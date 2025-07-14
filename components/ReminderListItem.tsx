import { triggerMediumHaptic } from '@/utils/haptics';
import { Reminder } from '@/utils/reminderStorage';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Animated as RNAnimated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import SFSymbol from 'sweet-sfsymbols';
import ProgressBar from './ProgressBar';

interface ReminderListItemProps extends Omit<Reminder, 'id'> {
    id: string;
    onDelete: () => void;
    onEdit?: () => void;
    openSignal?: string | null;
    onSwipeOpen?: () => void;
    completedCount?: number;
    onComplete?: (id: string) => void;
    onDecrement?: (id: string) => void; // NEW
    onRequestCloseSwipeable?: (id: string) => void;
}

function formatTimeSpan(start: string, end: string) {
    const s = new Date(start);
    const e = new Date(end);
    const format = (d: Date) => {
        let h = d.getHours();
        const m = d.getMinutes();
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        const mins = m < 10 ? `0${m}` : m;
        return `${h}:${mins} ${ampm}`;
    };
    return `${format(s)} - ${format(e)}`;
}

const ReminderListItem = forwardRef<any, ReminderListItemProps>(({ id, icon, title, frequency, startTime, endTime, onDelete, onEdit, openSignal, onSwipeOpen, completedCount = 0, onComplete, onDecrement, onRequestCloseSwipeable }, ref) => {
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const height = useSharedValue(90);
    const margin = useSharedValue(7);
    const swipeableRef = useRef<Swipeable>(null);
    const [circleAnim] = useState(new RNAnimated.Value(0));

    useEffect(() => {
        if (openSignal && openSignal !== id) {
            swipeableRef.current?.close();
        }
    }, [openSignal, id]);

    useImperativeHandle(ref, () => ({
        close: () => swipeableRef.current?.close(),
    }));

    // Set initial value on mount and id change
    useEffect(() => {
        circleAnim.setValue(completedCount >= frequency ? 1 : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const prevCompletedCount = useRef(completedCount);
    useEffect(() => {
        if (completedCount > prevCompletedCount.current) {
            // Animate to filled (and leave filled if at max)
            const isFinal = completedCount === frequency;
            animateCircle(!isFinal);
        } else if (completedCount < prevCompletedCount.current) {
            // Animate on decrement as well
            animateCircle(true);
        }
        prevCompletedCount.current = completedCount;
    }, [completedCount, frequency]);

    const handleDelete = () => {
        triggerMediumHaptic();
        opacity.value = withTiming(0, { duration: 250, easing: Easing.inOut(Easing.ease) });
        scale.value = withTiming(0.8, { duration: 250, easing: Easing.inOut(Easing.ease) });
        height.value = withTiming(0, { duration: 250, easing: Easing.inOut(Easing.ease) }, (finished) => {
            if (finished) {
                runOnJS(onDelete)();
            }
        });
        margin.value = withTiming(0, { duration: 250, easing: Easing.inOut(Easing.ease) });
    };

    // Animate the circle when completed
    const animateCircle = (shouldReset: boolean) => {
        circleAnim.setValue(0);
        RNAnimated.timing(circleAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start(() => {
            if (shouldReset) {
                setTimeout(() => {
                    RNAnimated.timing(circleAnim, {
                        toValue: 0,
                        duration: 350,
                        useNativeDriver: true,
                    }).start();
                }, 400);
            }
        });
    };

    const handleComplete = () => {
        // Always dismiss open swipeables if another is open
        if (openSignal && openSignal !== id) {
            if (onRequestCloseSwipeable) onRequestCloseSwipeable(id);
        }
        // Animate/increment if not complete
        if (completedCount < frequency && onComplete) {
            onComplete(id);
            triggerMediumHaptic();
        }
    };

    // NEW: handle decrement
    const handleDecrement = () => {
        if (completedCount > 0 && typeof onDecrement === 'function') {
            // If currently completed, reset completed state immediately for UI
            if (completedCount === frequency) {
                // Reset dot and gray-out immediately
                circleAnim.setValue(0);
            }
            onDecrement(id);
            animateCircle(true); // animate dot (reset)
            triggerMediumHaptic();
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        height: height.value,
        marginVertical: margin.value,
    }));

    const circleScale = circleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.4, 1],
    });
    const circleColor = circleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ECEDEE', '#000'],
    });

    const isCompleted = completedCount >= frequency;

    const renderRightActions = () => (
        <Animated.View
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 90,
                },
                animatedStyle,
            ]}
        >
            <TouchableOpacity style={styles.decrementCard} onPress={handleDecrement} disabled={completedCount === 0}>
                <SFSymbol name='minus' size={20} colors={['#000']} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionsCard} onPress={onEdit}>
                <SFSymbol name='ellipsis' size={20} colors={['#fff']} />
            </TouchableOpacity>
            {/* NEW: Decrement card */}
            <TouchableOpacity style={styles.deleteCard} onPress={handleDelete}>
                <SFSymbol name='trash' size={20} colors={['#fff']} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <Swipeable
            ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={() => { triggerMediumHaptic(); if (onSwipeOpen) onSwipeOpen(); }}
            onSwipeableWillClose={triggerMediumHaptic}>
            <Animated.View style={[styles.container, animatedStyle, isCompleted && styles.completedContainer]}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleComplete} style={{ flex: 1 }} disabled={isCompleted}>
                    <View style={styles.subContainer}>
                        <View style={styles.headerContainer}>
                            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
                                <View style={styles.iconContainer}>
                                    <SFSymbol name={icon as any} size={18} colors={isCompleted ? ['#B4B4B9'] : undefined} />
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
                                    <Text style={[styles.subtitle, isCompleted && styles.completedText]}>{frequency} times a day • {formatTimeSpan(startTime, endTime)}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center', minWidth: 64, justifyContent: 'flex-end' }}>
                                <RNAnimated.View style={[styles.circle, { transform: [{ scale: circleScale }], backgroundColor: circleColor }]} />
                                <Text style={[styles.counterText, isCompleted && styles.completedText, { width: 32, textAlign: 'right', marginLeft: 2 }]}>{`${completedCount}/${frequency}`}</Text>
                            </View>
                        </View>
                        <ProgressBar progress={frequency > 0 ? completedCount / frequency : 0} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Swipeable>
    );
});

export default ReminderListItem;

const styles = StyleSheet.create({
    container: {
        marginLeft: 21,
        marginRight: 8,
        // marginVertical: 7, // Now animated
        height: 90,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        // border
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)', // #D6D6D6 at 50% opacity
    },
    subContainer: {
        marginHorizontal: 16,
        paddingVertical: 12.73,
        flexDirection: 'column',
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontWeight: '600',
        fontSize: 16
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 12,
        color: '#D6D6D6'
    },
    iconContainer: {
        width: 29,
        height: 29,
        borderRadius: 29 / 2,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    counterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#747474'
    },
    circle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderColor: '#ECEDEE'
    },
    deleteCard: {
        marginRight: 8,
        height: 90,
        width: 52,
        backgroundColor: '#FF0000',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionsCard: {
        marginRight: 8,
        height: 90,
        width: 52,
        backgroundColor: '#000',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    decrementCard: {
        marginRight: 8,
        height: 90,
        width: 52,
        backgroundColor: '#ECEDEE',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedContainer: {
        opacity: 0.5,
    },
    completedText: {
        color: '#B4B4B9',
    },
})