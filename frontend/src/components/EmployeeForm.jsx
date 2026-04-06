import { useState } from "react";

export default function EmployeeForm({ addEmployee, toast }) {
  const [form, setForm] = useState({ name: "", email: "", department: "", designation: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast("Please enter a name.", "error"); return; }
    if (!form.email.trim()) { toast("Please enter an email.", "error"); return; }
    setLoading(true);
    try {
      await addEmployee(form);
      setForm({ name: "", email: "", department: "", designation: "" });
      toast("Employee added successfully!", "success");
    } catch {
      toast("Failed to add employee.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "name",        label: "Full Name",  placeholder: "Ada Lovelace"     },
    { key: "email",       label: "Email",       placeholder: "ada@company.com"  },
    { key: "department",  label: "Department",  placeholder: "Engineering"      },
    { key: "designation", label: "Designation", placeholder: "Senior Engineer"  },
  ];

  return (
    <div className="form-panel">
      <p className="section-label">Add Employee</p>
      <div className="form-grid">
        {fields.map(({ key, label, placeholder }) => (
          <div className="input-wrap" key={key}>
            <label className="input-label">{label}</label>
            <input
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
        {loading
          ? <><span className="spinner" /> Adding...</>
          : <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Employee
            </>
        }
      </button>
    </div>
  );
}