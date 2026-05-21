import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyJobs } from "../services/recruiterService";
import Spinner from "../components/Spinner";

function RecruiterDashboard() {
  // Get the logged-in recruiter from AuthContext
  const { user } = useAuth();

  // jobs = array of job posts, loading = fetch in progress, error = error message
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs when the component mounts
  useEffect(() => {
    // If recruiter is pending, don't bother fetching — they can't post jobs yet
    if (user?.status === "pending") {
      setLoading(false);
      return;
    }

    async function fetchJobs() {
      try {
        const { data } = await getMyJobs();
        setJobs(data.jobs || data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [user]);

  // ── Loading state ──────────────────────────────────────────
  if (loading) return <Spinner />;

  // ── Error state ────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.errorBox}>
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  // ── Pending recruiter — show banner instead of job list ────
  if (user?.status === "pending") {
    return (
      <div style={styles.container}>
        <div style={styles.pendingBanner}>
          <h2> Account Pending Approval</h2>
          <p>
            Your recruiter account is waiting for admin approval. You will
            be able to post jobs once approved.
          </p>
        </div>
      </div>
    );
  }

  // ── Success state ──────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header row */}
      <div style={styles.header}>
        <h1 style={styles.title}>My Job Posts</h1>
        <Link to="/recruiter/jobs/create" style={styles.createBtn}>
          + Post New Job
        </Link>
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <p style={styles.empty}>
          You have not posted any jobs yet.{" "}
          <Link to="/recruiter/jobs/create">Post your first job</Link>
        </p>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.card}>
              {/* Job title + status */}
              <div style={styles.cardTop}>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      job.status === "open" ? "#dcfce7" : "#f3f4f6",
                    color: job.status === "open" ? "#166534" : "#374151",
                  }}
                >
                  {job.status}
                </span>
              </div>

              {/* Company + location */}
              <p style={styles.meta}>
                {job.company} — {job.location}
              </p>

              {/* Applicant count */}
              <p style={styles.applicantCount}>
                👥 {job.applicantCount ?? 0} applicant
                {job.applicantCount !== 1 ? "s" : ""}
              </p>

              {/* Action links */}
              <div style={styles.cardActions}>
                <Link
                  to={`/recruiter/applicants/${job._id}`}
                  style={styles.linkBtn}
                >
                  View Applicants
                </Link>
                <Link
                  to={`/recruiter/jobs/${job._id}/edit`}
                  style={styles.linkBtnSecondary}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  createBtn: {
    padding: "8px 18px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  jobTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
  },
  statusBadge: {
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "0.72rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  meta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  applicantCount: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#374151",
    fontWeight: 500,
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  linkBtn: {
    padding: "6px 14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
  },
  linkBtnSecondary: {
    padding: "6px 14px",
    backgroundColor: "#f9fafb",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
  },
  pendingBanner: {
    backgroundColor: "#fefce8",
    border: "1px solid #fde047",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    color: "#854d0e",
  },
  errorBox: {
    padding: "24px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#991b1b",
    maxWidth: "600px",
    margin: "32px auto",
  },
  empty: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
};

export default RecruiterDashboard;