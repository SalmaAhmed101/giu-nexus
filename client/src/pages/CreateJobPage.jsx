import { useState } from "react";
import { Link } from "react-router-dom";
import { createJob } from "../services/recruiterService";
import categoryColors from "../utils/categoryColors";

function CreateJobPage() {
  // ── Form field state ───────────────────────────────────────
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    type: "full-time",
    salary: "",
    totalSlots: "",
  });

  // requirements is an array — each item is one requirement string
  const [requirements, setRequirements] = useState([""]);

  // ── UI state ───────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // createdJob holds the full job object returned by the API after success
  const [createdJob, setCreatedJob] = useState(null);

  // ── Handlers ───────────────────────────────────────────────

  // Update any simple form field
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Update one requirement at a specific index
  function handleRequirementChange(index, value) {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  }

  // Add a new empty requirement input
  function addRequirement() {
    setRequirements([...requirements, ""]);
  }

  // Remove a requirement at a specific index
  function removeRequirement(index) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  // Submit the form
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty requirement strings before sending
      const payload = {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
        totalSlots: form.totalSlots ? Number(form.totalSlots) : undefined,
        requirements: requirements.filter((r) => r.trim() !== ""),
      };

      const { data } = await createJob(payload);

      // Save the created job — includes AI-assigned category
      setCreatedJob(data.job || data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────
  if (createdJob) {
    const badgeStyle =
      categoryColors[createdJob.category] || categoryColors["Other"];

    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <h2 style={styles.successTitle}>✅ Job Posted Successfully!</h2>

          <p style={styles.successMeta}>
            <strong>{createdJob.title}</strong> at {createdJob.company}
          </p>

          {/* AI-assigned category — read only */}
          <div style={styles.categoryRow}>
            <span style={styles.categoryLabel}>AI-Assigned Category:</span>
            <span
              style={{
                ...styles.badge,
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
                border: `1px solid ${badgeStyle.border}`,
              }}
            >
              {createdJob.category}
            </span>
          </div>

          <div style={styles.successActions}>
            <Link to="/recruiter/dashboard" style={styles.primaryBtn}>
              Back to Dashboard
            </Link>
            <button
              onClick={() => {
                setCreatedJob(null);
                setForm({
                  title: "",
                  company: "",
                  description: "",
                  location: "",
                  type: "full-time",
                  salary: "",
                  totalSlots: "",
                });
                setRequirements([""]);
              }}
              style={styles.secondaryBtn}
            >
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form screen ────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Post a New Job</h1>
      <p style={styles.subtitle}>
        The job category will be automatically assigned by AI based on your
        description.
      </p>

      {/* Error message */}
      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <div style={styles.field}>
          <label style={styles.label}>Job Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        {/* Company */}
        <div style={styles.field}>
          <label style={styles.label}>Company *</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. Acme Corp"
          />
        </div>

        {/* Description */}
        <div style={styles.field}>
          <label style={styles.label}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            style={styles.textarea}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
          />
        </div>

        {/* Requirements */}
        <div style={styles.field}>
          <label style={styles.label}>Requirements</label>
          {requirements.map((req, index) => (
            <div key={index} style={styles.requirementRow}>
              <input
                value={req}
                onChange={(e) =>
                  handleRequirementChange(index, e.target.value)
                }
                style={styles.input}
                placeholder={`Requirement ${index + 1}`}
              />
              {requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            style={styles.addBtn}
          >
            + Add Requirement
          </button>
        </div>

        {/* Location */}
        <div style={styles.field}>
          <label style={styles.label}>Location *</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="e.g. Cairo, Egypt"
          />
        </div>

        {/* Type */}
        <div style={styles.field}>
          <label style={styles.label}>Job Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Salary (optional) */}
        <div style={styles.field}>
          <label style={styles.label}>Salary (optional)</label>
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. 50000"
          />
        </div>

        {/* Total Slots (optional) */}
        <div style={styles.field}>
          <label style={styles.label}>Total Slots (optional)</label>
          <input
            name="totalSlots"
            type="number"
            value={form.totalSlots}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g. 3"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "32px 16px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#111827",
    outline: "none",
    width: "100%",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#111827",
    outline: "none",
    resize: "vertical",
    width: "100%",
  },
  requirementRow: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    marginBottom: "6px",
  },
  removeBtn: {
    padding: "8px 10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "0.8rem",
    flexShrink: 0,
  },
  addBtn: {
    padding: "8px 14px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#374151",
    cursor: "pointer",
    alignSelf: "flex-start",
    fontWeight: 500,
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
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
  successCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  successTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#111827",
  },
  successMeta: {
    fontSize: "0.95rem",
    color: "#374151",
  },
  categoryRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  categoryLabel: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
  },
  badge: {
    display: "inline-block",
    padding: "3px 12px",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  successActions: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  primaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  secondaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "0.9rem",
    cursor: "pointer",
    color: "#374151",
  },
};

export default CreateJobPage;