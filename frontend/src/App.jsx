import { useEffect, useState } from "react";
import './App.css';
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import Header from "./components/Header";
import Modal from "./components/Modal";
import EditEmployeeModal from "./components/EditEmployeeModal";
import ToastContainer from "./components/ToastContainer";
import Analytics from "./components/Analytics";
import LeaveManagement from "./components/LeaveManagement";
import PerformanceReviews from "./components/PerformanceReviews";
import Recruitment from "./components/Recruitment";
import Onboarding from "./components/Onboarding";
import { useToast } from "./hooks/useToast";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  getEmployees, addEmployeeAPI, updateEmployeeAPI,
  generateBio, generateSkills, generateReview,
  deleteEmployeeAPI,
} from "./services/api";

const TABS = [
  { id:"Employees",   label:"👥 Employees"   },
  { id:"Recruitment", label:"💼 Recruitment" },
  { id:"Leave",       label:"📅 Leave"       },
  { id:"Performance", label:"📋 Performance" },
  { id:"Onboarding",  label:"🚀 Onboarding"  },
  { id:"Analytics",   label:"📊 Analytics"   },
];

function App() {
  const [employees, setEmployees] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [modalEmp,  setModalEmp]  = useState(null);
  const [modalData, setModalData] = useState({});
  const [editEmp,   setEditEmp]   = useState(null);
  const [tab,       setTab]       = useState("Employees");
  const { toasts, toast }         = useToast();
  const { dark, toggle }          = useDarkMode();

  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try { setEmployees(await getEmployees()); }
    catch { toast("Failed to load employees.", "error"); }
  };

  const addEmployee = async (emp) => {
    await addEmployeeAPI(emp); await fetchEmployees();
  };

  const handleEdit = async (id, data) => {
    try { await updateEmployeeAPI(id, data); await fetchEmployees(); toast("Employee updated!", "success"); }
    catch { toast("Failed to update.", "error"); }
  };

  const handleGenerateBio = async (id) => {
    setLoadingId(`${id}-bio`);
    try {
      const res = await generateBio(id); await fetchEmployees();
      if (modalEmp?.id === id) setModalData(p => ({ ...p, bio: res.bio }));
      toast("Bio generated!", "success");
    } catch { toast("Failed.", "error"); } finally { setLoadingId(null); }
  };

  const handleGenerateSkills = async (id) => {
    setLoadingId(`${id}-skills`);
    try {
      const res = await generateSkills(id);
      if (modalEmp?.id === id) setModalData(p => ({ ...p, skills: res.skills }));
      toast("Skills generated!", "success");
    } catch { toast("Failed.", "error"); } finally { setLoadingId(null); }
  };

  const handleGenerateReview = async (id) => {
    setLoadingId(`${id}-review`);
    try {
      const res = await generateReview(id);
      if (modalEmp?.id === id) setModalData(p => ({ ...p, review: res.review }));
      toast("Review generated!", "success");
    } catch { toast("Failed.", "error"); } finally { setLoadingId(null); }
  };

  const handleModalGenerate = (id, type) => {
    if (type === "bio")    handleGenerateBio(id);
    if (type === "skills") handleGenerateSkills(id);
    if (type === "review") handleGenerateReview(id);
  };

  const deleteEmployee = async (id) => {
    setLoadingId(`${id}-delete`);
    try { await deleteEmployeeAPI(id); await fetchEmployees(); toast("Employee deleted.", "info"); }
    catch { toast("Failed.", "error"); } finally { setLoadingId(null); }
  };

  return (
    <div className="app-shell">
      <Header
        total={employees.filter(e => e.status === "active").length}
        bios={employees.filter(e => e.bio).length}
        dark={dark}
        onToggleTheme={toggle}
      />

      <main className="app-main">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">AI-Powered Human Resource Management System</p>

        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "Employees" && <>
          <EmployeeForm addEmployee={addEmployee} toast={toast} />
          <EmployeeList
            employees={employees}
            generateBio={handleGenerateBio}
            deleteEmployee={deleteEmployee}
            onOpenModal={(emp) => { setModalEmp(emp); setModalData({ bio: emp.bio || "" }); }}
            onEdit={(emp) => setEditEmp(emp)}
            loadingId={loadingId}
          />
        </>}

        {tab === "Recruitment"  && <Recruitment toast={toast} />}
        {tab === "Leave"        && <LeaveManagement toast={toast} />}
        {tab === "Performance"  && <PerformanceReviews toast={toast} />}
        {tab === "Onboarding"   && <Onboarding toast={toast} employees={employees} />}
        {tab === "Analytics"    && <Analytics />}
      </main>

      {modalEmp && (
        <Modal emp={modalEmp} data={modalData}
          onClose={() => { setModalEmp(null); setModalData({}); }}
          onGenerate={handleModalGenerate} loadingId={loadingId}
        />
      )}

      {editEmp && (
        <EditEmployeeModal emp={editEmp}
          onClose={() => setEditEmp(null)}
          onSave={handleEdit}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default App;