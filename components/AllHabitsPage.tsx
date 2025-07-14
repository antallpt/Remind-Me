import { Reminder } from '@/utils/reminderStorage';
import React from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { RemindersListSection } from './RemindersListSection';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AllHabitsPageProps {
    reminders: Reminder[];
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
    openSignal: string | null;
    setOpenSignal: (v: string | null) => void;
    onEditReminder?: (reminder: Reminder) => void;
    onCompleteReminder: (id: string) => void;
}

const AllHabitsPage = ({ reminders, setReminders, openSignal, setOpenSignal, onEditReminder, onCompleteReminder }: AllHabitsPageProps) => {
    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReminders(reminders => reminders.filter(r => r.id !== id));
    };

    // Sort: incomplete first (by createdAt desc), then completed (by createdAt desc)
    const incomplete = reminders.filter(r => (r.completedCount || 0) < r.frequency).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const completedReminders = reminders.filter(r => (r.completedCount || 0) >= r.frequency).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const sortedReminders = [...incomplete, ...completedReminders];

    return (
        <View style={{ flex: 1, marginTop: 11 }}>
            <RemindersListSection
                title="All Reminders"
                reminders={sortedReminders}
                onDelete={handleDelete}
                openSignal={openSignal}
                setOpenSignal={setOpenSignal}
                onEditReminder={onEditReminder}
                onCompleteReminder={onCompleteReminder}
            />
        </View>
    )
};

export default AllHabitsPage;

const styles = StyleSheet.create({})