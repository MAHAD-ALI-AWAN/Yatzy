export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-emerald-950/80 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-[85%]:max-w-[240px] bg-gradient-to-b from-emerald-900 via-emerald-950 to-stone-950 border border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex flex-col items-center text-center">
        
        {/* Warning Icon */}
        <div className="w-8 h-8 rounded-full bg-emerald-900/90 border border-emerald-500/40 flex items-center justify-center mb-2 text-amber-400 text-xs shadow-inner">
          ⚠
        </div>

        {/* Title */}
        <h3 className="text-xs font-bold text-emerald-100 tracking-wide mb-1">
          {title || "Confirm Action"}
        </h3>

        {/* Message */}
        <p className="text-[10px] text-emerald-300/80 mb-3 leading-relaxed px-1">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            onClick={onCancel}
            className="py-1.5 px-2 rounded-xl bg-stone-900/90 border border-stone-700/80 text-stone-300 font-medium text-[10px] hover:bg-stone-800 transition-all shadow active:scale-95"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold text-[10px] hover:from-amber-400 hover:to-amber-500 transition-all shadow-md active:scale-95"
          >
            Yes
          </button>
        </div>

      </div>
    </div>
  );
}