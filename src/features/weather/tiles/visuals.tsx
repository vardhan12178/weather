/** Marker on a gradient track; `pct` 0–100 */
export const Meter = ({ pct, gradient }: { pct: number; gradient: string }) => (
  <div className="relative mt-3 h-1.5 rounded-full" style={{ background: gradient }} aria-hidden="true">
    <span
      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-black/35"
      style={{ left: `${Math.max(0, Math.min(100, pct))}%` }}
    />
  </div>
);

/** Wind compass; the arrow points where the wind is blowing *to* */
export const Compass = ({ deg, size = 76 }: { deg: number; size?: number }) => (
  <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true" className="shrink-0">
    <circle cx="40" cy="40" r="34" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="1" />
    {/* Ticks every 10°, leaving room for the cardinal letters */}
    {Array.from({ length: 36 }, (_, i) =>
      i % 9 === 0 ? null : (
        <line key={i} x1="40" y1="7" x2="40" y2="11" stroke="rgb(255 255 255 / 0.45)" strokeWidth="1" transform={`rotate(${i * 10} 40 40)`} />
      ),
    )}
    {(
      [
        ['N', 40, 14],
        ['E', 68, 44],
        ['S', 40, 74],
        ['W', 12, 44],
      ] as const
    ).map(([d, x, y]) => (
      <text key={d} x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="600" fill="white">
        {d}
      </text>
    ))}
    <g transform={`rotate(${deg + 180} 40 40)`}>
      <line x1="40" y1="54" x2="40" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 22 L45 31 L35 31 Z" fill="white" />
      <circle cx="40" cy="55" r="3" fill="white" />
    </g>
  </svg>
);

/** Small arc showing the sun's position (null progress = night) */
export const SunArc = ({ progress, width = 140 }: { progress: number | null; width?: number }) => {
  const r = 56;
  const cx = 70;
  const cy = 64;
  const t = progress ?? 0;
  const angle = Math.PI * (1 - t);
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);
  return (
    <svg viewBox="0 0 140 72" width={width} height={(width * 72) / 140} aria-hidden="true">
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="1.5" />
      <line x1="4" y1={cy} x2="136" y2={cy} stroke="rgb(255 255 255 / 0.3)" strokeWidth="1" />
      {progress != null && (
        <>
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x} ${y}`} fill="none" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
          <circle cx={x} cy={y} r="6" fill="#fde68a" stroke="rgb(8 20 45 / 0.4)" strokeWidth="2" />
        </>
      )}
    </svg>
  );
};
