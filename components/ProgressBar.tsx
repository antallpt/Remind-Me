import React from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
    progress: number; // value between 0 and 1
};

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <View style={styles.background}>
            <View style={[styles.bar, { width: `${progress * 100}%` }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        height: 6,
        backgroundColor: '#ECEDEE',
        borderRadius: 3, // half of height for full rounding
        overflow: 'hidden',
    },
    bar: {
        height: 6,
        backgroundColor: '#000',
        borderRadius: 3,
    },
});