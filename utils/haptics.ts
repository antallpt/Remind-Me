// @ts-ignore
import * as Haptics from 'expo-haptics';

export function triggerMediumHaptic() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function triggerSuccessHaptic() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function triggerWarningHaptic() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}