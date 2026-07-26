import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@cadence_onboarding_done';
const CONTEXT_KEY = '@cadence_context';
const NOTIFY_TIME_KEY = '@cadence_notification_time';

export type SpeakingContext = 'meetings' | 'presentations' | 'interviews' | 'everyday';

export async function isOnboardingDone(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function setOnboardingDone(done: boolean): Promise<void> {
  if (done) await AsyncStorage.setItem(ONBOARDING_KEY, '1');
  else await AsyncStorage.removeItem(ONBOARDING_KEY);
}

export async function getSpeakingContext(): Promise<SpeakingContext | null> {
  try {
    return (await AsyncStorage.getItem(CONTEXT_KEY)) as SpeakingContext | null;
  } catch {
    return null;
  }
}

export async function setSpeakingContext(ctx: SpeakingContext): Promise<void> {
  await AsyncStorage.setItem(CONTEXT_KEY, ctx);
}

/** Stored as "HH:MM" 24h. */
export async function getNotificationTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(NOTIFY_TIME_KEY);
  } catch {
    return null;
  }
}

export async function setNotificationTime(time: string): Promise<void> {
  await AsyncStorage.setItem(NOTIFY_TIME_KEY, time);
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}
