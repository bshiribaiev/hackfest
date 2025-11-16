import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';
import { askPurchaseAdvice } from '@/lib/api';

type Insight = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
};

const INSIGHTS: Insight[] = [
  {
    id: 1,
    title: 'Weekly Budget Alert',
    description: "You’ve spent $127.50 this week. That’s 15% more than last week.",
    icon: 'alert-circle-outline',
    color: '#ea580c',
    bgColor: '#ffedd5',
  },
  {
    id: 2,
    title: 'Smart Saving Tip',
    description: 'Making coffee at home 3x/week could save you $45/month.',
    icon: 'bulb-outline',
    color: '#eab308',
    bgColor: '#fef9c3',
  },
  {
    id: 3,
    title: 'Spending Pattern',
    description: 'You spend most on weekdays between 12–2pm. Consider meal prep!',
    icon: 'trending-down-outline',
    color: '#2563eb',
    bgColor: '#dbeafe',
  },
];

export default function TipsScreen() {
  const monthlyGoal = {
    target: 500,
    current: 387.5,
  };
  const progress = (monthlyGoal.current / monthlyGoal.target) * 100;

  const handleAISend = async (text: string) => {
    try {
      const advice = await askPurchaseAdvice('6', text);
      const title =
        advice.status === 'GO'
          ? 'Looks good ✅'
          : advice.status === 'CAREFUL'
            ? 'Be careful ⚠️'
            : 'Not a great idea 🚫';
      const body =
        advice.suggestion && advice.suggestion.trim().length > 0
          ? `${advice.message}\n\n${advice.suggestion}`
          : advice.message;

      Alert.alert(title, body);
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
              <View style={styles.goalIconCircle}>
                <Ionicons name="flag-outline" size={18} color="#4f46e5" />
              </View>
              <ThemedText style={styles.goalTitle}>Monthly Budget Goal</ThemedText>
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
            {INSIGHTS.map((insight) => (
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

          {/* Breakdown */}
          <ThemedView style={styles.breakdownCard}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              This Week’s Breakdown
            </ThemedText>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <View style={[styles.dot, { backgroundColor: '#f97316' }]} />
                <ThemedText style={styles.breakdownLabel}>Food & Dining</ThemedText>
              </View>
              <ThemedText style={styles.breakdownValue}>$56.50 (44%)</ThemedText>
            </View>
            <View style={styles.breakdownTrack}>
              <View style={[styles.breakdownFill, { width: '44%' }]} />
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                <ThemedText style={styles.breakdownLabel}>Transportation</ThemedText>
              </View>
              <ThemedText style={styles.breakdownValue}>$35.00 (27%)</ThemedText>
            </View>
            <View style={styles.breakdownTrack}>
              <View style={[styles.breakdownFill, { width: '27%' }]} />
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <View style={[styles.dot, { backgroundColor: '#8b5cf6' }]} />
                <ThemedText style={styles.breakdownLabel}>Books & Supplies</ThemedText>
              </View>
              <ThemedText style={styles.breakdownValue}>$36.00 (29%)</ThemedText>
            </View>
            <View style={styles.breakdownTrack}>
              <View style={[styles.breakdownFill, { width: '29%' }]} />
            </View>
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
