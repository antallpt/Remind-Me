import { triggerMediumHaptic } from '@/utils/haptics';
import React, { useRef } from 'react';
import { Alert, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import SFSymbol from 'sweet-sfsymbols';
import ProgressBar from './ProgressBar';

interface ReminderListItemProps {
    id: string;
    title: string;
    onDelete: () => void;
}

const ReminderListItem = ({ id, title, onDelete }: ReminderListItemProps) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const swipeableRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            'Delete Reminder?',
            "This reminder will be deleted immediately. You can't undo this action.",
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        triggerMediumHaptic();
                        Animated.parallel([
                            Animated.timing(translateX, {
                                toValue: -300, // slide far left
                                duration: 250,
                                useNativeDriver: true,
                            }),
                            Animated.timing(opacity, {
                                toValue: 0,
                                duration: 250,
                                useNativeDriver: true,
                            }),
                        ]).start(() => {
                            onDelete && onDelete();
                        });
                    },
                },
            ]
        );
    };

    const renderRightActions = () => (
        <Animated.View
            style={{
                flexDirection: 'row',
                opacity,
                transform: [{ translateX }],
            }}
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
        <Swipeable ref={swipeableRef}
            renderRightActions={renderRightActions}
            onSwipeableWillOpen={triggerMediumHaptic}
            onSwipeableWillClose={triggerMediumHaptic}>
            <Animated.View
                style={{
                    transform: [{ translateX }],
                    opacity,
                }}
            >
                <View style={styles.container}>
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
        marginVertical: 14,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 4,
        // border
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)', // #D6D6D6 at 50% opacity
    },
    subContainer: {
        height: '100%',
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
        fontSize: 14
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 10,
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
        fontSize: 12,
        fontWeight: '600',
        color: '#747474'
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ECEDEE'
    },
    deleteCard: {
        marginTop: 14,
        marginRight: 8,
        height: 80,
        width: 52,
        backgroundColor: '#FF0000',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionsCard: {
        marginTop: 14,
        marginRight: 8,
        height: 80,
        width: 52,
        backgroundColor: '#ECEDEE',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})