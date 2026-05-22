import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SkillChip from '../components/SkillChip';
import Spinner from '../components/Spinner';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(r => { setProfile(r.data.user); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleExtractSkills = async () => {
    setExtracting(true);
    setExtractError('');
    try {
      const r = await api.post('/profile/extract-skills');
      setProfile(p => ({ ...p, skills: r.data.skills }));
    } catch (e) {
      setExtractError(e.message);
    }
    setExtracting(false);
  };

  if (loading) return <Spinner />;
  if (!profile) return <p style={{ padding: '2rem' }}>Could not load profile.</p>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="profile"
          style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <h1 style={{ marginTop: '1rem' }}>{profile.name}</h1>
      <p style={{ color: '#6b7280' }}>{profile.email}</p>
      <p style={{ marginTop: '0.5rem' }}>{profile.bio || 'No bio yet.'}</p>

      <h3 style={{ marginTop: '1.5rem' }}>Skills</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        {profile.skills && profile.skills.length > 0
          ? profile.skills.map(s => <SkillChip key={s} skill={s} />)
          : <p style={{ color: '#9ca3af', fontSize: 14 }}>No skills yet.</p>
        }
      </div>

      <button
        onClick={handleExtractSkills}
        disabled={extracting}
        style={{
          marginTop: '0.5rem',
          backgroundColor: extracting ? '#c4b5fd' : '#7c3aed',
          color: 'white',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '10px',
          cursor: extracting ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}
      >
        {extracting ? 'Extracting...' : 'Extract Skills from Bio'}
      </button>

      {extractError && (
        <p style={{ color: 'red', fontSize: 13, marginTop: 6 }}>
          {extractError}{' '}
          {extractError.toLowerCase().includes('bio') && (
            <a href="/profile/edit">Edit your profile</a>
          )}
        </p>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <a
          href="/profile/edit"
          style={{
            border: '1px solid #7c3aed',
            color: '#7c3aed',
            padding: '10px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Edit Profile
        </a>

        <a
          href="/profile/change-password"
          style={{
            border: '1px solid #d1d5db',
            color: '#374151',
            padding: '10px 18px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          Change Password
        </a>
      </div>
    </div>
  );
}