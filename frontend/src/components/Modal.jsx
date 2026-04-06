export default function Modal({ emp, data, onClose, onGenerate, loadingId }) {
  if (!emp) return null;

  const isLoading = (type) => loadingId === `${emp.id}-${type}`;

  const parseSkills = (text) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((l) => l.replace(/^[-•*\d.]\s*/, "").trim())
      .filter(Boolean);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{emp.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-2)", marginTop: "2px" }}>
              {emp.designation} · {emp.department}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Bio */}
        <div className="modal-section">
          <div className="modal-section-label">AI Bio</div>
          {data.bio ? (
            <div className="modal-content">{data.bio}</div>
          ) : (
            <div className="modal-content" style={{ color: "var(--text-3)", fontStyle: "italic" }}>
              No bio generated yet.
            </div>
          )}
        </div>

        {/* Skills */}
        {data.skills && (
          <div className="modal-section">
            <div className="modal-section-label">Suggested Skills</div>
            <div className="skills-list">
              {parseSkills(data.skills).map((s, i) => (
                <div className="skill-item" key={i}>
                  <div className="skill-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Review */}
        {data.review && (
          <div className="modal-section">
            <div className="modal-section-label">Performance Review</div>
            <div className="modal-content">{data.review}</div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button
            className="btn btn-success btn-sm"
            onClick={() => onGenerate(emp.id, "bio")}
            disabled={isLoading("bio")}
          >
            {isLoading("bio") ? <><span className="spinner" /> Generating...</> : "↻ Regenerate Bio"}
          </button>

          <button
            className="btn btn-warning btn-sm"
            onClick={() => onGenerate(emp.id, "skills")}
            disabled={isLoading("skills")}
          >
            {isLoading("skills") ? <><span className="spinner" /> Loading...</> : "✦ Suggest Skills"}
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onGenerate(emp.id, "review")}
            disabled={isLoading("review")}
          >
            {isLoading("review") ? <><span className="spinner" /> Loading...</> : "📋 Performance Review"}
          </button>
        </div>
      </div>
    </div>
  );
}