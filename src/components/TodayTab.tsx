import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';
import { useWorkoutLogs, useLastLogForExercise, useCompletedSession, saveWorkoutLog, markSessionComplete } from '../hooks/useDB';

function getTodayDayIndex(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1; // Convert Sun=0..Sat=6 → Mon=0..Sun=6
}

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Suggest a weight based on last session's max and current phase.
 * - Deload: drop to ~60% of last weight
 * - Ph1 (foundation / higher reps): keep same weight
 * - Ph2/Ph3/Ph4 (progressive overload / lower reps): nudge up 2.5%
 */
function getSuggestedWeight(lastMax: number, phase: Phase): number {
  if (phase === 'deload') return Math.round(lastMax * 0.6 / 2.5) * 2.5;
  if (phase === 'ph1') return lastMax;
  // ph2, ph3, ph4 — reps typically drop so weight can go up
  return Math.round((lastMax * 1.025) / 2.5) * 2.5;
}

function ExerciseCard({ exercise, phase, week, date, dayIndex, logs }: {
  exercise: Exercise; phase: Phase; week: number; date: string; dayIndex: number;
  logs: { exerciseId: string; sets: { reps: number; weight: number }[] }[] | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const setsCount = parseInt(exercise.sets[phase]) || 3;
  const repsLabel = exercise.reps[phase];

  const existingLog = logs?.find(l => l.exerciseId === exercise.id);
  const lastLog = useLastLogForExercise(exercise.id, date);
  const [weights, setWeights] = useState<number[]>(() => Array(setsCount).fill(0));

  // Sync weights from DB once logs load (they're undefined on first render)
  useEffect(() => {
    if (existingLog) {
      setWeights(existingLog.sets.map(s => s.weight));
    }
  }, [existingLog?.sets.map(s => s.weight).join(',')]);

  // Build weight suggestion from last session
  const lastMaxWeight = lastLog ? Math.max(...lastLog.sets.map(s => s.weight)) : 0;
  const suggestedWeight = lastMaxWeight > 0 ? getSuggestedWeight(lastMaxWeight, phase) : 0;

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

  const groupColors: Record<string, string> = {
    main: 'bg-accent-pink/20 text-accent-pink',
    abs: 'bg-accent-cyan/20 text-accent-cyan',
    hip: 'bg-purple/20 text-purple',
    pf: 'bg-success/20 text-success',
  };

  return (
    <div className="card mb-3 animate-scale-in">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`pill ${groupColors[exercise.group]}`}>
                {exercise.group.toUpperCase()}
              </span>
              {exercise.equipment && (
                <span className="text-xs text-secondary">{exercise.equipment}</span>
              )}
            </div>
            <h3 className="text-white font-semibold text-sm">{exercise.name}</h3>
            <p className="text-secondary text-xs mt-0.5">
              {exercise.sets[phase]} sets × {repsLabel}
            </p>
          </div>
          <svg className={`w-5 h-5 text-secondary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/8 animate-fade-in">
          {exercise.cues.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-secondary font-semibold mb-1">FORM CUES</p>
              <ul className="space-y-1">
                {exercise.cues.map((cue, i) => (
                  <li key={i} className="text-xs text-secondary flex items-start gap-1.5">
                    <span className="text-accent-pink mt-0.5">•</span>{cue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-xs text-secondary font-semibold mb-2">WEIGHT LOG (kg)</p>

            {/* Weight suggestion from last session */}
            {suggestedWeight > 0 && !existingLog && (
              <div className="mb-3 flex items-center gap-2 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-accent-cyan flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="flex-1">
                  <p className="text-[10px] text-accent-cyan font-semibold">
                    {phase === 'deload' ? 'DELOAD — REDUCE WEIGHT' : 'SUGGESTED WEIGHT'}
                  </p>
                  <p className="text-xs text-white">
                    <span className="font-bold">{suggestedWeight} kg</span>
                    <span className="text-secondary ml-1">
                      (last: {lastMaxWeight} kg{phase === 'deload' ? ' → 60%' : phase !== 'ph1' ? ' → +2.5%' : ' → maintain'})
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
                  className="text-[10px] font-bold text-bg bg-accent-cyan px-2.5 py-1 rounded-lg active:scale-95 transition-transform flex-shrink-0"
                >
                  USE
                </button>
              </div>
            )}

            {/* Last session reference (when already logging) */}
            {lastMaxWeight > 0 && existingLog && (
              <p className="text-[10px] text-secondary mb-2">
                Last session: <span className="text-accent-cyan font-semibold">{lastMaxWeight} kg</span>
                {suggestedWeight !== lastMaxWeight && (
                  <span> — target this week: <span className="text-success font-semibold">{suggestedWeight} kg</span></span>
                )}
              </p>
            )}

            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: setsCount }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-secondary">Set {i + 1}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weights[i] || ''}
                    onChange={e => handleWeightChange(i, e.target.value)}
                    placeholder={suggestedWeight > 0 ? String(suggestedWeight) : '0'}
                    className="w-16 h-9 bg-surface-light border border-white/8 rounded-lg text-center text-white text-sm focus:border-accent-pink focus:outline-none transition-colors"
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

  const handleComplete = async () => {
    await markSessionComplete({ date: todayDate, week: currentWeek, day: dayIndex });
  };

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold tracking-tight">TODAY</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary">Week</span>
            <select
              value={currentWeek}
              onChange={e => setCurrentWeek(Number(e.target.value))}
              className="bg-surface border border-white/8 rounded-lg text-white text-sm px-2 py-1 focus:outline-none focus:border-accent-pink"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill" style={{ backgroundColor: phaseConfig.color + '22', color: phaseConfig.color }}>
            {phaseConfig.label}
          </span>
          <span className="text-secondary text-xs">
            {DAY_NAMES[dayIndex]} — Day {dayIndex + 1}
          </span>
        </div>
      </div>

      {/* Session Card */}
      <div className="card-light mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-white">{SESSION_NAMES[dayIndex]}</h2>
          {completed ? (
            <span className="pill bg-success/20 text-success">COMPLETE ✓</span>
          ) : (
            <span className="pill bg-accent-pink/20 text-accent-pink">{exercises.length} exercises</span>
          )}
        </div>

        {exercises.map(ex => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            phase={phase}
            week={currentWeek}
            date={todayDate}
            dayIndex={dayIndex}
            logs={logs}
          />
        ))}

        {!completed && exercises.length > 0 && (
          <button
            onClick={handleComplete}
            className="w-full mt-3 py-3 bg-accent-pink text-white font-bold rounded-xl text-sm active:scale-95 transition-transform"
          >
            MARK SESSION COMPLETE
          </button>
        )}
      </div>

      {/* PF Reminder */}
      <div className="card border-success/30">
        <div className="flex items-center gap-2 mb-1">
          <span className="pill bg-success/20 text-success">PF</span>
          <h3 className="text-sm font-semibold">Pelvic Floor Daily Reminder</h3>
        </div>
        <p className="text-xs text-secondary">
          Complete your daily PF protocol: 360° breathing, kegel set, and happy baby stretch.
          Tap the Prehab tab for full details.
        </p>
      </div>
    </div>
  );
}
