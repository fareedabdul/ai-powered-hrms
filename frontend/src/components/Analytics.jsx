import { useEffect, useState } from "react";
import { getAnalytics, getAnalyticsSummary } from "../services/api";

function Bar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom:"12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
        <span style={{ fontSize:"13px", color:"var(--text-2)" }}>{label}</span>
        <span style={{ fontSize:"13px", fontWeight:600, color:"var(--text-1)" }}>{value}</span>
      </div>
      <div style={{ height:"6px", background:"var(--surface-2)", borderRadius:"100px", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"100px", transition:"width 0.6s ease" }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-lg)", padding:"16px 20px" }}>
      <div style={{ fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"1.2px", color:"var(--text-3)", marginBottom:"8px" }}>{label}</div>
      <div style={{ fontSize:"28px", fontWeight:700, fontFamily:"var(--font-display)", color: color || "var(--text-1)" }}>{value}</div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData]       = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAnalytics().then(setData);
  }, []);

  const handleSummary = async () => {
    setLoading(true);
    const res = await getAnalyticsSummary();
    setSummary(res.summary);
    setLoading(false);
  };

  if (!data) return <div className="empty-state"><div className="empty-sub">Loading analytics...</div></div>;

  const maxDept = Math.max(...(data.by_dept.map(d => d.count)), 1);
  const COLORS  = ["var(--accent)", "var(--accent-2)", "var(--success)", "var(--warning)", "var(--danger)"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>

      {/* Stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:"12px" }}>
        <StatCard label="Total Employees" value={data.total} />
        <StatCard label="Active"          value={data.active}   color="var(--success)" />
        <StatCard label="Inactive"        value={data.inactive} color="var(--danger)"  />
        <StatCard label="Bios Generated"  value={data.bios}     color="var(--accent)"  />
        <StatCard label="Attrition Rate"  value={`${data.attrition}%`} color="var(--warning)" />
      </div>

      {/* Dept breakdown */}
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-xl)", padding:"24px" }}>
        <p className="section-label" style={{ marginBottom:"16px" }}>Headcount by Department</p>
        {data.by_dept.length === 0
          ? <div style={{ color:"var(--text-3)", fontSize:"13px" }}>No department data yet.</div>
          : data.by_dept.map((d, i) => (
              <Bar key={d.department} label={d.department} value={d.count} max={maxDept} color={COLORS[i % COLORS.length]} />
            ))
        }
      </div>

      {/* AI Summary */}
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-xl)", padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
          <p className="section-label" style={{ margin:0 }}>AI Monthly Summary</p>
          <button className="btn btn-primary btn-sm" onClick={handleSummary} disabled={loading}>
            {loading ? <><span className="spinner" /> Generating...</> : "✦ Generate Summary"}
          </button>
        </div>
        {summary
          ? <div className="card-bio"><div className="card-bio-text">{summary}</div></div>
          : <div style={{ fontSize:"13px", color:"var(--text-3)", fontStyle:"italic" }}>Click Generate Summary to get an AI-powered monthly HR report.</div>
        }
      </div>
    </div>
  );
}