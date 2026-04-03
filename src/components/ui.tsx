/** Circular progress ring */
export function ProgressRing({
  radius = 40,
  stroke = 5,
  progress,
  color = '#FF2D78',
  children,
}: {
  radius?: number;
  stroke?: number;
  progress: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={radius * 2} height={radius * 2} className="-rotate-90">
        <circle cx={radius} cy={radius} r={normalizedRadius} fill="none" stroke="#222" strokeWidth={stroke} />
        <circle
          cx={radius} cy={radius} r={normalizedRadius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** Horizontal progress bar */
export function ProgressBar({ progress, color = '#FF2D78', height = 4 }: { progress: number; color?: string; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, backgroundColor: '#222' }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color, transition: 'width 0.5s ease-out' }}
      />
    </div>
  );
}

/** Stat card with glow */
export function StatCard({ label, value, unit, color }: { label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl p-3" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ backgroundColor: color }} />
      <div className="relative">
        <p className="section-label">{label}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xl font-bold" style={{ color }}>{value}</span>
          {unit && <span className="text-xs" style={{ color: '#666' }}>{unit}</span>}
        </div>
      </div>
    </div>
  );
}

/** Session type icon */
export function SessionIcon({ type, size = 20, color = '#E0E0E0' }: { type: string; size?: number; color?: string }) {
  const paths: Record<string, string> = {
    upper: 'M12 2a4 4 0 014 4v2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2v2a4 4 0 01-8 0v-2H6a2 2 0 01-2-2v-4a2 2 0 012-2h2V6a4 4 0 014-4z',
    lower: 'M12 2C8 2 6 5 6 8v3l-2 6h4l1 5h6l1-5h4l-2-6V8c0-3-2-6-6-6z',
    cardio: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    metabolic: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    rest: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={paths[type] || paths.upper} />
    </svg>
  );
}

const SESSION_ICONS: Record<number, string> = { 0: 'upper', 1: 'lower', 2: 'cardio', 3: 'upper', 4: 'lower', 5: 'metabolic', 6: 'rest' };
export function getSessionIcon(dayIndex: number) { return SESSION_ICONS[dayIndex] || 'rest'; }

export function GlowDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span className="relative inline-flex">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: color }} />
      <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
    </span>
  );
}
