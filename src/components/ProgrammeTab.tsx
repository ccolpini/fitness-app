import { useState } from 'react';
import { useStore } from '../store/useStore';
import { SESSIONS } from '../data/exercises';
import { PHASE_CONFIG, DAY_NAMES, SESSION_NAMES, getPhaseForWeek } from '../data/types';
import type { Exercise, Phase } from '../data/types';
import { SessionIcon, getSessionIcon, ProgressBar } from './ui';

const GROUP_ACCENT: Record<string, string> = { main: '#FF2D78', abs: '#00D4FF', hip: '#00FF88', pf: '#00FF88' };

function ExerciseDetail({ exercise, phase }: { exercise: Exercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const accent = GROUP_ACCENT[exercise.group] || '#FF2D78';

  return (
    <div
      className="relative overflow-hidden rounded-xl mb-2"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
      <button onClick={() => setOpen(!open)} className="w-full text-left p-3 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-1"
              style={{ backgroundColor: accent + '26', color: accent }}>
              {exercise.group.toUpperCase()}
            </span>
            <h4 className="text-white font-semibold" style={{ fontSize: '15px' }}>{exercise.name}</h4>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '1px' }}>
              {exercise.sets[phase]}×{exercise.reps[phase]}{exercise.equipment ? ` · ${exercise.equipment}` : ''}
            </p>
          </div>
          <svg className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} fill="none" stroke="#666" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-3 pl-4 pb-3 border-t border-white/[0.04] animate-expand">
          <div className="mt-2 mb-2">
            {exercise.cues.map((c, i) => (
              <div key={i} className="flex items-start gap-2 mb-1" style={{ fontSize: '12px', color: '#666' }}>
                <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ backgroundColor: accent + '20', color: accent }}>{i + 1}</span>
                {c}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
              <div key={ph} className="text-center rounded-lg py-1.5"
                style={ph === phase
                  ? { border: `1px solid ${accent}50`, backgroundColor: accent + '15', color: accent }
                  : { backgroundColor: '#1E1E1E', color: '#666' }}>
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
  const exercises = (SESSIONS[selectedDay] || []).filter(ex => ex.sets[phase] !== '0');
  const phaseConfig = PHASE_CONFIG[selectedWeek];

  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.group] = acc[ex.group] || []).push(ex);
    return acc;
  }, {});

  const groupLabels: Record<string, string> = { main: 'MAIN', abs: 'ABS', hip: 'HIP CIRCUIT', pf: 'PELVIC FLOOR' };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="relative overflow-hidden px-5 pt-8 pb-5"
        style={{ background: 'radial-gradient(ellipse at top left, #0a1520 0%, #0A0A0A 60%)' }}>
        <h1 className="text-white leading-none mb-1" style={{ fontSize: '36px', fontWeight: 800 }}>PROGRAMME</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>12-week recomposition plan</p>
      </div>

      <div className="px-4 mt-2">
        {/* Week Selector */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-3 -mx-4 px-4">
          {Array.from({ length: 12 }, (_, i) => {
            const w = i + 1;
            const cfg = PHASE_CONFIG[w];
            const active = selectedWeek === w;
            return (
              <button key={w} onClick={() => setSelectedWeek(w)}
                className={`relative flex-shrink-0 w-12 h-14 rounded-2xl text-xs font-bold transition-all duration-300 active:scale-90 overflow-hidden ${
                  active ? 'text-white' : 'text-[#666]'
                }`}
                style={active ? {
                  background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)`,
                  boxShadow: `0 4px 15px ${cfg.color}40`,
                  color: cfg.color === '#FFFFFF' ? '#0A0A0A' : '#FFF',
                } : { backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex flex-col items-center justify-center h-full gap-0.5">
                  <span className="text-[9px] opacity-60">WK</span>
                  <span className="text-base">{w}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase indicator */}
        <div className="rounded-xl p-3 mb-3 flex items-center gap-3"
          style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: phaseConfig.color + '20' }}>
            <span className="text-xs font-bold" style={{ color: phaseConfig.color }}>
              {selectedWeek === 9 ? 'DL' : `P${phaseConfig.phase.replace('ph', '')}`}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">{phaseConfig.label}</p>
            <div className="mt-1.5"><ProgressBar progress={(selectedWeek / 12) * 100} color={phaseConfig.color} height={3} /></div>
          </div>
          <span className="text-xs" style={{ color: '#666' }}>Wk {selectedWeek}/12</span>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1.5 mb-4">
          {DAY_NAMES.map((day, i) => {
            const active = selectedDay === i;
            return (
              <button key={i} onClick={() => setSelectedDay(i)}
                className="py-2.5 rounded-xl text-center transition-all duration-300 active:scale-90"
                style={active ? {
                  background: `linear-gradient(180deg, ${phaseConfig.color}30, ${phaseConfig.color}10)`,
                  border: `1px solid ${phaseConfig.color}40`,
                } : { backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex flex-col items-center gap-1">
                  <SessionIcon type={getSessionIcon(i)} size={14} color={active ? phaseConfig.color : '#444'} />
                  <span className={`text-[10px] font-bold ${active ? 'text-white' : ''}`} style={active ? {} : { color: '#666' }}>{day}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Session Title */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold text-white">{SESSION_NAMES[selectedDay]}</h2>
          <span className="text-xs" style={{ color: '#666' }}>{exercises.length} exercises</span>
        </div>

        {/* Exercise Groups */}
        <div className="stagger-children">
          {Object.entries(grouped).map(([group, exs]) => (
            <div key={group} className="mb-4">
              <p className="section-label mb-2">{groupLabels[group] || group.toUpperCase()}</p>
              {exs.map(ex => <ExerciseDetail key={ex.id} exercise={ex} phase={phase} />)}
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="text-center py-10 rounded-xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
            <SessionIcon type="rest" size={24} color="#666" />
            <p className="font-medium mt-2" style={{ color: '#666' }}>Rest Day</p>
            <p className="text-xs mt-1" style={{ color: '#444' }}>Light walk recommended — 20-30 min</p>
          </div>
        )}
      </div>
    </div>
  );
}
