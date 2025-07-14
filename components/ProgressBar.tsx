import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type ProgressBarProps = {
    progress: number; // value between 0 and 1
};

export default function ProgressBar({ progress }: ProgressBarProps) {
    const animatedWidth = useRef(new Animated.Value(progress)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthInterpolate = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.background}>
            <Animated.View style={[styles.bar, { width: widthInterpolate }]} />
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