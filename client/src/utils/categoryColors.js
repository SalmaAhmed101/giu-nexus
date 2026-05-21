// ⚠️  THIS FILE BELONGS TO MEMBER 3 (src/utils/categoryColors.js)
// Member 2 wrote this because JobCard depends on it and M3 hasn't submitted yet.
// When M3 submits their version, compare — if it matches these exact keys and values,
// no changes needed in any of Member 2's files. If M3 changes the key names, update
// the import in JobCard.jsx accordingly.
//
// The spec says exactly 6 labels. These are the EXACT strings the backend returns.
// Color map matches the spec: green=Frontend, blue=Backend, purple=AI/ML,
// teal=DevOps, orange=Data Engineering, grey=Other.

const categoryColors = {
  Frontend: {
    bg: "#dcfce7",
    text: "#166534",
    border: "#86efac",
  },
  Backend: {
    bg: "#dbeafe",
    text: "#1e40af",
    border: "#93c5fd",
  },
  "AI/ML": {
    bg: "#f3e8ff",
    text: "#6b21a8",
    border: "#d8b4fe",
  },
  DevOps: {
    bg: "#ccfbf1",
    text: "#0f766e",
    border: "#5eead4",
  },
  "Data Engineering": {
    bg: "#ffedd5",
    text: "#c2410c",
    border: "#fdba74",
  },
  Other: {
    bg: "#f3f4f6",
    text: "#374151",
    border: "#d1d5db",
  },
};

export default categoryColors;
