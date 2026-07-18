import React, { useState, useEffect } from 'react';
 import api, { SERVER_URL } from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import { FiUsers, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      toast.error('Failed to load platform users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (id, currentBlockStatus, name) => {
    const action = currentBlockStatus ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} user "${name}"?`)) {
      try {
        const res = await api.put(`/admin/users/${id}/status`, { isBlocked: !currentBlockStatus });
        if (res.data.success) {
          toast.success(res.data.message);
          setUsers((prev) =>
            prev.map((u) => (u._id === id ? { ...u, isBlocked: !currentBlockStatus } : u))
          );
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Action failed');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="fade-in-up">
      <div className="mb-4">
        <h3 className="fw-bold">Platform Users Management</h3>
        <p className="text-secondary">Verify registrations, change roles, or restrict policy violators.</p>
      </div>

      <div className="card border-0 glass-card p-3 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle m-0">
            <thead>
              <tr>
                <th scope="col" className="border-0">User Details</th>
                <th scope="col" className="border-0">Email ID</th>
                <th scope="col" className="border-0">Phone</th>
                <th scope="col" className="border-0">Role</th>
                <th scope="col" className="border-0">Status</th>
                <th scope="col" className="border-0 text-end">Lock Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                        {u.profilePicture ? (
                          <img src={` ${SERVER_URL}${u.profilePicture}`} alt="Avatar" className="rounded-circle w-100 h-100 object-fit-cover" />
                        ) : (
                          u.name[0]
                        )}
                      </div>
                      <div>
                        <h6 className="fw-bold m-0 text-sm">{u.name}</h6>
                        <small className="text-muted text-xs">Registered {new Date(u.createdAt).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-secondary text-sm">{u.email}</span></td>
                  <td><span className="text-secondary text-sm">{u.phone || '-'}</span></td>
                  <td>
                    <span className={`badge px-2.5 py-1.5 rounded-pill fs-8 ${
                      u.role === 'admin' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.isBlocked ? (
                      <span className="badge bg-danger text-white px-2 py-1 rounded fs-9">Blocked</span>
                    ) : (
                      <span className="badge bg-success text-white px-2 py-1 rounded fs-9">Active</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center justify-content-end">
                      {u.role === 'admin' ? (
                        <FiShield className="text-muted" size={18} title="Admin Account Protected" />
                      ) : (
                        <button
                          className={`btn btn-xs rounded-3 fw-semibold text-xs px-3 py-1.5 d-flex align-items-center gap-1 ${
                            u.isBlocked ? 'btn-success text-white' : 'btn-outline-danger'
                          }`}
                          onClick={() => handleStatusToggle(u._id, u.isBlocked, u.name)}
                        >
                          {u.isBlocked ? (
                            <>
                              <FiUserCheck size={12} />
                              <span>Activate</span>
                            </>
                          ) : (
                            <>
                              <FiUserX size={12} />
                              <span>Block User</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
