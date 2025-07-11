import Header from "@/components/Header";
import RemindersList from "@/components/RemindersList";
import Tabs from "@/components/Tabs";
import { useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Index() {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabChange = (index: number) => {
    setTabIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={styles.pager}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <RemindersList type="today" />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <RemindersList type="all" />
        </View>
      </Animated.ScrollView>
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
  }
});