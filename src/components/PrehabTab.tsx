import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { pfExercises, hipExercises } from '../data/prehab';
import { getPhaseForWeek } from '../data/types';
import type { Phase, PFExercise, HipExercise } from '../data/types';
import { usePFNote, savePFNote } from '../hooks/useDB';

function PFCard({ exercise, phase }: { exercise: PFExercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  const note = usePFNote(exercise.id);
  const [noteText, setNoteText] = useState('');
  const [noteLoaded, setNoteLoaded] = useState(false);

  if (note && !noteLoaded) {
    setNoteText(note.note);
    setNoteLoaded(true);
  }

  const handleNoteSave = useCallback(async (text: string) => {
    setNoteText(text);
    await savePFNote({
      exerciseId: exercise.id,
      note: text,
      updatedAt: new Date().toISOString(),
    });
  }, [exercise.id]);

  return (
    <div className="card mb-2">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">{exercise.name}</h4>
            <p className="text-xs text-secondary">{exercise.sets[phase]}×{exercise.reps[phase]}</p>
          </div>
          <svg className={`w-4 h-4 text-secondary transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="mt-2 pt-2 border-t border-white/8 animate-fade-in">
          <ul className="space-y-0.5 mb-2">
            {exercise.cues.map((c, i) => (
              <li key={i} className="text-xs text-secondary"><span className="text-success">•</span> {c}</li>
            ))}
          </ul>
          <div className="grid grid-cols-5 gap-1 text-[10px] mb-3">
            {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
              <div key={ph} className={`text-center rounded-lg py-1 ${ph === phase ? 'bg-success/20 text-success' : 'bg-surface text-secondary'}`}>
                <div className="font-bold">{ph === 'deload' ? 'DL' : ph.toUpperCase()}</div>
                <div>{exercise.sets[ph]}×{exercise.reps[ph]}</div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-secondary font-semibold mb-1">PERSONAL NOTES</p>
            <textarea
              value={noteText}
              onChange={e => handleNoteSave(e.target.value)}
              placeholder="Add your notes here..."
              className="w-full h-16 bg-surface border border-white/8 rounded-lg text-xs text-white p-2 resize-none focus:border-success focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HipCard({ exercise, phase }: { exercise: HipExercise; phase: Phase }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card mb-2">
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div>
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
          <ul className="space-y-0.5 mb-2">
            {exercise.cues.map((c, i) => (
              <li key={i} className="text-xs text-secondary"><span className="text-accent-cyan">•</span> {c}</li>
            ))}
          </ul>
          <div className="grid grid-cols-5 gap-1 text-[10px]">
            {(['ph1','ph2','ph3','deload','ph4'] as Phase[]).map(ph => (
              <div key={ph} className={`text-center rounded-lg py-1 ${ph === phase ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-surface text-secondary'}`}>
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
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold tracking-tight mb-4">PREHAB</h1>

      {/* Section Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSection('pf')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            section === 'pf' ? 'bg-success text-bg' : 'bg-surface text-secondary border border-white/8'
          }`}
        >
          Pelvic Floor
        </button>
        <button
          onClick={() => setSection('hip')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
            section === 'hip' ? 'bg-accent-cyan text-bg' : 'bg-surface text-secondary border border-white/8'
          }`}
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
              <h3 className="text-sm font-bold">Protocol A — Mon + Sat Opener</h3>
            </div>
            {pfA.map(ex => <PFCard key={ex.id} exercise={ex} phase={phase} />)}
          </div>

          {/* Protocol B */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill bg-success/20 text-success">B</span>
              <h3 className="text-sm font-bold">Protocol B — Thu + Fri Closer</h3>
            </div>
            {pfB.map(ex => <PFCard key={ex.id} exercise={ex} phase={phase} />)}
          </div>

          {/* Daily */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill bg-success/20 text-success">DAILY</span>
              <h3 className="text-sm font-bold">Daily Protocol — Any Time</h3>
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
              <h3 className="text-sm font-bold">Circuit A — After Lower A (Tue)</h3>
            </div>
            {hipA.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
          </div>

          {/* Circuit B */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill bg-accent-cyan/20 text-accent-cyan">B</span>
              <h3 className="text-sm font-bold">Circuit B — After Lower B (Fri)</h3>
            </div>
            {hipB.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
          </div>

          {/* Mobility */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="pill bg-accent-cyan/20 text-accent-cyan">MOB</span>
              <h3 className="text-sm font-bold">Mobility — After Wed Cardio</h3>
            </div>
            {hipMobility.map(ex => <HipCard key={ex.id} exercise={ex} phase={phase} />)}
          </div>

          {/* Hip Maintenance Guide */}
          <div className="card border-accent-cyan/20">
            <h3 className="text-sm font-bold mb-2">Hip Maintenance Phase Guide</h3>
            <ul className="space-y-1.5 text-xs text-secondary">
              <li><span className="text-accent-cyan">Ph1-2:</span> Focus on activation and mobility — build foundation</li>
              <li><span className="text-accent-cyan">Ph3:</span> Increase hold times and resistance — build resilience</li>
              <li><span className="text-accent-cyan">Deload:</span> Reduce volume, maintain frequency — active recovery</li>
              <li><span className="text-accent-cyan">Ph4:</span> Peak intensity with full ROM — maintain gains</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
