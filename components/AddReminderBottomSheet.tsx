import { getTodayDateString } from '@/utils/date';
import { Reminder } from '@/utils/reminderStorage';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import SFSymbol from 'sweet-sfsymbols';

interface AddReminderBottomSheetProps {
    onAdd: (reminderData: Omit<Reminder, 'id'>) => void;
    reminder?: Reminder | null;
}

type SheetContent = 'add' | 'picker';
type PickerType = 'time-start' | 'time-end' | 'repeat' | 'frequency' | 'icon' | null;

const AddReminderBottomSheet = forwardRef<{ present: () => void }, AddReminderBottomSheetProps>((props, ref) => {
    const modalRef = useRef<BottomSheetModal>(null);

    // Sheet content state
    const [sheetContent, setSheetContent] = useState<SheetContent>('add');
    const [pickerType, setPickerType] = useState<PickerType>(null);

    // Add Reminder form state
    const today = getTodayDateString();
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [reminderTitle, setReminderTitle] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [repeat, setRepeat] = useState('No repeat');
    const [frequency, setFrequency] = useState(5);
    const [icon, setIcon] = useState('pencil');

    // Prefill form if editing
    useEffect(() => {
        if (props.reminder) {
            setReminderTitle(props.reminder.title);
            setSelectedDate(props.reminder.date);
            setStartTime(new Date(props.reminder.startTime));
            setEndTime(new Date(props.reminder.endTime));
            setRepeat(props.reminder.repeat);
            setFrequency(props.reminder.frequency);
            setIcon(props.reminder.icon);
        } else {
            setReminderTitle('');
            setSelectedDate(today);
            setStartTime(new Date());
            setEndTime(new Date());
            setRepeat('No repeat');
            setFrequency(5);
            setIcon('pencil');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.reminder]);

    const iconOptions = [
        // Row 1
        'face.smiling', 'list.bullet.circle', 'bookmark', 'key.fill', 'gift.fill', 'birthday.cake.fill', 'calendar',
        // Row 2
        'graduationcap.fill', 'backpack.fill', 'pencil.and.ruler', 'doc.fill', 'book.fill', 'creditcard.fill',
        // Row 3
        'creditcard', 'banknote', 'dumbbell.fill', 'figure.run', 'fork.knife', 'wineglass',
        // Row 4
        'pills.fill', 'stethoscope', 'chair.lounge.fill', 'house.fill', 'building.2.fill', 'building.columns.fill',
        // Row 5
        'tent.fill', 'display', 'music.note', 'desktopcomputer', 'gamecontroller.fill', 'headphones',
        // Row 6
        'leaf.fill', 'carrot.fill', 'figure.stand', 'figure.2', 'pawprint.fill',
        // Row 7
        'teddybear.fill', 'fish.fill', 'basket.fill', 'cart.fill', 'bag.fill', 'shippingbox.fill',
        // Row 8
        'soccerball', 'baseball', 'basketball', 'football', 'tennis.racket', 'tram.fill',
        // Row 9
        'airplane', 'sailboat.fill', 'car.fill', 'umbrella.fill', 'sun.max.fill', 'moon.fill',
        // Row 10
        'drop.fill', 'snowflake', 'flame.fill', 'briefcase.fill', 'wrench.and.screwdriver', 'scissors',
        // Row 11
        'compass.drawing', 'curlybraces', 'lightbulb.fill', 'bubble.left.fill', 'exclamationmark.2', 'asterisk',
        // Row 12
        'square.fill', 'circle.fill', 'triangle.fill', 'diamond.fill', 'heart.fill', 'star.fill',
    ];

    const frequencyScrollRef = useRef<ScrollView>(null);
    const [optionPositions, setOptionPositions] = useState<{ [key: number]: number }>({});

    // Remove previous useEffect for scrollTo
    // Add new effect that waits for optionPositions[frequency] to be available
    useEffect(() => {
        if (
            pickerType === 'frequency' &&
            frequencyScrollRef.current &&
            optionPositions[frequency] !== undefined
        ) {
            frequencyScrollRef.current.scrollTo({
                y: optionPositions[frequency],
                animated: false,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickerType, optionPositions, frequency]);

    // Handler for sheet index change
    const handleSheetChange = (index: number) => {
        // No longer intercept close here; pan down to close is only enabled on add sheet
    };

    // When switching back to add sheet, re-present the modal if needed
    // Remove this effect:
    // useEffect(() => {
    //     if (sheetContent === 'add') {
    //         modalRef.current?.present();
    //     }
    // }, [sheetContent]);

    // Snap points - different heights for add vs picker
    const snapPoints = useMemo(() => {
        return sheetContent === 'add' ? ['90%'] : ['50%'];
    }, [sheetContent]);

    // Format time for display
    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const mins = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${mins} ${ampm}`;
    };

    useImperativeHandle(ref, () => ({
        present: () => {
            setSheetContent('add');
            setPickerType(null);
            // Do not reset form here, handled by useEffect above
            modalRef.current?.present();
        },
    }));

    // Custom backdrop
    const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
                {...backdropProps}
                opacity={0.35}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    // Handle picker opening
    const openPicker = (type: PickerType) => {
        setPickerType(type);
        setSheetContent('picker');
    };

    // Handle picker closing
    const closePicker = () => {
        setPickerType(null);
        setSheetContent('add');
    };

    // Handle time picker changes
    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            if (pickerType === 'time-start') {
                setStartTime(selectedDate);
            } else if (pickerType === 'time-end') {
                setEndTime(selectedDate);
            }
        }
        // Do not close the picker here
    };

    // Handle repeat selection
    const handleRepeatSelect = (value: string) => {
        setRepeat(value);
        closePicker();
    };

    // Handle frequency selection
    const handleFrequencySelect = (value: number) => {
        setFrequency(value);
        closePicker();
    };

    // Handle icon selection
    const handleIconSelect = (value: string) => {
        setIcon(value);
        closePicker();
    };

    // Calendar handlers
    const onDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    const onMonthChange = (month: { year: number; month: number }) => {
        // Do not set selectedDate here! Only set selectedDate in onDayPress.
    };

    const getMarkedDates = () => {
        const markedDates: any = {};
        if (selectedDate === today) {
            markedDates[today] = {
                selected: true,
                marked: true,
                selectedColor: '#000',
                selectedTextColor: '#fff',
                dotColor: '#fff',
            };
        } else {
            markedDates[today] = {
                marked: true,
                dotColor: '#000',
            };
            if (selectedDate) {
                markedDates[selectedDate] = {
                    selected: true,
                    selectedColor: '#000',
                    selectedTextColor: '#fff',
                };
            }
        }
        return markedDates;
    };

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const NUM_COLUMNS = 4; // Changed from 5 to 4
    const ICON_GAP = 16;
    const iconSize = (SCREEN_WIDTH - 24 - ICON_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

    // Helper to chunk array into rows
    const chunkArray = <T,>(arr: T[], size: number): T[][] =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
            arr.slice(i * size, i * size + size)
        );

    const iconRows = chunkArray<string>(iconOptions, NUM_COLUMNS);

    // Render picker content
    const renderPickerContent = (hideTitle = false) => {
        switch (pickerType) {
            case 'time-start':
            case 'time-end':
                return (
                    <>
                        {!hideTitle && <Text style={styles.pickerTitle}>{pickerType === 'time-start' ? 'Start Time' : 'End Time'}</Text>}
                        <DateTimePicker
                            value={pickerType === 'time-start' ? startTime : endTime}
                            mode="time"
                            display="spinner"
                            onChange={handleTimeChange}
                            style={styles.timePicker}
                        />
                        <SafeAreaView style={styles.addButtonContainer}>
                            <TouchableHighlight
                                style={styles.addButton}
                                onPress={closePicker}
                                underlayColor="#222"
                            >
                                <Text style={styles.addButtonText}>Done</Text>
                            </TouchableHighlight>
                        </SafeAreaView>
                    </>
                );

            case 'repeat':
                return (
                    <>
                        {!hideTitle && <Text style={styles.pickerTitle}>Repeat</Text>}
                        {['No repeat', 'Daily', 'Weekly', 'Monthly'].map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[
                                    styles.pickerOption,
                                    repeat === opt && styles.pickerOptionSelected
                                ]}
                                activeOpacity={0.7}
                                onPress={() => handleRepeatSelect(opt)}
                            >
                                <Text style={[
                                    styles.pickerOptionText,
                                    repeat === opt && styles.pickerOptionTextSelected
                                ]}>
                                    {opt}
                                </Text>
                                {repeat === opt && (
                                    <SFSymbol name="checkmark.circle.fill" size={20} colors={["#000"]} />
                                )}
                            </TouchableOpacity>

                        ))}
                        <SafeAreaView style={styles.addButtonContainer}>
                            <TouchableHighlight
                                style={styles.addButton}
                                onPress={closePicker}
                                underlayColor="#222"
                            >
                                <Text style={styles.addButtonText}>Done</Text>
                            </TouchableHighlight>
                        </SafeAreaView>
                    </>
                );

            case 'frequency':
                return (
                    <>
                        {!hideTitle && <Text style={styles.pickerTitle}>Frequency</Text>}
                        <ScrollView
                            ref={frequencyScrollRef}
                            style={{ maxHeight: 250 }}
                            showsVerticalScrollIndicator={false}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <TouchableOpacity
                                    key={num}
                                    onLayout={e => {
                                        const y = e.nativeEvent.layout.y;
                                        setOptionPositions(pos => ({ ...pos, [num]: y }));
                                    }}
                                    style={[
                                        styles.pickerOption,
                                        frequency === num && styles.pickerOptionSelected
                                    ]}
                                    activeOpacity={0.7}
                                    onPress={() => handleFrequencySelect(num)}
                                >
                                    <Text style={[
                                        styles.pickerOptionText,
                                        frequency === num && styles.pickerOptionTextSelected
                                    ]}>
                                        {num} times
                                    </Text>
                                    {frequency === num && (
                                        <SFSymbol name="checkmark.circle.fill" size={20} colors={["#000"]} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <SafeAreaView style={styles.addButtonContainer}>
                            <TouchableHighlight
                                style={styles.addButton}
                                onPress={closePicker}
                                underlayColor="#222"
                            >
                                <Text style={styles.addButtonText}>Done</Text>
                            </TouchableHighlight>
                        </SafeAreaView>
                    </>
                );

            case 'icon':
                return (
                    <>
                        {!hideTitle && <Text style={styles.pickerTitle}>Icon</Text>}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 250 }}>
                            <View style={{}}>
                                {iconRows.map((row, rowIdx) => (
                                    <View
                                        key={rowIdx}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: ICON_GAP,
                                        }}
                                    >
                                        {row.map((iconName: string) => (
                                            <TouchableOpacity
                                                key={iconName}
                                                style={{
                                                    width: iconSize,
                                                    height: iconSize,
                                                    borderRadius: iconSize / 2,
                                                    backgroundColor: icon === iconName ? '#000' : '#F5F5F5',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                                activeOpacity={0.7}
                                                onPress={() => handleIconSelect(iconName)}
                                            >
                                                <SFSymbol
                                                    name={iconName as any}
                                                    size={28}
                                                    colors={icon === iconName ? ["#fff"] : ["#000"]}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                        <SafeAreaView style={styles.addButtonContainer}>
                            <TouchableHighlight
                                style={styles.addButton}
                                onPress={closePicker}
                                underlayColor="#222"
                            >
                                <Text style={styles.addButtonText}>Done</Text>
                            </TouchableHighlight>
                        </SafeAreaView>
                    </>
                );

            default:
                return null;
        }
    };

    // Save handler
    const handleSave = () => {
        if (!reminderTitle.trim()) return;
        props.onAdd({
            icon,
            title: reminderTitle,
            date: selectedDate,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            repeat,
            frequency,
        });
        // Reset form
        setReminderTitle('');
        setSelectedDate(today);
        setStartTime(new Date());
        setEndTime(new Date());
        setRepeat('No repeat');
        setFrequency(5);
        setIcon('pencil');
        // Dismiss the sheet
        modalRef.current?.dismiss();
    };

    return (
        <BottomSheetModal
            ref={modalRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose={sheetContent === 'add'}
            enableDynamicSizing={false}
            backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            handleIndicatorStyle={{ backgroundColor: '#fff', width: 36, height: 6, top: -25 }}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChange}
        >
            <BottomSheetView style={styles.sheetContent}>
                {sheetContent === 'add' ? (
                    <>
                        <View style={{ marginHorizontal: 21 }}>
                            <Text style={styles.addTitle}>{props.reminder ? 'Edit' : 'Add'}</Text>
                            <View style={styles.inputRow}>
                                <TouchableOpacity style={styles.iconCircle} onPress={() => openPicker('icon')}>
                                    <SFSymbol name={icon as any} size={20} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.titleInput}
                                    placeholder="Title"
                                    placeholderTextColor="#B4B4B9"
                                    value={reminderTitle}
                                    onChangeText={setReminderTitle}
                                />
                            </View>
                        </View>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 120 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    current={selectedDate}
                                    onDayPress={onDayPress}
                                    onMonthChange={onMonthChange}
                                    markedDates={getMarkedDates()}
                                    theme={{
                                        backgroundColor: '#fff',
                                        calendarBackground: '#fff',
                                        textSectionTitleColor: '#000',
                                        selectedDayBackgroundColor: '#000',
                                        selectedDayTextColor: '#fff',
                                        todayTextColor: '#000',
                                        dayTextColor: '#000',
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: '#000',
                                        selectedDotColor: '#fff',
                                        arrowColor: '#000',
                                        monthTextColor: '#000',
                                        indicatorColor: '#000',
                                        textDayFontWeight: '600',
                                        textMonthFontWeight: '700',
                                        textDayHeaderFontWeight: '600',
                                        textDayFontSize: 16,
                                        textMonthFontSize: 18,
                                        textDayHeaderFontSize: 14,
                                    }}
                                    style={{ backgroundColor: '#fff' }}
                                    dayComponent={({ date, state, marking }) => {
                                        if (!date) return null;
                                        const isSelected = marking?.selected;
                                        const isMarked = marking?.marked;
                                        return (
                                            <TouchableOpacity
                                                onPress={() => onDayPress(date)}
                                                disabled={state === 'disabled'}
                                                style={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 19,
                                                    backgroundColor: isSelected ? '#000' : 'transparent',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: isSelected ? '#fff' : state === 'disabled' ? '#d9e1e8' : '#000',
                                                        fontWeight: isSelected ? '700' : '600',
                                                        fontSize: 16,
                                                    }}
                                                >
                                                    {date.day}
                                                </Text>
                                                {isMarked && (
                                                    <View
                                                        style={{
                                                            width: 5,
                                                            height: 5,
                                                            borderRadius: 2.5,
                                                            backgroundColor: marking?.dotColor || '#000',
                                                            marginTop: 2,
                                                        }}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                            </View>
                            <View style={{ marginTop: 2, paddingHorizontal: 21 }}>
                                {[{
                                    label: 'Start',
                                    value: formatTime(startTime),
                                    onPress: () => openPicker('time-start'),
                                }, {
                                    label: 'End',
                                    value: formatTime(endTime),
                                    onPress: () => openPicker('time-end'),
                                }, {
                                    label: 'Repeat',
                                    value: repeat === 'No repeat' ? '↻ No repeat' : repeat,
                                    onPress: () => openPicker('repeat'),
                                }, {
                                    label: 'Frequency',
                                    value: `${frequency} times`,
                                    onPress: () => openPicker('frequency'),
                                }].map((item, idx) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        style={[
                                            styles.optionRow,
                                            idx === 3 && { marginBottom: 0 }
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={item.onPress}
                                    >
                                        <Text style={styles.optionLabel}>{item.label}</Text>
                                        <View style={styles.optionValue}>
                                            <Text style={styles.optionValueText}>{item.value}</Text>
                                            <SFSymbol name={'chevron.right' as any} size={16} colors={['#B4B4B9']} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                        <SafeAreaView style={styles.addButtonContainer}>
                            <TouchableHighlight
                                style={[styles.addButton, !reminderTitle.trim() && { backgroundColor: '#B4B4B9' }]}
                                onPress={handleSave}
                                underlayColor="#222"
                                disabled={!reminderTitle.trim()}
                            >
                                <Text style={styles.addButtonText}>Save</Text>
                            </TouchableHighlight>
                        </SafeAreaView>
                    </>
                ) : (
                    // Picker content with back arrow
                    <View style={styles.pickerContainer}>
                        <View style={styles.pickerHeader}>
                            <TouchableOpacity onPress={closePicker} style={styles.pickerBackButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                                <SFSymbol name={'chevron.left' as any} size={22} />
                            </TouchableOpacity>
                            <Text style={styles.pickerHeaderTitle}>
                                {pickerType === 'time-start' ? 'Start Time' :
                                    pickerType === 'time-end' ? 'End Time' :
                                        pickerType === 'repeat' ? 'Repeat' :
                                            pickerType === 'frequency' ? 'Frequency' :
                                                pickerType === 'icon' ? 'Icon' : ''}
                            </Text>
                        </View>
                        {/* Render the rest of the picker content as before, but without the title */}
                        {renderPickerContent(true)}
                    </View>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

const styles = StyleSheet.create({
    sheetContent: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        paddingTop: 5,
    },
    addTitle: {
        fontWeight: '700',
        fontSize: 20,
        marginBottom: 27,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 14,
    },
    iconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 5,
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)',
    },
    titleInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 18,
        paddingVertical: 18,
        fontSize: 16,
        height: 54,
        fontWeight: '600',
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 5,
    },
    calendarContainer: {
        marginBottom: 18,
        backgroundColor: '#fff',
        marginHorizontal: 10,
    },
    optionRow: {
        backgroundColor: '#fff',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginBottom: 12,
        marginHorizontal: 0,
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.07,
        shadowRadius: 3,
        elevation: 2,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    optionValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionValueText: {
        fontSize: 16,
        color: '#747474',
        fontWeight: '500',
    },
    addButtonContainer: {
        position: 'absolute',
        right: 0,
        bottom: 34,
        width: 135.19,
        marginRight: 21,
    },
    addButton: {
        backgroundColor: '#000',
        borderRadius: 13,
        width: 135.19,
        height: 59.82,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    // Picker styles
    pickerContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 18,
        paddingTop: 5
    },
    pickerTitle: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        // No marginBottom or paddingBottom here
    },
    timePicker: {
        height: 200,
    },
    pickerButton: {
        backgroundColor: '#000',
        borderRadius: 13,
        paddingVertical: 16,
        alignItems: 'center',

    },
    pickerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    pickerOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderRadius: 12,
        marginBottom: 2,
        backgroundColor: 'transparent',
    },
    pickerOptionSelected: {
        backgroundColor: '#F5F5F5',
    },
    pickerOptionText: {
        fontSize: 17,
        color: '#747474',
        fontWeight: '400',
    },
    pickerOptionTextSelected: {
        color: '#000',
        fontWeight: '700',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 20,
    },
    iconOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconOptionSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    pickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 27, // match addTitle marginBottom
    },
    pickerBackButton: {
        position: 'absolute',
        left: 0,
        width: 44,
        height: 44,
        justifyContent: 'center',
        zIndex: 2,
    },
    pickerHeaderTitle: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        flex: 1,
    },
});

AddReminderBottomSheet.displayName = 'AddReminderBottomSheet';

export default AddReminderBottomSheet; 