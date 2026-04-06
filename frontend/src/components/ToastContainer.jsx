export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type} ${t.removing ? "removing" : ""}`}>
          <div className="toast-dot" />
          {t.message}
        </div>
      ))}
    </div>
  );
}