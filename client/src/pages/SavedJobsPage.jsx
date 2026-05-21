// src/pages/SavedJobsPage.jsx
// Member 2 — Grid of jobs the logged-in job seeker has bookmarked.
//
// API:
//   GET  /api/v1/jobs/saved          — fetch saved jobs list
//   POST /api/v1/jobs/:id/save       — toggle (unsave) — same endpoint as save
//
// Behaviour:
//   - Each card has an Unsave action that calls the toggle endpoint
//   - After unsaving, remove the card from the list immediately (optimistic)
//
// Access: Job Seeker only (protected by RoleRoute in App.jsx)

import React, { useState, useEffect } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Fetch saved jobs ─────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchSaved() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/jobs/saved");
        // M2 response shape: { success, jobs: [...] }
        setSavedJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  // ─── Unsave handler ───────────────────────────────────────────────────────
  // Optimistically removes from list; reverts on failure
  async function handleUnsave(jobId) {
    // Optimistic removal
    const previous = savedJobs;
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));

    try {
      await api.post(`/jobs/${jobId}/save`);
      // Response.saved === false means unsaved — no further action needed
    } catch (err) {
      // Revert if it fails
      setSavedJobs(previous);
      setError(`Failed to unsave: ${err.message}`);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Saved Jobs</h1>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : savedJobs.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ marginBottom: "12px" }}>You haven't saved any jobs yet.</p>
          <Link to="/jobs" style={styles.browseBtn}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          <p style={styles.count}>
            {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
          </p>
          <div style={styles.grid}>
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                showUnsave={true}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#111827",
    marginBottom: "8px",
  },
  count: {
    color: "#6b7280",
    fontSize: "0.9rem",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "14px 18px",
    fontSize: "0.9rem",
  },
  empty: {
    textAlign: "center",
    padding: "80px 0",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  browseBtn: {
    display: "inline-block",
    padding: "10px 22px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
};

export default SavedJobsPage;
