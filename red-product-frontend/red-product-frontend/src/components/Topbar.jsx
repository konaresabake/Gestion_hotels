import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchUnreadCount,
  listNotifications,
  markAllNotificationsRead,
} from "../api/notifications";
import "./Topbar.css";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} j`;
}

export default function Topbar({ title }) {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchValue, setSearchValue] = useState(
    () => new URLSearchParams(window.location.search).get("search") || ""
  );
  const dropdownRef = useRef(null);
  const searchDebounce = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      const trimmed = value.trim();
      navigate(trimmed ? `/hotels?search=${encodeURIComponent(trimmed)}` : "/hotels");
    }, 350);
  };

  const loadUnreadCount = () => {
    fetchUnreadCount()
      .then(({ data }) => setUnreadCount(data.count))
      .catch(() => {});
  };

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000); // rafraîchi toutes les 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      listNotifications()
        .then(({ data }) => setNotifications(data))
        .catch(() => {});
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead().then(() => {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    });
  };

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-actions">
        <div className="topbar-search">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#9a9aa0" strokeWidth="1.4" />
            <line x1="9.7" y1="9.7" x2="13" y2="13" stroke="#9a9aa0" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input placeholder="Rechercher un hôtel..." value={searchValue} onChange={handleSearchChange} />
        </div>

        <div className="topbar-notifications" ref={dropdownRef}>
          <button className="topbar-bell" aria-label="Notifications" onClick={toggleDropdown}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path
                d="M8.5 1.5c-2.2 0-4 1.8-4 4v2.5l-1.3 2.3c-.2.3 0 .7.4.7h9.8c.4 0 .6-.4.4-.7L12.5 8V5.5c0-2.2-1.8-4-4-4z"
                fill="#54545a"
              />
              <path d="M6.7 13.2a1.8 1.8 0 003.6 0" stroke="#54545a" strokeWidth="1.2" fill="none" />
            </svg>
            {unreadCount > 0 && (
              <span className="topbar-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {open && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead}>Tout marquer comme lu</button>
                )}
              </div>
              <div className="notif-dropdown-list">
                {notifications.length === 0 && (
                  <p className="notif-empty">Aucune notification pour le moment.</p>
                )}
                {notifications.map((n) => (
                  <div key={n.id} className={"notif-item" + (n.is_read ? "" : " unread")}>
                    <p className="notif-message">{n.message}</p>
                    <p className="notif-time">{timeAgo(n.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          className="topbar-avatar"
          onClick={() => navigate("/profile")}
          aria-label="Mon profil"
        >
          {admin?.avatar ? (
            <img src={admin.avatar} alt={admin.name} />
          ) : (
            admin?.name?.[0] ?? "A"
          )}
        </button>

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
