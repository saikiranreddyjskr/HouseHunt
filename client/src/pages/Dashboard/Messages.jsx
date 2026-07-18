import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
 import api, { SERVER_URL } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiSend, FiMessageSquare, FiUser, FiInfo } from 'react-icons/fi';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Selected user object
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [convLoading, setConvLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 1. Fetch conversations list on mount
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations list', err);
    } finally {
      setConvLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Fetch messages for active chat
  const fetchMessages = async (chatUserId, silent = false) => {
    if (!chatUserId) return;
    if (!silent) setMsgLoading(true);
    try {
      const res = await api.get(`/messages/${chatUserId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch message history');
    } finally {
      if (!silent) setMsgLoading(false);
    }
  };

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
    }
  }, [activeChat]);

  // 3. Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Polling for new messages in selected conversation every 4 seconds
  useEffect(() => {
    let interval;
    if (activeChat) {
      interval = setInterval(() => {
        fetchMessages(activeChat._id, true);
        fetchConversations(); // Update last message in lists
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageText = newMessage;
    setNewMessage(''); // optimistic clear

    try {
      const res = await api.post('/messages', {
        receiverId: activeChat._id,
        message: messageText,
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        fetchConversations(); // refresh conversations list order
      }
    } catch (err) {
      toast.error('Message delivery failed');
    }
  };

  if (convLoading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">My Inbox Messages</h3>
        <p className="text-secondary">Direct secure communication with house owners and prospective tenants.</p>
      </div>

      <div className="row g-4" style={{ height: '70vh' }}>
        {/* Conversations Sidebar */}
        <div className="col-md-4 col-sm-12 h-100">
          <div className="card border-0 glass-card h-100 p-3 overflow-hidden d-flex flex-column">
            <h5 className="fw-bold mb-3 px-2">Conversations</h5>
            <div className="flex-grow-1 overflow-y-auto d-flex flex-column gap-2 pe-1">
              {conversations.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <FiMessageSquare size={32} className="mb-2 text-muted" />
                  <p className="text-sm">Inbox is empty. Start chatting from property detail page!</p>
                </div>
              ) : (
                conversations.map((c) => {
                  const isSelected = activeChat && activeChat._id === c.user._id;
                  return (
                    <button
                      key={c.user._id}
                      className={`btn text-start border-0 rounded-3 p-2.5 d-flex align-items-center gap-3 transition ${
                        isSelected ? 'bg-primary text-white' : 'bg-light text-dark hover-scale'
                      }`}
                      onClick={() => setActiveChat(c.user)}
                    >
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${
                          isSelected ? 'bg-white text-primary' : 'bg-primary text-white'
                        }`}
                        style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}
                      >
                        {c.user.profilePicture ? (
                          <img
                            src={` ${SERVER_URL}${c.user.profilePicture}`}
                            alt="avatar"
                            className="rounded-circle w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          c.user.name[0]
                        )}
                      </div>
                      <div className="overflow-hidden flex-grow-1 text-truncate">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="fw-bold m-0 text-sm">{c.user.name}</h6>
                          {c.lastMessageTime && (
                            <span className="text-xs opacity-75" style={{ fontSize: '0.72rem' }}>
                              {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <small className="opacity-75 text-truncate d-block text-xs mt-0.5">{c.lastMessage || 'Click to message'}</small>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Chat Window Panel */}
        <div className="col-md-8 col-sm-12 h-100">
          <div className="card border-0 glass-card h-100 overflow-hidden d-flex flex-column p-0">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="border-bottom p-3 d-flex align-items-center justify-content-between" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      {activeChat.profilePicture ? (
                        <img
                          src={` ${SERVER_URL}${activeChat.profilePicture}`}
                          alt="active avatar"
                          className="rounded-circle w-100 h-100 object-fit-cover"
                        />
                      ) : (
                        activeChat.name[0]
                      )}
                    </div>
                    <div>
                      <h6 className="fw-bold m-0 text-sm">{activeChat.name}</h6>
                      <small className="text-muted text-xs capitalize">{activeChat.role} • {activeChat.phone || activeChat.email}</small>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-grow-1 overflow-y-auto p-4 d-flex flex-column gap-3 bg-light-subtle">
                  {msgLoading ? (
                    <LoadingSpinner />
                  ) : messages.length === 0 ? (
                    <div className="text-center py-5 text-secondary my-auto">
                      <p className="text-sm">No messages yet. Send a greeting to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isSentByMe = m.sender === user._id || m.sender._id === user._id;
                      return (
                        <div
                          key={m._id}
                          className={`d-flex flex-column max-w-75 ${
                            isSentByMe ? 'align-self-end align-items-end' : 'align-self-start align-items-start'
                          }`}
                        >
                          <div
                            className={`rounded-4 px-3.5 py-2 text-sm shadow-sm ${
                              isSentByMe
                                ? 'bg-primary text-white rounded-br-0'
                                : 'bg-white text-dark rounded-bl-0 border'
                            }`}
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            {m.message}
                          </div>
                          {m.property && (
                            <Link
                              to={`/properties/${m.property._id}`}
                              className="text-xs text-primary mt-1 text-decoration-none fw-medium d-flex align-items-center gap-1 bg-light border px-2 py-1 rounded"
                            >
                              <FiInfo size={12} />
                              <span>About: {m.property.title}</span>
                            </Link>
                          )}
                          <span className="text-muted text-xs mt-1" style={{ fontSize: '0.68rem' }}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Messages Footer Input */}
                <form onSubmit={handleSendMessage} className="border-top p-3 d-flex gap-2" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message content..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary px-4 rounded-3 d-flex align-items-center gap-1">
                    <FiSend size={16} />
                    <span className="d-none d-sm-inline">Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center py-5 text-secondary">
                <FiMessageSquare size={48} className="text-muted mb-3 animate-pulse" />
                <h5>Select a Conversation</h5>
                <p className="text-sm">Click on any name on the left sidebar to view messages thread.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
