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
  Frontend:           { bg: '#dcfce7', text: '#166534' },
  Backend:            { bg: '#dbeafe', text: '#1e40af' },
  'AI/ML':            { bg: '#ede9fe', text: '#5b21b6' },
  DevOps:             { bg: '#ccfbf1', text: '#115e59' },
  'Data Engineering': { bg: '#fed7aa', text: '#9a3412' },
  Other:              { bg: '#f3f4f6', text: '#374151' },
};

export default categoryColors;
