import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ProgressBar from './ProgressBar'

const DailyProgress = () => {
    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Daily Progress</Text>
                        <Text style={styles.subtitle}>3/8 completed</Text>
                    </View>
                    <ProgressBar progress={3 / 8} />
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statsSub}>
                        <Text style={styles.statsTitle}>3</Text>
                        <Text style={styles.statsSubTitle}>Completed</Text>
                    </View>
                    <View style={styles.statsSub}>
                        <Text style={styles.statsTitle}>5</Text>
                        <Text style={styles.statsSubTitle}>Remaining</Text>
                    </View>
                    <View style={styles.statsSub}>
                        <Text style={styles.statsTitle}>8</Text>
                        <Text style={styles.statsSubTitle}>Total</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default DailyProgress

const styles = StyleSheet.create({
    container: {
        marginTop: 11,
        marginHorizontal: 21,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        // shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 6.3,
        elevation: 5,
        // border
        borderWidth: 0.2,
        borderColor: 'rgba(214,214,214,0.5)', // #D6D6D6 at 50% opacity
    },
    subContainer: {
        height: '100%',
        marginHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        fontWeight: '600',
        fontSize: 16
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 14,
        color: '#747474'
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    statsSub: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    statsTitle: {
        fontSize: 14,
        fontWeight: '600'
    },
    statsSubTitle: {
        fontWeight: '600',
        fontSize: 12,
        color: '#D6D6D6'
    }
})