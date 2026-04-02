import type { PFExercise, HipExercise } from './types';

const p = (ph1: string, ph2: string, ph3: string, deload: string, ph4: string) => ({ ph1, ph2, ph3, deload, ph4 });

// ── PELVIC FLOOR ──
// PF-A: Mon + Sat opener
// PF-B: Thu + Fri closer
// Daily: any time

export const pfExercises: PFExercise[] = [
  // Protocol A
  {
    id: 'pf-a-diaphragm', name: 'Diaphragmatic Breathing', protocol: 'A',
    sets: p('2','2','3','2','3'), reps: p('10 breaths','10 breaths','12 breaths','8 breaths','12 breaths'),
    cues: ['Lie on back, knees bent', 'Hand on belly — feel it rise', 'Inhale 4s nose, exhale 6s mouth', 'Pelvic floor relaxes on inhale'],
  },
  {
    id: 'pf-a-kegel', name: 'Slow Kegel Hold', protocol: 'A',
    sets: p('3','3','3','2','3'), reps: p('5s hold × 8','8s hold × 8','10s hold × 10','5s hold × 6','10s hold × 10'),
    cues: ['Gentle lift — "closing a zipper"', 'Hold without bearing down', 'Breathe normally throughout', 'Fully relax between reps'],
  },
  {
    id: 'pf-a-bridge', name: 'PF Bridge March', protocol: 'A',
    sets: p('2','3','3','2','3'), reps: p('8/side','10/side','10/side','8/side','12/side'),
    cues: ['Glute bridge position', 'Lift one foot 2 inches', 'Keep hips level', 'Engage PF before lifting'],
  },
  {
    id: 'pf-a-squat', name: 'Squat with PF Release', protocol: 'A',
    sets: p('2','2','3','2','3'), reps: p('8','10','10','8','12'),
    cues: ['Bodyweight squat', 'Inhale and relax PF at bottom', 'Exhale and gently engage on rise', 'Full depth, no rush'],
  },

  // Protocol B
  {
    id: 'pf-b-quickflick', name: 'Quick Flick Kegels', protocol: 'B',
    sets: p('3','3','3','2','3'), reps: p('10 rapid','12 rapid','15 rapid','8 rapid','15 rapid'),
    cues: ['Quick contract-release', '1 second each', 'Focus on speed not force', 'Fully release each time'],
  },
  {
    id: 'pf-b-birddogpf', name: 'Bird Dog with PF Brace', protocol: 'B',
    sets: p('2','3','3','2','3'), reps: p('8/side','10/side','10/side','8/side','10/side'),
    cues: ['All fours, neutral spine', 'Engage PF before extending', 'Opposite arm + leg', 'Hold 3s extended'],
  },
  {
    id: 'pf-b-clamshell', name: 'Clamshell', protocol: 'B',
    sets: p('2','3','3','2','3'), reps: p('12/side','12/side','15/side','10/side','15/side'),
    cues: ['Side lying, knees bent', 'Open knees like a book', 'Keep feet together', 'Engage PF at top'],
  },
  {
    id: 'pf-b-wallsit', name: 'Wall Sit with PF Pulse', protocol: 'B',
    sets: p('2','3','3','2','3'), reps: p('20s','30s','30s','20s','40s'),
    cues: ['Back flat on wall', 'Thighs parallel to floor', 'Pulse PF contract/relax', '2s on, 2s off rhythm'],
  },

  // Daily Protocol
  {
    id: 'pf-daily-breath', name: '360° Breathing', protocol: 'daily',
    sets: p('1','1','1','1','1'), reps: p('10 breaths','10 breaths','10 breaths','10 breaths','10 breaths'),
    cues: ['Sit or lie comfortably', 'Breathe into sides and back', 'Feel ribcage expand 360°', 'PF naturally descends on inhale'],
  },
  {
    id: 'pf-daily-kegel', name: 'Daily Kegel Set', protocol: 'daily',
    sets: p('2','2','2','2','2'), reps: p('5s × 5, then 5 quick','8s × 5, then 8 quick','10s × 5, then 10 quick','5s × 5, then 5 quick','10s × 5, then 10 quick'),
    cues: ['Mix of slow holds + quick flicks', 'Can do anywhere — standing, sitting', 'Focus on full release between', 'Breathe normally'],
  },
  {
    id: 'pf-daily-stretch', name: 'Happy Baby Stretch', protocol: 'daily',
    sets: p('1','1','1','1','1'), reps: p('60s','60s','90s','60s','90s'),
    cues: ['Lie on back', 'Grab outside of feet', 'Knees wide toward armpits', 'Gentle rock side to side, relax PF'],
  },
];

// ── HIP CIRCUITS ──
// Circuit A: after Tue (Lower A)
// Circuit B: after Fri (Lower B)
// Mobility: after Wed cardio

export const hipExercises: HipExercise[] = [
  // Circuit A
  {
    id: 'hip-a-clamshell', name: 'Banded Clamshell', circuit: 'A',
    equipment: 'Mini Band',
    sets: p('2','3','3','2','3'), reps: p('12/side','15/side','15/side','10/side','15/side'),
    cues: ['Band above knees', 'Side lying', 'Open knees, keep feet stacked', 'Slow and controlled'],
  },
  {
    id: 'hip-a-firehydrant', name: 'Fire Hydrant', circuit: 'A',
    equipment: 'Mini Band (optional)',
    sets: p('2','3','3','2','3'), reps: p('10/side','12/side','12/side','10/side','15/side'),
    cues: ['All fours position', 'Lift knee out to side', 'Keep hips square', 'Squeeze at top'],
  },
  {
    id: 'hip-a-lateralwalk', name: 'Banded Lateral Walk', circuit: 'A',
    equipment: 'Mini Band',
    sets: p('2','3','3','2','3'), reps: p('10/side','12/side','12/side','10/side','15/side'),
    cues: ['Band around ankles', 'Quarter squat position', 'Step sideways', 'Keep tension on band'],
  },
  {
    id: 'hip-a-singlelegbridge', name: 'Single-Leg Glute Bridge', circuit: 'A',
    sets: p('2','3','3','2','3'), reps: p('8/side','10/side','10/side','8/side','12/side'),
    cues: ['One foot on ground', 'Other leg extended or bent', 'Squeeze glute at top', 'Hips stay level'],
  },

  // Circuit B
  {
    id: 'hip-b-copenhagenplank', name: 'Copenhagen Plank (modified)', circuit: 'B',
    sets: p('2','2','3','2','3'), reps: p('15s/side','20s/side','25s/side','15s/side','30s/side'),
    cues: ['Top foot on bench', 'Bottom leg hangs or supports', 'Hips stacked', 'Engage adductors'],
  },
  {
    id: 'hip-b-hipflexor', name: 'Half-Kneeling Hip Flexor Stretch', circuit: 'B',
    sets: p('2','2','3','2','3'), reps: p('30s/side','30s/side','45s/side','30s/side','45s/side'),
    cues: ['Back knee on pad', 'Squeeze back glute', 'Lean forward slightly', 'Posterior pelvic tilt'],
  },
  {
    id: 'hip-b-piriformis', name: 'Piriformis Figure-4 Stretch', circuit: 'B',
    sets: p('2','2','2','2','2'), reps: p('30s/side','30s/side','45s/side','30s/side','45s/side'),
    cues: ['Lie on back', 'Ankle on opposite knee', 'Pull standing leg toward chest', 'Feel deep glute stretch'],
  },
  {
    id: 'hip-b-90-90', name: '90/90 Hip Switch', circuit: 'B',
    sets: p('2','2','3','2','3'), reps: p('8/side','10/side','10/side','8/side','12/side'),
    cues: ['Both legs at 90°', 'Rotate to switch sides', 'Sit tall', 'Control the movement'],
  },

  // Wednesday Mobility
  {
    id: 'hip-m-worldsgreatest', name: 'World\'s Greatest Stretch', circuit: 'mobility',
    sets: p('2','2','2','2','2'), reps: p('5/side','5/side','6/side','5/side','6/side'),
    cues: ['Lunge position', 'Elbow to instep', 'Rotate and reach to sky', 'Hold each position 3s'],
  },
  {
    id: 'hip-m-frogstretch', name: 'Frog Stretch', circuit: 'mobility',
    sets: p('2','2','3','2','3'), reps: p('30s','30s','45s','30s','45s'),
    cues: ['Knees wide on ground', 'Rock forward and back', 'Feel inner thigh stretch', 'Keep back flat'],
  },
  {
    id: 'hip-m-pigeon', name: 'Pigeon Pose', circuit: 'mobility',
    sets: p('2','2','2','2','2'), reps: p('30s/side','45s/side','45s/side','30s/side','60s/side'),
    cues: ['Front shin perpendicular', 'Back leg extended', 'Fold forward over front leg', 'Breathe into the stretch'],
  },
  {
    id: 'hip-m-hipcar', name: 'Hip CARs (Controlled Articular Rotation)', circuit: 'mobility',
    sets: p('2','2','2','2','2'), reps: p('5/direction/side','5/direction/side','6/direction/side','5/direction/side','6/direction/side'),
    cues: ['All fours or standing', 'Make largest circle possible', 'Slow and controlled', 'Both clockwise and counter'],
  },
];
