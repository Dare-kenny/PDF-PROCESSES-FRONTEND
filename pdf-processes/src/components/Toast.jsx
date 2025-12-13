// src/components/Toast.jsx

function Toast({ type = "info", message, onClose }) {
  if (!message) return null;

  const isError = type === "error";
  const isSuccess = type === "success";

  const baseClasses =
    "flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm";

  const colorClasses = isError
    ? "bg-red-900/90 border-red-500/70 text-red-50"
    : isSuccess
    ? "bg-emerald-900/90 border-emerald-500/70 text-emerald-50"
    : "bg-slate-800/90 border-slate-600/70 text-slate-50";

  const icon = isError ? "⚠️" : isSuccess ? "✅" : "ℹ️";

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={`${baseClasses} ${colorClasses}`}>
        <div className="mt-0.5">{icon}</div>
        <div className="flex-1">
          <p className="leading-snug">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-xs text-slate-200 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Toast;
