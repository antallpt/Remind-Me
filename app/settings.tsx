import AboutPage from '@/components/AboutPage';
import SettingsBar from '@/components/SettingsBar';
import { triggerMediumHaptic } from '@/utils/haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SFSymbol from 'sweet-sfsymbols';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 14
    },
    hozContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 37,
        paddingHorizontal: 21,
    },
    capsule: {
        width: 37,
        height: 49.72,
        backgroundColor: '#F5F5F5',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 4,
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)',
    },
    titleContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
    },
    subHeader: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subText: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
    },
    mainPage: {
        flex: 1,
        paddingHorizontal: 21,
    },
    subPageContent: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: 21,
    },
    animatedPage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
    }
});

const SETTINGS_PAGES = [
    { key: 'main', label: '', content: null },
    { key: 'appearance', label: 'Appearance', content: <Text style={styles.subText}>Appearance Settings</Text> },
    { key: 'notifications', label: 'Notifications', content: <Text style={styles.subText}>Notifications Settings</Text> },
    { key: 'restore', label: 'Restore Purchase', content: <Text style={styles.subText}>Restore Purchase</Text> },
    { key: 'privacy', label: 'Privacy', content: <Text style={styles.subText}>Privacy Settings</Text> },
    { key: 'about', content: <AboutPage /> },
];

const Settings = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const mainX = useRef(new Animated.Value(0)).current;
    const subX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
    // Remove mainOpacity and subOpacity
    const [subPageIdx, setSubPageIdx] = useState(1); // Track which subpage to show

    const slideToSubPage = (idx: number) => {
        setSubPageIdx(idx);
        Animated.parallel([
            Animated.timing(mainX, {
                toValue: -SCREEN_WIDTH,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(subX, {
                toValue: 0,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            // Remove opacity animations
        ]).start(() => setPageIndex(idx));
    };

    const slideToMain = () => {
        Animated.parallel([
            Animated.timing(mainX, {
                toValue: 0,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(subX, {
                toValue: SCREEN_WIDTH,
                duration: 320,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            // Remove opacity animations
        ]).start(() => setPageIndex(0));
    };

    const handleBarPress = (idx: number) => {
        triggerMediumHaptic();
        slideToSubPage(idx);
    };

    const handleHeaderBack = () => {
        triggerMediumHaptic();
        if (pageIndex === 0) {
            router.back();
        } else {
            slideToMain();
        }
    };

    // Main page content
    const mainContent = (
        <View style={styles.mainPage}>
            <SettingsBar iconName="star.fill" text="Get RemindMe Pro" color="#7B61FF" onPress={() => {/* handle upgrade */ }} emphasized />
            <SettingsBar iconName="eye.fill" text="Appearance" onPress={() => handleBarPress(1)} />
            <SettingsBar iconName="bell.fill" text="Notifications" onPress={() => handleBarPress(2)} />
            <SettingsBar iconName="cart.fill" text="Restore Purchase" onPress={() => handleBarPress(3)} />
            <SettingsBar iconName="lock.fill" text="Privacy" onPress={() => handleBarPress(4)} />
            <SettingsBar iconName="info.circle.fill" text="About" onPress={() => handleBarPress(5)} />
        </View>
    );

    // Subpage content
    const subPage = SETTINGS_PAGES[subPageIdx];
    const subContent = (
        <View style={styles.subPageContent}>
            {subPage.content}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed Header */}
            <View style={styles.hozContainer}>
                <TouchableOpacity style={styles.capsule} onPress={handleHeaderBack}>
                    <SFSymbol name="chevron.backward" size={17} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.header}>Settings</Text>
                </View>
            </View>
            {/* Slide Animation Content */}
            <View style={{ flex: 1, overflow: 'hidden' }}>
                <Animated.View
                    style={[
                        styles.animatedPage,
                        { transform: [{ translateX: mainX }] },
                        { zIndex: pageIndex === 0 ? 2 : 1 }
                    ]}
                    pointerEvents={pageIndex === 0 ? 'auto' : 'none'}
                >
                    {mainContent}
                </Animated.View>
                <Animated.View
                    style={[
                        styles.animatedPage,
                        { transform: [{ translateX: subX }] },
                        { zIndex: pageIndex === 0 ? 1 : 2 }
                    ]}
                    pointerEvents={pageIndex === 0 ? 'none' : 'auto'}
                >
                    {subContent}
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default Settings;