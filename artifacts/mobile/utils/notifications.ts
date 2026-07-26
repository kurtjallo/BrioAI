import { Platform } from 'react-native';

const REMINDER_ID_KEY = 'daily-reminder';

/**
 * Schedule (or reschedule) the repeating daily reminder at "HH:MM" 24h.
 * No-op on web. Returns true if a notification was scheduled.
 */
export async function scheduleDailyReminder(time: string): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const Notifications = await import('expo-notifications');

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') {
        await cancelDailyReminder();
        return false;
      }
    }

    const [hour, minute] = time.split(':').map(Number);
    if (!Number.isInteger(hour) || !Number.isInteger(minute)) return false;

    // Replace any existing reminder before scheduling the new one.
    await cancelDailyReminder();

    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID_KEY,
      content: {
        title: 'Time for your daily take',
        body: 'One 60-second take. Say it with intent.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return true;
  } catch {
    // Notifications unavailable (e.g. Expo Go limitations) — fail quietly.
    return false;
  }
}

/** Cancel the daily reminder if one is scheduled. No-op on web. */
export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID_KEY);
  } catch {
    // Nothing scheduled or notifications unavailable.
  }
}
