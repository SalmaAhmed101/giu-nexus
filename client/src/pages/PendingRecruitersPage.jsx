import { useEffect, useState } from 'react';
import { getUsers, updateUserStatus } from '../services/adminService';
import Spinner from '../components/Spinner';

export default function PendingRecruitersPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers({ role: 'recruiter', status: 'pending' })
      .then((res) => setRecruiters(res.data.users))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      setRecruiters((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1>Pending Recruiters</h1>
      {recruiters.length === 0 ? (
        <p>No pending recruiters.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Joined</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recruiters.map((r) => (
              <tr key={r._id}>
                <td style={tdStyle}>{r.name}</td>
                <td style={tdStyle}>{r.email}</td>
                <td style={tdStyle}>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleStatus(r._id, 'approved')}
                    style={{ ...btnStyle, backgroundColor: 'green', color: 'white', marginRight: '8px' }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatus(r._id, 'rejected')}
                    style={{ ...btnStyle, backgroundColor: 'red', color: 'white' }}
                  >
                    Reject
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
const btnStyle = { padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' };