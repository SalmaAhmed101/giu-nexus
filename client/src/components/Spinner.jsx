// ⚠️  THIS FILE BELONGS TO MEMBER 3 (src/components/Spinner.jsx)
// Member 2 wrote this stub because all pages need a loading indicator.
// When M3 submits their Spinner, DELETE this file and use theirs.
// The prop interface used in Member 2's pages is: <Spinner /> (no required props)
// As long as M3's Spinner is also a default export with no required props, 
// everything in Member 2's files will work without any changes.

import React from "react";

function Spinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
    </div>
  );
}

// Inline styles so this stub works with zero CSS dependencies
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px 0",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Inject the keyframe animation once into the document head
if (typeof document !== "undefined") {
  const styleId = "spinner-keyframe";
  if (!document.getElementById(styleId)) {
    const styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleTag);
  }
}

export default Spinner;
