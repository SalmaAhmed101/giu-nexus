// src/pages/JobListPage.jsx
// Member 2 — Browsable grid of all jobs with filter support.
//
// API: GET /api/v1/jobs
// Query params wired to filter UI: keyword, location, type, status, page, limit
// Access: Public (anyone can browse)

import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Spinner from "../components/Spinner";

// How many jobs per page
const PAGE_LIMIT = 9;

// Job type options — matches backend enum values
const JOB_TYPES = ["", "full-time", "part-time", "internship", "remote"];
const JOB_STATUSES = ["", "open", "closed"];

function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state — each key maps to a backend query param
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "",
    status: "",
  });

  // Temporary filter values (only applied when user hits "Search")
  const [draftFilters, setDraftFilters] = useState({ ...filters });

  // ─── Fetch jobs whenever page or active filters change ───────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page,
        limit: PAGE_LIMIT,
        ...Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v !== "")
        ),
      };
      const { data } = await api.get("/jobs", { params });
      // Backend returns { data: { jobs: [...], totalPages: N } } — adjust if different
      // M2 response shape: { success, total, page, jobs: [...] }
      setJobs(data.jobs || []);
      // totalPages isn't returned directly — compute from total + limit
      setTotalPages(Math.ceil((data.total || 0) / PAGE_LIMIT) || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  function handleDraftChange(e) {
    setDraftFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    setFilters({ ...draftFilters });
  }

  function handleReset() {
    const empty = { keyword: "", location: "", type: "", status: "" };
    setDraftFilters(empty);
    setFilters(empty);
    setPage(1);
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Browse Jobs</h1>

      {/* ── Filter bar ── */}
      <form onSubmit={handleSearch} style={styles.filterBar}>
        <input
          name="keyword"
          value={draftFilters.keyword}
          onChange={handleDraftChange}
          placeholder="Keyword (title, company…)"
          style={styles.input}
        />
        <input
          name="location"
          value={draftFilters.location}
          onChange={handleDraftChange}
          placeholder="Location"
          style={styles.input}
        />
        <select
          name="type"
          value={draftFilters.type}
          onChange={handleDraftChange}
          style={styles.select}
        >
          <option value="">All Types</option>
          {JOB_TYPES.filter(Boolean).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={draftFilters.status}
          onChange={handleDraftChange}
          style={styles.select}
        >
          <option value="">All Statuses</option>
          {JOB_STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.searchBtn}>
          Search
        </button>
        <button type="button" onClick={handleReset} style={styles.resetBtn}>
          Reset
        </button>
      </form>

      {/* ── Content area ── */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>
          <p>No jobs found matching your criteria.</p>
          <button onClick={handleReset} style={styles.resetBtn}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={styles.pageBtn}
              >
                ← Prev
              </button>
              <span style={styles.pageInfo}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={styles.pageBtn}
              >
                Next →
              </button>
            </div>
          )}
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
    marginBottom: "20px",
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "28px",
    alignItems: "center",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    flex: "1 1 160px",
    outline: "none",
    color: "#111827",
  },
  select: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    flex: "1 1 130px",
    backgroundColor: "#fff",
    color: "#111827",
    cursor: "pointer",
  },
  searchBtn: {
    padding: "8px 20px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  resetBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.875rem",
    cursor: "pointer",
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
    padding: "60px 0",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    marginTop: "36px",
  },
  pageBtn: {
    padding: "8px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#374151",
    fontSize: "0.875rem",
    cursor: "pointer",
    fontWeight: 500,
    disabled: { opacity: 0.4, cursor: "not-allowed" },
  },
  pageInfo: {
    fontSize: "0.875rem",
    color: "#6b7280",
    fontWeight: 500,
  },
};

export default JobListPage;
