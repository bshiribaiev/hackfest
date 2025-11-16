import React, { useState, useEffect } from 'react';
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
  email?: string;
  avatarColor?: string;
};

type TabKey = 'savings' | 'events' | 'eco';

const [data, setData] = useState<Leader[]>([]);
const [studentData, setStudentData] = useState<any>(null);

useEffect(() => {
  fetch('http://127.0.0.1:8000/leaderboard')
    .then(response => response.json())
    .then(setData)
    .catch(console.error);
}, []);

useEffect(() => {
  fetch('http://127.0.0.1:8000/students')
    .then(response => response.json())
    .then(setStudentData)
    .catch(console.error);
}, []);

function getUserData() {
  if (studentData) {
    return studentData.map((student: any) => ({
      rank: student.rank,
      name: student.name,
      value: `$${student.total_savings}`,
      badge: 'Student Badge',
      email: student.email,
      avatarColor: student.avatarColor,
      isCurrentUser: student.isCurrentUser,
    }));
  }
  return [];
}

const LEADERBOARD_DATA: Record<TabKey, Leader[]> = {
  savings: getUserData(),
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

          <ThemedView
            lightColor="#7c3aed"
            darkColor="#7c3aed"
            style={styles.challengeCard}>
            <Ionicons name="flash" size={24} color="#fef9c3" />
            <View style={{ flex: 
