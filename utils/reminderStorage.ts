import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reminder {
    id: string;
    icon: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    repeat: string;
    frequency: number;
    completedCount?: number; // new property
    createdAt: number; // timestamp for sorting
    lastReset?: string; // ISO date string for repeat logic
}

const REMINDERS_KEY = 'REMINDERS_LIST';

export async function saveReminders(reminders: Reminder[]): Promise<void> {
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export async function loadReminders(): Promise<Reminder[]> {
    const data = await AsyncStorage.getItem(REMINDERS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export async function addReminder(reminder: Reminder): Promise<void> {
    const reminders = await loadReminders();
    reminders.push(reminder);
    await saveReminders(reminders);
}

export async function removeReminder(id: string): Promise<void> {
    const reminders = await loadReminders();
    const filtered = reminders.filter(r => r.id !== id);
    await saveReminders(filtered);
}

export async function updateReminder(id: string, update: Partial<Reminder>): Promise<void> {
    const reminders = await loadReminders();
    const updated = reminders.map(r => r.id === id ? { ...r, ...update } : r);
    await saveReminders(updated);
} 