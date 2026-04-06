export default function Header({ total, bios, dark, onToggleTheme }) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-mark">H</div>
        <div className="logo-text">HR<span>MS</span></div>
      </div>

      <div className="header-right">
        <div className="stat-badge">
          <strong>{total}</strong>&nbsp;employees
        </div>
        <div className="stat-badge">
          <strong>{bios}</strong>&nbsp;bios
        </div>

        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {dark ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 9.5A5.5 5.5 0 016.5 2.5a5.5 5.5 0 100 11 5.5 5.5 0 007-4z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}