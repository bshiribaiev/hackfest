import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { updateBudgetLimit } from '@/lib/api';

type BudgetPlanningProps = {
    profile: any | null;
    onBudgetUpdated?: () => void;
};

type BudgetSummary = {
    id: number;
    name: string;
    icon: string;
    color: string;
    limit: number;
    spent: number;
};

function mapCategoryToMeta(category: string): { icon: string; color: string } {
    const key = category.toLowerCase();
    if (key.includes('food') || key.includes('dining') || key.includes('meal')) {
        return { icon: '🍕', color: '#ef4444' };
    }
    if (key.includes('transport') || key.includes('bus') || key.includes('metro')) {
        return { icon: '🚌', color: '#0ea5e9' };
    }
    if (key.includes('shop') || key.includes('retail')) {
        return { icon: '🛍️', color: '#8b5cf6' };
    }
    if (key.includes('entertain') || key.includes('fun')) {
        return { icon: '🎮', color: '#22c55e' };
    }
    return { icon: '💸', color: '#4f46e5' };
}

function computeBudgetSummaries(profile: any | null): BudgetSummary[] {
    if (!profile) return [];

    const budgets = (profile as any).budgets ?? [];
    const txs = (profile as any).recent_transactions ?? [];

    // Focus on weekly budgets for the card
    const weeklyBudgets = budgets.filter((b: any) => b.period === 'weekly');

    const summaries: BudgetSummary[] = weeklyBudgets.map((b: any) => {
        const limit = Number(b.limit_amount ?? 0);
        const category = String(b.category ?? 'overall');

        const spent = txs
            .filter((t: any) => {
                const cat = (t.category ?? '').toString();
                if (cat === 'top-up' || cat === 'save-to-savings') return false;
                return category === 'overall' ? true : cat === category;
            })
            .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

        const { icon, color } = mapCategoryToMeta(category);

        return {
            id: Number(b.id),
            name: category === 'overall' ? 'Overall' : category,
            icon,
            color,
            limit,
            spent,
        };
    });

    // Show at most 3 categories, sorted by limit descending
    return summaries
        .sort((a, b) => b.limit - a.limit)
        .slice(0, 3);
}

export function BudgetPlanning({ profile, onBudgetUpdated }: BudgetPlanningProps) {
    const categories = computeBudgetSummaries(profile);
    const [editing, setEditing] = useState<BudgetSummary | null>(null);
    const [newLimit, setNewLimit] = useState<string>('');

    if (!categories.length) {
        return null;
    }

    const totalLimit = categories.reduce((sum, c) => sum + c.limit, 0);
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const totalLeft = totalLimit - totalSpent;

    return (
        <ThemedView style={styles.card}>
            <View style={styles.headerRow}>
                <View>
                    <ThemedText type="subtitle" style={styles.title}>
                        Weekly Budget
                    </ThemedText>
                    <ThemedText style={styles.subtitle}>Track your spending this week</ThemedText>
                </View>
                <View style={styles.remainingCol}>
                    <ThemedText style={styles.remainingLabel}>Remaining</ThemedText>
                    <ThemedText style={styles.remainingValue}>${totalLeft.toFixed(2)}</ThemedText>
                </View>
            </View>

            <View style={styles.categoryRow}>
                {categories.map((cat) => {
                    const left = cat.limit - cat.spent;
                    const pct = cat.limit > 0 ? (cat.spent / cat.limit) * 100 : 0;

                    let leftColor = styles.leftGood;
                    if (pct > 90) leftColor = styles.leftBad;
                    else if (pct > 75) leftColor = styles.leftWarn;

                    return (
                        <View key={cat.name} style={styles.categoryCol}>
                            {/* Simple circular progress approximation */}
                            <View style={[styles.circleOuter]}>
                                <View style={[styles.circleInner]}>
                                    <ThemedText style={styles.circleIcon}>{cat.icon}</ThemedText>
                                    <ThemedText style={styles.circlePct}>{`${pct.toFixed(0)}%`}</ThemedText>
                                </View>
                            </View>

                            <View style={styles.categoryMeta}>
                                <ThemedText style={styles.catName}>{cat.name}</ThemedText>
                                <ThemedText style={styles.catLimit}>
                                    ${cat.spent.toFixed(2)} / ${cat.limit.toFixed(0)}
                                </ThemedText>
                                <Pressable
                                    onPress={() => {
                                        setEditing(cat);
                                        setNewLimit(String(cat.limit.toFixed(0)));
                                    }}>
                                    <ThemedText style={styles.editLink}>Edit budget</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Total progress bar */}
            <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total</ThemedText>
                <ThemedText style={styles.totalValue}>
                    ${totalSpent.toFixed(2)} / ${totalLimit.toFixed(0)}
                </ThemedText>
            </View>
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: totalLimit > 0 ? `${(totalSpent / totalLimit) * 100}%` : '0%' },
                    ]}
                />
            </View>

            {/* Simple edit modal for budget limit */}
            <Modal
                transparent
                animationType="fade"
                visible={!!editing}
                onRequestClose={() => setEditing(null)}>
                <View style={styles.modalBackdrop}>
                    <ThemedView style={styles.modalCard}>
                        <ThemedText type="subtitle" style={styles.modalTitle}>
                            Edit {editing?.name} budget
                        </ThemedText>
                        <ThemedText style={styles.modalLabel}>Weekly limit</ThemedText>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={newLimit}
                            onChangeText={setNewLimit}
                            placeholder="0"
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.modalSecondary}
                                onPress={() => {
                                    setEditing(null);
                                }}>
                                <ThemedText>Cancel</ThemedText>
                            </Pressable>
                            <Pressable
                                style={styles.modalPrimary}
                                onPress={async () => {
                                    if (!editing) return;
                                    const numeric = Number(newLimit);
                                    if (!Number.isFinite(numeric) || numeric <= 0) {
                                        Alert.alert('Invalid amount', 'Please enter a positive number.');
                                        return;
                                    }
                                    try {
                                        await updateBudgetLimit(editing.id, numeric);
                                        setEditing(null);
                                        onBudgetUpdated?.();
                                    } catch (err) {
                                        Alert.alert(
                                            'Failed to update budget',
                                            err instanceof Error ? err.message : 'Please try again.',
                                        );
                                    }
                                }}>
                                <ThemedText lightColor="#ffffff" darkColor="#ffffff">
                                    Save
                                </ThemedText>
                            </Pressable>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    remainingCol: {
        alignItems: 'flex-end',
    },
    remainingLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    remainingValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#16a34a',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    categoryCol: {
        flex: 1,
        alignItems: 'center',
    },
    circleOuter: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleIcon: {
        fontSize: 18,
        marginBottom: 2,
    },
    circlePct: {
        fontSize: 14,
        fontWeight: '700',
    },
    categoryMeta: {
        marginTop: 4,
        alignItems: 'center',
    },
    catName: {
        fontSize: 13,
        fontWeight: '600',
    },
    catLimit: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 2,
    },
    catLeft: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    editLink: {
        fontSize: 11,
        color: '#4f46e5',
        marginTop: 2,
    },
    leftGood: {
        color: '#16a34a',
    },
    leftWarn: {
        color: '#eab308',
    },
    leftBad: {
        color: '#dc2626',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 8,
    },
    totalLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: '600',
    },
    progressTrack: {
        height: 6,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#4f46e5',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        borderRadius: 20,
        padding: 16,
    },
    modalTitle: {
        marginBottom: 8,
    },
    modalLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    modalSecondary: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
    },
    modalPrimary: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: '#4f46e5',
    },
});

