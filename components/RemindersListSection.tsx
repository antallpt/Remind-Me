import { FlatList, StyleSheet, Text, View } from "react-native";
import ReminderListItem from "./ReminderListItem";

export const RemindersListSection = ({ title, reminders, onDelete }: { title: string, reminders: any[], onDelete: (id: string) => void }) => (
    <View style={{ gap: 3 }}>
        <Text style={styles.title}>{title}</Text>
        <FlatList
            data={reminders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <ReminderListItem
                    {...item}
                    onDelete={() => onDelete(item.id)}
                />
            )}
            contentContainerStyle={{ marginRight: 13, marginTop: 10 }}
        />
    </View>
);

const styles = StyleSheet.create({
    title: {
        marginLeft: 21,
        fontWeight: '600',
        fontSize: 16
    }
})