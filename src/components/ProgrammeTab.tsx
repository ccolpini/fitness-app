import { useState } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';

function ExerciseDetail({ exercise, phase }: { exercise: Exercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const groupColors: Record<string, string> = {
    main: 'bg-accent-pink/20 text-accent-pink',
    abs: 'bg-accent-cyan/20 text-accent-cyan',
    hip: 'bg-purple/20 text-purple',
    pf: 'bg-success/20 text-success',
  };

  return (
    <div className="card mb-2">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`pill text-[10px] ${groupColors[exercise.group]}`}>{exercise.group.toUpperCase()}</span>
            </div>
            <h4 className="text-sm font-semibold text-white">{exercise.name}</h4>
            <p className="text-xs text-secondary">{exercise.sets[phase]}×{exercise.reps[phase]}{exercise.equipment ? ` — ${exercise.equipment}` : ''}</p>
          </div>
          <svg className={`w-4 h-4 text-secondary transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="mt-2 pt-2 border-t border-white/8 animate-fade-in">
          <p className="text-[10px] text-secondary font-semibold mb-1">FORM CUES</p>
          <ul className="space-y-0.5">
            {exercise.cues.map((c, i) => (
              <li key={i} className="text-xs text-secondary">
                <span className="text-accent-cyan">•</span> {c}
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-5 gap-1 text-[10px]">
            {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
              <div key={ph} className={`text-center rounded-lg py-1 ${ph === phase ? 'bg-accent-pink/20 text-accent-pink' : 'bg-surface text-secondary'}`}>
                <div className="font-bold">{ph === 'deload' ? 'DL' : ph.toUpperCase()}</div>
                <div>{exercise.sets[ph]}×{exercise.reps[ph]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgrammeTab() {
  const { selectedWeek, setSelectedWeek, selectedDay, setSelectedDay } = useStore();
  const phase = getPhaseForWeek(selectedWeek);
  const exercises = SESSIONS[selectedDay] || [];

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.group] = acc[ex.group] || []).push(ex);
    return acc;
  }, {});

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold tracking-tight mb-4">PROGRAMME</h1>

      {/* Week Selector */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3 mb-4">
        {Array.from({ length: 12 }, (_, i) => {
          const w = i + 1;
          const cfg = PHASE_CONFIG[w];
          const active = selectedWeek === w;
          return (
            <button
              key={w}
              onClick={() => setSelectedWeek(w)}
              className={`flex-shrink-0 w-11 h-11 rounded-xl text-xs font-bold transition-all active:scale-90 ${
                active
                  ? 'text-white scale-105 shadow-lg'
                  : 'bg-surface text-secondary border border-white/8'
              }`}
              style={active ? { backgroundColor: cfg.color, color: cfg.color === '#FFFFFF' ? '#0A0A0A' : '#FFF' } : undefined}
            >
              W{w}
            </button>
          );
        })}
      </div>

      {/* Phase Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="pill" style={{ backgroundColor: PHASE_CONFIG[selectedWeek].color + '22', color: PHASE_CONFIG[selectedWeek].color }}>
          {PHASE_CONFIG[selectedWeek].label}
        </span>
        {selectedWeek === 9 && (
          <span className="text-xs text-purple">Reduced volume this week</span>
        )}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAY_NAMES.map((day, i) => {
          const active = selectedDay === i;
          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`py-2 rounded-lg text-xs font-semibold transition-all active:scale-90 ${
                active
                  ? 'bg-accent-pink text-white'
                  : 'bg-surface text-secondary border border-white/8'
              }`}
            >
              <div>{day}</div>
              <div className="text-[10px] mt-0.5 opacity-70">{SESSION_NAMES[i]?.split(' ')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Session Title */}
      <h2 className="text-lg font-bold mb-3">{SESSION_NAMES[selectedDay]}</h2>

      {/* Exercise Groups */}
      {Object.entries(grouped).map(([group, exs]) => (
        <div key={group} className="mb-4">
          <h3 className="text-xs font-bold text-secondary tracking-widest uppercase mb-2">
            {group === 'main' ? 'Main Lifts' : group === 'abs' ? 'Abs' : group === 'hip' ? 'Hip Circuit' : 'Pelvic Floor'}
          </h3>
          {exs.map(ex => (
            <ExerciseDetail key={ex.id} exercise={ex} phase={phase} />
          ))}
        </div>
      ))}

      {exercises.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-secondary">Rest day — light walk recommended</p>
        </div>
      )}
    </div>
  );
}
