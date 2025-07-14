import React from "react";
import { ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, { Layout } from 'react-native-reanimated';
import ReminderListItem from "./ReminderListItem";

interface RemindersListSectionProps {
    title: string;
    reminders: any[];
    onDelete: (id: string) => void;
    onEditReminder?: (reminder: any) => void;
    openSignal: string | null;
    setOpenSignal: (v: string | null) => void;
    onCompleteReminder?: (id: string) => void;
    onDecrementReminder?: (id: string) => void;
}

export const RemindersListSection = ({ title, reminders, onDelete, onEditReminder, openSignal, setOpenSignal, onCompleteReminder, onDecrementReminder }: RemindersListSectionProps) => {
    const handleEdit = (reminder: any) => {
        setOpenSignal(Date.now().toString()); // unique value to trigger effect
        if (onEditReminder) onEditReminder(reminder);
    };

    const handleSwipeOpen = (id: string) => {
        setOpenSignal(id);
    };

    // Close all reminders on scroll
    const handleScroll = () => {
        if (openSignal) {
            setOpenSignal(null);
        }
    };

    // Close all reminders on tap anywhere
    const handleScreenTap = () => {
        if (openSignal) {
            setOpenSignal(null);
        }
    };

    // Always allow tap: close swipeable if open, and increment if not complete
    const handleComplete = (id: string, completedCount: number, frequency: number) => {
        if (openSignal) {
            setOpenSignal(null); // Close the open swipeable
        }
        if (completedCount < frequency && onCompleteReminder) {
            onCompleteReminder(id);
        }
    };

    const handleRequestCloseSwipeable = () => {
        setOpenSignal(Date.now().toString());
    };

    return (
        <TouchableWithoutFeedback onPress={handleScreenTap} accessible={false}>
            <View style={{ flex: 1, gap: 10 }}>
                <Text style={styles.title}>{title}</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ marginRight: 13, paddingBottom: 55 }}
                    style={{ flex: 1 }}
                    onScroll={handleScroll}
                >
                    {reminders.map(item => (
                        <Animated.View key={item.id} layout={Layout.duration(250)}>
                            <ReminderListItem
                                {...item}
                                onDelete={() => onDelete(item.id)}
                                onEdit={onEditReminder ? () => handleEdit(item) : undefined}
                                openSignal={openSignal}
                                onSwipeOpen={() => handleSwipeOpen(item.id)}
                                completedCount={item.completedCount || 0}
                                onComplete={() => handleComplete(item.id, item.completedCount || 0, item.frequency)}
                                onDecrement={onDecrementReminder ? () => onDecrementReminder(item.id) : undefined}
                                onRequestCloseSwipeable={handleRequestCloseSwipeable}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    title: {
        marginLeft: 21,
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    }
});