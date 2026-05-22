import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Spinner from '../components/Spinner';

export default function EditProfilePage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', bio: '', profilePicture: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = {
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '15px',
    outline: 'none'
  };

  useEffect(() => {
    api.get('/profile')
      .then(r => { setForm({ name: r.data.user.name || '', bio: r.data.user.bio || '', profilePicture: r.data.user.profilePicture || '' }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await api.patch('/profile', form);
      nav('/profile');
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '2rem' }}>
      <h2>Edit Profile</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <textarea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
          rows={4}
          style={inputStyle}
        />
        <input
          name="profilePicture"
          placeholder="Profile picture URL"
          value={form.profilePicture}
          onChange={handleChange}
          style={inputStyle}
        />
        {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            backgroundColor: saving ? '#c4b5fd' : '#7c3aed',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          {saving ? 'Saving...' : 'Save'}
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