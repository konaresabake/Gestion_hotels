import { Link } from "react-router-dom";
import "./StatCard.css";

export default function StatCard({ value, label, sublabel, color, icon, to }) {
  const content = (
    <>
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <p className="stat-value">
          {value} <span className="stat-label">{label}</span>
        </p>
        <p className="stat-sublabel">{sublabel}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link className="stat-card stat-card-link" to={to}>
        {content}
      </Link>
    );
  }

  return <div className="stat-card">{content}</div>;
}
