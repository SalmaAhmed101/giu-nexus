import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const isJobSeeker = isAuthenticated && user?.role === 'jobSeeker';

  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingRec, setLoadingRec] = useState(false);
  const [trendingError, setTrendingError] = useState('');
  const [recError, setRecError] = useState('');

  useEffect(() => {
    api.get('/jobs')
      .then(r => { setTrending(r.data.jobs || []); setLoadingTrending(false); })
      .catch(e => { setTrendingError(e.message); setLoadingTrending(false); });
  }, []);

  useEffect(() => {
    if (!isJobSeeker) return;
    setLoadingRec(true);
    api.get('/jobs/recommended')
      .then(r => { setRecommended(r.data.jobs || []); setLoadingRec(false); })
      .catch(e => { setRecError(e.message); setLoadingRec(false); });
  }, [isJobSeeker]);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>

      {isJobSeeker && (
        <div style={{ marginBottom: '3rem' }}>
          <h2>Recommended for You</h2>
          {loadingRec ? <Spinner /> : recError ? (
            <p style={{ color: 'red' }}>{recError}</p>
          ) : recommended.length === 0 ? (
            <p>No recommendations yet. <a href="/profile">Extract skills from your bio</a> to get started.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {recommended.map(job => (
                <JobCard key={job._id} job={job} score={job.score} />
              ))}
            </div>
          )}
        </div>
      )}

      <h2>Trending Jobs</h2>
      {loadingTrending ? <Spinner /> : trendingError ? (
        <p style={{ color: 'red' }}>{trendingError}</p>
      ) : trending.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {trending.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

    </div>
  );
}