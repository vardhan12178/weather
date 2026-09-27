import { useId, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { formatHour } from '../../../lib/time';
import { useElementWidth } from '../../../lib/useElementWidth';

export interface ChartSeries {
  name: string;
  /** A validated series colour (see --color-series-* in styles/index.css) */
  color: string;
  values: number[];
}

interface HourlyChartProps {
  /** What the chart shows, for screen readers and the table caption */
  label: string;
  times: number[];
  timezone: string;
  series: ChartSeries[];
  kind: 'line' | 'bar';
  format: (value: number) => string;
  /** Fixed y-range (e.g. 0–100 for percentages); otherwise fitted to the data */
  domain?: [number, number];
}

const PLOT_H = 170;
const AXIS_H = 24;
const PAD = { top: 18, right: 10, left: 44 };
const GRID = 'var(--color-hairline)';
const SURFACE = 'var(--color-surface)';

/** 3–5 round tick values covering [min, max] */
const niceTicks = (min: number, max: number): number[] => {
  const span = max - min || 1;
  const rough = span / 3;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? pow * 10;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(Number(v.toFixed(6)));
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
};

/** Rounded-top bar anchored square to the baseline (4px radius) */
const barPath = (x: number, y: number, w: number, base: number) => {
  const r = Math.min(4, w / 2, Math.max(0, base - y));
  return `M${x},${base} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${base} Z`;
};

const HourlyChart = ({ label, times, timezone, series, kind, format, domain }: HourlyChartProps) => {
  const [boxRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const tableId = useId();
  const n = times.length;

  const all = series.flatMap((s) => s.values);
  const [lo, hi] = domain ?? [Math.min(...all, kind === 'bar' ? 0 : Infinity), Math.max(...all)];
  const ticks = niceTicks(lo, hi);
  const yMin = domain ? domain[0] : ticks[0];
  const yMax = domain ? domain[1] : ticks[ticks.length - 1];

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const band = n > 0 ? plotW / n : 0;
  const xAt = (i: number) => PAD.left + band * (i + 0.5);
  const yAt = (v: number) => PAD.top + PLOT_H - ((v - yMin) / (yMax - yMin || 1)) * PLOT_H;
  const baseY = yAt(Math.max(yMin, 0));

  const pick = (clientX: number, rect: DOMRect) => {
    const i = Math.floor((clientX - rect.left - PAD.left) / band);
    setActive(Math.max(0, Math.min(n - 1, i)));
  };
  const onPointer = (e: PointerEvent<SVGSVGElement>) => pick(e.clientX, e.currentTarget.getBoundingClientRect());
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') setActive((i) => Math.min(n - 1, (i ?? -1) + 1));
    else if (e.key === 'ArrowLeft') setActive((i) => Math.max(0, (i ?? 1) - 1));
    else return;
    e.preventDefault();
  };

  // Single-series line: label the peak (selective direct label)
  const peak = kind === 'line' && series.length === 1 ? series[0].values.indexOf(Math.max(...series[0].values)) : -1;
  const labelEvery = n > 12 ? 6 : 3;
  const tooltipLeft = active == null ? 0 : Math.min(Math.max(xAt(active) - 88, 0), Math.max(0, width - 176));

  return (
    <figure className="m-0">
      {series.length > 1 && (
        <figcaption className="mb-2 flex flex-wrap gap-4 text-footnote text-white/85">
          {series.map((s) => (
            <span key={s.name} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 rounded-full" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </figcaption>
      )}

      <div
        ref={boxRef}
        className="relative rounded-xl focus-visible:outline-2"
        tabIndex={0}
        role="img"
        aria-label={`${label}. Use left and right arrow keys to read hourly values, or open the table below.`}
        onKeyDown={onKey}
        onFocus={() => setActive((i) => i ?? 0)}
        onBlur={() => setActive(null)}
      >
        {width > 0 && (
          <svg width={width} height={PAD.top + PLOT_H + AXIS_H} onPointerMove={onPointer} onPointerDown={onPointer} onPointerLeave={() => setActive(null)} className="block touch-pan-y">
            {/* Recessive grid + y ticks */}
            {ticks.filter((t) => t >= yMin && t <= yMax).map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={yAt(t)} y2={yAt(t)} stroke={GRID} strokeWidth="1" />
                <text x={PAD.left - 6} y={yAt(t) + 4} textAnchor="end" fontSize="12" fill="rgb(255 255 255 / 0.7)" className="tnum">
                  {format(t)}
                </text>
              </g>
            ))}

            {kind === 'bar' &&
              series[0].values.map((v, i) => {
                const w = Math.min(24, Math.max(2, band - 2)); // ≤24px, 2px surface gap
                return (
                  <path
                    key={i}
                    d={barPath(xAt(i) - w / 2, yAt(v), w, baseY)}
                    fill={series[0].color}
                    opacity={active == null || active === i ? 1 : 0.55}
                  />
                );
              })}

            {kind === 'line' &&
              series.map((s) => {
                const d = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i)},${yAt(v)}`).join(' ');
                return (
                  <g key={s.name}>
                    {series.length === 1 && (
                      <path d={`${d} L${xAt(n - 1)},${PAD.top + PLOT_H} L${xAt(0)},${PAD.top + PLOT_H} Z`} fill={s.color} opacity="0.1" />
                    )}
                    <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                  </g>
                );
              })}

            {peak >= 0 && active == null && (
              <g>
                <circle cx={xAt(peak)} cy={yAt(series[0].values[peak])} r="4" fill={series[0].color} stroke={SURFACE} strokeWidth="2" />
                <text x={xAt(peak)} y={yAt(series[0].values[peak]) - 9} textAnchor="middle" fontSize="12" fontWeight="600" fill="white">
                  {format(series[0].values[peak])}
                </text>
              </g>
            )}

            {/* X axis labels */}
            {times.map((t, i) =>
              i % labelEvery === 0 ? (
                <text key={t} x={xAt(i)} y={PAD.top + PLOT_H + 17} textAnchor="middle" fontSize="12" fill="rgb(255 255 255 / 0.7)">
                  {i === 0 ? 'Now' : formatHour(t, timezone)}
                </text>
              ) : null,
            )}

            {/* Crosshair */}
            {active != null && (
              <g>
                <line x1={xAt(active)} x2={xAt(active)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="rgb(255 255 255 / 0.5)" strokeWidth="1" />
                {kind === 'line' &&
                  series.map((s) => (
                    <circle key={s.name} cx={xAt(active)} cy={yAt(s.values[active])} r="4" fill={s.color} stroke={SURFACE} strokeWidth="2" />
                  ))}
              </g>
            )}
          </svg>
        )}

        {active != null && (
          <div
            className="pointer-events-none absolute top-0 w-[176px] rounded-xl bg-surface-raised px-3 py-2 text-footnote shadow-lg ring-1 ring-white/10"
            style={{ left: tooltipLeft }}
            aria-hidden="true"
          >
            <p className="text-white/85">{active === 0 ? 'Now' : formatHour(times[active], timezone)}</p>
            {series.map((s) => (
              <p key={s.name} className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                <span className="font-semibold tnum">{format(s.values[active])}</span>
                {series.length > 1 && <span className="truncate text-white/85">{s.name}</span>}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Table twin: every value is reachable without hovering */}
      <details className="mt-2 text-footnote">
        <summary className="inline-flex min-h-11 items-center text-white/85 hover:text-white" aria-controls={tableId}>
          Show as table
        </summary>
        <table id={tableId} className="mt-1 w-full tnum">
          <caption className="sr-only">{label}</caption>
          <thead>
            <tr className="text-left text-white/85">
              <th className="py-1 font-medium">Time</th>
              {series.map((s) => (
                <th key={s.name} className="py-1 text-right font-medium">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((t, i) => (
              <tr key={t} className="border-t border-white/10">
                <td className="py-1">{i === 0 ? 'Now' : formatHour(t, timezone)}</td>
                {series.map((s) => (
                  <td key={s.name} className="py-1 text-right">
                    {format(s.values[i])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
};

export default HourlyChart;
