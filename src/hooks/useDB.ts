import { useLiveQuery } from 'dexie-react-hooks';
import { db, type WorkoutLog, type WeeklyCheckin, type PFNote, type CompletedSession } from '../db/database';

export function useWorkoutLogs(date?: string) {
  return useLiveQuery(
    () => date ? db.workoutLogs.where('date').equals(date).toArray() : db.workoutLogs.toArray(),
    [date]
  );
}

export function useWorkoutLogsByExercise(exerciseId: string) {
  return useLiveQuery(
    () => db.workoutLogs.where('exerciseId').equals(exerciseId).toArray(),
    [exerciseId]
  );
}

export function useAllWorkoutLogs() {
  return useLiveQuery(() => db.workoutLogs.toArray());
}

export function useWeeklyCheckins() {
  return useLiveQuery(() => db.weeklyCheckins.orderBy('week').toArray());
}

export function useCheckinForWeek(week: number) {
  return useLiveQuery(() => db.weeklyCheckins.where('week').equals(week).first(), [week]);
}

export function usePFNote(exerciseId: string) {
  return useLiveQuery(() => db.pfNotes.where('exerciseId').equals(exerciseId).first(), [exerciseId]);
}

export function useCompletedSessions() {
  return useLiveQuery(() => db.completedSessions.toArray());
}

export function useCompletedSession(date: string) {
  return useLiveQuery(() => db.completedSessions.where('date').equals(date).first(), [date]);
}

export async function saveWorkoutLog(log: Omit<WorkoutLog, 'id'>) {
  const existing = await db.workoutLogs.where('[date+exerciseId]').equals([log.date, log.exerciseId]).first();
  if (existing?.id) {
    await db.workoutLogs.update(existing.id, log);
  } else {
    await db.workoutLogs.add(log);
  }
}

export async function saveWeeklyCheckin(checkin: Omit<WeeklyCheckin, 'id'>) {
  const existing = await db.weeklyCheckins.where('week').equals(checkin.week).first();
  if (existing?.id) {
    await db.weeklyCheckins.update(existing.id, checkin);
  } else {
    await db.weeklyCheckins.add(checkin);
  }
}

export async function savePFNote(note: Omit<PFNote, 'id'>) {
  const existing = await db.pfNotes.where('exerciseId').equals(note.exerciseId).first();
  if (existing?.id) {
    await db.pfNotes.update(existing.id, note);
  } else {
    await db.pfNotes.add(note);
  }
}

export async function markSessionComplete(session: Omit<CompletedSession, 'id'>) {
  const existing = await db.completedSessions.where('date').equals(session.date).first();
  if (!existing) {
    await db.completedSessions.add(session);
  }
}
