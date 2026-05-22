import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ChangePasswordPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '15px',
    outline: 'none'
  };

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.patch('/profile/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (success) return <p style={{ padding: '2rem' }}>Password changed successfully!</p>;

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h2>Change Password</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current password"
          value={form.currentPassword}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          value={form.newPassword}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={form.confirmPassword}
          onChange={handleChange}
          style={inputStyle}
        />

        {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#c4b5fd' : '#7c3aed',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          {loading ? 'Saving...' : 'Change Password'}
        </button>

        <button
          onClick={() => nav('/profile')}
          style={{
            background: 'none',
            border: '1px solid #ef4444',
            color: '#ef4444',
            padding: '10px 18px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}