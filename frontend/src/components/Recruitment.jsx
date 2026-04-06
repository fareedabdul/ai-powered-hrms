import { useState, useEffect } from "react";
import { createJob, getAllJobs, closeJob, addCandidate, getCandidates, updateStage, scoreCandidate, genQuestions } from "../services/api";

const STAGES = ["Applied","Screening","Interview","Offer","Hired","Rejected"];
const STAGE_COLOR = { Applied:"var(--accent)", Screening:"var(--warning)", Interview:"var(--accent-2)", Offer:"var(--success)", Hired:"var(--success)", Rejected:"var(--danger)" };

function ScoreRing({ score }) {
  const color = score >= 70 ? "var(--success)" : score >= 45 ? "var(--warning)" : "var(--danger)";
  return (
    <div style={{ width:52,height:52,borderRadius:"50%",border:`3px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      <span style={{ fontSize:"13px",fontWeight:700,color }}>{Math.round(score)}%</span>
    </div>
  );
}

export default function Recruitment({ toast }) {
  const [jobs,setJobs]=useState([]);
  const [selJob,setSelJob]=useState(null);
  const [candidates,setCandidates]=useState([]);
  const [selCand,setSelCand]=useState(null);
  const [view,setView]=useState("jobs");
  const [loading,setLoading]=useState(false);
  const [jobForm,setJobForm]=useState({title:"",department:"",description:"",required_skills:"",experience:""});
  const [candForm,setCandForm]=useState({name:"",email:"",resume_text:""});
  const [showJobForm,setShowJobForm]=useState(false);
  const [showCandForm,setShowCandForm]=useState(false);

  useEffect(()=>{ getAllJobs().then(setJobs); },[]);

  const openJob = async (job) => {
    setSelJob(job);
    const c = await getCandidates(job.id);
    setCandidates(c); setView("candidates");
  };

  const handleCreateJob = async () => {
    if (!jobForm.title){ toast("Job title required.","error"); return; }
    setLoading(true);
    const j = await createJob(jobForm);
    setJobs(prev=>[...prev,j]);
    setJobForm({title:"",department:"",description:"",required_skills:"",experience:""});
    setShowJobForm(false); toast("Job posted!","success"); setLoading(false);
  };

  const handleAddCandidate = async () => {
    if (!candForm.name){ toast("Name required.","error"); return; }
    setLoading(true);
    const c = await addCandidate({...candForm, job_id:selJob.id});
    setCandidates(prev=>[...prev,c]);
    setCandForm({name:"",email:"",resume_text:""}); setShowCandForm(false);
    toast("Candidate added!","success"); setLoading(false);
  };

  const handleScore = async (id) => {
    setLoading(true);
    try {
      const updated = await scoreCandidate(id);
      setCandidates(prev=>prev.map(c=>c.id===id?updated:c));
      if(selCand?.id===id) setSelCand(updated);
      toast("Resume scored!","success");
    } catch { toast("Scoring failed.","error"); }
    setLoading(false);
  };

  const handleQuestions = async (id) => {
    setLoading(true);
    try {
      const updated = await genQuestions(id);
      setCandidates(prev=>prev.map(c=>c.id===id?updated:c));
      if(selCand?.id===id) setSelCand(updated);
      toast("Questions generated!","success");
    } catch { toast("Failed.","error"); }
    setLoading(false);
  };

  const handleStage = async (id, stage) => {
    const updated = await updateStage(id, stage);
    setCandidates(prev=>prev.map(c=>c.id===id?updated:c));
    if(selCand?.id===id) setSelCand(updated);
  };

  if (view==="detail" && selCand) return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setView("candidates")}>← Back</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"18px",fontWeight:700,color:"var(--text-1)"}}>{selCand.name}</div>
          <div style={{fontSize:"12px",color:"var(--text-2)"}}>{selCand.email} · {selJob?.title}</div>
        </div>
        {selCand.ai_score!=null && <ScoreRing score={selCand.ai_score}/>}
      </div>
      <div className="form-panel" style={{margin:0}}>
        <p className="section-label">Pipeline Stage</p>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          {STAGES.map(s=>(
            <button key={s} onClick={()=>handleStage(selCand.id,s)} className="btn btn-sm"
              style={{background:selCand.stage===s?STAGE_COLOR[s]:"var(--surface-2)",color:selCand.stage===s?"#fff":"var(--text-2)",border:`1px solid ${selCand.stage===s?STAGE_COLOR[s]:"var(--border)"}`}}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
        <button className="btn btn-success btn-sm" onClick={()=>handleScore(selCand.id)} disabled={loading}>
          {loading?<><span className="spinner"/>Scoring...</>:"✦ AI Score Resume"}
        </button>
        <button className="btn btn-warning btn-sm" onClick={()=>handleQuestions(selCand.id)} disabled={loading}>
          {loading?<><span className="spinner"/>Generating...</>:"✦ Interview Questions"}
        </button>
      </div>
      {selCand.ai_reasoning && (
        <div className="form-panel" style={{margin:0}}>
          <p className="section-label">AI Assessment</p>
          {[["Reasoning",selCand.ai_reasoning,"var(--accent)"],["Top Strengths",selCand.ai_strengths,"var(--success)"],["Gaps",selCand.ai_gaps,"var(--danger)"]].map(([l,v,c])=>v&&(
            <div key={l} style={{marginBottom:"14px"}}>
              <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"1.5px",color:c,marginBottom:"6px"}}>{l}</div>
              <div className="card-bio"><div className="card-bio-text">{v}</div></div>
            </div>
          ))}
        </div>
      )}
      {selCand.ai_questions && (
        <div className="form-panel" style={{margin:0}}>
          <p className="section-label">Interview Questions</p>
          <div className="card-bio"><div className="card-bio-text" style={{whiteSpace:"pre-wrap"}}>{selCand.ai_questions}</div></div>
        </div>
      )}
      {selCand.resume_text && (
        <div className="form-panel" style={{margin:0}}>
          <p className="section-label">Resume</p>
          <div className="card-bio"><div className="card-bio-text" style={{whiteSpace:"pre-wrap",fontSize:"12px"}}>{selCand.resume_text}</div></div>
        </div>
      )}
    </div>
  );

  if (view==="candidates") return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{display:"flex",gap:"12px",alignItems:"center",flexWrap:"wrap"}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>setView("jobs")}>← Jobs</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--font-display)",fontSize:"16px",fontWeight:700,color:"var(--text-1)"}}>{selJob?.title}</div>
          <div style={{fontSize:"12px",color:"var(--text-2)"}}>{selJob?.department} · {candidates.length} candidates</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowCandForm(v=>!v)}>+ Add Candidate</button>
      </div>
      {showCandForm && (
        <div className="form-panel" style={{margin:0}}>
          <p className="section-label">Add Candidate</p>
          <div className="form-grid" style={{marginBottom:"12px"}}>
            <div className="input-wrap"><label className="input-label">Name</label><input placeholder="John Doe" value={candForm.name} onChange={e=>setCandForm({...candForm,name:e.target.value})}/></div>
            <div className="input-wrap"><label className="input-label">Email</label><input placeholder="john@email.com" value={candForm.email} onChange={e=>setCandForm({...candForm,email:e.target.value})}/></div>
            <div className="input-wrap" style={{gridColumn:"1/-1"}}>
              <label className="input-label">Resume Text</label>
              <textarea placeholder="Paste resume here..." value={candForm.resume_text} onChange={e=>setCandForm({...candForm,resume_text:e.target.value})}
                style={{width:"100%",minHeight:"120px",padding:"10px 14px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--radius-md)",color:"var(--text-1)",fontFamily:"var(--font-body)",fontSize:"13px",outline:"none",resize:"vertical"}}/>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAddCandidate} disabled={loading}>
            {loading?<><span className="spinner"/>Adding...</>:"Add Candidate"}
          </button>
        </div>
      )}
      {candidates.length===0
        ? <div className="empty-state"><div className="empty-icon">👤</div><div className="empty-title">No candidates yet</div></div>
        : <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {candidates.map(c=>(
              <div key={c.id} onClick={()=>{setSelCand(c);setView("detail");}}
                style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"16px 20px",display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap",cursor:"pointer",transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-md)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{flex:1,minWidth:"150px"}}>
                  <div style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"14px",color:"var(--text-1)",marginBottom:"3px"}}>{c.name}</div>
                  <div style={{fontSize:"12px",color:"var(--text-2)"}}>{c.email}</div>
                </div>
                <span style={{padding:"3px 12px",borderRadius:"100px",fontSize:"11px",fontWeight:700,background:`${STAGE_COLOR[c.stage]}18`,color:STAGE_COLOR[c.stage],border:`1px solid ${STAGE_COLOR[c.stage]}40`}}>{c.stage}</span>
                {c.ai_score!=null && <ScoreRing score={c.ai_score}/>}
              </div>
            ))}
          </div>
      }
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p className="section-label" style={{margin:0}}>{jobs.length} job postings</p>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowJobForm(v=>!v)}>+ Post Job</button>
      </div>
      {showJobForm && (
        <div className="form-panel" style={{margin:0}}>
          <p className="section-label">New Job Posting</p>
          <div className="form-grid" style={{marginBottom:"12px"}}>
            {[["title","Job Title","e.g. Senior Engineer"],["department","Department","Engineering"],["experience","Experience","e.g. 3-5 years"]].map(([k,l,p])=>(
              <div key={k} className="input-wrap"><label className="input-label">{l}</label><input placeholder={p} value={jobForm[k]} onChange={e=>setJobForm({...jobForm,[k]:e.target.value})}/></div>
            ))}
            <div className="input-wrap" style={{gridColumn:"1/-1"}}>
              <label className="input-label">Job Description</label>
              <textarea placeholder="Describe the role..." value={jobForm.description} onChange={e=>setJobForm({...jobForm,description:e.target.value})}
                style={{width:"100%",minHeight:"80px",padding:"10px 14px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--radius-md)",color:"var(--text-1)",fontFamily:"var(--font-body)",fontSize:"13px",outline:"none",resize:"vertical"}}/>
            </div>
            <div className="input-wrap" style={{gridColumn:"1/-1"}}>
              <label className="input-label">Required Skills</label>
              <input placeholder="e.g. React, Python, SQL" value={jobForm.required_skills} onChange={e=>setJobForm({...jobForm,required_skills:e.target.value})}/>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleCreateJob} disabled={loading}>
            {loading?<><span className="spinner"/>Posting...</>:"Post Job"}
          </button>
        </div>
      )}
      {jobs.length===0
        ? <div className="empty-state"><div className="empty-icon">💼</div><div className="empty-title">No job postings yet</div></div>
        : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"14px"}}>
            {jobs.map(j=>(
              <div key={j.id} onClick={()=>openJob(j)}
                style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-xl)",padding:"20px",cursor:"pointer",transition:"border-color 0.2s,transform 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border-md)";e.currentTarget.style.transform="translateY(-2px)"}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                  <div style={{fontFamily:"var(--font-display)",fontSize:"15px",fontWeight:700,color:"var(--text-1)"}}>{j.title}</div>
                  <span style={{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:"100px",background:j.status==="open"?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.1)",color:j.status==="open"?"var(--success)":"var(--danger)",border:`1px solid ${j.status==="open"?"rgba(52,211,153,0.3)":"rgba(248,113,113,0.3)"}`}}>{j.status}</span>
                </div>
                {j.department && <div style={{fontSize:"12px",color:"var(--text-2)",marginBottom:"6px"}}>{j.department}</div>}
                {j.experience && <div style={{fontSize:"12px",color:"var(--text-3)"}}>Exp: {j.experience}</div>}
                {j.required_skills && <div style={{fontSize:"11px",color:"var(--text-3)",marginTop:"8px"}}>{j.required_skills}</div>}
              </div>
            ))}
          </div>
      }
    </div>
  );
}