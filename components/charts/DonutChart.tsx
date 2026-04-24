'use client';

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface Props {
  slices: Slice[];
  total: number;
}

const R = 60;
const CX = 90;
const CY = 90;
const STROKE = 22;

function polarToXY(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  if (endAngle - startAngle >= 360) endAngle = startAngle + 359.99;
  const start  = polarToXY(cx, cy, r, startAngle);
  const end    = polarToXY(cx, cy, r, endAngle);
  const large  = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

export default function DonutChart({ slices, total }: Props) {
  const filtered = slices.filter((s) => s.value > 0);

  let cursor = 0;
  const arcs = filtered.map((s) => {
    const sweep = (s.value / total) * 360;
    const arc   = { ...s, start: cursor, end: cursor + sweep };
    cursor += sweep;
    return arc;
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-[140px] h-[140px] shrink-0">
        {total === 0 ? (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
        ) : (
          arcs.map((arc, i) => (
            <path
              key={i}
              d={describeArc(CX, CY, R, arc.start, arc.end)}
              fill="none"
              stroke={arc.color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
            />
          ))
        )}
        {/* Center total */}
        <text x={CX} y={CY - 6} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#1e293b">
          {total}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize={10} fill="#94a3b8">
          total
        </text>
      </svg>

      {/* Legend */}
      <div className="space-y-2.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-slate-500">{s.label}</span>
            <span className="text-xs font-semibold text-slate-800 ml-auto pl-4">
              {s.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}