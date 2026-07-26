import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, WordEntry } from '@/types';

const SESSIONS_KEY = '@cadence_sessions';
const WORDS_KEY = '@cadence_words';

export async function getSessions(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Session[];
}

export async function replaceSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function clearSessions(): Promise<void> {
  await AsyncStorage.removeItem(SESSIONS_KEY);
}

export async function addSession(session: Session): Promise<void> {
  const sessions = await getSessions();
  sessions.unshift(session);
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function getSession(id: string): Promise<Session | null> {
  const sessions = await getSessions();
  return sessions.find(s => s.id === id) ?? null;
}

export async function getWords(): Promise<WordEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(WORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WordEntry[];
  } catch {
    return [];
  }
}

export async function saveWords(words: WordEntry[]): Promise<void> {
  await AsyncStorage.setItem(WORDS_KEY, JSON.stringify(words));
}

export function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasSession = sessions.some(s => s.date.startsWith(dateStr));
    if (hasSession) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow today to not have a session yet without breaking streak
      if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}
