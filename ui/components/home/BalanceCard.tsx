import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type BalanceCardProps = {
    balance?: number;
    spentThisWeek?: number;
    savings?: number;
};

export function BalanceCard({
    balance = 387.5,
    spentThisWeek = 127.5,
    savings = 89.2,
}: BalanceCardProps) {
    return (
        <ThemedView lightColor="#4f46e5" darkColor="#312e81" style={styles.container}>
            <View style={styles.topRow}>
                <View>
                    <View style={styles.labelRow}>
                        <Ionicons name="wallet" size={18} color="#c7d2fe" />
                        <ThemedText style={styles.label}>Campus Wallet</ThemedText>
                    </View>
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceText}>
                            ${balance.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.footerRow}>
                <View>
                    <Text style={styles.footerLabel}>This Week Spent</Text>
                    <Text style={styles.footerValue}>${spentThisWeek.toFixed(2)}</Text>
                </View>
                <View style={styles.savingsColumn}>
                    <Text style={styles.footerLabel}>Savings</Text>
                    <Text style={styles.savingsValue}>${savings.toFixed(2)}</Text>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    label: {
        fontSize: 13,
        color: '#c7d2fe',
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    balanceText: {
        fontSize: 38,
        fontWeight: '700',
        color: '#f0f4ff',
        letterSpacing: -0.5,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: 'rgba(249,250,251,0.25)',
        paddingTop: 12,
    },
    footerLabel: {
        fontSize: 12,
        color: '#e0e7ff',
        marginBottom: 2,
    },
    footerValue: {
        fontSize: 19,
        color: '#f0f4ff',
        fontWeight: '600',
    },
    savingsColumn: {
        alignItems: 'flex-end',
    },
    savingsValue: {
        fontSize: 19,
        color: '#bfdbfe',
        fontWeight: '600',
    },
});


