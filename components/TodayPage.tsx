import { getTodayDateString } from '@/utils/date';
import { Reminder } from '@/utils/reminderStorage';
import React, { useEffect } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import DailyProgress from './DailyProgress';
import { RemindersListSection } from './RemindersListSection';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TodayPageProps {
    reminders: Reminder[];
    setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
    onEditReminder: (reminder: Reminder) => void;
    openSignal: string | null;
    setOpenSignal: (v: string | null) => void;
    onCompleteReminder: (id: string) => void;
}

const TodayPage = ({ reminders, setReminders, onEditReminder, openSignal, setOpenSignal, onCompleteReminder }: TodayPageProps) => {
    const today = getTodayDateString();
    // Show reminders for today if:
    // - repeat is No repeat and date === today
    // - repeat is Daily and lastReset is today
    // - repeat is Weekly and lastReset is this week's start
    // - repeat is Monthly and lastReset is this month's start
    const getPeriodStart = (date: Date, repeat: string): string => {
        if (repeat === 'Daily') {
            return date.toISOString().slice(0, 10);
        } else if (repeat === 'Weekly') {
            const d = new Date(date);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            d.setDate(diff);
            return d.toISOString().slice(0, 10);
        } else if (repeat === 'Monthly') {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        }
        return '';
    };
    const now = new Date();
    const todayPeriodDaily = getPeriodStart(now, 'Daily');
    const todayPeriodWeekly = getPeriodStart(now, 'Weekly');
    const todayPeriodMonthly = getPeriodStart(now, 'Monthly');
    const filteredReminders = reminders.filter(r => {
        const startDate = new Date(r.date);
        const todayDate = new Date(today);
        if (todayDate < startDate) return false; // Don't show before start date
        if (!r.repeat || r.repeat === 'No repeat') {
            return r.date === today;
        }
        if (r.repeat === 'Daily') {
            return r.lastReset === todayPeriodDaily && todayDate >= startDate;
        }
        if (r.repeat === 'Weekly') {
            // Show only if (today - startDate) is a multiple of 7 days
            const diffDays = Math.floor((todayDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            return r.lastReset === todayPeriodWeekly && diffDays % 7 === 0 && diffDays >= 0;
        }
        if (r.repeat === 'Monthly') {
            // Show only if day of month matches start date and today >= start date
            return todayDate.getDate() === startDate.getDate() && todayDate >= startDate;
        }
        return false;
    });

    // Sort: incomplete first (by createdAt desc), then completed (by createdAt desc)
    const incomplete = filteredReminders.filter(r => (r.completedCount || 0) < r.frequency).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const completedReminders = filteredReminders.filter(r => (r.completedCount || 0) >= r.frequency).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const sortedReminders = [...incomplete, ...completedReminders];

    // Calculate daily progress values
    const total = filteredReminders.reduce((sum, r) => sum + (r.frequency || 0), 0);
    const completed = filteredReminders.reduce((sum, r) => sum + (r.completedCount || 0), 0);
    const remaining = total - completed;

    useEffect(() => {
        return () => {
            setOpenSignal(null);
        };
    }, []);

    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReminders(reminders => reminders.filter(r => r.id !== id));
    };

    return (
        <View style={styles.container}>
            <DailyProgress total={total} completed={completed} remaining={remaining} />
            <RemindersListSection
                title="Today's Reminders"
                reminders={sortedReminders}
                onDelete={handleDelete}
                onEditReminder={onEditReminder}
                openSignal={openSignal}
                setOpenSignal={setOpenSignal}
                onCompleteReminder={(id) => {
                    LayoutAnimation.configureNext({
                        duration: 400,
                        update: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.opacity,
                        },
                        create: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.scaleY,
                        },
                        delete: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.scaleY,
                        },
                    });
                    onCompleteReminder(id);
                }}
                onDecrementReminder={(id) => {
                    LayoutAnimation.configureNext({
                        duration: 400,
                        update: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.opacity,
                        },
                        create: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.scaleY,
                        },
                        delete: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.scaleY,
                        },
                    });
                    setReminders(reminders => reminders.map(r => {
                        if (r.id === id) {
                            const next = Math.max((r.completedCount || 0) - 1, 0);
                            return { ...r, completedCount: next };
                        }
                        return r;
                    }));
                }}
            />
        </View>
    )
};

export default TodayPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});