import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import DailyProgress from './DailyProgress';
import { RemindersListSection } from './RemindersListSection';

const initialReminders = [
    { id: '1', title: 'Drink Water' },
    { id: '2', title: 'Drink Water' },
    { id: '3', title: 'Drink Water' },
    { id: '4', title: 'Drink Water' }
    // ...more reminders
];

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}



const TodayPage = () => {
    const [reminders, setReminders] = useState(initialReminders);

    const handleDelete = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setReminders(reminders => reminders.filter(r => r.id !== id));
    };

    return (
        <View style={styles.container}>
            <DailyProgress />
            <RemindersListSection
                title="Today's Reminders"
                reminders={reminders}
                onDelete={handleDelete}
            />
        </View>
    )
}

export default TodayPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 31
    },

})