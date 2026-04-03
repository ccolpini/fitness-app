import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';
import { useWorkoutLogs, useLastLogForExercise, useCompletedSession, saveWorkoutLog, markSessionComplete } from '../hooks/useDB';

function getTodayDayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function getSuggestedWeight(lastMax: number, phase: Phase): number {
  if (phase === 'deload') return Math.round(lastMax * 0.6 / 2.5) * 2.5;
  if (phase === 'ph1') return lastMax;
  return Math.round((lastMax * 1.025) / 2.5) * 2.5;
}

/* ── Accent colors per exercise group ── */
const GROUP_ACCENT: Record<string, string> = {
  main: '#FF2D78',
  abs: '#00D4FF',
  hip: '#00FF88',
  pf: '#00FF88',
};

/* ── Exercise Card ── */
function ExerciseCard({ exercise, phase, week, date, dayIndex, logs, index }: {
  exercise: Exercise; phase: Phase; week: number; date: string; dayIndex: number;
  logs: { exerciseId: string; sets: { reps: number; weight: number }[] }[] | undefined;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const setsCount = parseInt(exercise.sets[phase]) || 3;
  const repsLabel = exercise.reps[phase];

  const existingLog = logs?.find(l => l.exerciseId === exercise.id);
  const lastLog = useLastLogForExercise(exercise.id, date);
  const [weights, setWeights] = useState<number[]>(() => Array(setsCount).fill(0));

  useEffect(() => {
    if (existingLog) {
      setWeights(existingLog.sets.map(s => s.weight));
    }
  }, [existingLog?.sets.map(s => s.weight).join(',')]);

  const lastMaxWeight = lastLog ? Math.max(...lastLog.sets.map(s => s.weight)) : 0;
  const suggestedWeight = lastMaxWeight > 0 ? getSuggestedWeight(lastMaxWeight, phase) : 0;
  const hasLogged = existingLog && existingLog.sets.some(s => s.weight > 0);

  const handleWeightChange = useCallback(async (setIndex: number, value: string) => {
    const num = parseFloat(value) || 0;
    const newWeights = [...weights];
    newWeights[setIndex] = num;
    setWeights(newWeights);
    await saveWorkoutLog({
      date, week, day: dayIndex, exerciseId: exercise.id,
      sets: newWeights.map(w => ({ reps: parseInt(repsLabel) || 0, weight: w })),
    });
  }, [weights, date, week, dayIndex, exercise.id, repsLabel]);

  const accent = GROUP_ACCENT[exercise.group] || '#FF2D78';

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-3 animate-slide-up"
      style={{
        animationDelay: `${index * 50}ms`,
        background: '#141414',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Left accent bar — 3px wide, full card height */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />

      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 pl-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {/* Category pill at 15% opacity bg */}
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                style={{ backgroundColor: accent + '26', color: accent }}
              >
                {exercise.group.toUpperCase()}
              </span>
              {hasLogged && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00FF8826] text-[#00FF88]">
                  LOGGED
                </span>
              )}
            </div>
            <h3 className="text-white font-semibold" style={{ fontSize: '16px' }}>{exercise.name}</h3>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
              {exercise.sets[phase]} sets × {repsLabel}{exercise.equipment ? ` · ${exercise.equipment}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastMaxWeight > 0 && !expanded && (
              <span className="text-xs font-bold" style={{ color: accent }}>{lastMaxWeight}kg</span>
            )}
            <svg className={`w-5 h-5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="#666" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pl-5 pb-4 border-t border-white/[0.04] animate-expand">
          {/* Form Cues */}
          {exercise.cues.length > 0 && (
            <div className="mt-3 mb-3">
              <p className="section-label mb-1.5">FORM CUES</p>
              <div className="grid gap-1.5">
                {exercise.cues.map((cue, i) => (
                  <div key={i} className="flex items-start gap-2" style={{ fontSize: '12px', color: '#666' }}>
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: accent + '20', color: accent }}
                    >{i + 1}</span>
                    {cue}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weight Log */}
          <div>
            <p className="section-label mb-2">WEIGHT LOG (KG)</p>

            {/* Suggestion banner */}
            {suggestedWeight > 0 && !existingLog && (
              <div
                className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: accent + '0D', border: `1px solid ${accent}20` }}
              >
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] font-bold" style={{ color: accent }}>
                    {phase === 'deload' ? 'DELOAD — REDUCE' : 'SUGGESTED'}
                  </p>
                  <p className="text-xs" style={{ color: '#E0E0E0' }}>
                    <span className="font-bold">{suggestedWeight}kg</span>
                    <span style={{ color: '#666', marginLeft: '4px', fontSize: '10px' }}>(was {lastMaxWeight}kg)</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    const filled = Array(setsCount).fill(suggestedWeight);
                    setWeights(filled);
                    saveWorkoutLog({
                      date, week, day: dayIndex, exerciseId: exercise.id,
                      sets: filled.map(w => ({ reps: parseInt(repsLabel) || 0, weight: w })),
                    });
                  }}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
                  style={{ backgroundColor: accent, color: '#0A0A0A' }}
                >
                  USE
                </button>
              </div>
            )}

            {lastMaxWeight > 0 && existingLog && (
              <p className="text-[10px] mb-2" style={{ color: '#666' }}>
                Last: <span className="font-semibold" style={{ color: accent }}>{lastMaxWeight}kg</span>
                {suggestedWeight !== lastMaxWeight && (
                  <span> → target: <span className="font-semibold" style={{ color: '#00FF88' }}>{suggestedWeight}kg</span></span>
                )}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: setsCount }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px]" style={{ color: '#444' }}>S{i + 1}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weights[i] || ''}
                    onChange={e => handleWeightChange(i, e.target.value)}
                    placeholder={suggestedWeight > 0 ? String(suggestedWeight) : '—'}
                    className="pill-input w-16 h-10 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Progress Ring (SVG) ── */
function HeroProgressRing({ progress, size = 88 }: { progress: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#222" strokeWidth={stroke} />
        {/* Fill */}
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="#FF2D78" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {progress >= 100 ? (
          <svg className="w-7 h-7" fill="#00FF88" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        ) : (
          <div className="text-center">
            <div className="text-xl font-bold text-white leading-none">{progress}<span className="text-xs">%</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Tab ── */
export function TodayTab() {
  const { currentWeek, setCurrentWeek } = useStore();
  const dayIndex = getTodayDayIndex();
  const todayDate = getTodayDate();
  const phase = getPhaseForWeek(currentWeek);
  const phaseConfig = PHASE_CONFIG[currentWeek];
  const allExercises = SESSIONS[dayIndex] || [];
  const exercises = allExercises.filter(ex => ex.sets[phase] !== '0');
  const logs = useWorkoutLogs(todayDate);
  const completed = useCompletedSession(todayDate);

  const loggedCount = logs ? new Set(logs.filter(l => l.sets.some(s => s.weight > 0)).map(l => l.exerciseId)).size : 0;
  const totalExercises = exercises.length;
  const progressPct = totalExercises > 0 ? Math.round((loggedCount / totalExercises) * 100) : 0;

  const handleComplete = async () => {
    await markSessionComplete({ date: todayDate, week: currentWeek, day: dayIndex });
  };

  return (
    <div className="pb-4">
      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden px-5 pt-8 pb-6"
        style={{ background: 'radial-gradient(ellipse at top left, #2a0a1a 0%, #0A0A0A 60%)' }}
      >
        {/* Pink glow blob behind session title */}
        <div
          className="absolute"
          style={{
            top: '-20px', left: '20px', width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            {/* Week selector + phase */}
            <div className="flex items-center gap-2 mb-3">
              <select
                value={currentWeek}
                onChange={e => setCurrentWeek(Number(e.target.value))}
                className="text-sm font-bold px-2.5 py-1 rounded-lg focus:outline-none"
                style={{ background: '#1E1E1E', color: '#E0E0E0', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>Wk {i + 1}</option>
                ))}
              </select>
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: phaseConfig.color + '22', color: phaseConfig.color }}
              >
                {phaseConfig.label}
              </span>
            </div>

            {/* Session name — massive */}
            <h1
              className="text-white leading-none mb-2"
              style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em' }}
            >
              {SESSION_NAMES[dayIndex]}
            </h1>

            <p style={{ fontSize: '14px', color: '#666' }}>
              {DAY_NAMES[dayIndex]} · Day {dayIndex + 1} of 7
            </p>

            {/* Day progress pills — 7 segments */}
            <div className="flex gap-1.5 mt-4">
              {DAY_NAMES.map((_, i) => (
                <div
                  key={i}
                  className={`h-[5px] flex-1 rounded-full ${i === dayIndex ? 'animate-pulse-glow' : ''}`}
                  style={{
                    backgroundColor: i < dayIndex ? '#FF2D78' : i === dayIndex ? '#FF2D78' : '#222',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex-shrink-0 ml-4 mt-2">
            <HeroProgressRing progress={completed ? 100 : progressPct} />
          </div>
        </div>
      </div>

      {/* ── Exercises ── */}
      <div className="px-4 mt-4">
        {/* Group labels + exercise cards */}
        {(() => {
          const mainExercises = exercises.filter(e => e.group === 'main');
          const absExercises = exercises.filter(e => e.group === 'abs');
          const otherExercises = exercises.filter(e => e.group !== 'main' && e.group !== 'abs');
          const groups: [string, Exercise[]][] = [];
          if (mainExercises.length) groups.push(['MAIN', mainExercises]);
          if (absExercises.length) groups.push(['ABS', absExercises]);
          if (otherExercises.length) groups.push(['ACCESSORY', otherExercises]);

          let cardIndex = 0;
          return groups.map(([label, exs]) => (
            <div key={label} className="mb-4">
              <p className="section-label mb-2">{label}</p>
              <div className="stagger-children">
                {exs.map(ex => {
                  const i = cardIndex++;
                  return (
                    <ExerciseCard
                      key={ex.id}
                      exercise={ex}
                      phase={phase}
                      week={currentWeek}
                      date={todayDate}
                      dayIndex={dayIndex}
                      logs={logs}
                      index={i}
                    />
                  );
                })}
              </div>
            </div>
          ));
        })()}

        {/* Complete Button */}
        {!completed && exercises.length > 0 && (
          <button
            onClick={handleComplete}
            className="w-full py-3.5 font-bold rounded-xl text-sm text-white active:scale-[0.98] transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #FF2D78, #cc2460)',
              boxShadow: '0 4px 20px rgba(255, 45, 120, 0.35)',
            }}
          >
            MARK SESSION COMPLETE
          </button>
        )}

        {completed && (
          <div
            className="text-center py-4 rounded-xl"
            style={{ background: '#141414', border: '1px solid rgba(0,255,136,0.15)' }}
          >
            <svg className="w-8 h-8 mx-auto mb-1" fill="#00FF88" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <p className="text-sm font-bold" style={{ color: '#00FF88' }}>Session Complete</p>
          </div>
        )}

        {/* PF Reminder */}
        <div
          className="mt-4 p-4 rounded-xl flex items-center gap-3"
          style={{ background: '#141414', border: '1px solid rgba(0,255,136,0.1)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,255,136,0.1)' }}
          >
            <svg className="w-5 h-5" fill="#00FF88" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">PF Daily Protocol</h3>
            <p style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
              360° breathing · kegel set · happy baby stretch
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
