'use client';

import type { DayData } from '@/hooks/useAnalytics';

interface Props {
  data: DayData[];
}

function fmtDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const W = 800;
const H = 220;
const PAD = { top: 16, right: 8, bottom: 40, left: 36 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

// Show every N-th label so they don't overlap
function labelStep(count: number): number {
  if (count <= 10) return 1;
  if (count <= 20) return 2;
  return 5;
}

export default function BarChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-slate-400 text-sm">
        No data for this period
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const step   = labelStep(data.length);
  const barW   = Math.max(4, (chartW / data.length) * 0.6);
  const gap    = chartW / data.length;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * maxVal));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: H }}
    >
      <g transform={`translate(${PAD.left},${PAD.top})`}>
        {/* Y gridlines + labels */}
        {yTicks.map((tick) => {
          const y = chartH - (tick / maxVal) * chartH;
          return (
            <g key={tick}>
              <line x1={0} y1={y} x2={chartW} y2={y} stroke="#f1f5f9" strokeWidth={1} />
              <text x={-6} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
                {tick}
              </text>
            </g>
          );
        })}

        {/* Bars (stacked: resolved / in_progress / pending) */}
        {data.map((d, i) => {
          const x       = i * gap + gap / 2 - barW / 2;
          const rH      = (d.resolved    / maxVal) * chartH;
          const ipH     = (d.in_progress / maxVal) * chartH;
          const pH      = (d.pending     / maxVal) * chartH;
          const totalH  = (d.total       / maxVal) * chartH;
          const baseY   = chartH;

          return (
            <g key={d.date}>
              {/* Resolved — bottom of stack */}
              <rect x={x} y={baseY - rH} width={barW} height={rH} fill="#10b981" rx={2} />
              {/* In progress — middle */}
              <rect x={x} y={baseY - rH - ipH} width={barW} height={ipH} fill="#f97316" rx={2} />
              {/* Pending — top */}
              <rect x={x} y={baseY - totalH} width={barW} height={pH} fill="#f87171" rx={2} />

              {/* X-axis label every N bars */}
              {i % step === 0 && (
                <text
                  x={x + barW / 2}
                  y={chartH + 18}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#94a3b8"
                >
                  {fmtDay(d.date)}
                </text>
              )}
            </g>
          );
        })}

        {/* X axis line */}
        <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke="#e2e8f0" strokeWidth={1} />
      </g>
    </svg>
  );
}