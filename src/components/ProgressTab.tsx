import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store/useStore';
import { useWeeklyCheckins, useAllWorkoutLogs, saveWeeklyCheckin, useCheckinForWeek } from '../hooks/useDB';

function CheckInForm({ week }: { week: number }) {
  const existing = useCheckinForWeek(week);
  const [form, setForm] = useState({
    weight: 0, waist: 0, hip: 0, thigh: 0,
    protein: 0, energy: 3, hipPain: 0, pr: '', notes: '',
  });
  const [loaded, setLoaded] = useState(false);

  if (existing && !loaded) {
    setForm({
      weight: existing.weight, waist: existing.waist, hip: existing.hip,
      thigh: existing.thigh, protein: existing.protein, energy: existing.energy,
      hipPain: existing.hipPain, pr: existing.pr, notes: existing.notes,
    });
    setLoaded(true);
  }

  const handleSave = async () => {
    await saveWeeklyCheckin({ week, ...form });
  };

  const numField = (label: string, key: keyof typeof form, unit: string) => (
    <div>
      <label className="text-[10px] text-secondary font-semibold tracking-wider">{label}</label>
      <div className="flex items-center gap-1 mt-0.5">
        <input
          type="number"
          inputMode="decimal"
          value={form[key] || ''}
          onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
          className="w-full h-9 bg-surface border border-white/8 rounded-lg text-center text-white text-sm focus:border-accent-pink focus:outline-none"
        />
        <span className="text-[10px] text-secondary w-6">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="card mb-4">
      <h3 className="text-sm font-bold mb-3">Week {week} Check-In</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {numField('Avg Weight', 'weight', 'kg')}
        {numField('Waist', 'waist', 'cm')}
        {numField('Hip', 'hip', 'cm')}
        {numField('Thigh', 'thigh', 'cm')}
        {numField('Avg Protein', 'protein', 'g')}
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-semibold tracking-wider">ENERGY (1-5)</label>
        <div className="flex gap-1 mt-1">
          {[1,2,3,4,5].map(v => (
            <button
              key={v}
              onClick={() => setForm(f => ({ ...f, energy: v }))}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                form.energy === v ? 'bg-accent-cyan text-bg' : 'bg-surface text-secondary border border-white/8'
              }`}
            >{v}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-semibold tracking-wider">HIP PAIN (0-10)</label>
        <div className="flex gap-1 mt-1 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              onClick={() => setForm(f => ({ ...f, hipPain: i }))}
              className={`flex-shrink-0 w-8 h-8 rounded-lg text-xs font-bold transition-all active:scale-90 ${
                form.hipPain === i ? 'bg-accent-pink text-white' : 'bg-surface text-secondary border border-white/8'
              }`}
            >{i}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-semibold tracking-wider">PR THIS WEEK</label>
        <input
          value={form.pr}
          onChange={e => setForm(f => ({ ...f, pr: e.target.value }))}
          placeholder="e.g. Bench 80kg × 5"
          className="w-full h-9 mt-0.5 bg-surface border border-white/8 rounded-lg text-white text-sm px-3 focus:border-accent-pink focus:outline-none"
        />
      </div>

      <div className="mb-3">
        <label className="text-[10px] text-secondary font-semibold tracking-wider">NOTES</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="How did this week feel?"
          className="w-full h-16 mt-0.5 bg-surface border border-white/8 rounded-lg text-white text-sm p-2 resize-none focus:border-accent-pink focus:outline-none"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-accent-pink text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
      >
        SAVE CHECK-IN
      </button>
    </div>
  );
}

const chartColors = {
  weight: '#FF2D78',
  waist: '#00D4FF',
  hip: '#A855F7',
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

  // Build strength data from workout logs
  const strengthData: Record<string, { week: number; maxWeight: number }[]> = {};
  for (const log of allLogs ?? []) {
    const maxW = Math.max(...log.sets.map(s => s.weight), 0);
    if (maxW > 0) {
      if (!strengthData[log.exerciseId]) strengthData[log.exerciseId] = [];
      strengthData[log.exerciseId].push({ week: log.week, maxWeight: maxW });
    }
  }

  const topExercises = Object.entries(strengthData)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold tracking-tight mb-4">PROGRESS</h1>

      {/* Check-in Form */}
      <CheckInForm week={currentWeek} />

      {/* Chart Toggle */}
      <div className="flex gap-2 mb-3">
        {[
          { id: 'weight' as const, label: 'Weight' },
          { id: 'waist' as const, label: 'Waist' },
          { id: 'strength' as const, label: 'Strength' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setChartType(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              chartType === t.id ? 'bg-accent-pink text-white' : 'bg-surface text-secondary border border-white/8'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {chartType !== 'strength' && chartData.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-sm font-bold mb-2">
            {chartType === 'weight' ? 'Weight Trend' : 'Waist Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#888' }} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#fff' }}
              />
              {chartType === 'weight' ? (
                <Line type="monotone" dataKey="weight" stroke={chartColors.weight} strokeWidth={2} dot={{ fill: chartColors.weight, r: 4 }} />
              ) : (
                <>
                  <Line type="monotone" dataKey="waist" stroke={chartColors.waist} strokeWidth={2} dot={{ fill: chartColors.waist, r: 4 }} />
                  <Line type="monotone" dataKey="hip" stroke={chartColors.hip} strokeWidth={2} dot={{ fill: chartColors.hip, r: 4 }} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'strength' && topExercises.length > 0 && (
        <div className="card mb-4">
          <h3 className="text-sm font-bold mb-2">Strength PRs Over Time</h3>
          {topExercises.map(([exId, data]) => {
            const sorted = [...data].sort((a, b) => a.week - b.week);
            const chartD = sorted.map(d => ({ week: `W${d.week}`, weight: d.maxWeight }));
            return (
              <div key={exId} className="mb-4">
                <p className="text-xs text-secondary mb-1">{exId}</p>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={chartD}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#888' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#888' }} />
                    <Line type="monotone" dataKey="weight" stroke="#00FF88" strokeWidth={2} dot={{ fill: '#00FF88', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}

      {chartData.length === 0 && chartType !== 'strength' && (
        <div className="card text-center py-6 mb-4">
          <p className="text-secondary text-sm">No check-in data yet. Complete your first weekly check-in above.</p>
        </div>
      )}

      {chartType === 'strength' && topExercises.length === 0 && (
        <div className="card text-center py-6 mb-4">
          <p className="text-secondary text-sm">No workout data yet. Log weights in your sessions to track strength progress.</p>
        </div>
      )}

      {/* Weight Log per Exercise */}
      {(allLogs ?? []).length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Exercise Weight Log</h3>
          {topExercises.map(([exId, data]) => {
            const best = Math.max(...data.map(d => d.maxWeight));
            return (
              <div key={exId} className="card mb-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white">{exId}</p>
                  <span className="pill bg-success/20 text-success">Best: {best}kg</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interpretation Guide */}
      <div className="card border-accent-cyan/20">
        <h3 className="text-sm font-bold mb-2">Trend Interpretation Guide</h3>
        <ul className="space-y-2 text-xs text-secondary">
          <li>
            <span className="text-accent-pink font-semibold">Weight stable + waist decreasing:</span>{' '}
            Ideal recomp — losing fat while maintaining/gaining muscle.
          </li>
          <li>
            <span className="text-accent-cyan font-semibold">Weight dropping + strength steady:</span>{' '}
            Successful cut — preserving muscle mass during fat loss.
          </li>
          <li>
            <span className="text-success font-semibold">Strength increasing + weight stable:</span>{' '}
            Neural gains and muscle growth — classic recomp signal.
          </li>
          <li>
            <span className="text-purple font-semibold">Weight up + measurements up:</span>{' '}
            Review calorie intake — may be in surplus. Check diet adherence.
          </li>
          <li>
            <span className="text-amber font-semibold">Energy dropping + strength flat:</span>{' '}
            Consider a diet break or deload. Recovery may be insufficient.
          </li>
        </ul>
      </div>
    </div>
  );
}
