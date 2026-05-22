import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicants, updateApplicationStatus } from "../services/recruiterService";
import Spinner from "../components/Spinner";
import ApplicationStatusBadge from "../components/ApplicationStatusBadge";

function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which application is currently being updated
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  // ── Fetch applicants on mount ──────────────────────────────
  useEffect(() => {
    async function fetchApplicants() {
      try {
        const { data } = await getApplicants(jobId);
        setApplicants(data.applicants || data.data || []);
        setJobTitle(data.jobTitle || data.job?.title || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, [jobId]);

  // ── Inline status update ───────────────────────────────────
  async function handleStatusChange(applicationId, newStatus) {
    setUpdatingId(applicationId);
    setUpdateError(null);

    try {
      const { data } = await updateApplicationStatus(applicationId, newStatus);

      // Update the applicant's status in local state without refetching
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: data.application?.status || newStatus }
            : app
        )
      );
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

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

  // ── Main render ────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Applicants</h1>
          {jobTitle && (
            <p style={styles.subtitle}>for {jobTitle}</p>
          )}
        </div>
        <button
          onClick={() => navigate("/recruiter/dashboard")}
          style={styles.backBtn}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Inline update error */}
      {updateError && (
        <div style={styles.errorBox}>
          Failed to update status: {updateError}
        </div>
      )}

      {/* Empty state */}
      {applicants.length === 0 ? (
        <p style={styles.empty}>No applicants yet for this job.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Skills</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app._id} style={styles.tableRow}>
                  {/* Name */}
                  <td style={styles.td}>
                    {app.applicant?.name || app.name || "—"}
                  </td>

                  {/* Email */}
                  <td style={styles.td}>
                    {app.applicant?.email || app.email || "—"}
                  </td>

                  {/* Skills */}
                  <td style={styles.td}>
                    <div style={styles.skillsRow}>
                      {(app.applicant?.skills || app.skills || []).length === 0 ? (
                        <span style={styles.noSkills}>No skills listed</span>
                      ) : (
                        (app.applicant?.skills || app.skills).map((skill, i) => (
                          <span key={i} style={styles.skillChip}>
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Current status badge */}
                  <td style={styles.td}>
                    <ApplicationStatusBadge status={app.status} />
                  </td>

                  {/* Inline status update buttons */}
                  <td style={styles.td}>
                    <div style={styles.statusButtons}>
                      {["pending", "shortlisted", "rejected"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(app._id, s)}
                          disabled={app.status === s || updatingId === app._id}
                          style={{
                            ...styles.statusBtn,
                            ...(app.status === s ? styles.statusBtnActive : {}),
                            opacity: updatingId === app._id ? 0.6 : 1,
                            cursor:
                              app.status === s || updatingId === app._id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {updatingId === app._id ? "..." : s}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  backBtn: {
    padding: "8px 16px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.875rem",
  },
  tableHead: {
    backgroundColor: "#f9fafb",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: 600,
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  tableRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "14px 16px",
    color: "#111827",
    verticalAlign: "middle",
  },
  skillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  skillChip: {
    padding: "2px 8px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    color: "#374151",
  },
  noSkills: {
    color: "#9ca3af",
    fontSize: "0.8rem",
  },
  statusButtons: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  statusBtn: {
    padding: "4px 10px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#374151",
    cursor: "pointer",
    textTransform: "capitalize",
  },
  statusBtnActive: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "1px solid #2563eb",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#991b1b",
    fontSize: "0.875rem",
    marginBottom: "16px",
  },
  empty: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
};

export default ApplicantsPage;