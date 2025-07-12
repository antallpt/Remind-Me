import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SFSymbol from 'sweet-sfsymbols';

// SFSymbol expects a SystemName type, but we use string for flexibility
interface SettingsBarProps {
    iconName?: any; // string, but bypassing SystemName type error
    text?: string;
    onPress?: () => void;
    color?: string;
    emphasized?: boolean;
}

const SettingsBar = ({ iconName = 'eye.fill', text = 'Appearance', onPress, color = '#000', emphasized = false }: SettingsBarProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
                <SFSymbol name={iconName} size={14} colors={[color]} />
                <Text style={[styles.title, emphasized ? styles.titleEmphasized : null, { color }]}>{text}</Text>
            </View>
            <SFSymbol name='chevron.right' size={15} colors={[color]} />
        </TouchableOpacity>
    )
}

export default SettingsBar

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontWeight: '600',
        fontSize: 14
    },
    titleEmphasized: {
        fontWeight: '700',
        fontSize: 14
    }
})