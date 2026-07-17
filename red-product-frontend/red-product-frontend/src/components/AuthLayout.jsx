import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <div className="auth-pattern" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rings" width="220" height="220" patternUnits="userSpaceOnUse">
              <circle cx="110" cy="110" r="90" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="14" />
              <circle cx="0" cy="0" r="90" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="14" />
              <circle cx="220" cy="220" r="90" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="14" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rings)" />
        </svg>
      </div>

      <div className="auth-content">
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 0L18 9L9 6L0 9L9 0Z" fill="white" />
              <path d="M9 6L18 9L9 18L0 9L9 6Z" fill="white" fillOpacity="0.55" />
            </svg>
          </span>
          <span className="auth-logo-text">RED PRODUCT</span>
        </div>

        {children}
      </div>
    </div>
  );
}
