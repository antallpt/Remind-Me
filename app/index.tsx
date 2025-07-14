import AddReminderBottomSheet from "@/components/AddReminderBottomSheet";
import AllHabitsPage from "@/components/AllHabitsPage";
import CustomAnimatedPickerSheet from "@/components/CustomAnimatedPickerSheet";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import TodayPage from "@/components/TodayPage";
import { Reminder, loadReminders, saveReminders, updateReminder } from "@/utils/reminderStorage";
import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from 'react-native-uuid';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Helper: get period start for repeat type
function getPeriodStart(date: Date, repeat: string): string {
  if (repeat === 'Daily') {
    return date.toISOString().slice(0, 10);
  } else if (repeat === 'Weekly') {
    // Get Monday of this week
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  } else if (repeat === 'Monthly') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
  }
  return '';
}

// Helper: should reset reminder?
function shouldResetReminder(reminder: Reminder): boolean {
  if (!reminder.repeat || reminder.repeat === 'No repeat') return false;
  const now = new Date();
  const periodStart = getPeriodStart(now, reminder.repeat);
  return reminder.lastReset !== periodStart;
}

// Helper: reset reminder for new period
function resetReminder(reminder: Reminder): Reminder {
  const now = new Date();
  const periodStart = getPeriodStart(now, reminder.repeat);
  return { ...reminder, completedCount: 0, lastReset: periodStart };
}

export default function Index() {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const addSheetRef = useRef<{ present: () => void }>(null);

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  // Editing state
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  // Global openSignal for swipe state
  const [openSignal, setOpenSignal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadReminders().then(reminders => {
      const updated = reminders.map(r => {
        if (shouldResetReminder(r)) {
          const reset = resetReminder(r);
          updateReminder(r.id, { completedCount: 0, lastReset: reset.lastReset });
          return reset;
        }
        return r;
      });
      setReminders(updated);
    });
    // Listen for app foreground to trigger reset logic
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        loadReminders().then(reminders => {
          const updated = reminders.map(r => {
            if (shouldResetReminder(r)) {
              const reset = resetReminder(r);
              updateReminder(r.id, { completedCount: 0, lastReset: reset.lastReset });
              return reset;
            }
            return r;
          });
          setReminders(updated);
        });
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);
  useEffect(() => {
    setOpenSignal(null);
  }, [currentPage]);

  // Picker state at the root
  const [pickerType, setPickerType] = useState<null | 'repeat' | 'frequency' | 'icon'>(null);
  const [repeat, setRepeat] = useState('No repeat');
  const [frequency, setFrequency] = useState(5);
  const [icon, setIcon] = useState('pencil');
  const iconOptions = [
    'pencil', 'bell.fill', 'star.fill', 'heart.fill', 'drop.fill',
    'flame.fill', 'leaf.fill', 'moon.fill', 'sun.max.fill', 'bolt.fill',
    'checkmark.circle.fill', 'cart.fill', 'book.fill', 'clock.fill', 'gift.fill',
  ];

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    setCurrentPage(index);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    loadReminders().then(reminders => {
      const updated = reminders.map(r => {
        if (shouldResetReminder(r)) {
          const reset = resetReminder(r);
          updateReminder(r.id, { completedCount: 0, lastReset: reset.lastReset });
          return reset;
        }
        return r;
      });
      setReminders(updated);
    });
  };

  const openAddSheet = () => {
    addSheetRef.current?.present();
  };

  // Add/Edit reminder handler
  const handleAddReminder = (reminderData: Omit<Reminder, 'id'>) => {
    if (selectedReminder) {
      // Edit mode: update existing reminder
      setReminders(prev => prev.map(r => r.id === selectedReminder.id ? { ...r, ...reminderData } : r));
      setSelectedReminder(null);
    } else {
      // Add mode
      const today = new Date().toISOString().slice(0, 10);
      const newReminder: Reminder = { ...reminderData, id: uuid.v4() as string, completedCount: 0, createdAt: Date.now(), lastReset: today };
      setReminders(prev => [...prev, newReminder]);
    }
    addSheetRef.current?.present(); // Optionally close the sheet
  };

  // Complete reminder handler
  const handleCompleteReminder = (id: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const next = Math.min((r.completedCount || 0) + 1, r.frequency);
        updateReminder(id, { completedCount: next });
        return { ...r, completedCount: next };
      }
      return r;
    }));
  };

  // Open edit sheet
  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    addSheetRef.current?.present();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header />
        <Tabs
          activeTab={tabIndex}
          onTabChange={handleTabChange}
          scrollX={scrollX}
          screenWidth={SCREEN_WIDTH}
        />
        <Animated.ScrollView
          ref={scrollViewRef as any}
          horizontal
          pagingEnabled
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          style={styles.pager}
          onMomentumScrollEnd={e => {
            const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentPage(page);
          }}
        >
          <View style={{ width: SCREEN_WIDTH }}>
            <TodayPage reminders={reminders} setReminders={setReminders} onEditReminder={handleEditReminder} openSignal={openSignal} setOpenSignal={setOpenSignal} onCompleteReminder={handleCompleteReminder} />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <AllHabitsPage reminders={reminders} setReminders={setReminders} openSignal={openSignal} setOpenSignal={setOpenSignal} onEditReminder={handleEditReminder} onCompleteReminder={handleCompleteReminder} />
          </View>
        </Animated.ScrollView>
      </View>
      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => { setOpenSignal(Date.now().toString()); setSelectedReminder(null); openAddSheet(); }}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <AddReminderBottomSheet
        ref={addSheetRef}
        onAdd={handleAddReminder}
        reminder={selectedReminder}
      />
      <CustomAnimatedPickerSheet
        pickerType={pickerType}
        setPickerType={setPickerType}
        repeat={repeat}
        setRepeat={setRepeat}
        frequency={frequency}
        setFrequency={setFrequency}
        icon={icon}
        setIcon={setIcon}
        iconOptions={iconOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  pager: {
    flex: 1
  },
  addButton: {
    position: 'absolute',
    right: 21,
    bottom: 36,
    backgroundColor: '#000',
    borderRadius: 13,
    borderCurve: 'continuous',
    width: 135.19,
    height: 59.82,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 17,
  },
});

