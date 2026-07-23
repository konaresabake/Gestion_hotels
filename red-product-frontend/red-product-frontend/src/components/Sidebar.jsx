import "./StatCard.css";

export default function StatCard({ value, label, sublabel, color, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <p className="stat-value">
          {value} <span className="stat-label">{label}</span>
        </p>
        <p className="stat-sublabel">{sublabel}</p>
      </div>
    </div>
  );
}
