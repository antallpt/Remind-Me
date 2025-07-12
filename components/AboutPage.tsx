import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, StyleSheet, Text, View } from 'react-native';
import SFSymbol from 'sweet-sfsymbols';

const logoAsset = require('@/assets/images/Logo.png');

const AboutPage = () => {
    const [logoLoaded, setLogoLoaded] = useState(false);

    useEffect(() => {
        Asset.loadAsync(logoAsset).then(() => setLogoLoaded(true));
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ gap: 12 }}>
                <Text style={styles.title}>About</Text>
                <View style={{ gap: 7 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600' }}>Having trouble or found a bug?</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#747474', lineHeight: 21 }}>
                        If you run into any problems or have questions, just email us at{' '}
                        <Text
                            style={{ color: '#7B61FF', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL('mailto:support@appwerk-berlin.de')}
                        >
                            support@appwerk-berlin.de
                        </Text>
                        {' '}and we’ll be happy to help!
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <View style={{ gap: 9 }}>
                        <Text style={{ color: '#B4B4B9', fontSize: 10 }}>Version 1.0.0</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                            <SFSymbol name='c.circle' size={13} colors={['#98989D']} />
                            <Text style={{ color: '#B4B4B9', fontSize: 12, fontWeight: '500' }}>AppWerk-Berlin</Text>
                        </View>
                    </View>
                    {logoLoaded ? (
                        <Image source={logoAsset} style={styles.img} resizeMode='contain' />
                    ) : (
                        <ActivityIndicator size="small" color="#7B61FF" style={styles.img} />
                    )}
                </View>
            </View>

        </View>
    )
}

export default AboutPage

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    img: {
        height: 3000 / 80,
        width: 5500 / 80,
    }
})