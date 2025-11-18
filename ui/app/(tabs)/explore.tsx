import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';
import { askPurchaseAdvice, createBudget, updateBudgetLimit } from '@/lib/api';
import { useStudentProfile } from '@/hooks/useStudentProfile';

type Insight = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
};

const STATIC_INSIGHTS_META: Omit<Insight, 'description'>[] = [
  {
    id: 1,
    title: 'Weekly Budget Alert',
    icon: 'alert-circle-outline',
    color: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    id: 2,
    title: 'Smart Saving Tip',
    icon: 'bulb-outline',
    color: '#eab308',
    bgColor: '#fef9c3',
  },
  {
    id: 3,
    title: 'Spending Pattern',
    icon: 'trending-down-outline',
    color: '#2563eb',
    bgColor: '#dbeafe',
  },
];

export default function TipsScreen() {
  const STUDENT_ID = 6;
  const { data: profile, reload } = useStudentProfile(STUDENT_ID);

  // Ensure tips reflect the latest wallet/budget data whenever the tab is focused.
  useFocusEffect(
    React.useCallback(() => {
      reload();
    }, [reload]),
  );

  const wallet = (profile as any)?.wallet;
  const currentBalance = wallet ? Number(wallet.balance ?? 0) : 0;

  const budgets = (profile as any)?.budgets ?? [];

  const overallMonthlyBudget = React.useMemo(
    () =>
      budgets.find(
        (b: any) => b.category === 'overall' && b.period === 'monthly',
      ),
    [budgets],
  );

  const monthlyTarget = React.useMemo(() => {
    if (overallMonthlyBudget) {
      return Number(overallMonthlyBudget.limit_amount ?? 0);
    }
    return 500; // sensible demo default
  }, [overallMonthlyBudget]);

  const monthlyGoal = {
    target: monthlyTarget,
    current: currentBalance,
  };
  const progress =
    monthlyGoal.target > 0 ? (monthlyGoal.current / monthlyGoal.target) * 100 : 0;

  const { spentThisWeek, spentLastWeek } = React.useMemo(() => {
    if (!profile) {
      return { spentThisWeek: 0, spentLastWeek: 0 };
    }
    const txs = (profile as any).recent_transactions ?? [];
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    const isSpendingTx = (t: any) => {
      if (t.fraudflag) return false;
      const cat = (t.category ?? '').toString();
      return cat !== 'top-up' && cat !== 'save-to-savings';
    };

    const spentThisWeek = txs
      .filter((t: any) => {
        const created = t.createdat ?? t.created_at;
        if (!created) return false;
        const d = new Date(created);
        return isSpendingTx(t) && d >= weekAgo;
      })
      .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

    const spentLastWeek = txs
      .filter((t: any) => {
        const created = t.createdat ?? t.created_at;
        if (!created) return false;
        const d = new Date(created);
        return isSpendingTx(t) && d >= twoWeeksAgo && d < weekAgo;
      })
      .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

    return { spentThisWeek, spentLastWeek };
  }, [profile]);

  const weeklyAlertDescription = React.useMemo(() => {
    if (!spentThisWeek && !spentLastWeek) {
      return "You haven't spent anything yet this week. Nice start!";
    }
    if (!spentLastWeek) {
      return `You've spent $${spentThisWeek.toFixed(
        2,
      )} this week so far. This is your first tracked week.`;
    }
    const diff = spentThisWeek - spentLastWeek;
    const pct = spentLastWeek > 0 ? (diff / spentLastWeek) * 100 : 0;
    const direction = diff >= 0 ? 'more' : 'less';
    return `You’ve spent $${spentThisWeek.toFixed(
      2,
    )} this week. That’s ${Math.abs(pct).toFixed(0)}% ${direction} than last week.`;
  }, [spentThisWeek, spentLastWeek]);

  const insights: Insight[] = React.useMemo(
    () =>
      STATIC_INSIGHTS_META.map((meta) => {
        if (meta.id === 1) {
          return { ...meta, description: weeklyAlertDescription };
        }
        if (meta.id === 2) {
          return {
            ...meta,
            description: 'Making coffee at home 3x/week could save you around $45/month.',
          };
        }
        return {
          ...meta,
          description:
            'You tend to spend the most on weekdays around lunchtime. Consider meal prep!',
        };
      }),
    [weeklyAlertDescription],
  );

  const handleEditMonthlyGoal = React.useCallback(() => {
    const existingLimit =
      overallMonthlyBudget && overallMonthlyBudget.limit_amount != null
        ? Number(overallMonthlyBudget.limit_amount)
        : monthlyTarget;

    // iOS-only prompt; on Android we fall back to a simple alert.
    if (typeof Alert.prompt !== 'function') {
      Alert.alert(
        'Edit monthly budget',
        `Current goal is $${existingLimit.toFixed(
          2,
        )}. Budget editing is currently available on iOS only.`,
      );
      return;
    }

    Alert.prompt(
      'Edit monthly budget',
      'Enter your monthly budget amount in dollars.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (value: string | undefined) => {
            if (!value) return;

            const cleaned = value.replace(/[^0-9.]/g, '');
            const parsed = Number(cleaned);
            if (!isFinite(parsed) || parsed <= 0) {
              Alert.alert(
                'Invalid amount',
                'Please enter a positive number for your budget.',
              );
              return;
            }

            try {
              if (overallMonthlyBudget?.id) {
                await updateBudgetLimit(overallMonthlyBudget.id, parsed);
              } else {
                await createBudget(STUDENT_ID, {
                  category: 'overall',
                  period: 'monthly',
                  limit_amount: parsed,
                });
              }
              reload();
            } catch (err) {
              Alert.alert(
                'Could not save budget',
                err instanceof Error ? err.message : 'Please try again.',
              );
            }
          },
        },
      ],
      'plain-text',
      existingLimit.toString(),
    );
  }, [STUDENT_ID, overallMonthlyBudget, monthlyTarget, reload]);

  const handleAISend = async (text: string) => {
    try {
      const advice = await askPurchaseAdvice('6', text);
      const body =
        advice.suggestion && advice.suggestion.trim().length > 0
          ? advice.suggestion
          : advice.message;

      Alert.alert('AI insight', body);
    } catch (err) {
      Alert.alert(
        'AI unavailable',
        err instanceof Error ? err.message : 'Please try again in a moment.',
      );
    }
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.chatInputWrapper}>
          <ChatInput
            onSend={handleAISend}
            placeholder="Ask the AI for tips to save more..."
          />
        </ThemedView>
      </SafeAreaView>

      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          {/* Header */}
          <ThemedView
            lightColor="#4c1d95"
            darkColor="#4c1d95"
            style={styles.headerCard}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="sparkles-outline" size={22} color="#fefce8" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText
                type="defaultSemiBold"
                lightColor="#fefce8"
                darkColor="#fefce8"
                style={styles.headerTitle}>
                Smart Tips
              </ThemedText>
              <ThemedText lightColor="#ddd6fe" darkColor="#ddd6fe" style={styles.headerSubtitle}>
                Insights to help you save more
              </ThemedText>
            </View>
          </ThemedView>

          {/* Monthly goal */}
          <ThemedView style={styles.goalCard}>
            <View style={styles.goalHeaderRow}>
              <View style={styles.goalHeaderLeft}>
                <View style={styles.goalIconCircle}>
                  <Ionicons name="flag-outline" size={18} color="#4f46e5" />
                </View>
                <ThemedText style={styles.goalTitle}>Monthly Budget Goal</ThemedText>
              </View>
              <Pressable onPress={handleEditMonthlyGoal} hitSlop={8}>
                <ThemedText style={styles.goalEditText}>Edit</ThemedText>
              </Pressable>
            </View>
            <View style={styles.goalStatsCol}>
              <View style={styles.goalRow}>
                <ThemedText style={styles.goalLabel}>Current balance</ThemedText>
                <ThemedText style={styles.goalValue}>
                  ${monthlyGoal.current.toFixed(2)} / ${monthlyGoal.target}
                </ThemedText>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <ThemedText style={styles.goalHint}>
                You’re {progress > 75 ? 'on track' : 'slightly behind'} to meet your goal.{' '}
                {progress > 75 ? 'Keep it up!' : 'Try saving $5 more per day.'}
              </ThemedText>
            </View>
          </ThemedView>

          {/* Insights */}
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Personalized Insights
            </ThemedText>
          </View>

          <ThemedView style={styles.cardList}>
            {insights.map((insight) => (
              <View key={insight.id} style={styles.insightCard}>
                <View style={[styles.insightIconWrap, { backgroundColor: insight.bgColor }]}>
                  <Ionicons name={insight.icon} size={18} color={insight.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.insightTitle}>{insight.title}</ThemedText>
                  <ThemedText style={styles.insightBody}>{insight.description}</ThemedText>
                </View>
              </View>
            ))}
          </ThemedView>

        </ThemedView>
      </ParallaxScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  chatInputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  screen: {
    gap: 16,
  },
  headerCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(250,250,250,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  goalCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
    gap: 10,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  goalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  goalEditText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '500',
  },
  goalStatsCol: {
    marginTop: 8,
    gap: 6,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  goalValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
  goalHint: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
  },
  cardList: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  insightIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightBody: {
    fontSize: 12,
    color: '#6b7280',
  },
  breakdownCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  breakdownTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginTop: 4,
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
});
