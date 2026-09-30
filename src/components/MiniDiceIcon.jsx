export default function MiniDiceIcon({ value, label }) {
  const dots = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [25, 75], [75, 25], [75, 75]],
    5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
    6: [[25, 20], [25, 50], [25, 80], [75, 20], [75, 50], [75, 80]],
  }[value];

  if (dots) {
    return (
      <div className="w-4 h-4 bg-gradient-to-br from-emerald-100 to-emerald-300 rounded relative shadow-sm border border-emerald-400/40 shrink-0 flex items-center justify-center">
        {dots.map((pos, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-emerald-950 rounded-full"
            style={{ top: `${pos[0]}%`, left: `${pos[1]}%`, transform: 'translate(-50%, -50%)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-4 h-4 bg-emerald-950/60 border border-emerald-500/30 rounded text-[8px] font-black text-amber-300 flex items-center justify-center shadow-inner">
      {label}
    </div>
  );
}
