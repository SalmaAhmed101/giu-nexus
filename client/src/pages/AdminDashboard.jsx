import { useEffect, useState } from 'react';
import { getAdminStats } from '../services/adminService';
import Spinner from '../components/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '24px' }}>
        Admin Dashboard
      </h1>

      {/* Users by Role */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', letterSpacing: '-0.01em', marginBottom: '16px' }}>
        Users by Role
      </h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Job Seekers</h3>
          <p style={{ fontSize: '2rem' }}>{stats.usersByRole?.jobSeeker || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Recruiters</h3>
          <p style={{ fontSize: '2rem' }}>{stats.usersByRole?.recruiter || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Admins</h3>
          <p style={{ fontSize: '2rem' }}>{stats.usersByRole?.admin || 0}</p>
        </div>
      </div>

      {/* Jobs by Status */}
      <h2>Jobs by Status</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Open</h3>
          <p style={{ fontSize: '2rem' }}>{stats.jobsByStatus?.open || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Closed</h3>
          <p style={{ fontSize: '2rem' }}>{stats.jobsByStatus?.closed || 0}</p>
        </div>
      </div>

      {/* Applications by Status */}
      <h2>Applications by Status</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={cardStyle}>
          <h3>Pending</h3>
          <p style={{ fontSize: '2rem' }}>{stats.appsByStatus?.pending || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Shortlisted</h3>
          <p style={{ fontSize: '2rem' }}>{stats.appsByStatus?.shortlisted || 0}</p>
        </div>
        <div style={cardStyle}>
          <h3>Rejected</h3>
          <p style={{ fontSize: '2rem' }}>{stats.appsByStatus?.rejected || 0}</p>
        </div>
      </div>

      {/* Top Jobs */}
      <h2>Top Jobs by Applications</h2>
      {stats.topJobs?.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Applications</th>
            </tr>
          </thead>
          <tbody>
            {stats.topJobs?.map((job) => (
              <tr key={job._id}>
                <td style={tdStyle}>{job.title}</td>
                <td style={tdStyle}>{job.company}</td>
                <td style={tdStyle}>{job.applicationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '20px',
  minWidth: '150px',
  textAlign: 'center',
};

const thStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #eee',
};