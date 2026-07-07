const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    // Find all messages sent/received by this user
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).sort({ createdAt: -1 });

    // Extract unique user ids that are not the current user
    const userIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== currentUserId) {
        userIds.add(msg.sender.toString());
      }
      if (msg.receiver.toString() !== currentUserId) {
        userIds.add(msg.receiver.toString());
      }
    });

    const uniqueUserIds = Array.from(userIds);
    const conversations = await User.find({ _id: { $in: uniqueUserIds } }).select('name email phone profilePicture role');

    // Attach last message to each user object
    const conversationsWithLastMsg = conversations.map((user) => {
      const lastMsg = messages.find(
        (m) =>
          (m.sender.toString() === user._id.toString() && m.receiver.toString() === currentUserId) ||
          (m.sender.toString() === currentUserId && m.receiver.toString() === user._id.toString())
      );
      return {
        user,
        lastMessage: lastMsg ? lastMsg.message : '',
        lastMessageTime: lastMsg ? lastMsg.createdAt : null,
      };
    });

    // Sort by last message time descending
    conversationsWithLastMsg.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    res.status(200).json({
      success: true,
      count: conversationsWithLastMsg.length,
      conversations: conversationsWithLastMsg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history between current user and specified user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res, next) => {
  try {
    const chatUserId = req.params.userId;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: chatUserId },
        { sender: chatUserId, receiver: currentUserId },
      ],
    })
      .populate('property', 'title price images city')
      .sort({ createdAt: 1 });

    // Mark incoming messages as read
    await Message.updateMany(
      { sender: chatUserId, receiver: currentUserId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message, propertyId } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Please specify a receiver and message content' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Recipient user not found' });
    }

    const messageData = {
      sender: req.user.id,
      receiver: receiverId,
      message,
    };

    if (propertyId) {
      messageData.property = propertyId;
    }

    const newMessage = await Message.create(messageData);

    // Create message notification for recipient
    const Notification = require('../models/Notification');
    await Notification.create({
      user: receiverId,
      type: 'message',
      title: `New Message from ${req.user.name}`,
      message: message.substring(0, 60) + (message.length > 60 ? '...' : ''),
      link: `/dashboard/messages`,
    });

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
