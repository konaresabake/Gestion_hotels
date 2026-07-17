import { useAuth } from "../context/AuthContext";
import "./Topbar.css";

export default function Topbar({ title }) {
  const { admin, logout } = useAuth();

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        <div className="topbar-search">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#9a9aa0" strokeWidth="1.4" />
            <line x1="9.7" y1="9.7" x2="13" y2="13" stroke="#9a9aa0" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input placeholder="Recherche" />
        </div>

        <button className="topbar-bell" aria-label="Notifications">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path
              d="M8.5 1.5c-2.2 0-4 1.8-4 4v2.5l-1.3 2.3c-.2.3 0 .7.4.7h9.8c.4 0 .6-.4.4-.7L12.5 8V5.5c0-2.2-1.8-4-4-4z"
              fill="#54545a"
            />
            <path d="M6.7 13.2a1.8 1.8 0 003.6 0" stroke="#54545a" strokeWidth="1.2" fill="none" />
          </svg>
          <span className="topbar-badge">3</span>
        </button>

        <div className="topbar-avatar">{admin?.name?.[0] ?? "A"}</div>

        <button className="topbar-logout" onClick={logout} aria-label="Se déconnecter">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 2H3.5a1 1 0 00-1 1v10a1 1 0 001 1H6M10.5 11l3-3-3-3M13.3 8H5.5"
              stroke="#54545a"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
