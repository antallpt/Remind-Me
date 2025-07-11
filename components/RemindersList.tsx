// components/RemindersList.tsx
import React from 'react';
import { Text, View } from 'react-native';

type RemindersListProps = {
    type: 'today' | 'all';
};

export default function RemindersList({ type }: RemindersListProps) {
    // For now, just show which list it is
    return (
        <View>
            <Text>{type === 'today' ? 'Today\'s Reminders' : 'All Reminders'}</Text>
            {/* Later: map over your reminders and display them here */}
        </View>
    );
}