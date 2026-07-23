import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/hotels", label: "Liste des hôtels", icon: "list" },
];

function Icon({ name }) {
  if (name === "grid") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="2" width="16" height="5" rx="1.2" fill="currentColor" opacity="0.55" />
      <rect x="1" y="11" width="16" height="5" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export default function Sidebar() {
  const { admin } = useAuth();

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 0L18 9L9 6L0 9L9 0Z" fill="white" />
              <path d="M9 6L18 9L9 18L0 9L9 6Z" fill="white" fillOpacity="0.55" />
            </svg>
          </span>
          RED PRODUCT
        </div>

        <p className="sidebar-section">Principal</p>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
            >
              <Icon name={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {admin?.avatar ? (
            <img src={admin.avatar} alt={admin.name} />
          ) : (
            admin?.name?.[0] ?? "A"
          )}
        </div>
        <div>
          <p className="sidebar-user-name">{admin?.name ?? "Admin"}</p>
          <p className="sidebar-user-status">
            <span className="status-dot" /> en ligne
          </p>
        </div>
      </div>
    </aside>
  );
}
