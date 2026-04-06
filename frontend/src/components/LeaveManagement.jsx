import { useState, useEffect } from "react";
import { getAllLeaves, applyLeave, updateLeave, getLeaveBalance, getLeavePatterns, getEmployees } from "../services/api";

const STATUS_COLOR = { pending:"var(--warning)", approved:"var(--success)", rejected:"var(--danger)" };
const TYPE_LABELS  = { sick:"Sick", casual:"Casual", earned:"Earned", wfh:"WFH" };

export default function LeaveManagement({ toast }) {
  const [leaves,    setLeaves]    = useState([]);
  const [employees, setEmployees] = useState([]);
  const [balance,   setBalance]   = useState(null);
  const [patterns,  setPatterns]  = useState(null);
  const [selEmp,    setSelEmp]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [form, setForm] = useState({ employee_id:"", leave_type:"sick", start_date:"", end_date:"", reason:"" });

  useEffect(() => {
    getAllLeaves().then(setLeaves);
    getEmployees().then(setEmployees);
  }, []);

  const handleApply = async () => {
    if (!form.employee_id || !form.start_date || !form.end_date) { toast("Fill all required fields.", "error"); return; }
    setLoading(true);
    try {
      await applyLeave({ ...form, employee_id: parseInt(form.employee_id) });
      getAllLeaves().then(setLeaves);
      setForm({ employee_id:"", leave_type:"sick", start_date:"", end_date:"", reason:"" });
      toast("Leave applied!", "success");
    } catch { toast("Failed to apply leave.", "error"); }
    finally { setLoading(false); }
  };

  const handleStatus = async (id, status) => {
    const comment = status === "rejected" ? prompt("Rejection reason:") || "" : "";
    await updateLeave(id, { status, manager_comment: comment });
    getAllLeaves().then(setLeaves);
    toast(`Leave ${status}!`, status === "approved" ? "success" : "info");
  };

  const loadBalance = async () => {
    if (!selEmp) { toast("Select an employee first.", "error"); return; }
    const b = await getLeaveBalance(parseInt(selEmp));
    setBalance(b);
  };

  const loadPatterns = async () => {
    if (!selEmp) { toast("Select an employee first.", "error"); return; }
    setLoading(true);
    const p = await getLeavePatterns(parseInt(selEmp));
    setPatterns(p);
    setLoading(false);
  };

  const empName = (id) => employees.find(e => e.id === id)?.name || `#${id}`;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>

      {/* Apply Leave Form */}
      <div className="form-panel">
        <p className="section-label">Apply Leave</p>
        <div className="form-grid">
          <div className="input-wrap">
            <label className="input-label">Employee</label>
            <select value={form.employee_id} onChange={e => setForm({...form, employee_id:e.target.value})}>
              <option value="">Select employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="input-wrap">
            <label className="input-label">Leave Type</label>
            <select value={form.leave_type} onChange={e => setForm({...form, leave_type:e.target.value})}>
              {Object.entries(TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="input-wrap">
            <label className="input-label">Start Date</label>
            <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date:e.target.value})} />
          </div>
          <div className="input-wrap">
            <label className="input-label">End Date</label>
            <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date:e.target.value})} />
          </div>
          <div className="input-wrap" style={{ gridColumn:"1/-1" }}>
            <label className="input-label">Reason (optional)</label>
            <input placeholder="Reason for leave..." value={form.reason} onChange={e => setForm({...form, reason:e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleApply} disabled={loading}>
          {loading ? <><span className="spinner"/>Applying...</> : "Apply Leave"}
        </button>
      </div>

      {/* Balance + Pattern */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        <div className="form-panel" style={{ margin:0 }}>
          <p className="section-label">Leave Balance</p>
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
            <select style={{ flex:1 }} value={selEmp} onChange={e => setSelEmp(e.target.value)}>
              <option value="">Select employee</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={loadBalance}>Check</button>
          </div>
          {!balance ? (
            <div style={{ fontSize:"13px", color:"var(--text-3)", fontStyle:"italic" }}>Select an employee and click Check to view leave balance.</div>
          ) : Object.entries(balance).map(([type, data]) => (
            <div key={type} style={{ marginBottom:"10px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", marginBottom:"4px" }}>
                <span style={{ color:"var(--text-2)" }}>{TYPE_LABELS[type]}</span>
                <span style={{ color:"var(--text-1)", fontWeight:600 }}>{data.remaining}/{data.total}</span>
              </div>
              <div style={{ height:"5px", background:"var(--surface-2)", borderRadius:"100px" }}>
                <div style={{ height:"100%", width:`${Math.round((data.remaining/data.total)*100)}%`, background:"var(--accent)", borderRadius:"100px", transition:"width 0.5s" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="form-panel" style={{ margin:0 }}>
          <p className="section-label">AI Pattern Detection</p>
          <button className="btn btn-warning btn-sm" onClick={loadPatterns} disabled={loading} style={{ marginBottom:"14px" }}>
            {loading ? <><span className="spinner"/>Analyzing...</> : "✦ Detect Patterns"}
          </button>
          {!patterns ? (
            <div style={{ fontSize:"13px", color:"var(--text-3)", fontStyle:"italic" }}>Select an employee above and click Detect Patterns to run AI analysis.</div>
          ) : (
            <div>
              {patterns.patterns.length === 0
                ? <div style={{ fontSize:"13px", color:"var(--success)" }}>✓ No unusual patterns detected.</div>
                : patterns.patterns.map((p,i) => <div key={i} style={{ fontSize:"12px", color:"var(--warning)", padding:"4px 0" }}>⚠ {p}</div>)
              }
              {patterns.ai_note && (
                <div className="card-bio" style={{ marginTop:"12px" }}>
                  <div className="card-bio-label">AI Analysis</div>
                  <div className="card-bio-text">{patterns.ai_note}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Leave Requests */}
      <div>
        <p className="section-label">{leaves.length} leave request{leaves.length !== 1 ? "s" : ""}</p>
        {leaves.length === 0 ? (
          <div className="module-empty">
            <div className="module-empty-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="6" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 12h24M10 4v4M22 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="module-empty-title">No leave requests yet</div>
            <div className="module-empty-sub">Leave requests will appear here once employees apply.</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {leaves.map(l => (
              <div key={l.id} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"16px 20px", display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:"180px" }}>
                  <div style={{ fontFamily:"var(--font-display)", fontWeight:600, fontSize:"14px", color:"var(--text-1)", marginBottom:"3px" }}>{empName(l.employee_id)}</div>
                  <div style={{ fontSize:"12px", color:"var(--text-2)" }}>{TYPE_LABELS[l.leave_type]} · {l.start_date} → {l.end_date}</div>
                  {l.reason && <div style={{ fontSize:"12px", color:"var(--text-3)", marginTop:"3px" }}>{l.reason}</div>}
                </div>
                <span style={{ padding:"3px 12px", borderRadius:"100px", fontSize:"11px", fontWeight:700, background:`${STATUS_COLOR[l.status]}18`, color:STATUS_COLOR[l.status], border:`1px solid ${STATUS_COLOR[l.status]}40` }}>
                  {l.status}
                </span>
                {l.status === "pending" && (
                  <div style={{ display:"flex", gap:"6px" }}>
                    <button className="btn btn-success btn-xs" onClick={() => handleStatus(l.id, "approved")}>Approve</button>
                    <button className="btn btn-danger btn-xs"  onClick={() => handleStatus(l.id, "rejected")}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
