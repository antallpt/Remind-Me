import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import { RemindersListSection } from './RemindersListSection';

const initialReminders = [
    { id: '1', title: 'Drink Water' },
    { id: '2', title: 'Drink Water' },
    { id: '3', title: 'Drink Water' },
    { id: '4', title: 'Drink Water' }
    // ...more reminders
];

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AllHabitsPage = () => {
    const [reminders, setReminders] = useState(initialReminders);

    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReminders(reminders => reminders.filter(r => r.id !== id));
    };

    return (
        <View style={{ flex: 1, marginTop: 11 }}>
            <RemindersListSection
                title="All Reminders"
                reminders={reminders}
                onDelete={handleDelete}
            />
        </View>
    )
}

export default AllHabitsPage

const styles = StyleSheet.create({})