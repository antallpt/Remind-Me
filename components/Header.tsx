import { triggerMediumHaptic } from '@/utils/haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SFSymbol from 'sweet-sfsymbols';

function getFormattedDate(date: Date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

const onPress = () => {
    triggerMediumHaptic();
    router.push('/settings')
}

export default function Header() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // Calculate ms until next midnight
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0, 0
        );
        const msUntilMidnight = nextMidnight.getTime() - now.getTime();

        const timeout = setTimeout(() => {
            setNow(new Date());
        }, msUntilMidnight + 1000); // +1s buffer

        return () => clearTimeout(timeout);
    }, [now]);

    return (
        <View style={styles.container}>
            <View style={styles.hozContainer}>
                <View style={styles.vertContainer}>
                    <Text style={styles.headerText}>Reminders</Text>
                    <Text style={styles.subTitleText}>{getFormattedDate(now)}</Text>
                </View>
                <TouchableOpacity style={styles.capsule} onPress={onPress}>
                    <SFSymbol
                        name="person"
                        size={17}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 21,
    },
    hozContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    vertContainer: {
        flexDirection: 'column',
        gap: 3,
    },
    headerText: {
        fontWeight: '600',
        fontSize: 28,
    },
    subTitleText: {
        fontWeight: '500',
        color: '#747474'
    },
    capsule: {
        width: 37,
        height: 49.72,
        backgroundColor: '#F5F5F5',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 4,
        // border
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)', // #D6D6D6 at 50% opacity
    }
})