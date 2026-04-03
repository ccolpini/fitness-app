import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { pfExercises, hipExercises } from '../data/prehab';
import { getPhaseForWeek } from '../data/types';
import type { Phase, PFExercise, HipExercise } from '../data/types';
import { usePFNote, savePFNote } from '../hooks/useDB';

function PFCard({ exercise, phase }: { exercise: PFExercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const note = usePFNote(exercise.id);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (note) setNoteText(note.note);
  }, [note?.note]);

  const handleNoteSave = useCallback(async (text: string) => {
    setNoteText(text);
    await savePFNote({
      exerciseId: exercise.id,
      note: text,
      updatedAt: new Date().toISOString(),
    });
  }, [exercise.id]);

  return (
    <div
      className="rounded-xl mb-2 overflow-hidden"
      style={{
        background: '#141414',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Green left accent bar */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '3px', background: '#4ade80', flexShrink: 0, borderRadius: '0' }} />
        <div style={{ flex: 1, padding: '10px 12px' }}>
          <button onClick={() => setOpen(!open)} className="w-full text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{exercise.name}</h4>
                <p className="text-xs" style={{ color: '#666' }}>{exercise.sets[phase]}×{exercise.reps[phase]}</p>
              </div>
              <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {open && (
            <div className="mt-2 pt-2 border-t border-white/8 animate-fade-in">
              <ul className="space-y-0.5 mb-2">
                {exercise.cues.map((c, i) => (
                  <li key={i} className="text-xs" style={{ color: '#666' }}><span className="text-success">•</span> {c}</li>
                ))}
              </ul>
              <div className="grid grid-cols-5 gap-1 text-[10px] mb-3">
                {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
                  <div
                    key={ph}
                    className={`text-center rounded-lg py-1 ${ph === phase ? 'bg-success/20 text-success' : ''}`}
                    style={ph !== phase ? { background: '#1E1E1E', color: '#666' } : undefined}
                  >
                    <div className="font-bold">{ph === 'deload' ? 'DL' : ph.toUpperCase()}</div>
                    <div>{exercise.sets[ph]}×{exercise.reps[ph]}</div>
                  </div>
                ))}
              </div>
              <div>
                <p className="section-label mb-1">PERSONAL NOTES</p>
                <textarea
                  value={noteText}
                  onChange={e => handleNoteSave(e.target.value)}
                  placeholder="Add your notes here..."
                  className="w-full h-16 text-xs text-white p-2 resize-none focus:border-success focus:outline-none"
                  style={{
                    background: '#1E1E1E',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HipCard({ exercise, phase }: { exercise: HipExercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl mb-2 overflow-hidden"
      style={{
        background: '#141414',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Cyan left accent bar */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: '3px', background: '#22d3ee', flexShrink: 0, borderRadius: '0' }} />
        <div style={{ flex: 1, padding: '10px 12px' }}>
          <button onClick={() => setOpen(!open)} className="w-full text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">{exercise.name}</h4>
                <p className="text-xs" style={{ color: '#666' }}>{exercise.sets[phase]}×{exercise.reps[phase]}{exercise.equipment ? ` — ${exercise.equipment}` : ''}</p>
              </div>
              <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: '#666' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {open && (
            <div className="mt-2 pt-2 border-t border-white/8 animate-fade-in">
              <ul className="space-y-0.5 mb-2">
                {exercise.cues.map((c, i) => (
                  <li key={i} className="text-xs" style={{ color: '#666' }}><span className="text-accent-cyan">•</span> {c}</li>
                ))}
              </ul>
              <div className="grid grid-cols-5 gap-1 text-[10px]">
                {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
                  <div
                    key={ph}
                    className={`text-center rounded-lg py-1 ${ph === phase ? 'bg-accent-cyan/20 text-accent-cyan' : ''}`}
                    style={ph !== phase ? { background: '#1E1E1E', color: '#666' } : undefined}
                  >
                    <div className="font-bold">{ph === 'deload' ? 'DL' : ph.toUpperCase()}</div>
                    <div>{exercise.sets[ph]}×{exercise.reps[ph]}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PrehabTab() {
  const { currentWeek } = useStore();
  const phase = getPhaseForWeek(currentWeek);
  const [section, setSection] = useState<'pf' | 'hip'>('pf');

  const pfA = pfExercises.filter(e => e.protocol === 'A');
  const pfB = pfExercises.filter(e => e.protocol === 'B');
  const pfDaily = pfExercises.filter(e => e.protocol === 'daily');

  const hipA = hipExercises.filter(e => e.circuit === 'A');
  const hipB = hipExercises.filter(e => e.circuit === 'B');
  const hipMobility = hipExercises.filter(e => e.circuit === 'mobility');

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-6 pb-4" style={{ background: 'radial-gradient(ellipse at top left, #0a150a 0%, #0A0A0A 60%)' }}>
        <h1 className="text-white leading-none mb-1" style={{ fontSize: '36px', fontWeight: 800 }}>PREHAB</h1>
        <p style={{ fontSize: '14px', color: '#666' }}>Pelvic floor &amp; hip maintenance protocols</p>
      </div>

      <div className="px-4 pb-4">
        {/* Section Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSection('pf')}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={
              section === 'pf'
                ? { background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#0A0A0A' }
                : { background: '#141414', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            Pelvic Floor
          </button>
          <button
            onClick={() => setSection('hip')}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
            style={
              section === 'hip'
                ? { background: 'linear-gradient(135deg, #22d3ee, #06b6d4)', color: '#0A0A0A' }
                : { background: '#141414', color: '#666', border: '1px solid rgba(255,255,255,0.06)' }
            }
          >
            Hip Circuits
          </button>
        </div>

        {section === 'pf' ? (
          <div className="animate-fade-in">
            {/* Protocol A */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-success/20 text-success">A</span>
                <h3 className="section-label">Protocol A — Mon + Sat Opener</h3>
              </div>
              {pfA.map(ex => <PFCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>

            {/* Protocol B */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-success/20 text-success">B</span>
                <h3 className="section-label">Protocol B — Thu + Fri Closer</h3>
              </div>
              {pfB.map(ex => <PFCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>

            {/* Daily */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-success/20 text-success">DAILY</span>
                <h3 className="section-label">Daily Protocol — Any Time</h3>
              </div>
              {pfDaily.map(ex => <PFCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Circuit A */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-accent-cyan/20 text-accent-cyan">A</span>
                <h3 className="section-label">Circuit A — After Lower A (Tue)</h3>
              </div>
              {hipA.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>

            {/* Circuit B */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-accent-cyan/20 text-accent-cyan">B</span>
                <h3 className="section-label">Circuit B — After Lower B (Fri)</h3>
              </div>
              {hipB.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>

            {/* Mobility */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="pill bg-accent-cyan/20 text-accent-cyan">MOB</span>
                <h3 className="section-label">Mobility — After Wed Cardio</h3>
              </div>
              {hipMobility.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
            </div>

            {/* Hip Maintenance Guide */}
            <div
              className="rounded-xl"
              style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                padding: '12px',
              }}
            >
              <h3 className="text-sm font-bold mb-2">Hip Maintenance Phase Guide</h3>
              <ul className="space-y-1.5 text-xs" style={{ color: '#666' }}>
                <li><span className="text-accent-cyan">Ph1-2:</span> Focus on activation and mobility — build foundation</li>
                <li><span className="text-accent-cyan">Ph3:</span> Increase hold times and resistance — build resilience</li>
                <li><span className="text-accent-cyan">Deload:</span> Reduce volume, maintain frequency — active recovery</li>
                <li><span className="text-accent-cyan">Ph4:</span> Peak intensity with full ROM — maintain gains</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
