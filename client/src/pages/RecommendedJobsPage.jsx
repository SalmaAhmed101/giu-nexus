import { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/jobs/recommended')
      .then(r => { setJobs(r.data.jobs || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <Spinner />;

  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  if (jobs.length === 0) return (
    <div style={{ padding: '2rem' }}>
      <p>No recommendations yet.</p>
      <a href="/profile">Extract skills from your bio</a> to get started.
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '24px' }}>Recommended for You</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
        {jobs.map(job => (
          <JobCard key={job._id} job={job} score={job.score} />
        ))}
      </div>
    </div>
  );
}