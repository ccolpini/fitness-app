import type { Exercise } from './types';

const p = (ph1: string, ph2: string, ph3: string, deload: string, ph4: string) => ({ ph1, ph2, ph3, deload, ph4 });

// ── UPPER A (Monday) ──
export const upperAExercises: Exercise[] = [
  {
    id: 'ua-bench', name: 'Barbell Bench Press', equipment: 'Barbell + Bench',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('8-10','6-8','5-6','10-12','4-6'),
    cues: ['Retract scapula', 'Feet flat, arch maintained', 'Bar to mid-chest', 'Drive through heels'],
  },
  {
    id: 'ua-row', name: 'Barbell Bent-Over Row', equipment: 'Barbell',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('8-10','6-8','5-6','10-12','4-6'),
    cues: ['Hinge at hips 45°', 'Pull to lower chest', 'Squeeze shoulder blades', 'Control the negative'],
  },
  {
    id: 'ua-ohp', name: 'Dumbbell Overhead Press', equipment: 'Dumbbells',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10-12','8-10','6-8','12','6-8'),
    cues: ['Brace core tight', 'Press slightly in front', 'Full lockout at top', 'Controlled descent'],
  },
  {
    id: 'ua-pulldown', name: 'Lat Pulldown', equipment: 'Cable Machine',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Lean back slightly', 'Drive elbows to hips', 'Full stretch at top', 'Pause at bottom'],
  },
  {
    id: 'ua-lateral', name: 'Lateral Raise', equipment: 'Dumbbells',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Slight elbow bend', 'Lead with elbows', 'Stop at shoulder height', 'Slow negative 3s'],
  },
  {
    id: 'ua-curl', name: 'Barbell Curl', equipment: 'Barbell / EZ-Bar',
    group: 'main', sets: p('2','3','3','2','3'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Elbows pinned to sides', 'Full range of motion', 'Squeeze at top', 'No swinging'],
  },
  // Abs — Mon: hollow body, cable crunch, Pallof
  {
    id: 'ua-hollow', name: 'Hollow Body Hold', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('20s','30s','30s','20s','30s'),
    cues: ['Lower back glued to floor', 'Arms overhead', 'Legs straight, hover off floor', 'Breathe through brace'],
  },
  {
    id: 'ua-cablecrunch', name: 'Cable Crunch', equipment: 'Cable Machine',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Kneel facing cable', 'Crunch ribs to hips', 'Hold peak contraction', 'Exhale at bottom'],
  },
  {
    id: 'ua-pallof', name: 'Pallof Press', equipment: 'Cable / Band',
    group: 'abs', sets: p('2','3','3','2','3'), reps: p('10/side','10/side','12/side','10/side','12/side'),
    cues: ['Stand perpendicular to cable', 'Press hands forward', 'Resist rotation', 'Brace obliques hard'],
  },
];

// ── LOWER A (Tuesday) ──
export const lowerAExercises: Exercise[] = [
  {
    id: 'la-goblet', name: 'Goblet Squat', equipment: 'Dumbbell / Kettlebell',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('10','6-8','5-6','10-12','4-6'),
    cues: ['Hold weight at chest', 'Elbows inside knees at bottom', 'Focus on depth and upright torso', 'Elevate heels slightly if mobility limited'],
  },
  {
    id: 'la-boxsquat', name: 'Box Squat', equipment: 'Box / Bench (BW or light KB)',
    group: 'main', sets: p('3','0','0','0','0'), reps: p('8','—','—','—','—'),
    cues: ['Sit back to parallel box', 'Pause 1s on box — no bouncing', 'Drive up through full foot', 'Teaches hip hinge into squat without forward knee drift'],
  },
  {
    id: 'la-stepup', name: 'Step-Up (tall box)', equipment: 'Box / Bench (BW or DB)',
    group: 'main', sets: p('3','0','0','0','0'), reps: p('10/side','—','—','—','—'),
    cues: ['Full hip extension at top', 'All load through front leg', 'Control the step down', 'Replaces split squat while hip fires correctly'],
  },
  {
    id: 'la-rdl', name: 'Romanian Deadlift', equipment: 'Barbell',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10-12','8-10','6-8','12','6-8'),
    cues: ['Soft knee bend', 'Hinge at hips, bar close', 'Feel hamstring stretch', 'Squeeze glutes at top'],
  },
  {
    id: 'la-legpress', name: 'Leg Press', equipment: 'Leg Press Machine',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Feet shoulder width', 'Full range of motion', 'Don\'t lock knees', 'Control the negative'],
  },
  {
    id: 'la-legcurl', name: 'Lying Leg Curl', equipment: 'Machine',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Hips stay down', 'Curl past 90°', 'Slow eccentric 3s', 'Full stretch at bottom'],
  },
  {
    id: 'la-calfraise', name: 'Standing Calf Raise', equipment: 'Machine / Smith',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Full stretch at bottom', 'Pause at top 2s', 'Straight legs', 'Even weight distribution'],
  },
];

// ── ZONE 2 + HIP (Wednesday) ──
export const zone2Exercises: Exercise[] = [
  {
    id: 'z2-cardio', name: 'Zone 2 Cardio (bike/walk/row)', equipment: 'Cardio Machine',
    group: 'main', sets: p('1','1','1','1','1'), reps: p('30 min','35 min','40 min','25 min','40 min'),
    cues: ['Heart rate 120-140 BPM', 'Conversational pace', 'Nose breathing preferred', 'Steady effort throughout'],
  },
];

// ── UPPER B (Thursday) ──
export const upperBExercises: Exercise[] = [
  {
    id: 'ub-incline', name: 'Incline Dumbbell Press', equipment: 'Dumbbells + Incline Bench',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('8-10','6-8','6-8','10-12','5-6'),
    cues: ['30° incline angle', 'Dumbbells at chest level', 'Press and squeeze at top', 'Controlled descent'],
  },
  {
    id: 'ub-cablerow', name: 'Seated Cable Row', equipment: 'Cable Machine',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('8-10','6-8','6-8','10-12','6-8'),
    cues: ['Sit tall, chest up', 'Pull to lower sternum', 'Squeeze shoulder blades', 'Full stretch forward'],
  },
  {
    id: 'ub-arnoldpress', name: 'Arnold Press', equipment: 'Dumbbells',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Start palms facing you', 'Rotate as you press', 'Full lockout', 'Smooth rotation down'],
  },
  {
    id: 'ub-facepull', name: 'Face Pull', equipment: 'Cable + Rope',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('12-15','12-15','12-15','15','12-15'),
    cues: ['High cable attachment', 'Pull to ears', 'External rotate at end', 'Squeeze rear delts'],
  },
  {
    id: 'ub-triceppush', name: 'Tricep Pushdown', equipment: 'Cable Machine',
    group: 'main', sets: p('2','3','3','2','3'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Elbows pinned', 'Full extension', 'Squeeze at bottom', 'Controlled return'],
  },
  {
    id: 'ub-hammercurl', name: 'Hammer Curl', equipment: 'Dumbbells',
    group: 'main', sets: p('2','3','3','2','3'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Neutral grip', 'Elbows stationary', 'Full range of motion', 'Alternate or together'],
  },
  // Abs — Thu: hanging leg raise, Russian twist, plank
  {
    id: 'ub-hanglegraise', name: 'Hanging Leg Raise', equipment: 'Pull-up Bar',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('8-10','10-12','12-15','10','12-15'),
    cues: ['Dead hang start', 'Curl pelvis up', 'Control the descent', 'Avoid swinging'],
  },
  {
    id: 'ub-russiantwist', name: 'Russian Twist', equipment: 'Plate / Dumbbell',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('12/side','15/side','15/side','12/side','15/side'),
    cues: ['Lean back 45°', 'Feet off ground', 'Rotate from thoracic', 'Touch weight to floor each side'],
  },
  {
    id: 'ub-plank', name: 'Plank Hold', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('30s','45s','60s','30s','60s'),
    cues: ['Forearms under shoulders', 'Body straight line', 'Squeeze glutes', 'Breathe steadily'],
  },
];

// ── LOWER B + ABS (Friday) ──
export const lowerBExercises: Exercise[] = [
  {
    id: 'lb-trapbar', name: 'Trap Bar Deadlift', equipment: 'Trap Bar (or Dumbbells)',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('8','5-6','4-5','8-10','3-5'),
    cues: ['Step inside trap bar', 'Hips back, chest up', 'Drive through full foot', 'Lockout with glutes — more upright torso than conventional'],
  },
  {
    id: 'lb-rfess', name: 'Rear-Foot Elevated Split Squat', equipment: 'Bench (BW → light DB)',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('8/side','8/leg','8/leg','12/leg','6-8/leg'),
    cues: ['Rear foot on bench, laces down', 'Torso upright, core braced', 'Front knee tracks toe', 'Ph1: bodyweight only — groove the pattern'],
  },
  {
    id: 'lb-laterallunge', name: 'Lateral Lunge', equipment: 'Bodyweight (or light DB)',
    group: 'main', sets: p('3','0','0','0','0'), reps: p('10/side','—','—','—','—'),
    cues: ['Wide step to the side', 'Sit hips back on working leg', 'Keep trailing leg straight', 'Drives hip abductors — supports hip rehab'],
  },
  {
    id: 'lb-hipthrust', name: 'Barbell Hip Thrust', equipment: 'Barbell + Bench',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10-12','8-10','8-10','12','8-10'),
    cues: ['Upper back on bench', 'Feet flat, shins vertical', 'Squeeze glutes at top', 'Chin tucked'],
  },
  {
    id: 'lb-legext', name: 'Leg Extension', equipment: 'Machine',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Adjust pad above ankles', 'Full extension', 'Pause at top 2s', 'Slow negative'],
  },
  {
    id: 'lb-seatedcalf', name: 'Seated Calf Raise', equipment: 'Machine',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Full stretch at bottom', 'Pause at top', 'Knees at 90°', 'Even tempo'],
  },
  // Abs — Fri full block (5 exercises)
  {
    id: 'lb-crunch', name: 'Cable Crunch', equipment: 'Cable Machine',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('12-15','10-12','10-12','15','10-12'),
    cues: ['Kneel facing cable', 'Crunch ribs to hips', 'Hold peak', 'Exhale at bottom'],
  },
  {
    id: 'lb-leglifts', name: 'Lying Leg Lifts', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('10-12','12-15','15','10','15'),
    cues: ['Lower back pressed down', 'Legs straight', 'Slow lower to 6 inches', 'Exhale on lift'],
  },
  {
    id: 'lb-bicycle', name: 'Bicycle Crunch', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('12/side','15/side','20/side','12/side','20/side'),
    cues: ['Opposite elbow to knee', 'Full extension on straight leg', 'Rotate from thoracic', 'Controlled pace'],
  },
  {
    id: 'lb-woodchop', name: 'Cable Woodchop', equipment: 'Cable Machine',
    group: 'abs', sets: p('2','3','3','2','3'), reps: p('10/side','10/side','12/side','10/side','12/side'),
    cues: ['Rotate hips and torso', 'Arms stay extended', 'Control the return', 'Power from core'],
  },
  {
    id: 'lb-deadbug', name: 'Dead Bug', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('8/side','10/side','12/side','8/side','12/side'),
    cues: ['Lower back flat', 'Opposite arm and leg extend', 'Exhale as you extend', 'Slow and controlled'],
  },
];

// ── METABOLIC (Saturday) ──
export const metabolicExercises: Exercise[] = [
  {
    id: 'met-kbswing', name: 'Kettlebell Swing', equipment: 'Kettlebell',
    group: 'main', sets: p('3','4','4','2','4'), reps: p('15','15','20','12','20'),
    cues: ['Hinge at hips', 'Snap hips forward', 'Arms are pendulum', 'Breathe at top'],
  },
  {
    id: 'met-battlerop', name: 'Battle Rope Slams', equipment: 'Battle Ropes',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('20s','30s','30s','20s','30s'),
    cues: ['Full arm extension up', 'Slam with force', 'Slight squat', 'Keep breathing'],
  },
  {
    id: 'met-boxjump', name: 'Box Jump / Step-Up', equipment: 'Plyo Box',
    group: 'main', sets: p('3','3','3','2','3'), reps: p('8','10','10','8','12'),
    cues: ['Swing arms', 'Land softly', 'Step down, don\'t jump', 'Full hip extension at top'],
  },
  {
    id: 'met-medbslam', name: 'Med Ball Slam', equipment: 'Medicine Ball',
    group: 'main', sets: p('3','3','4','2','4'), reps: p('10','12','12','8','15'),
    cues: ['Reach overhead fully', 'Slam with full force', 'Squat to pick up', 'Explosive rhythm'],
  },
  {
    id: 'met-rowing', name: 'Rowing Intervals', equipment: 'Rower',
    group: 'main', sets: p('1','1','1','1','1'), reps: p('5×30s on/30s off','6×30s on/30s off','8×30s on/30s off','4×30s on/30s off','8×30s on/30s off'),
    cues: ['Max effort on work', 'Active recovery on rest', 'Drive with legs first', 'Rate 28-32 SPM'],
  },
  // Abs — Sat: mountain climbers + V-ups
  {
    id: 'met-mountainclimb', name: 'Mountain Climbers', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('20/side','25/side','30/side','15/side','30/side'),
    cues: ['High plank position', 'Drive knees to chest', 'Keep hips level', 'Fast but controlled'],
  },
  {
    id: 'met-vups', name: 'V-Ups', equipment: 'None',
    group: 'abs', sets: p('3','3','3','2','3'), reps: p('10','12','15','8','15'),
    cues: ['Arms and legs straight', 'Touch toes at top', 'Lower with control', 'Lower back stays safe'],
  },
];

// ── REST DAY (Sunday) ──
export const restDayExercises: Exercise[] = [
  {
    id: 'rest-walk', name: 'Active Recovery Walk', equipment: 'None',
    group: 'main', sets: p('1','1','1','1','1'), reps: p('20-30 min','30 min','30-40 min','20 min','30-40 min'),
    cues: ['Easy conversational pace', 'Light stretching after', 'Stay hydrated', 'Enjoy the rest day'],
  },
];

// Assemble all sessions
export const SESSIONS: Record<number, Exercise[]> = {
  0: upperAExercises,
  1: lowerAExercises,
  2: zone2Exercises,
  3: upperBExercises,
  4: lowerBExercises,
  5: metabolicExercises,
  6: restDayExercises,
};
