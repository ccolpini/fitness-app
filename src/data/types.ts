export type Phase = 'ph1' | 'ph2' | 'ph3' | 'deload' | 'ph4';

export interface PhaseReps {
  ph1: string;
  ph2: string;
  ph3: string;
  deload: string;
  ph4: string;
}

export interface Exercise {
  id: string;
  name: string;
  equipment?: string;
  cues: string[];
  sets: PhaseReps;
  reps: PhaseReps;
  group: 'main' | 'abs' | 'hip' | 'pf';
}

export interface Session {
  id: string;
  name: string;
  dayIndex: number; // 0=Mon, 6=Sun
  exercises: Exercise[];
}

export interface PFExercise {
  id: string;
  name: string;
  protocol: 'A' | 'B' | 'daily';
  sets: PhaseReps;
  reps: PhaseReps;
  cues: string[];
}

export interface HipExercise {
  id: string;
  name: string;
  circuit: 'A' | 'B' | 'mobility';
  sets: PhaseReps;
  reps: PhaseReps;
  cues: string[];
  equipment?: string;
}

export interface NutritionPlan {
  trainingDay: MacroSet;
  restDay: MacroSet;
  dietBreak: MacroSet;
  deload: MacroSet;
}

export interface MacroSet {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meals: Meal[];
}

export interface Meal {
  time: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  foods: string[];
}

export const PHASE_CONFIG: Record<number, { phase: Phase; label: string; color: string }> = {
  1: { phase: 'ph1', label: 'Phase 1 — Foundation', color: '#FFB800' },
  2: { phase: 'ph1', label: 'Phase 1 — Foundation', color: '#FFB800' },
  3: { phase: 'ph1', label: 'Phase 1 — Foundation', color: '#FFB800' },
  4: { phase: 'ph2', label: 'Phase 2 — Build', color: '#00D4FF' },
  5: { phase: 'ph2', label: 'Phase 2 — Build', color: '#00D4FF' },
  6: { phase: 'ph2', label: 'Phase 2 — Build', color: '#00D4FF' },
  7: { phase: 'ph3', label: 'Phase 3 — Intensify', color: '#FF2D78' },
  8: { phase: 'ph3', label: 'Phase 3 — Intensify', color: '#FF2D78' },
  9: { phase: 'deload', label: 'Deload Week', color: '#A855F7' },
  10: { phase: 'ph4', label: 'Phase 4 — Peak', color: '#FFFFFF' },
  11: { phase: 'ph4', label: 'Phase 4 — Peak', color: '#FFFFFF' },
  12: { phase: 'ph4', label: 'Phase 4 — Peak', color: '#FFFFFF' },
};

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const SESSION_NAMES: Record<number, string> = {
  0: 'Upper A',
  1: 'Lower A',
  2: 'Zone 2 + Hip Mobility',
  3: 'Upper B',
  4: 'Lower B + Abs',
  5: 'Metabolic',
  6: 'Rest + Walk',
};

export function getPhaseForWeek(week: number): Phase {
  return PHASE_CONFIG[week]?.phase ?? 'ph1';
}
