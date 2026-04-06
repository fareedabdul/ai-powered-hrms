import { useState, useEffect, useRef } from "react";
import { getAllChecklists, addChecklistItem, updateProgress, getProgress, getAllDocs, addPolicyDoc, chatWithBot } from "../services/api";

export default function Onboarding({ toast, employees }) {
  const [docs,setDocs]=useState([]);
  const [checklist,setChecklist]=useState([]);
  const [progress,setProgress]=useState([]);
  const [selEmp,setSelEmp]=useState("");
  const [messages,setMessages]=useState([{role:"bot",text:"Hi! I'm your onboarding assistant 👋 Ask me anything about company policies, leave rules, tools, or procedures."}]);
  const [input,setInput]=useState("");
  const [chatLoading,setChatLoading]=useState(false);
  const [docForm,setDocForm]=useState({title:"",content:"",category:"general"});
  const [checkForm,setCheckForm]=useState({role:"",title:"",description:"",due_days:7,assignee:""});
  const [tab,setTab]=useState("chat");
  const messagesEnd=useRef(null);

  useEffect(()=>{ getAllDocs().then(setDocs); getAllChecklists().then(setChecklist); },[]);
  useEffect(()=>{ messagesEnd.current?.scrollIntoView({behavior:"smooth"}); },[messages]);
  useEffect(()=>{ if(selEmp) getProgress(selEmp).then(setProgress); },[selEmp]);

  const sendMessage = async () => {
    if(!input.trim()) return;
    const q=input.trim();
    setMessages(prev=>[...prev,{role:"user",text:q}]);
    setInput(""); setChatLoading(true);
    try {
      const res = await chatWithBot(q);
      setMessages(prev=>[...prev,{role:"bot",text:res.answer}]);
    } catch {
      setMessages(prev=>[...prev,{role:"bot",text:"Sorry, I couldn't reach the server. Please contact HR."}]);
    }
    setChatLoading(false);
  };

  const addDoc = async () => {
    if(!docForm.title||!docForm.content){ toast("Title and content required.","error"); return; }
    const d = await addPolicyDoc(docForm);
    setDocs(prev=>[...prev,d]);
    setDocForm({title:"",content:"",category:"general"});
    toast("Document uploaded!","success");
  };

  const addChecklist = async () => {
    if(!checkForm.role||!checkForm.title){ toast("Role and title required.","error"); return; }
    const item = await addChecklistItem(checkForm);
    setChecklist(prev=>[...prev,item]);
    setCheckForm({role:"",title:"",description:"",due_days:7,assignee:""});
    toast("Checklist item added!","success");
  };

  const toggleProgress = async (checklistId,done) => {
    if(!selEmp){ toast("Select an employee first.","error"); return; }
    await updateProgress({employee_id:parseInt(selEmp),checklist_id:checklistId,completed:done});
    getProgress(selEmp).then(setProgress);
  };

  const isDone=(id)=>progress.find(p=>p.checklist_id===id)?.completed;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <div style={{display:"flex",gap:"4px",borderBottom:"1px solid var(--border)",paddingBottom:0}}>
        {[["chat","🤖 AI Chatbot"],["checklist","✅ Checklist"],["docs","📄 Policy Docs"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{padding:"8px 16px",fontFamily:"var(--font-display)",fontSize:"12px",fontWeight:600,color:tab===t?"var(--text-1)":"var(--text-3)",background:"transparent",border:"none",borderBottom:tab===t?"2px solid var(--accent)":"2px solid transparent",marginBottom:"-1px",cursor:"pointer",transition:"all 0.2s"}}>
            {l}
          </button>
        ))}
      </div>

      {tab==="chat" && (
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-xl)",overflow:"hidden"}}>
            <div style={{height:"380px",overflowY:"auto",padding:"20px",display:"flex",flexDirection:"column",gap:"12px"}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?"var(--accent)":"var(--surface-2)",color:m.role==="user"?"#fff":"var(--text-1)",fontSize:"13px",lineHeight:1.6,border:m.role==="bot"?"1px solid var(--border)":"none"}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{display:"flex",justifyContent:"flex-start"}}>
                  <div style={{padding:"10px 14px",borderRadius:"16px 16px 16px 4px",background:"var(--surface-2)",border:"1px solid var(--border)",display:"flex",gap:"4px",alignItems:"center"}}>
                    {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--text-3)",animation:`bounce 1s ${i*0.2}s infinite`}}/>)}
                  </div>
                </div>
              )}
              <div ref={messagesEnd}/>
            </div>
            <div style={{borderTop:"1px solid var(--border)",padding:"12px 16px",display:"flex",gap:"10px"}}>
              <input style={{flex:1}} placeholder="Ask about leave policy, tools, procedures..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/>
              <button className="btn btn-primary btn-sm" onClick={sendMessage} disabled={chatLoading}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2l2 5-2 5 10-5z" fill="currentColor"/></svg>
              </button>
            </div>
          </div>
          <div style={{fontSize:"12px",color:"var(--text-3)",textAlign:"center"}}>Chatbot answers from uploaded policy documents only.</div>
        </div>
      )}

      {tab==="checklist" && (
        <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div className="form-panel" style={{margin:0}}>
            <p className="section-label">Add Checklist Item</p>
            <div className="form-grid" style={{marginBottom:"12px"}}>
              <div className="input-wrap"><label className="input-label">Role</label><input placeholder="e.g. Software Engineer" value={checkForm.role} onChange={e=>setCheckForm({...checkForm,role:e.target.value})}/></div>
              <div className="input-wrap"><label className="input-label">Task Title</label><input placeholder="e.g. Setup laptop" value={checkForm.title} onChange={e=>setCheckForm({...checkForm,title:e.target.value})}/></div>
              <div className="input-wrap"><label className="input-label">Assignee</label><input placeholder="IT Team / HR" value={checkForm.assignee} onChange={e=>setCheckForm({...checkForm,assignee:e.target.value})}/></div>
              <div className="input-wrap"><label className="input-label">Due (days)</label><input type="number" value={checkForm.due_days} onChange={e=>setCheckForm({...checkForm,due_days:parseInt(e.target.value)})}/></div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={addChecklist}>Add Item</button>
          </div>
          <div className="form-panel" style={{margin:0}}>
            <p className="section-label">Track Employee Progress</p>
            <select style={{marginBottom:"16px"}} value={selEmp} onChange={e=>setSelEmp(e.target.value)}>
              <option value="">Select employee...</option>
              {(employees||[]).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            {checklist.length===0
              ? <div style={{fontSize:"13px",color:"var(--text-3)"}}>No checklist items yet.</div>
              : checklist.map(item=>(
                  <div key={item.id} onClick={()=>toggleProgress(item.id,!isDone(item.id))}
                    style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 0",borderBottom:"1px solid var(--border)",cursor:"pointer"}}>
                    <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${isDone(item.id)?"var(--success)":"var(--border-md)"}`,background:isDone(item.id)?"var(--success)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                      {isDone(item.id)&&<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"13px",fontWeight:500,color:isDone(item.id)?"var(--text-3)":"var(--text-1)",textDecoration:isDone(item.id)?"line-through":"none"}}>{item.title}</div>
                      <div style={{fontSize:"11px",color:"var(--text-3)"}}>{item.role} · Day {item.due_days}{item.assignee&&` · ${item.assignee}`}</div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      )}

      {tab==="docs" && (
        <div style={{display:"flex",flexDirection:"column",gap:"20px"}}>
          <div className="form-panel" style={{margin:0}}>
            <p className="section-label">Upload Policy Document</p>
            <div className="form-grid" style={{marginBottom:"12px"}}>
              <div className="input-wrap"><label className="input-label">Title</label><input placeholder="e.g. Leave Policy 2025" value={docForm.title} onChange={e=>setDocForm({...docForm,title:e.target.value})}/></div>
              <div className="input-wrap">
                <label className="input-label">Category</label>
                <select value={docForm.category} onChange={e=>setDocForm({...docForm,category:e.target.value})}>
                  {["general","leave","tools","conduct"].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </div>
              <div className="input-wrap" style={{gridColumn:"1/-1"}}>
                <label className="input-label">Content (chatbot reads this)</label>
                <textarea placeholder="Paste the full policy text here..." value={docForm.content} onChange={e=>setDocForm({...docForm,content:e.target.value})}
                  style={{width:"100%",minHeight:"140px",padding:"10px 14px",background:"var(--surface-2)",border:"1px solid var(--border)",borderRadius:"var(--radius-md)",color:"var(--text-1)",fontFamily:"var(--font-body)",fontSize:"13px",outline:"none",resize:"vertical"}}/>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={addDoc}>Upload Document</button>
          </div>
          <p className="section-label">{docs.length} documents uploaded</p>
          {docs.map(d=>(
            <div key={d.id} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                <div style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:"14px",color:"var(--text-1)"}}>{d.title}</div>
                <span style={{fontSize:"10px",fontWeight:700,padding:"2px 8px",borderRadius:"100px",background:"var(--surface-2)",color:"var(--text-2)",border:"1px solid var(--border)"}}>{d.category}</span>
              </div>
              <div style={{fontSize:"12px",color:"var(--text-3)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.content.slice(0,120)}...</div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}