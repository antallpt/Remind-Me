import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SFSymbol from 'sweet-sfsymbols';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PICKER_SHEET_HEIGHT = SCREEN_HEIGHT * 0.35;

type PickerType = 'repeat' | 'frequency' | 'icon' | null;

interface CustomAnimatedPickerSheetProps {
    pickerType: PickerType;
    setPickerType: (type: PickerType) => void;
    repeat: string;
    setRepeat: (val: string) => void;
    frequency: number;
    setFrequency: (val: number) => void;
    icon: string;
    setIcon: (val: string) => void;
    iconOptions: string[];
}

const CustomAnimatedPickerSheet: React.FC<CustomAnimatedPickerSheetProps> = ({
    pickerType,
    setPickerType,
    repeat,
    setRepeat,
    frequency,
    setFrequency,
    icon,
    setIcon,
    iconOptions,
}) => {
    const [pickerVisible, setPickerVisible] = useState(false);
    const pickerAnim = useRef(new Animated.Value(0)).current;
    const pickerPanY = useRef(new Animated.Value(0)).current;
    const pickerBackdropAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (pickerType) {
            setPickerVisible(true);
            Animated.parallel([
                Animated.timing(pickerAnim, { toValue: 1, duration: 260, useNativeDriver: true }),
                Animated.timing(pickerBackdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
            ]).start();
        } else if (pickerVisible) {
            Animated.parallel([
                Animated.timing(pickerAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                Animated.timing(pickerBackdropAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
            ]).start(() => setPickerVisible(false));
        }
    }, [pickerType]);

    const pickerPanResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 8,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    pickerPanY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 60) {
                    Animated.timing(pickerAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setPickerType(null));
                } else {
                    Animated.spring(pickerPanY, { toValue: 0, useNativeDriver: true }).start();
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(pickerPanY, { toValue: 0, useNativeDriver: true }).start();
            },
        })
    ).current;

    const pickerTranslateY = Animated.add(
        pickerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [PICKER_SHEET_HEIGHT + 40, 0],
            extrapolate: 'clamp',
        }),
        pickerPanY
    );

    if (!pickerVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <Pressable
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}
                onPress={() => setPickerType(null)}
            >
                <Animated.View
                    pointerEvents={pickerType ? 'auto' : 'none'}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: '#222',
                        opacity: pickerBackdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }),
                    }}
                />
            </Pressable>
            {/* Sheet */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        minHeight: PICKER_SHEET_HEIGHT,
                        maxHeight: SCREEN_HEIGHT * 0.8,
                        width: '100%',
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6.3,
                        elevation: 5,
                        zIndex: 1001,
                        overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
                    },
                    { transform: [{ translateY: pickerTranslateY }] },
                ]}
                {...pickerPanResponder.panHandlers}
            >
                <SafeAreaView edges={['bottom']} style={{ flex: 1, width: '100%', paddingTop: 24, paddingHorizontal: 24, paddingBottom: 18, justifyContent: 'flex-start' }}>
                    {pickerType === 'repeat' && (
                        <>
                            <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 27 }}>Repeat</Text>
                            {['No repeat', 'Daily', 'Weekly', 'Monthly'].map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 18,
                                        borderRadius: 12,
                                        marginBottom: 2,
                                        backgroundColor: repeat === opt ? '#F5F5F5' : 'transparent',
                                    }}
                                    activeOpacity={0.7}
                                    onPress={() => { setRepeat(opt); setPickerType(null); }}
                                >
                                    <Text style={{ fontSize: 17, color: repeat === opt ? '#000' : '#747474', fontWeight: repeat === opt ? '700' : '400' }}>{opt}</Text>
                                    {repeat === opt && (
                                        <SFSymbol name="checkmark.circle.fill" size={20} colors={["#000"]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </>
                    )}
                    {pickerType === 'frequency' && (
                        <>
                            <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 27 }}>Frequency</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 28, width: '100%' }}>
                                <TouchableOpacity
                                    onPress={() => setFrequency(f => Math.max(1, f - 1))}
                                    disabled={frequency === 1}
                                    style={{
                                        width: 45, height: 45, borderRadius: 27, marginHorizontal: 18,
                                        backgroundColor: frequency === 1 ? '#F5F5F5' : '#fff',
                                        alignItems: 'center', justifyContent: 'center',
                                        opacity: frequency === 1 ? 0.5 : 1,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 6.3,
                                        elevation: 5,
                                        borderWidth: 0.2,
                                        borderColor: 'rgba(214,214,214,0.5)',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <SFSymbol name='minus' size={15} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 28, fontWeight: '700', width: 60, textAlign: 'center' }}>{frequency}</Text>
                                <TouchableOpacity
                                    onPress={() => setFrequency(f => Math.min(30, f + 1))}
                                    disabled={frequency === 30}
                                    style={{
                                        width: 45, height: 45, borderRadius: 27, marginHorizontal: 18,
                                        backgroundColor: frequency === 30 ? '#F5F5F5' : '#fff',
                                        alignItems: 'center', justifyContent: 'center',
                                        opacity: frequency === 30 ? 0.5 : 1,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 6.3,
                                        elevation: 5,
                                        borderWidth: 0.2,
                                        borderColor: 'rgba(214,214,214,0.5)',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <SFSymbol name='plus' size={15} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={{ backgroundColor: '#000', borderRadius: 10, paddingVertical: 13, paddingHorizontal: 38, alignSelf: 'center', marginTop: 6 }}
                                onPress={() => setPickerType(null)}
                                activeOpacity={0.8}
                            >
                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Confirm</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {pickerType === 'icon' && (
                        <>
                            <Text style={{ fontWeight: '700', fontSize: 20, marginBottom: 27 }}>Choose Icon</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, width: '100%' }}>
                                {iconOptions.map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={{
                                            width: 54, height: 54, borderRadius: 27, margin: 7,
                                            backgroundColor: icon === opt ? '#000' : '#F5F5F5',
                                            borderWidth: icon === opt ? 2 : 1.5,
                                            borderColor: icon === opt ? '#000' : '#E0E0E0',
                                            alignItems: 'center', justifyContent: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 0 },
                                            shadowOpacity: 0.07,
                                            shadowRadius: 3,
                                            elevation: 2,
                                        }}
                                        onPress={() => { setIcon(opt); setPickerType(null); }}
                                        activeOpacity={0.7}
                                    >
                                        <SFSymbol name={opt} size={22} colors={[icon === opt ? '#fff' : '#000']} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </SafeAreaView>
            </Animated.View>
        </>
    );
};

export default CustomAnimatedPickerSheet; 