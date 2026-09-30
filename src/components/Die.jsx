export default function Die({ value, held, onClick, disabled, isRolling, isP2 }) {
  const isHeld = Boolean(held);

  const renderDots = (val) => {
    const dotClass = 'w-2 h-2 bg-emerald-950 rounded-full shadow-inner';
    switch (val) {
      case 1:
        return <div className="flex items-center justify-center w-full h-full"><div className={dotClass}></div></div>;
      case 2:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className={`self-start ${dotClass}`}></div>
            <div className={`self-end ${dotClass}`}></div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className={`self-start ${dotClass}`}></div>
            <div className={`self-center ${dotClass}`}></div>
            <div className={`self-end ${dotClass}`}></div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-center w-full"><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col justify-between w-full h-full p-1">
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
            <div className="flex justify-between w-full"><div className={dotClass}></div><div className={dotClass}></div></div>
          </div>
        );
      default:
        return null;
    }
  };

  const shouldAnimate = isRolling && !held;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all shadow-md border-2 bg-gradient-to-br from-white via-slate-100 to-emerald-50 border-emerald-300/60 text-emerald-950 ${
        isP2 ? 'bg-transparent border-transparent shadow-none' : 'hover:bg-white shadow-emerald-950/25'
      } ${isHeld && !isP2 ? 'from-amber-300 to-amber-500 border-amber-200 -translate-y-1 ring-1 ring-amber-300' : ''} ${
        isHeld && isP2 ? 'bg-violet-500/10 border-violet-300/70 shadow-none' : ''
      } ${shouldAnimate ? 'animate-spin opacity-60' : ''}`}
    >
      {renderDots(value)}
      {isHeld && (
        <span className={`absolute -bottom-2 ${isP2 ? 'bg-violet-400 text-violet-950' : 'bg-amber-400 text-emerald-950'} text-[7px] font-black px-1 rounded uppercase tracking-tighter border ${isP2 ? 'border-violet-200' : 'border-amber-200'}`}>
          {isP2 ? 'Hold' : 'Held'}
        </span>
      )}
    </button>
  );
}
