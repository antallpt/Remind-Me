import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

type TabsProps = {
    activeTab: number;
    onTabChange: (index: number) => void;
    scrollX: Animated.Value;
    screenWidth: number;
};

export default function Tabs({ activeTab, onTabChange, scrollX, screenWidth }: TabsProps) {
    // Interpolate color for each tab
    const todayColor = scrollX.interpolate({
        inputRange: [0, screenWidth],
        outputRange: ['#000', '#D6D6D6'],
        extrapolate: 'clamp',
    });
    const allHabitsColor = scrollX.interpolate({
        inputRange: [0, screenWidth],
        outputRange: ['#D6D6D6', '#000'],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                onPress={() => onTabChange(0)}
                style={{ paddingRight: 12, paddingLeft: 21 }}
            >
                <Animated.Text style={[styles.tabText, { color: todayColor }]}>Today</Animated.Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onTabChange(1)}
            >
                <Animated.Text style={[styles.tabText, { color: allHabitsColor }]}>All Habits</Animated.Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
    },
    tabText: {
        color: '#D6D6D6',
        fontWeight: '700',
        fontSize: 18,
        paddingTop: 31,
        paddingBottom: 20

    }
});