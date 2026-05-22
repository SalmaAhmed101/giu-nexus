export default function SkillChip({ skill }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      background: '#ede9fe',
      color: '#5b21b6',
      borderRadius: '9999px',
      fontSize: '12px',
      margin: '2px',
      fontWeight: 500
    }}>
      {skill}
    </span>
  );
}