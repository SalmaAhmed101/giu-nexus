// src/components/ApplicationStatusBadge.jsx
// Member 2 — Coloured badge for application statuses returned by the backend.
// The three valid status values are exactly: "pending", "shortlisted", "rejected"
// Usage: <ApplicationStatusBadge status={application.status} />

import React from "react";

// Colour map — one entry per backend status value (match backend casing exactly)
const statusStyles = {
  pending: {
    bg: "#fef9c3",
    text: "#854d0e",
    border: "#fde047",
    label: "Pending",
  },
  shortlisted: {
    bg: "#dcfce7",
    text: "#166534",
    border: "#86efac",
    label: "Shortlisted",
  },
  rejected: {
    bg: "#fee2e2",
    text: "#991b1b",
    border: "#fca5a5",
    label: "Rejected",
  },
};

function ApplicationStatusBadge({ status }) {
  // Fallback if backend ever returns an unexpected value
  const style = statusStyles[status] || {
    bg: "#f3f4f6",
    text: "#374151",
    border: "#d1d5db",
    label: status || "Unknown",
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "9999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        textTransform: "capitalize",
        letterSpacing: "0.02em",
      }}
    >
      {style.label}
    </span>
  );
}

export default ApplicationStatusBadge;
