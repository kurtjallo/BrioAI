import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session } from '@/types';
import {
  addSession as storeAddSession,
  calculateStreak,
  clearSessions as storeClearSessions,
  getSessions,
  replaceSessions,
} from '@/services/storage';
import { buildSampleSessions } from '@/data/sample-sessions';

interface SessionContextType {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addSession: (session: Session) => Promise<void>;
  getSessionById: (id: string) => Session | undefined;
  todaysSession: Session | undefined;
  streak: number;
  seedSampleData: () => Promise<void>;
  clearAllSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  sessions: [],
  loading: true,
  error: null,
  reload: async () => {},
  addSession: async () => {},
  getSessionById: () => undefined,
  todaysSession: undefined,
  streak: 0,
  seedSampleData: async () => {},
  clearAllSessions: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stored = await getSessions();
      setSessions(stored);
      setStreak(calculateStreak(stored));
    } catch {
      setError('Could not load your sessions from storage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addSession = useCallback(async (session: Session) => {
    await storeAddSession(session);
    setSessions(prev => {
      const next = [session, ...prev];
      setStreak(calculateStreak(next));
      return next;
    });
  }, []);

  const seedSampleData = useCallback(async () => {
    const sample = buildSampleSessions();
    await replaceSessions(sample);
    setSessions(sample);
    setStreak(calculateStreak(sample));
  }, []);

  const clearAllSessions = useCallback(async () => {
    await storeClearSessions();
    setSessions([]);
    setStreak(0);
  }, []);

  const getSessionById = useCallback(
    (id: string) => sessions.find(s => s.id === id),
    [sessions],
  );

  const today = new Date().toISOString().split('T')[0];
  const todaysSession = sessions.find(s => s.date.startsWith(today));

  return (
    <SessionContext.Provider
      value={{
        sessions,
        loading,
        error,
        reload,
        addSession,
        getSessionById,
        todaysSession,
        streak,
        seedSampleData,
        clearAllSessions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
