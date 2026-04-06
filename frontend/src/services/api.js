const BASE_URL = "https://hrms-backend-den2.onrender.com";

// ── EMPLOYEES ────────────────────────────────────────────
export const getEmployees       = async () => (await fetch(`${BASE_URL}/employees`)).json();
export const getEmployee        = async (id) => (await fetch(`${BASE_URL}/employees/${id}`)).json();
export const addEmployeeAPI     = async (emp) => (await fetch(`${BASE_URL}/employees`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(emp) })).json();
export const updateEmployeeAPI  = async (id, data) => (await fetch(`${BASE_URL}/employees/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const deleteEmployeeAPI  = async (id) => fetch(`${BASE_URL}/employees/${id}`, { method:"DELETE" });
export const deactivateEmployee = async (id) => (await fetch(`${BASE_URL}/employees/${id}/deactivate`, { method:"PATCH" })).json();
export const exportCSV          = () => { window.open(`${BASE_URL}/employees/export/csv`, "_blank"); };

// ── ANALYTICS ────────────────────────────────────────────
export const getAnalytics        = async () => (await fetch(`${BASE_URL}/employees/analytics`)).json();
export const getAnalyticsSummary = async () => (await fetch(`${BASE_URL}/employees/analytics/summary`)).json();

// ── AI ───────────────────────────────────────────────────
export const generateBio    = async (id) => (await fetch(`${BASE_URL}/employees/${id}/bio`)).json();
export const generateSkills = async (id) => (await fetch(`${BASE_URL}/employees/${id}/skills`)).json();
export const generateReview = async (id) => (await fetch(`${BASE_URL}/employees/${id}/review`)).json();
export const detectIssues   = async (id) => (await fetch(`${BASE_URL}/employees/${id}/issues`)).json();

// ── LEAVE ────────────────────────────────────────────────
export const applyLeave        = async (data) => (await fetch(`${BASE_URL}/leaves`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAllLeaves       = async () => (await fetch(`${BASE_URL}/leaves`)).json();
export const getEmployeeLeaves = async (id) => (await fetch(`${BASE_URL}/leaves/employee/${id}`)).json();
export const updateLeave       = async (id, data) => (await fetch(`${BASE_URL}/leaves/${id}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getLeaveBalance   = async (id) => (await fetch(`${BASE_URL}/leaves/balance/${id}`)).json();
export const getLeavePatterns  = async (id) => (await fetch(`${BASE_URL}/leaves/patterns/${id}`)).json();
export const markAttendance    = async (data) => (await fetch(`${BASE_URL}/leaves/attendance`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAttendance     = async (id) => (await fetch(`${BASE_URL}/leaves/attendance/${id}`)).json();
export const getMonthlySummary = async (id, month) => (await fetch(`${BASE_URL}/leaves/attendance/${id}/summary?month=${month}`)).json();

// ── PERFORMANCE ──────────────────────────────────────────
export const createReview        = async (data) => (await fetch(`${BASE_URL}/performance`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAllReviews        = async () => (await fetch(`${BASE_URL}/performance`)).json();
export const getEmployeeReviews  = async (id) => (await fetch(`${BASE_URL}/performance/employee/${id}`)).json();
export const submitManagerReview = async (id, data) => (await fetch(`${BASE_URL}/performance/${id}/manager`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const generateAIReview    = async (id) => (await fetch(`${BASE_URL}/performance/${id}/ai`, { method:"POST" })).json();

// ── RECRUITMENT ──────────────────────────────────────────
export const createJob      = async (data) => (await fetch(`${BASE_URL}/recruitment/jobs`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAllJobs      = async () => (await fetch(`${BASE_URL}/recruitment/jobs`)).json();
export const closeJob       = async (id) => (await fetch(`${BASE_URL}/recruitment/jobs/${id}/close`, { method:"PATCH" })).json();
export const addCandidate   = async (data) => (await fetch(`${BASE_URL}/recruitment/candidates`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getCandidates  = async (jobId) => (await fetch(`${BASE_URL}/recruitment/candidates/${jobId}`)).json();
export const updateStage    = async (id, stage) => (await fetch(`${BASE_URL}/recruitment/candidates/${id}/stage`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ stage }) })).json();
export const scoreCandidate = async (id) => (await fetch(`${BASE_URL}/recruitment/candidates/${id}/score`, { method:"POST" })).json();
export const genQuestions   = async (id) => (await fetch(`${BASE_URL}/recruitment/candidates/${id}/questions`, { method:"POST" })).json();

// ── ONBOARDING ───────────────────────────────────────────
export const addChecklistItem   = async (data) => (await fetch(`${BASE_URL}/onboarding/checklist`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAllChecklists    = async () => (await fetch(`${BASE_URL}/onboarding/checklist`)).json();
export const getChecklistByRole = async (role) => (await fetch(`${BASE_URL}/onboarding/checklist/${role}`)).json();
export const updateProgress     = async (data) => (await fetch(`${BASE_URL}/onboarding/progress`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getProgress        = async (id) => (await fetch(`${BASE_URL}/onboarding/progress/${id}`)).json();
export const addPolicyDoc       = async (data) => (await fetch(`${BASE_URL}/onboarding/documents`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) })).json();
export const getAllDocs          = async () => (await fetch(`${BASE_URL}/onboarding/documents`)).json();
export const chatWithBot        = async (question) => (await fetch(`${BASE_URL}/onboarding/chat`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ question }) })).json();
