import { useState } from "react";

export default function EditEmployeeModal({ emp, onClose, onSave }) {
  const [form, setForm] = useState({
    name:         emp.name         || "",
    email:        emp.email        || "",
    department:   emp.department   || "",
    designation:  emp.designation  || "",
    manager:      emp.manager      || "",
    joining_date: emp.joining_date || "",
    contact:      emp.contact      || "",
    status:       emp.status       || "active",
  });
  const [loading, setLoading] = useState(false);

  const fields = [
    { key:"name",         label:"Full Name",    placeholder:"Ada Lovelace"    },
    { key:"email",        label:"Email",         placeholder:"ada@company.com" },
    { key:"department",   label:"Department",    placeholder:"Engineering"     },
    { key:"designation",  label:"Designation",   placeholder:"Senior Engineer" },
    { key:"manager",      label:"Manager",       placeholder:"Manager name"    },
    { key:"joining_date", label:"Joining Date",  placeholder:"2024-01-15"      },
    { key:"contact",      label:"Contact",       placeholder:"+91 9876543210"  },
  ];

  const handleSave = async () => {
    setLoading(true);
    await onSave(emp.id, form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Edit Employee</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
          {fields.map(({ key, label, placeholder }) => (
            <div className="input-wrap" key={key}>
              <label className="input-label">{label}</label>
              <input
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          <div className="input-wrap">
            <label className="input-label">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? <><span className="spinner" /> Saving...</> : "Save Changes"}
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}