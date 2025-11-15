import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';

type Leader = {
  rank: number;
  name: string;
  value: string;
  badge: string;
  points?: number;
  isCurrentUser?: boolean;
};

type TabKey = 'savings' | 'events' | 'eco';

const LEADERBOARD_DATA: Record<TabKey, Leader[]> = {
  savings: [
    { rank: 1, name: 'Emma Wilson', value: '$245.50', badge: 'Savings Champion', points: 2450 },
    { rank: 2, name: 'Michael Chen', value: '$198.20', badge: 'Smart Saver', points: 1982 },
    { rank: 3, name: 'Sarah Johnson', value: '$167.80', badge: 'Budget Pro', points: 1678 },
    {
      rank: 4,
      name: 'Alex Smith',
      value: '$89.20',
      badge: 'Rising Star',
      points: 892,
      isCurrentUser: true,
    },
    { rank: 5, name: 'Jordan Lee', value: '$76.40', badge: 'Newcomer', points: 764 },
  ],
  events: [
    { rank: 1, name: 'Sarah Johnson', value: '12 events', badge: 'Event Champion', points: 675 },
    { rank: 2, name: 'Emma Wilson', value: '9 events', badge: 'Social Star', points: 525 },
    {
      rank: 3,
      name: 'Alex Smith',
      value: '3 events',
      badge: 'Active Member',
      points: 175,
      isCurrentUser: true,
    },
    { rank: 4, name: 'Jordan Lee', value: '2 events', badge: 'Getting Started', points: 75 },
  ],
  eco: [
    {
      rank: 1,
      name: 'Alex Smith',
      value: '95 pts',
      badge: 'Eco Warrior',
      points: 95,
      isCurrentUser: true,
    },
    { rank: 2, name: 'Emma Wilson', value: '87 pts', badge: 'Green Leader', points: 87 },
    { rank: 3, name: 'Jordan Lee', value: '76 pts', badge: 'Planet Saver', points: 76 },
  ],
};

function getRankIcon(rank: number) {
  if (rank === 1) return <Ionicons name="trophy" size={18} color="#facc15" />;
  if (rank === 2) return <Ionicons name="medal-outline" size={18} color="#9ca3af" />;
  if (rank === 3) return <Ionicons name="medal-outline" size={18} color="#92400e" />;
  return <ThemedText style={styles.rankText}>#{rank}</ThemedText>;
}

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('savings');
  const leaders = LEADERBOARD_DATA[activeTab];

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.chatInputWrapper}>
          <ChatInput />
        </ThemedView>
      </SafeAreaView>

      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          {/* Header gradient-ish card */}
          <ThemedView lightColor="#f97316" darkColor="#ea580c" style={styles.headerCard}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="trophy" size={22} color="#fefce8" />
            </View>
            <View>
              <ThemedText
                type="defaultSemiBold"
                lightColor="#fefce8"
                darkColor="#fefce8"
                style={styles.headerTitle}>
                Leaderboard
              </ThemedText>
              <ThemedText lightColor="#fffbeb" darkColor="#fffbeb" style={styles.headerSubtitle}>
                Compete with fellow students
              </ThemedText>
            </View>
          </ThemedView>

          {/* Your stats row */}
          <View style={styles.statsRow}>
            <ThemedView style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: '#e0e7ff' }]}>
                <Ionicons name="flag-outline" size={16} color="#4f46e5" />
              </View>
              <ThemedText style={styles.statLabel}>Your Rank</ThemedText>
              <ThemedText style={styles.statValue}>#4</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="trending-up-outline" size={16} color="#059669" />
              </View>
              <ThemedText style={styles.statLabel}>This Month</ThemedText>
              <ThemedText style={styles.statValue}>+12</ThemedText>
            </ThemedView>

            <ThemedView style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: '#ede9fe' }]}>
                <Ionicons name="flash-outline" size={16} color="#7c3aed" />
              </View>
              <ThemedText style={styles.statLabel}>Points</ThemedText>
              <ThemedText style={styles.statValue}>892</ThemedText>
            </ThemedView>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {([
              { key: 'savings', label: 'Savings' },
              { key: 'events', label: 'Events' },
              { key: 'eco', label: 'Eco' },
            ] as { key: TabKey; label: string }[]).map((tab) => {
              const active = activeTab === tab.key;
              return (
                <ThemedView
                  key={tab.key}
                  style={[styles.tabChip, active && styles.tabChipActive]}
                  lightColor={active ? '#111827' : '#f3f4f6'}
                  darkColor={active ? '#111827' : '#111827'}>
                  <ThemedText
                    onPress={() => setActiveTab(tab.key)}
                    style={[styles.tabLabel, active && styles.tabLabelActive]}
                    lightColor={active ? '#f9fafb' : '#4b5563'}
                    darkColor={active ? '#f9fafb' : '#e5e7eb'}>
                    {tab.label}
                  </ThemedText>
                </ThemedView>
              );
            })}
          </View>

          {/* Leader list */}
          <ThemedView style={styles.listCard}>
            {leaders.map((leader, idx) => (
              <View
                key={leader.rank}
                style={[
                  styles.leaderRow,
                  idx < leaders.length - 1 && styles.leaderRowDivider,
                  leader.isCurrentUser && styles.leaderRowCurrent,
                ]}>
                <View style={styles.rankIconCell}>{getRankIcon(leader.rank)}</View>
                <View style={styles.avatarCircle}>
                  <ThemedText style={styles.avatarInitials}>
                    {leader.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </ThemedText>
                </View>
                <View style={styles.leaderInfoCol}>
                  <View style={styles.leaderNameRow}>
                    <ThemedText style={styles.leaderName}>{leader.name}</ThemedText>
                    {leader.isCurrentUser && (
                      <ThemedText style={styles.youPill} lightColor="#111827" darkColor="#111827">
                        You
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText style={styles.leaderBadge}>{leader.badge}</ThemedText>
                </View>
                <View style={styles.leaderValueCol}>
                  <ThemedText
                    style={[
                      styles.leaderValue,
                      activeTab === 'savings' && styles.valueSavings,
                      activeTab === 'events' && styles.valueEvents,
                      activeTab === 'eco' && styles.valueEco,
                    ]}>
                    {leader.value}
                  </ThemedText>
                  {leader.points != null && (
                    <ThemedText style={styles.pointsText}>{leader.points} pts</ThemedText>
                  )}
                </View>
              </View>
            ))}
          </ThemedView>

          {/* Challenge banner */}
          <ThemedView
            lightColor="#7c3aed"
            darkColor="#7c3aed"
            style={styles.challengeCard}>
            <Ionicons name="flash" size={24} color="#fef9c3" />
            <View style={{ flex: 1 }}>
              <ThemedText
                style={styles.challengeTitle}
                lightColor="#fefce8"
                darkColor="#fefce8">
                Weekly Challenge
              </ThemedText>
              <ThemedText
                style={styles.challengeSubtitle}
                lightColor="#e9d5ff"
                darkColor="#e9d5ff">
                Save $50 this week for +100 bonus points!
              </ThemedText>
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
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(254,249,195,0.25)',
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  tabChip: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabChipActive: {
    backgroundColor: '#111827',
  },
  tabLabel: {
    fontSize: 13,
  },
  tabLabelActive: {
    fontWeight: '600',
  },
  listCard: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#ffffff',
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  leaderRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  leaderRowCurrent: {
    backgroundColor: '#eef2ff',
    borderRadius: 14,
  },
  rankIconCell: {
    width: 28,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 13,
    color: '#6b7280',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  leaderInfoCol: {
    flex: 1,
    gap: 2,
  },
  leaderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  youPill: {
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#e0e7ff',
  },
  leaderBadge: {
    fontSize: 11,
    color: '#6b7280',
  },
  leaderValueCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  leaderValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  valueSavings: {
    color: '#059669',
  },
  valueEvents: {
    color: '#4f46e5',
  },
  valueEco: {
    color: '#16a34a',
  },
  pointsText: {
    fontSize: 11,
    color: '#6b7280',
  },
  challengeCard: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  challengeTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  challengeSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
