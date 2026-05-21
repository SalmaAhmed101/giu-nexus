// src/components/JobCard.jsx
// Member 2 — Compact job card shown in grids across JobListPage, SavedJobsPage,
// HomePage (recommended section), and RecommendedJobsPage.
//
// Props:
//   job         {object}  — job object from API
//   score       {number}  — optional cosine similarity score (0-1), shown on recommended pages
//   showUnsave  {boolean} — if true, shows Unsave button instead of SaveJobButton
//   onUnsave    {function}— called when Unsave is clicked (for SavedJobsPage)
//
// The category badge uses categoryColors.js (M3's file).
// If M3's file hasn't been added yet, the stub in src/utils/categoryColors.js is used.

import React from "react";
import { Link } from "react-router-dom";
import categoryColors from "../utils/categoryColors";
import SaveJobButton from "./SaveJobButton";
import { useAuth } from "../context/AuthContext";

function JobCard({ job, score, showUnsave = false, onUnsave }) {
  const { user, isAuthenticated } = useAuth();
  const isJobSeeker = isAuthenticated && user?.role === "jobSeeker";

  // Look up badge colours; fall back to "Other" if category is unrecognised
  const badgeStyle = categoryColors[job.category] || categoryColors["Other"];

  // Format score as a percentage label (e.g. 0.87 → "87% match")
  const scoreLabel =
    score !== undefined && score !== null
      ? `${Math.round(score * 100)}% match`
      : null;

  return (
    <div style={styles.card}>
      {/* Top row: category badge + score */}
      <div style={styles.topRow}>
        <span
          style={{
            ...styles.badge,
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.text,
            border: `1px solid ${badgeStyle.border}`,
          }}
        >
          {job.category || "Other"}
        </span>
        {scoreLabel && (
          <span style={styles.scoreLabel}>{scoreLabel}</span>
        )}
      </div>

      {/* Job title */}
      <h3 style={styles.title}>{job.title}</h3>

      {/* Company */}
      <p style={styles.company}>{job.company}</p>

      {/* Meta info: type + location */}
      <div style={styles.meta}>
        {job.type && (
          <span style={styles.metaChip}>{job.type}</span>
        )}
        {job.location && (
          <span style={styles.metaChip}>📍 {job.location}</span>
        )}
      </div>

      {/* Salary (optional) */}
      {job.salary && (
        <p style={styles.salary}>${job.salary.toLocaleString()} / yr</p>
      )}

      {/* Footer: View Details link + save/unsave action */}
      <div style={styles.footer}>
        <Link to={`/jobs/${job._id}`} style={styles.viewBtn}>
          View Details
        </Link>

        <div style={styles.actions}>
          {/* Unsave mode — used on SavedJobsPage */}
          {showUnsave && onUnsave && (
            <button
              onClick={() => onUnsave(job._id)}
              style={styles.unsaveBtn}
            >
              Unsave
            </button>
          )}

          {/* Normal save toggle — only for authenticated job seekers */}
          {!showUnsave && isJobSeeker && (
            <SaveJobButton
              jobId={job._id}
              initialSaved={job.isSaved || false}
              jobStatus={job.status}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s, transform 0.2s",
    cursor: "default",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "9999px",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  scoreLabel: {
    fontSize: "0.72rem",
    fontWeight: 600,
    color: "#6366f1",
    backgroundColor: "#eef2ff",
    padding: "2px 8px",
    borderRadius: "9999px",
    border: "1px solid #c7d2fe",
  },
  title: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.3,
  },
  company: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#6b7280",
    fontWeight: 500,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "2px",
  },
  metaChip: {
    fontSize: "0.75rem",
    color: "#374151",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "2px 8px",
  },
  salary: {
    margin: 0,
    fontSize: "0.82rem",
    color: "#059669",
    fontWeight: 600,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
  },
  viewBtn: {
    display: "inline-block",
    padding: "6px 14px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "0.82rem",
    fontWeight: 600,
    textDecoration: "none",
    transition: "background-color 0.15s",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  unsaveBtn: {
    padding: "5px 12px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },
};

export default JobCard;
