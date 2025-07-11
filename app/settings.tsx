import { triggerMediumHaptic } from '@/utils/haptics';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SFSymbol from 'sweet-sfsymbols';


const onPress = () => {
    triggerMediumHaptic();
    router.back();
}

const Settings = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.hozContainer}>
                <TouchableOpacity style={styles.capsule} onPress={onPress}>
                    <SFSymbol
                        name="chevron.backward"
                        size={17}
                    />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.header}>Settings</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 21,
        paddingTop: 14
    },
    hozContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
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
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
    }
})