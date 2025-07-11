import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import DailyProgress from './DailyProgress';
import ReminderListItem from './ReminderListItem';

const initialReminders = [
    { id: '1', title: 'Drink Water' }
    // ...more reminders
];

const TodayPage = () => {
    const [reminders, setReminders] = useState(initialReminders);

    const handleDelete = (id: string) => {
        setReminders(reminders => reminders.filter(r => r.id !== id));
    };

    return (
        <View style={styles.container}>
            <DailyProgress />
            <View style={{ gap: 3 }}>
                <Text style={styles.title}>Today's Reminders</Text>
                <FlatList
                    data={reminders}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ReminderListItem
                            {...item}
                            onDelete={() => handleDelete(item.id)}
                        />
                    )}
                    contentContainerStyle={{ gap: 0, marginRight: 13 }}
                />
            </View>
        </View>
    )
}

export default TodayPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 31
    },
    title: {
        marginLeft: 21,
        fontWeight: '600',
        fontSize: 14
    },
})