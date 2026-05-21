// src/components/SaveJobButton.jsx
// Member 2 — Bookmark toggle for saving/unsaving a job.
//
// Behaviour (from spec):
// - Calls POST /api/v1/jobs/:id/save (same endpoint saves AND unsaves)
// - Reads the `saved` boolean in the response to set icon state
// - Updates optimistically (UI flips immediately, reverts on error)
// - Disabled when job.status !== "open" (backend returns 400 otherwise)
//
// Usage: <SaveJobButton jobId={job._id} initialSaved={job.isSaved} jobStatus={job.status} />

import React, { useState } from "react";
import api from "../services/api";

function SaveJobButton({ jobId, initialSaved = false, jobStatus = "open" }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDisabled = jobStatus !== "open" || loading;

  async function handleToggle() {
    if (isDisabled) return;

    // Optimistic update — flip immediately
    setSaved((prev) => !prev);
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post(`/jobs/${jobId}/save`);
      // Confirm with actual server response (source of truth)
      setSaved(data.saved);
    } catch (err) {
      // Revert optimistic update on failure
      setSaved((prev) => !prev);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        title={
          jobStatus !== "open"
            ? "Cannot save a closed job"
            : saved
            ? "Unsave job"
            : "Save job"
        }
        style={{
          background: "none",
          border: "none",
          cursor: isDisabled ? "not-allowed" : "pointer",
          padding: "4px",
          opacity: isDisabled ? 0.4 : 1,
          transition: "transform 0.15s, opacity 0.15s",
          fontSize: "1.25rem",
          lineHeight: 1,
        }}
        aria-label={saved ? "Unsave job" : "Save job"}
      >
        {/* Filled bookmark = saved, outline = not saved */}
        {saved ? "🔖" : "🏷️"}
      </button>
      {/* Inline error — tiny, non-intrusive */}
      {error && (
        <span style={{ fontSize: "0.65rem", color: "#dc2626", marginTop: "2px" }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default SaveJobButton;
