// src/pages/JobDetailPage.jsx
// Member 2 — Full job detail view.
//
// API calls:
//   GET  /api/v1/jobs/:id          — load job details
//   POST /api/v1/jobs/:id/apply    — apply (body: { coverLetter? })
//   POST /api/v1/jobs/:id/save     — save/unsave toggle (handled by SaveJobButton)
//
// Behaviour:
//   - If the authenticated job seeker has already applied → show status badge, hide Apply button
//   - Apply button opens a modal with an optional coverLetter textarea
//   - Category badge uses the shared categoryColors map
//
// ⚠️  BONUS PLACEHOLDER (Cover Letter AI):
//   There is a commented-out section at the bottom of this file for the
//   "Generate Cover Letter Suggestion" button (M5's bonus feature).
//   When M5 implements the backend endpoint, uncomment that section.
//   It will NOT cause any errors while commented out.
//
// Access: Public (but Apply + Save are job-seeker only)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import categoryColors from "../utils/categoryColors";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";
import SaveJobButton from "../components/SaveJobButton";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isJobSeeker = isAuthenticated && user?.role === "jobSeeker";

  // ─── Job state ───────────────────────────────────────────────────────────
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── Application state ───────────────────────────────────────────────────
  // existingApplication: the user's application object if they've already applied
  // { _id, status } or null
  const [existingApplication, setExistingApplication] = useState(null);

  // ─── Apply modal state ───────────────────────────────────────────────────
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  // ─── Fetch job ───────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/jobs/${id}`);
        // M2 response shape: { success, job: { _id, title, description, requirements,
        //   category, status, createdBy: { name, email }, ... } }
        const jobData = data.job || data.data || data; //chnaged by salma to test
        setJob(jobData);

        // Check if the current user has already applied.
        // The backend may return this in job.userApplication or we check
        // the applications array if included. Adjust to match your backend response.
        if (jobData.userApplication) {
          setExistingApplication(jobData.userApplication);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  // ─── Apply handler ───────────────────────────────────────────────────────
  async function handleApply() {
    setApplying(true);
    setApplyError("");
    try {
      const body = {};
      if (coverLetter.trim()) body.coverLetter = coverLetter.trim();

      const { data } = await api.post(`/jobs/${id}/apply`, body);

      // M2 response shape: { success, application: { _id, user, job, status, appliedAt } }
      setExistingApplication(data.application || { status: "pending" });
      setApplySuccess(true);
      setApplyModalOpen(false);
      setCoverLetter("");
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  }

  // ─── Render states ───────────────────────────────────────────────────────
  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.error}>{error}</div>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          ← Back
        </button>
      </div>
    );
  }

  if (!job) return null;

  const badgeStyle = categoryColors[job.category] || categoryColors["Other"];

  return (
    <div style={styles.page}>
      {/* Back link */}
      <button onClick={() => navigate('/jobs')} style={styles.backBtn}> 
        ← Back to Jobs
      </button>

      <div style={styles.card}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <div>
            <div style={styles.topRow}>
              {/* AI category badge */}
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
              {/* Job status chip */}
              <span
                style={{
                  ...styles.statusChip,
                  backgroundColor: job.status === "open" ? "#dcfce7" : "#f3f4f6",
                  color: job.status === "open" ? "#166534" : "#374151",
                }}
              >
                {job.status}
              </span>
            </div>
            <h1 style={styles.title}>{job.title}</h1>
            <p style={styles.company}>{job.company}</p>
          </div>

          {/* Save button — job seekers only */}
          {isJobSeeker && (
            <SaveJobButton
              jobId={job._id}
              initialSaved={job.isSaved || false}
              jobStatus={job.status}
            />
          )}
        </div>

        {/* ── Meta grid ── */}
        <div style={styles.metaGrid}>
          {job.location && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Location</span>
              <span>{job.location}</span>
            </div>
          )}
          {job.type && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Type</span>
              <span style={{ textTransform: "capitalize" }}>{job.type}</span>
            </div>
          )}
          {job.salary && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Salary</span>
              <span>${job.salary.toLocaleString()} / yr</span>
            </div>
          )}
          {job.totalSlots && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Open Slots</span>
              <span>{job.totalSlots}</span>
            </div>
          )}
        </div>

        {/* ── Description ── */}
        {job.description && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.bodyText}>{job.description}</p>
          </section>
        )}

        {/* ── Requirements ── */}
        {job.requirements && job.requirements.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Requirements</h2>
            <ul style={styles.list}>
              {job.requirements.map((req, i) => (
                <li key={i} style={styles.listItem}>
                  {req}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Action area ── */}
        <div style={styles.actions}>
          {/* Show apply button OR application status badge */}
          {isJobSeeker && (
            <>
              {existingApplication ? (
                // Already applied — show current status instead of Apply button
                <div style={styles.appliedRow}>
                  <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                    Your application:
                  </span>
                  <ApplicationStatusBadge status={existingApplication.status} />
                </div>
              ) : applySuccess ? (
                <div style={styles.successMsg}>
                  ✅ Application submitted!
                </div>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  disabled={job.status !== "open"}
                  style={{
                    ...styles.applyBtn,
                    opacity: job.status !== "open" ? 0.5 : 1,
                    cursor: job.status !== "open" ? "not-allowed" : "pointer",
                  }}
                >
                  Apply Now
                </button>
              )}
            </>
          )}

          {/* Not logged in — prompt to login */}
          {!isAuthenticated && (
            <Link to="/login" style={styles.applyBtn}>
              Login to Apply
            </Link>
          )}
        </div>

        {/* ⚠️  BONUS — Cover Letter AI (M5)
            Uncomment this section when M5 implements the backend endpoint.
            The button calls a new endpoint that generates a draft cover letter
            using the student's bio + job description via HuggingFace.
            Coordinate with M5 on the exact endpoint URL.

        {isJobSeeker && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>AI Cover Letter Suggestion</h2>
            <CoverLetterGenerator jobId={job._id} />
          </section>
        )}
        */}
      </div>

      {/* ── Apply Modal ── */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => {
          setApplyModalOpen(false);
          setApplyError("");
          setCoverLetter("");
        }}
        title={`Apply for: ${job.title}`}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Applying to <strong>{job.company}</strong>. A cover letter is optional.
          </p>

          <div>
            <label style={styles.label}>
              Cover Letter <span style={{ color: "#9ca3af" }}>(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Write a brief cover letter..."
              style={styles.textarea}
            />
          </div>

          {/* Inline error inside modal */}
          {applyError && (
            <div style={styles.modalError}>{applyError}</div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setApplyModalOpen(false);
                setApplyError("");
                setCoverLetter("");
              }}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={applying}
              style={styles.confirmBtn}
            >
              {applying ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: "0.875rem",
    cursor: "pointer",
    padding: 0,
    marginBottom: "20px",
    fontWeight: 500,
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  topRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "3px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 700,
  },
  statusChip: {
    display: "inline-block",
    padding: "3px 12px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#111827",
    lineHeight: 1.2,
  },
  company: {
    margin: 0,
    fontSize: "1rem",
    color: "#6b7280",
    fontWeight: 500,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    padding: "16px",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "0.875rem",
    color: "#374151",
  },
  metaLabel: {
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#9ca3af",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111827",
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "6px",
  },
  bodyText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#374151",
    lineHeight: 1.7,
    whiteSpace: "pre-line",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  listItem: {
    fontSize: "0.9rem",
    color: "#374151",
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingTop: "8px",
    borderTop: "1px solid #f3f4f6",
  },
  applyBtn: {
    display: "inline-block",
    padding: "10px 24px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  },
  appliedRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  successMsg: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "0.9rem",
    fontWeight: 600,
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "14px 18px",
    fontSize: "0.9rem",
    marginBottom: "16px",
  },
  // Modal inner styles
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    resize: "vertical",
    outline: "none",
    color: "#111827",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  modalError: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "0.85rem",
  },
  cancelBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    cursor: "pointer",
    color: "#374151",
  },
  confirmBtn: {
    padding: "8px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default JobDetailPage;
