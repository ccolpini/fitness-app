import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';
import { useWorkoutLogs, useLastLogForExercise, useCompletedSession, saveWorkoutLog, markSessionComplete } from '../hooks/useDB';
import { ProgressRing, SessionIcon, getSessionIcon, GlowDot } from './ui';

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

  const groupConfig: Record<string, { bg: string; text: string; accent: string }> = {
    main: { bg: 'bg-accent-pink/10', text: 'text-accent-pink', accent: '#FF2D78' },
    abs: { bg: 'bg-accent-cyan/10', text: 'text-accent-cyan', accent: '#00D4FF' },
    hip: { bg: 'bg-purple/10', text: 'text-purple', accent: '#A855F7' },
    pf: { bg: 'bg-success/10', text: 'text-success', accent: '#00FF88' },
  };
  const gc = groupConfig[exercise.group] || groupConfig.main;

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/8 mb-3 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, background: 'linear-gradient(135deg, rgba(20,20,20,1), rgba(26,26,26,1))' }}
    >
      {/* Left accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: gc.accent }} />

      <button onClick={() => setExpanded(!expanded)} className="w-full text-left p-4 pl-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`pill ${gc.bg} ${gc.text}`}>
                {exercise.group.toUpperCase()}
              </span>
              {hasLogged && (
                <span className="pill bg-success/15 text-success text-[10px]">LOGGED</span>
              )}
            </div>
            <h3 className="text-white font-semibold text-sm">{exercise.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-secondary text-xs">
                {exercise.sets[phase]} sets × {repsLabel}
              </span>
              {exercise.equipment && (
                <span className="text-[10px] text-secondary/60">{exercise.equipment}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {lastMaxWeight > 0 && !expanded && (
              <span className="text-xs font-bold" style={{ color: gc.accent }}>{lastMaxWeight}kg</span>
            )}
            <svg className={`w-5 h-5 text-secondary transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pl-5 pb-4 border-t border-white/5 animate-fade-in">
          {exercise.cues.length > 0 && (
            <div className="mt-3 mb-3">
              <p className="text-[10px] text-secondary font-bold tracking-widest mb-1.5">FORM CUES</p>
              <div className="grid gap-1">
                {exercise.cues.map((cue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-secondary">
                    <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: gc.accent + '20', color: gc.accent }}>
                      {i + 1}
                    </span>
                    {cue}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] text-secondary font-bold tracking-widest mb-2">WEIGHT LOG (kg)</p>

            {suggestedWeight > 0 && !existingLog && (
              <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: `linear-gradient(135deg, ${gc.accent}10, ${gc.accent}05)`, border: `1px solid ${gc.accent}25` }}>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: gc.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] font-bold" style={{ color: gc.accent }}>
                    {phase === 'deload' ? 'DELOAD — REDUCE' : 'SUGGESTED'}
                  </p>
                  <p className="text-xs text-white">
                    <span className="font-bold">{suggestedWeight} kg</span>
                    <span className="text-secondary ml-1 text-[10px]">
                      (was {lastMaxWeight}kg)
                    </span>
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
                  className="text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex-shrink-0"
                  style={{ backgroundColor: gc.accent, color: '#0A0A0A' }}
                >
                  USE
                </button>
              </div>
            )}

            {lastMaxWeight > 0 && existingLog && (
              <p className="text-[10px] text-secondary mb-2">
                Last: <span className="font-semibold" style={{ color: gc.accent }}>{lastMaxWeight}kg</span>
                {suggestedWeight !== lastMaxWeight && (
                  <span> → target: <span className="text-success font-semibold">{suggestedWeight}kg</span></span>
                )}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: setsCount }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-secondary/60">S{i + 1}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weights[i] || ''}
                    onChange={e => handleWeightChange(i, e.target.value)}
                    placeholder={suggestedWeight > 0 ? String(suggestedWeight) : '—'}
                    className="w-16 h-10 bg-white/5 border border-white/10 rounded-xl text-center text-white text-sm font-medium focus:border-accent-pink focus:bg-accent-pink/5 focus:outline-none transition-all"
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

export function TodayTab() {
  const { currentWeek, setCurrentWeek } = useStore();
  const dayIndex = getTodayDayIndex();
  const todayDate = getTodayDate();
  const phase = getPhaseForWeek(currentWeek);
  const phaseConfig = PHASE_CONFIG[currentWeek];
  const exercises = SESSIONS[dayIndex] || [];
  const logs = useWorkoutLogs(todayDate);
  const completed = useCompletedSession(todayDate);

  // Calculate session progress
  const loggedCount = logs ? new Set(logs.filter(l => l.sets.some(s => s.weight > 0)).map(l => l.exerciseId)).size : 0;
  const totalExercises = exercises.length;
  const progressPct = totalExercises > 0 ? Math.round((loggedCount / totalExercises) * 100) : 0;

  const handleComplete = async () => {
    await markSessionComplete({ date: todayDate, week: currentWeek, day: dayIndex });
  };

  return (
    <div className="pb-4">
      {/* Hero Header with gradient */}
      <div className="relative overflow-hidden px-4 pt-6 pb-5">
        {/* Background gradient glow */}
        <div className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(ellipse at top right, ${phaseConfig.color}30, transparent 60%)` }} />
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: phaseConfig.color }} />

        <div className="relative flex items-start justify-between">
          {/* Left: text content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-secondary">Week</span>
              <select
                value={currentWeek}
                onChange={e => setCurrentWeek(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg text-white text-sm px-2 py-0.5 focus:outline-none focus:border-accent-pink"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span className="pill text-[10px]" style={{ backgroundColor: phaseConfig.color + '22', color: phaseConfig.color }}>
                {phaseConfig.label}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-1">
              {SESSION_NAMES[dayIndex]}
            </h1>
            <p className="text-secondary text-sm">
              {DAY_NAMES[dayIndex]} — Day {dayIndex + 1} of 7
            </p>

            {/* Mini day indicators */}
            <div className="flex gap-1.5 mt-3">
              {DAY_NAMES.map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: i === dayIndex ? phaseConfig.color : i < dayIndex ? phaseConfig.color + '60' : 'rgba(255,255,255,0.08)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: progress ring */}
          <div className="flex-shrink-0 ml-4">
            <ProgressRing
              radius={42}
              stroke={5}
              progress={completed ? 100 : progressPct}
              color={completed ? '#00FF88' : phaseConfig.color}
            >
              <div className="text-center">
                {completed ? (
                  <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                ) : (
                  <>
                    <div className="text-lg font-bold leading-none" style={{ color: phaseConfig.color }}>
                      {progressPct}%
                    </div>
                    <div className="text-[8px] text-secondary mt-0.5">
                      {loggedCount}/{totalExercises}
                    </div>
                  </>
                )}
              </div>
            </ProgressRing>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Session type card */}
        <div className="glass-card p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: phaseConfig.color + '20' }}>
            <SessionIcon type={getSessionIcon(dayIndex)} size={20} color={phaseConfig.color} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{SESSION_NAMES[dayIndex]}</h2>
              {completed ? (
                <span className="pill bg-success/15 text-success text-[10px]">COMPLETE</span>
              ) : (
                <GlowDot color={phaseConfig.color} />
              )}
            </div>
            <p className="text-xs text-secondary mt-0.5">
              {exercises.filter(e => e.group === 'main').length} main · {exercises.filter(e => e.group === 'abs').length} abs · {exercises.filter(e => e.group !== 'main' && e.group !== 'abs').length} accessory
            </p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="stagger-children">
          {exercises.map((ex, i) => (
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
          ))}
        </div>

        {/* Complete Button */}
        {!completed && exercises.length > 0 && (
          <button
            onClick={handleComplete}
            className="w-full mt-2 py-3.5 font-bold rounded-xl text-sm active:scale-[0.98] transition-all duration-200 animate-slide-up"
            style={{
              background: `linear-gradient(135deg, ${phaseConfig.color}, ${phaseConfig.color}CC)`,
              boxShadow: `0 4px 20px ${phaseConfig.color}40`,
            }}
          >
            MARK SESSION COMPLETE
          </button>
        )}

        {/* PF Reminder */}
        <div className="glass-card p-4 mt-4 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-20 bg-success" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">PF Daily Protocol</h3>
              <p className="text-[11px] text-secondary mt-0.5">
                360° breathing · kegel set · happy baby stretch
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
