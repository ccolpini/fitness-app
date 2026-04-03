import { useState } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';
import { SessionIcon, getSessionIcon, ProgressBar } from './ui';

function ExerciseDetail({ exercise, phase }: { exercise: Exercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const gc: Record<string, { accent: string; bg: string }> = {
    main: { accent: '#FF2D78', bg: 'bg-accent-pink/10' },
    abs: { accent: '#00D4FF', bg: 'bg-accent-cyan/10' },
    hip: { accent: '#A855F7', bg: 'bg-purple/10' },
    pf: { accent: '#00FF88', bg: 'bg-success/10' },
  };
  const g = gc[exercise.group] || gc.main;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/6 mb-2"
      style={{ background: 'linear-gradient(135deg, rgba(20,20,20,1), rgba(26,26,26,1))' }}>
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: g.accent }} />
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`pill text-[10px] ${g.bg}`} style={{ color: g.accent }}>{exercise.group.toUpperCase()}</span>
            </div>
            <h4 className="text-sm font-semibold text-white">{exercise.name}</h4>
            <p className="text-xs text-secondary">{exercise.sets[phase]}×{exercise.reps[phase]}{exercise.equipment ? ` · ${exercise.equipment}` : ''}</p>
          </div>
          <svg className={`w-4 h-4 text-secondary transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-3 pl-4 pb-3 border-t border-white/5 animate-fade-in">
          <div className="mt-2 mb-2">
            {exercise.cues.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-secondary mb-1">
                <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ backgroundColor: g.accent + '20', color: g.accent }}>{i + 1}</span>
                {c}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
              <div key={ph} className={`text-center rounded-lg py-1.5 transition-all ${ph === phase ? 'border' : 'bg-white/3'}`}
                style={ph === phase ? { borderColor: g.accent + '50', backgroundColor: g.accent + '15', color: g.accent } : { color: '#888' }}>
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
  // Filter out exercises with 0 sets in the current phase (Ph1-only exercises etc.)
  const exercises = (SESSIONS[selectedDay] || []).filter(ex => ex.sets[phase] !== '0');
  const phaseConfig = PHASE_CONFIG[selectedWeek];

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.group] = acc[ex.group] || []).push(ex);
    return acc;
  }, {});

  const groupLabels: Record<string, string> = {
    main: 'Main Lifts', abs: 'Abs', hip: 'Hip Circuit', pf: 'Pelvic Floor',
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative overflow-hidden px-4 pt-6 pb-4">
        <div className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at top left, ${phaseConfig.color}25, transparent 60%)` }} />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight mb-1">PROGRAMME</h1>
          <p className="text-secondary text-sm">12-week body recomposition plan</p>
        </div>
      </div>

      <div className="px-4">
        {/* Week Selector — scrollable pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-3 -mx-4 px-4">
          {Array.from({ length: 12 }, (_, i) => {
            const w = i + 1;
            const cfg = PHASE_CONFIG[w];
            const active = selectedWeek === w;
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`relative flex-shrink-0 w-12 h-14 rounded-2xl text-xs font-bold transition-all duration-300 active:scale-90 overflow-hidden ${
                  active ? 'text-white' : 'border border-white/8 text-secondary'
                }`}
                style={active ? {
                  background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)`,
                  boxShadow: `0 4px 15px ${cfg.color}40`,
                  color: cfg.color === '#FFFFFF' ? '#0A0A0A' : '#FFF',
                } : { backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex flex-col items-center justify-center h-full gap-0.5">
                  <span className="text-[9px] opacity-70">WK</span>
                  <span className="text-base">{w}</span>
                </div>
                {active && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-white/60" />
                )}
              </button>
            );
          })}
        </div>

        {/* Phase label + week progress */}
        <div className="glass-card p-3 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: phaseConfig.color + '20' }}>
            <div className="text-xs font-bold" style={{ color: phaseConfig.color }}>
              {selectedWeek === 9 ? 'DL' : `P${phaseConfig.phase.replace('ph', '')}`}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">{phaseConfig.label}</p>
            <div className="mt-1.5">
              <ProgressBar progress={(selectedWeek / 12) * 100} color={phaseConfig.color} height={3} />
            </div>
          </div>
          <span className="text-xs text-secondary">Wk {selectedWeek}/12</span>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {DAY_NAMES.map((day, i) => {
            const active = selectedDay === i;
            const iconType = getSessionIcon(i);
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`relative py-2.5 rounded-xl text-center transition-all duration-300 active:scale-90 overflow-hidden ${
                  active ? 'border-transparent' : 'border border-white/8'
                }`}
                style={active ? {
                  background: `linear-gradient(180deg, ${phaseConfig.color}30, ${phaseConfig.color}10)`,
                  border: `1px solid ${phaseConfig.color}40`,
                } : { backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <SessionIcon type={iconType} size={14} color={active ? phaseConfig.color : '#555'} />
                  <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-secondary'}`}>{day}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Session Title */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold">{SESSION_NAMES[selectedDay]}</h2>
          <span className="text-xs text-secondary">{exercises.length} exercises</span>
        </div>

        {/* Exercise Groups */}
        <div className="stagger-children">
          {Object.entries(grouped).map(([group, exs]) => (
            <div key={group} className="mb-4">
              <h3 className="text-[10px] font-bold text-secondary tracking-[0.15em] uppercase mb-2">
                {groupLabels[group] || group}
              </h3>
              {exs.map(ex => (
                <ExerciseDetail key={ex.id} exercise={ex} phase={phase} />
              ))}
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="glass-card text-center py-10">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <SessionIcon type="rest" size={24} color="#888" />
            </div>
            <p className="text-secondary font-medium">Rest Day</p>
            <p className="text-xs text-secondary/60 mt-1">Light walk recommended — 20-30 min</p>
          </div>
        )}
      </div>
    </div>
  );
}
