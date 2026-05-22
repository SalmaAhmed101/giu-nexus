import { useEffect, useState } from 'react';
import { getUsers, updateUserStatus, deleteUser } from '../services/adminService';
import Spinner from '../components/Spinner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (roleFilter) params.role = roleFilter;
    if (statusFilter) params.status = statusFilter;
    getUsers(params)
      .then((res) => setUsers(res.data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '24px' }}>All Users</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={selectStyle}>
          <option value="">All Roles</option>
          <option value="jobSeeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <Spinner /> : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>{u.role}</td>
                <td style={tdStyle}>{u.status}</td>
                <td style={tdStyle}>
                  {u.status !== 'approved' && (
                    <button
                      onClick={() => handleStatus(u._id, 'approved')}
                      style={{ ...btnStyle, backgroundColor: 'green', color: 'white', marginRight: '6px' }}
                    >
                      Approve
                    </button>
                  )}
                  {u.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatus(u._id, 'rejected')}
                      style={{ ...btnStyle, backgroundColor: 'orange', color: 'white', marginRight: '6px' }}
                    >
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ ...btnStyle, backgroundColor: 'red', color: 'white' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee' };
const btnStyle = { padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const selectStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ddd' };