import { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useStore } from '../store/useStore';
import { useWeeklyCheckins, useAllWorkoutLogs, saveWeeklyCheckin, useCheckinForWeek } from '../hooks/useDB';
import { StatCard, ProgressRing } from './ui';

function CheckInForm({ week }: { week: number }) {
  const existing = useCheckinForWeek(week);
  const [form, setForm] = useState({
    weight: 0, waist: 0, hip: 0, thigh: 0,
    protein: 0, energy: 3, hipPain: 0, pr: '', notes: '',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        weight: existing.weight, waist: existing.waist, hip: existing.hip,
        thigh: existing.thigh, protein: existing.protein, energy: existing.energy,
        hipPain: existing.hipPain, pr: existing.pr, notes: existing.notes,
      });
    }
  }, [existing?.week]);

  const handleSave = async () => {
    await saveWeeklyCheckin({ week, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const numField = (label: string, key: keyof typeof form, unit: string, color: string) => (
    <div>
      <label className="text-[10px] text-secondary font-bold tracking-widest">{label}</label>
      <div className="flex items-center gap-1 mt-1">
        <input
          type="number"
          inputMode="decimal"
          value={form[key] || ''}
          onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl text-center text-white text-sm font-medium focus:outline-none transition-all"
          style={{ borderColor: form[key] ? color + '40' : undefined }}
        />
        <span className="text-[10px] text-secondary w-6">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="glass-card p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Week {week} Check-In</h3>
        {saved && <span className="pill bg-success/15 text-success text-[10px] animate-scale-in">SAVED</span>}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {numField('AVG WEIGHT', 'weight', 'kg', '#FF2D78')}
        {numField('WAIST', 'waist', 'cm', '#00D4FF')}
        {numField('HIP', 'hip', 'cm', '#A855F7')}
        {numField('THIGH', 'thigh', 'cm', '#FFB800')}
        {numField('AVG PROTEIN', 'protein', 'g', '#00FF88')}
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-bold tracking-widest">ENERGY LEVEL</label>
        <div className="flex gap-1.5 mt-1">
          {[1,2,3,4,5].map(v => (
            <button
              key={v}
              onClick={() => setForm(f => ({ ...f, energy: v }))}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-90"
              style={form.energy === v ? {
                background: 'linear-gradient(135deg, #00D4FF, #00D4FFCC)',
                boxShadow: '0 2px 10px rgba(0,212,255,0.25)',
                color: '#0A0A0A',
              } : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#888' }}
            >{v}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-bold tracking-widest">HIP PAIN (0-10)</label>
        <div className="flex gap-1 mt-1 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setForm(f => ({ ...f, hipPain: i }))}
              className="flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all duration-300 active:scale-90"
              style={form.hipPain === i ? {
                background: i <= 3 ? 'linear-gradient(135deg, #00FF88, #00FF88CC)' : i <= 6 ? 'linear-gradient(135deg, #FFB800, #FFB800CC)' : 'linear-gradient(135deg, #FF2D78, #FF2D78CC)',
                color: '#0A0A0A',
              } : { backgroundColor: 'rgba(255,255,255,0.04)', color: '#888' }}
            >{i}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-bold tracking-widest">PR THIS WEEK</label>
        <input
          value={form.pr}
          onChange={e => setForm(f => ({ ...f, pr: e.target.value }))}
          placeholder="e.g. Bench 80kg × 5"
          className="w-full h-10 mt-1 bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3 focus:border-accent-pink/40 focus:outline-none transition-all"
        />
      </div>

      <div className="mb-4">
        <label className="text-[10px] text-secondary font-bold tracking-widest">NOTES</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="How did this week feel?"
          className="w-full h-16 mt-1 bg-white/5 border border-white/10 rounded-xl text-white text-sm p-3 resize-none focus:border-accent-pink/40 focus:outline-none transition-all"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 font-bold rounded-xl text-sm active:scale-[0.98] transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #FF2D78, #FF2D78CC)',
          boxShadow: '0 4px 15px rgba(255,45,120,0.3)',
        }}
      >
        SAVE CHECK-IN
      </button>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#141414',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  fontSize: '11px',
  padding: '8px 12px',
};

export function ProgressTab() {
  const { currentWeek } = useStore();
  const checkins = useWeeklyCheckins();
  const allLogs = useAllWorkoutLogs();
  const [chartType, setChartType] = useState<'weight' | 'waist' | 'strength'>('weight');

  const chartData = (checkins ?? []).map(c => ({
    week: `W${c.week}`,
    weight: c.weight,
    waist: c.waist,
    hip: c.hip,
  }));

  // Build strength data
  const strengthData: Record<string, { week: number; maxWeight: number }[]> = {};
  for (const log of allLogs ?? []) {
    const maxW = Math.max(...log.sets.map(s => s.weight), 0);
    if (maxW > 0) {
      if (!strengthData[log.exerciseId]) strengthData[log.exerciseId] = [];
      strengthData[log.exerciseId].push({ week: log.week, maxWeight: maxW });
    }
  }
  const topExercises = Object.entries(strengthData).sort((a, b) => b[1].length - a[1].length).slice(0, 5);

  // Summary stats
  const latestCheckin = checkins && checkins.length > 0 ? checkins[checkins.length - 1] : null;
  const firstCheckin = checkins && checkins.length > 0 ? checkins[0] : null;
  const weightChange = latestCheckin && firstCheckin ? (latestCheckin.weight - firstCheckin.weight).toFixed(1) : null;
  const waistChange = latestCheckin && firstCheckin ? (latestCheckin.waist - firstCheckin.waist).toFixed(1) : null;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 opacity-25"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(255,45,120,0.2), transparent 60%)' }} />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight mb-1">PROGRESS</h1>
          <p className="text-secondary text-sm">Track your recomposition journey</p>
        </div>
      </div>

      <div className="px-4">
        {/* Quick Stats Row */}
        {latestCheckin && (
          <div className="grid grid-cols-3 gap-2 mb-5 animate-slide-up">
            <StatCard label="Weight" value={latestCheckin.weight} unit="kg" color="#FF2D78" />
            <StatCard label="Waist" value={latestCheckin.waist} unit="cm" color="#00D4FF" />
            <div className="relative overflow-hidden rounded-xl p-3 border border-white/8"
              style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,255,136,0.02))' }}>
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-30 bg-success" />
              <div className="relative">
                <p className="text-[10px] text-secondary font-semibold tracking-wider">ENERGY</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{
                      backgroundColor: i <= latestCheckin.energy ? '#00FF88' : 'rgba(255,255,255,0.08)',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delta badges */}
        {weightChange && (
          <div className="flex gap-2 mb-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card flex-1 p-3 flex items-center gap-2">
              <ProgressRing radius={18} stroke={3}
                progress={Math.min(Math.abs(parseFloat(weightChange)) * 10, 100)}
                color={parseFloat(weightChange) <= 0 ? '#00FF88' : '#FF2D78'}>
                <span className="text-[8px] font-bold" style={{ color: parseFloat(weightChange) <= 0 ? '#00FF88' : '#FF2D78' }}>
                  {parseFloat(weightChange) <= 0 ? '↓' : '↑'}
                </span>
              </ProgressRing>
              <div>
                <p className="text-[10px] text-secondary">Weight Δ</p>
                <p className="text-xs font-bold" style={{ color: parseFloat(weightChange) <= 0 ? '#00FF88' : '#FF2D78' }}>
                  {weightChange}kg
                </p>
              </div>
            </div>
            <div className="glass-card flex-1 p-3 flex items-center gap-2">
              <ProgressRing radius={18} stroke={3}
                progress={Math.min(Math.abs(parseFloat(waistChange!)) * 10, 100)}
                color={parseFloat(waistChange!) <= 0 ? '#00D4FF' : '#FFB800'}>
                <span className="text-[8px] font-bold" style={{ color: parseFloat(waistChange!) <= 0 ? '#00D4FF' : '#FFB800' }}>
                  {parseFloat(waistChange!) <= 0 ? '↓' : '↑'}
                </span>
              </ProgressRing>
              <div>
                <p className="text-[10px] text-secondary">Waist Δ</p>
                <p className="text-xs font-bold" style={{ color: parseFloat(waistChange!) <= 0 ? '#00D4FF' : '#FFB800' }}>
                  {waistChange}cm
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Toggle */}
        <div className="flex gap-1 p-1 bg-white/3 rounded-2xl mb-4">
          {[
            { id: 'weight' as const, label: 'Weight', color: '#FF2D78' },
            { id: 'waist' as const, label: 'Body', color: '#00D4FF' },
            { id: 'strength' as const, label: 'Strength', color: '#00FF88' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setChartType(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 ${
                chartType === t.id ? 'text-white' : 'text-secondary'
              }`}
              style={chartType === t.id ? {
                background: `linear-gradient(135deg, ${t.color}, ${t.color}CC)`,
                boxShadow: `0 2px 10px ${t.color}25`,
              } : undefined}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        {chartType !== 'strength' && chartData.length > 0 && (
          <div className="glass-card p-4 mb-4 animate-fade-in">
            <h3 className="text-sm font-bold mb-3">
              {chartType === 'weight' ? 'Weight Trend' : 'Body Measurements'}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF2D78" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FF2D78" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="waistGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#fff' }} />
                {chartType === 'weight' ? (
                  <>
                    <Area type="monotone" dataKey="weight" stroke="#FF2D78" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ fill: '#FF2D78', r: 4, strokeWidth: 0 }} />
                  </>
                ) : (
                  <>
                    <Area type="monotone" dataKey="waist" stroke="#00D4FF" strokeWidth={2} fill="url(#waistGrad)" dot={{ fill: '#00D4FF', r: 3, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="hip" stroke="#A855F7" strokeWidth={2} dot={{ fill: '#A855F7', r: 3, strokeWidth: 0 }} />
                  </>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'strength' && topExercises.length > 0 && (
          <div className="glass-card p-4 mb-4 animate-fade-in">
            <h3 className="text-sm font-bold mb-3">Strength PRs</h3>
            {topExercises.map(([exId, data]) => {
              const sorted = [...data].sort((a, b) => a.week - b.week);
              const chartD = sorted.map(d => ({ week: `W${d.week}`, kg: d.maxWeight }));
              const best = Math.max(...data.map(d => d.maxWeight));
              return (
                <div key={exId} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-white font-medium">{exId}</p>
                    <span className="pill bg-success/15 text-success text-[10px]">PR {best}kg</span>
                  </div>
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={chartD}>
                      <defs>
                        <linearGradient id={`sg-${exId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FF88" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" tick={{ fontSize: 8, fill: '#555' }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                      <Area type="monotone" dataKey="kg" stroke="#00FF88" strokeWidth={2} fill={`url(#sg-${exId})`} dot={{ fill: '#00FF88', r: 3, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        )}

        {chartData.length === 0 && chartType !== 'strength' && (
          <div className="glass-card text-center py-8 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.5 18.49l6-6.01 4 4L22 6.92" />
              </svg>
            </div>
            <p className="text-secondary text-sm font-medium">No data yet</p>
            <p className="text-xs text-secondary/60 mt-1">Complete your first weekly check-in above</p>
          </div>
        )}

        {chartType === 'strength' && topExercises.length === 0 && (
          <div className="glass-card text-center py-8 mb-4">
            <p className="text-secondary text-sm font-medium">No workout data yet</p>
            <p className="text-xs text-secondary/60 mt-1">Log weights in your sessions to track strength</p>
          </div>
        )}

        {/* Check-in Form */}
        <CheckInForm week={currentWeek} />

        {/* Interpretation Guide */}
        <div className="glass-card p-4" style={{ border: '1px solid rgba(0,212,255,0.1)' }}>
          <h3 className="text-sm font-bold mb-3">Trend Guide</h3>
          <div className="space-y-3">
            {[
              { color: '#FF2D78', title: 'Weight stable + waist ↓', desc: 'Ideal recomp — losing fat, maintaining muscle.' },
              { color: '#00D4FF', title: 'Weight ↓ + strength steady', desc: 'Successful cut — preserving muscle mass.' },
              { color: '#00FF88', title: 'Strength ↑ + weight stable', desc: 'Neural gains + muscle growth — classic recomp.' },
              { color: '#A855F7', title: 'Weight ↑ + measurements ↑', desc: 'Check calorie intake — may be in surplus.' },
              { color: '#FFB800', title: 'Energy ↓ + strength flat', desc: 'Consider diet break or deload. Recovery needed.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-[11px] text-secondary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
