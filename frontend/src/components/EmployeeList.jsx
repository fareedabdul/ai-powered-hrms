import { useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { exportCSV } from "../services/api";

export default function EmployeeList({ employees, generateBio, deleteEmployee, onOpenModal, onEdit, loadingId }) {
  const [search, setSearch] = useState("");
  const [dept,   setDept]   = useState("All");
  const [status, setStatus] = useState("All");

  const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];

  const filtered = employees.filter(emp => {
    const matchSearch = emp.name?.toLowerCase().includes(search.toLowerCase()) ||
                        emp.designation?.toLowerCase().includes(search.toLowerCase()) ||
                        emp.department?.toLowerCase().includes(search.toLowerCase());
    const matchDept   = dept   === "All" || emp.department === dept;
    const matchStatus = status === "All" || emp.status     === status;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div>
      <div className="toolbar">
        <div className="search-wrap" style={{ flex:2 }}>
          <span className="search-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
          <input className="search-input" placeholder="Search by name, role or department..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={dept} onChange={e => setDept(e.target.value)}>
          {departments.map(d => <option key={d} value={d}>{d === "All" ? "All departments" : d}</option>)}
        </select>
        <select className="filter-select" style={{ width:"140px" }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV} title="Export CSV">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Export CSV
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="module-empty">
          <div className="module-empty-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="module-empty-title">No employees yet</div>
          <div className="module-empty-sub">Add your first employee using the form above to get started.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="module-empty" style={{ padding:"32px 24px" }}>
          <div className="module-empty-title">No results found</div>
          <div className="module-empty-sub">Try a different search term or filter.</div>
        </div>
      ) : (
        <>
          <p className="section-label">{filtered.length} of {employees.length} employee{employees.length !== 1 ? "s" : ""}</p>
          <div className="emp-grid">
            {filtered.map(emp => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onGenerateBio={generateBio}
                onDelete={deleteEmployee}
                onOpenModal={onOpenModal}
                onEdit={onEdit}
                loadingId={loadingId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
