import Dexie, { type EntityTable } from 'dexie';

export interface WorkoutLog {
  id?: number;
  date: string;        // YYYY-MM-DD
  week: number;
  day: number;         // 0=Mon..6=Sun
  exerciseId: string;
  sets: { reps: number; weight: number }[];
}

export interface WeeklyCheckin {
  id?: number;
  week: number;
  weight: number;
  waist: number;
  hip: number;
  thigh: number;
  protein: number;
  energy: number;      // 1-5
  hipPain: number;     // 0-10
  pr: string;
  notes: string;
}

export interface PFNote {
  id?: number;
  exerciseId: string;
  note: string;
  updatedAt: string;
}

export interface CompletedSession {
  id?: number;
  date: string;        // YYYY-MM-DD
  week: number;
  day: number;
}

const db = new Dexie('CaroRecompDB') as Dexie & {
  workoutLogs: EntityTable<WorkoutLog, 'id'>;
  weeklyCheckins: EntityTable<WeeklyCheckin, 'id'>;
  pfNotes: EntityTable<PFNote, 'id'>;
  completedSessions: EntityTable<CompletedSession, 'id'>;
};

db.version(1).stores({
  workoutLogs: '++id, date, week, day, exerciseId, [date+exerciseId]',
  weeklyCheckins: '++id, &week',
  pfNotes: '++id, &exerciseId',
  completedSessions: '++id, &date, week',
});

export { db };
