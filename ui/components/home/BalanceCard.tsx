import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
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
    const [showBalance, setShowBalance] = useState(true);

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
                            {showBalance ? `$${balance.toFixed(2)}` : '••••••'}
                        </Text>
                        <Pressable
                            onPress={() => setShowBalance(!showBalance)}
                            style={styles.eyeButton}
                            hitSlop={8}>
                            <Ionicons
                                name={showBalance ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#ddd6fe"
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>Active</ThemedText>
                </View>
            </View>

            <View style={styles.footerRow}>
                <View>
                    <Text style={styles.footerLabel}>This Week Spent</Text>
                    <Text style={styles.footerValue}>${spentThisWeek.toFixed(2)}</Text>
                </View>
                <View style={styles.savingsColumn}>
                    <Text style={styles.footerLabel}>Savings</Text>
                    <View style={styles.savingsRow}>
                        <Ionicons name="trending-up-outline" size={14} color="#6ee7b7" />
                        <Text style={styles.savingsValue}>${savings.toFixed(2)}</Text>
                    </View>
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
    eyeButton: {
        width: 32,
        height: 32,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(249,250,251,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#22c55e',
        borderRadius: 999,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        color: '#ecfdf3',
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
    savingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    savingsValue: {
        fontSize: 19,
        color: '#bfdbfe',
        fontWeight: '600',
    },
});


