export default function EmployeeCard({ emp, onGenerateBio, onDelete, onOpenModal, onEdit, loadingId }) {
  const initials   = emp.name ? emp.name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() : "?";
  const isBioLoading = loadingId === `${emp.id}-bio`;
  const isDeleting   = loadingId === `${emp.id}-delete`;
  const isInactive   = emp.status === "inactive";

  return (
    <div className="emp-card" style={{ opacity: isInactive ? 0.6 : 1 }}>
      {/* Status badge */}
      {isInactive && (
        <div style={{ position:"absolute", top:"14px", right:"14px" }}>
          <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"100px", background:"rgba(248,113,113,0.12)", color:"var(--danger)", border:"1px solid rgba(248,113,113,0.2)" }}>
            Inactive
          </span>
        </div>
      )}

      <div className="card-header">
        <div className="card-avatar">{initials}</div>
        <div className="card-info">
          <div className="card-name">{emp.name}</div>
          <div className="card-designation">{emp.designation}</div>
        </div>
      </div>

      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
        <span className="card-dept">{emp.department}</span>
        {emp.manager && <span className="card-dept">↑ {emp.manager}</span>}
        {emp.joining_date && <span className="card-dept">📅 {emp.joining_date}</span>}
      </div>

      <div className="card-divider" />

      <div className="card-actions">
        <button className="btn btn-success btn-sm" onClick={() => onGenerateBio(emp.id)} disabled={isBioLoading}>
          {isBioLoading ? <><span className="spinner" /> Generating...</> : <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Bio
          </>}
        </button>

        <button className="btn btn-ghost btn-sm" onClick={() => onEdit(emp)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          Edit
        </button>

        <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal(emp)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 5.5v3M6 3.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Details
        </button>

        <button className="btn btn-danger btn-sm" onClick={() => onDelete(emp.id)} disabled={isDeleting}>
          {isDeleting ? <><span className="spinner" /> ...</> : <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M5 3V2h2v1M4 3v6h4V3H4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Delete
          </>}
        </button>
      </div>

      {emp.bio && (
        <div className="card-bio">
          <div className="card-bio-label">AI Bio</div>
          <div className="card-bio-text">{emp.bio}</div>
        </div>
      )}
    </div>
  );
}