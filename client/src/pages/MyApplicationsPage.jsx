// src/pages/MyApplicationsPage.jsx
// Member 2 — List of all jobs the logged-in job seeker has applied to.
//
// API: GET /api/v1/applications/my
// Response shape expected: array of application objects, each with:
//   { _id, job: { _id, title, company, location, type, category, status }, status, createdAt }
//
// Access: Job Seeker only (protected by RoleRoute in App.jsx)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import Spinner from "../components/Spinner";
import categoryColors from "../utils/categoryColors";

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Fetch applications ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchMyApplications() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/applications/my");
        // M2 response shape: { success, applications: [...] }
        // Each application: { _id, status, appliedAt, job: { _id, title, company, type, status } }
        // Note: job.category is NOT populated in this endpoint per M2 spec
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMyApplications();
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Applications</h1>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : applications.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ marginBottom: "12px" }}>
            You haven't applied to any jobs yet.
          </p>
          <Link to="/jobs" style={styles.browseBtn}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <>
          <p style={styles.count}>
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </p>

          <div style={styles.list}>
            {applications.map((app) => {
              const job = app.job || {};
              // Note: GET /api/v1/applications/my populates job with
              // { _id, title, company, type, status } — category is NOT included.
              // We fall back to "Other" styling when category is absent.
              const badgeStyle =
                categoryColors[job.category] || categoryColors["Other"];

              return (
                <div key={app._id} style={styles.row}>
                  {/* Left: job info */}
                  <div style={styles.jobInfo}>
                    {/* Category badge — only shown if category is populated */}
                    {job.category && (
                      <span
                        style={{
                          ...styles.categoryBadge,
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                          border: `1px solid ${badgeStyle.border}`,
                        }}
                      >
                        {job.category}
                      </span>
                    )}

                    <Link to={`/jobs/${job._id}`} style={styles.jobTitle}>
                      {job.title || "—"}
                    </Link>
                    <span style={styles.company}>{job.company || ""}</span>

                    <div style={styles.meta}>
                      {job.type && (
                        <span style={styles.metaChip}>{job.type}</span>
                      )}
                      {job.location && (
                        <span style={styles.metaChip}>📍 {job.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Right: status + date */}
                  <div style={styles.statusCol}>
                    <ApplicationStatusBadge status={app.status} />
                    {app.createdAt && (
                      <span style={styles.date}>
                        Applied{" "}
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: "820px",
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px 20px",
    gap: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    flexWrap: "wrap",
  },
  jobInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flex: 1,
    minWidth: "200px",
  },
  categoryBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "0.7rem",
    fontWeight: 700,
    alignSelf: "flex-start",
    marginBottom: "2px",
  },
  jobTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    textDecoration: "none",
  },
  company: {
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "4px",
  },
  metaChip: {
    fontSize: "0.72rem",
    color: "#374151",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "2px 7px",
  },
  statusCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
    flexShrink: 0,
  },
  date: {
    fontSize: "0.75rem",
    color: "#9ca3af",
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

export default MyApplicationsPage;
