import { useState, useEffect } from "react";
import { getAllReviews, createReview, submitManagerReview, generateAIReview, getEmployees } from "../services/api";

const RATINGS = ["quality","delivery","communication","initiative","teamwork"];

function RatingInput({ label, value, onChange }) {
  return (
    <div style={{ marginBottom:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
        <label className="input-label">{label}</label>
        <span style={{ fontSize:"13px", fontWeight:600, color:"var(--accent)" }}>{value || "—"}/5</span>
      </div>
      <div style={{ display:"flex", gap:"6px" }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            style={{ width:"36px", height:"36px", borderRadius:"8px", border:"1px solid var(--border)", background: value >= n ? "var(--accent)" : "var(--surface-2)", color: value >= n ? "#fff" : "var(--text-3)", cursor:"pointer", fontSize:"13px", fontWeight:600, transition:"all 0.15s" }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PerformanceReviews({ toast }) {
  const [reviews,   setReviews]   = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [view,      setView]      = useState("list"); // list | new | detail
  const [mgr, setMgr] = useState({ quality:0, delivery:0, communication:0, initiative:0, teamwork:0, manager_notes:"" });
  const [form, setForm] = useState({ employee_id:"", period:"", achievements:"", challenges:"", goals:"" });

  useEffect(() => {
    getAllReviews().then(setReviews);
    getEmployees().then(setEmployees);
  }, []);

  const handleCreate = async () => {
    if (!form.employee_id || !form.period) { toast("Fill employee and period.", "error"); return; }
    setLoading(true);
    try {
      await createReview({ ...form, employee_id: parseInt(form.employee_id) });
      getAllReviews().then(setReviews);
      setView("list");
      toast("Review created!", "success");
    } catch { toast("Failed.", "error"); }
    finally { setLoading(false); }
  };

  const handleManagerSubmit = async () => {
    setLoading(true);
    try {
      await submitManagerReview(selected.id, mgr);
      getAllReviews().then(r => { setReviews(r); setSelected(r.find(x => x.id === selected.id)); });
      toast("Manager review submitted!", "success");
    } catch { toast("Failed.", "error"); }
    finally { setLoading(false); }
  };

  const handleAI = async () => {
    setLoading(true);
    try {
      const updated = await generateAIReview(selected.id);
      getAllReviews().then(setReviews);
      setSelected(updated);
      toast("AI review generated!", "success");
    } catch { toast("Failed to generate AI review.", "error"); }
    finally { setLoading(false); }
  };

  const empName = (id) => employees.find(e => e.id === id)?.name || `#${id}`;
  const avg = (r) => {
    const vals = RATINGS.map(k => r[k]).filter(Boolean);
    return vals.length ? (vals.reduce((a,b) => a+b,0) / vals.length).toFixed(1) : null;
  };

  if (view === "new") return (
    <div className="form-panel">
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setView("list")}>← Back</button>
        <p className="section-label" style={{ margin:0 }}>New Performance Review</p>
      </div>
      <div className="form-grid">
        <div className="input-wrap">
          <label className="input-label">Employee</label>
          <select value={form.employee_id} onChange={e => setForm({...form, employee_id:e.target.value})}>
            <option value="">Select employee</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <div className="input-wrap">
          <label className="input-label">Period</label>
          <input placeholder="e.g. Q2 2025" value={form.period} onChange={e => setForm({...form, period:e.target.value})} />
        </div>
        {[["achievements","Achievements","Key wins this period..."],["challenges","Challenges","Obstacles faced..."],["goals","Goals for Next Period","Next period targets..."]].map(([key,label,ph]) => (
          <div key={key} className="input-wrap" style={{ gridColumn:"1/-1" }}>
            <label className="input-label">{label}</label>
            <textarea placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}
              style={{ width:"100%", minHeight:"80px", padding:"10px 14px", background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)", color:"var(--text-1)", fontFamily:"var(--font-body)", fontSize:"14px", outline:"none", resize:"vertical" }} />
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
        {loading ? <><span className="spinner"/>Creating...</> : "Create Review"}
      </button>
    </div>
  );

  if (view === "detail" && selected) return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setView("list")}>← Back</button>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:"18px", color:"var(--text-1)" }}>{empName(selected.employee_id)}</div>
          <div style={{ fontSize:"12px", color:"var(--text-2)" }}>Period: {selected.period} · Status: <span style={{ color: selected.status === "submitted" ? "var(--success)" : "var(--warning)" }}>{selected.status}</span></div>
        </div>
      </div>

      {/* Self assessment */}
      <div className="form-panel" style={{ margin:0 }}>
        <p className="section-label">Self Assessment</p>
        {[["achievements","Achievements"],["challenges","Challenges"],["goals","Goals"]].map(([k,l]) => selected[k] && (
          <div key={k} style={{ marginBottom:"12px" }}>
            <div className="input-label" style={{ marginBottom:"4px" }}>{l}</div>
            <div style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.7 }}>{selected[k]}</div>
          </div>
        ))}
      </div>

      {/* Manager ratings */}
      <div className="form-panel" style={{ margin:0 }}>
        <p className="section-label">Manager Ratings</p>
        {RATINGS.map(r => (
          <RatingInput key={r} label={r.charAt(0).toUpperCase()+r.slice(1)}
            value={mgr[r] || selected[r] || 0}
            onChange={v => setMgr(prev => ({...prev, [r]:v}))} />
        ))}
        <div className="input-wrap" style={{ marginTop:"12px", marginBottom:"16px" }}>
          <label className="input-label">Manager Notes</label>
          <textarea value={mgr.manager_notes || selected.manager_notes || ""}
            onChange={e => setMgr(p => ({...p, manager_notes:e.target.value}))}
            placeholder="Add notes..."
            style={{ width:"100%", minHeight:"80px", padding:"10px 14px", background:"var(--surface-2)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)", color:"var(--text-1)", fontFamily:"var(--font-body)", fontSize:"14px", outline:"none", resize:"vertical" }} />
        </div>
        <div style={{ display:"flex", gap:"10px" }}>
          <button className="btn btn-primary btn-sm" onClick={handleManagerSubmit} disabled={loading}>
            {loading ? <><span className="spinner"/>Saving...</> : "Submit Manager Review"}
          </button>
          <button className="btn btn-warning btn-sm" onClick={handleAI} disabled={loading}>
            {loading ? <><span className="spinner"/>Generating...</> : "✦ Generate AI Review"}
          </button>
        </div>
      </div>

      {/* AI Output */}
      {selected.ai_summary && (
        <div className="form-panel" style={{ margin:0 }}>
          <p className="section-label">AI Review Output</p>
          {[["ai_summary","Summary","var(--accent)"],["ai_mismatch","Mismatch Detection","var(--warning)"],["ai_actions","Development Actions","var(--success)"]].map(([k,l,c]) => selected[k] && (
            <div key={k} style={{ marginBottom:"16px" }}>
              <div style={{ fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:c, marginBottom:"8px" }}>{l}</div>
              <div className="card-bio"><div className="card-bio-text">{selected[k]}</div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <p className="section-label" style={{ margin:0 }}>{reviews.length} reviews</p>
        <button className="btn btn-primary btn-sm" onClick={() => setView("new")}>+ New Review</button>
      </div>
      {reviews.length === 0
        ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No reviews yet</div><div className="empty-sub">Start a new performance review cycle.</div></div>
        : <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {reviews.map(r => (
              <div key={r.id} onClick={() => { setSelected(r); setMgr({ quality:0,delivery:0,communication:0,initiative:0,teamwork:0,manager_notes:"" }); setView("detail"); }}
                style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"16px 20px", display:"flex", alignItems:"center", gap:"16px", cursor:"pointer", transition:"border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-md)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:600, fontSize:"14px", color:"var(--text-1)", marginBottom:"3px" }}>{empName(r.employee_id)}</div>
                  <div style={{ fontSize:"12px", color:"var(--text-2)" }}>Period: {r.period}</div>
                </div>
                {avg(r) && <div style={{ fontSize:"20px", fontWeight:700, color:"var(--accent)", fontFamily:"var(--font-display)" }}>{avg(r)}<span style={{ fontSize:"11px", color:"var(--text-3)" }}>/5</span></div>}
                <span style={{ padding:"3px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:700,
                  background: r.status==="submitted" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                  color: r.status==="submitted" ? "var(--success)" : "var(--warning)",
                  border: `1px solid ${r.status==="submitted" ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)"}` }}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
      }
    </div>
  );
}