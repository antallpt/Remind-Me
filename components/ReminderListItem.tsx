import { triggerMediumHaptic } from '@/utils/haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import SFSymbol from 'sweet-sfsymbols';
import ProgressBar from './ProgressBar';

interface ReminderListItemProps {
    id: string;
    title: string;
    onDelete: () => void;
}

const ReminderListItem = ({ id, title, onDelete }: ReminderListItemProps) => {
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);
    const height = useSharedValue(90); // Only the card height
    const margin = useSharedValue(7); // Animate marginVertical

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

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
        height: height.value,
        marginVertical: margin.value,
        // overflow: 'hidden', // Remove this line to keep shadow
    }));

    const renderRightActions = () => (
        <Animated.View
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 90, // Remove fixed height
                },
                animatedStyle, // Animate height for pills too
            ]}
        >
            <TouchableOpacity style={styles.optionsCard}>
                <SFSymbol name='ellipsis' size={20} colors={['#000']} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteCard} onPress={handleDelete}>
                <SFSymbol name='trash' size={20} colors={['#fff']} />
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={triggerMediumHaptic}
            onSwipeableWillClose={triggerMediumHaptic}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <View style={styles.subContainer}>
                    <View style={styles.headerContainer}>
                        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}>
                            <View style={styles.iconContainer}>
                                <SFSymbol name='drop.fill' size={12} />
                            </View>
                            <View style={styles.titleContainer}>
                                <Text style={styles.title}>{title}</Text>
                                <Text style={styles.subtitle}>3 times a day • 8AM - 8PM</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 9, alignItems: 'center' }}>
                            <Text style={styles.counterText}>3/8</Text>
                            <View style={styles.circle} />
                        </View>
                    </View>
                    <ProgressBar progress={3 / 8} />
                </View>
            </Animated.View>
        </Swipeable>
    );
};

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
        borderWidth: 1,
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
        backgroundColor: '#ECEDEE',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})