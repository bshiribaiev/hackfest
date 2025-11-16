import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';
import { askPurchaseAdvice } from '@/lib/api';

type UpcomingEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  points: number;
  category: string;
  featured?: boolean;
  eco?: boolean;
};

type AttendedEvent = {
  id: number;
  title: string;
  date: string;
  points: number;
  verified?: boolean;
};

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 1,
    title: 'Tech Career Fair 2025',
    date: 'Nov 18, 2025',
    time: '10:00 AM – 4:00 PM',
    location: 'Main Auditorium',
    attendees: 245,
    points: 50,
    category: 'Career',
    featured: true,
  },
  {
    id: 2,
    title: 'Student Mixer Night',
    date: 'Nov 16, 2025',
    time: '7:00 PM – 10:00 PM',
    location: 'Student Center',
    attendees: 156,
    points: 25,
    category: 'Social',
  },
  {
    id: 3,
    title: 'Sustainability Workshop',
    date: 'Nov 17, 2025',
    time: '2:00 PM – 4:00 PM',
    location: 'Science Building',
    attendees: 89,
    points: 75,
    category: 'Workshop',
    eco: true,
  },
];

const ATTENDED_EVENTS: AttendedEvent[] = [
  {
    id: 5,
    title: 'Hackathon Kickoff',
    date: 'Nov 10, 2025',
    points: 100,
    verified: true,
  },
  {
    id: 6,
    title: 'Financial Literacy Workshop',
    date: 'Nov 8, 2025',
    points: 50,
    verified: true,
  },
  {
    id: 7,
    title: 'Welcome Week Concert',
    date: 'Nov 1, 2025',
    points: 25,
    verified: true,
  },
];

export default function EventsScreen() {
  const eventsProgress = {
    current: 3,
    nextMilestone: 5,
    totalPoints: 175,
    nextReward: 50,
  };

  const progress = (eventsProgress.current / eventsProgress.nextMilestone) * 100;

  const handleAISend = async (text: string) => {
    try {
      const advice = await askPurchaseAdvice('1', text);
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
            placeholder="Ask the AI about events or points..."
          />
        </ThemedView>
      </SafeAreaView>

      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          {/* Header gradient card */}
          <ThemedView
            lightColor="#ec4899"
            darkColor="#7e22ce"
            style={styles.headerCard}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="calendar" size={22} color="#fef2f2" />
            </View>
            <View>
              <ThemedText
                type="defaultSemiBold"
                lightColor="#fef2f2"
                darkColor="#fef2f2"
                style={styles.headerTitle}>
                Campus Events
              </ThemedText>
              <ThemedText lightColor="#fee2e2" darkColor="#e5e7eb" style={styles.headerSubtitle}>
                Earn points by attending events
              </ThemedText>
            </View>
          </ThemedView>

          {/* Event streak / progress */}
          <ThemedView
            lightColor="#4f46e5"
            darkColor="#4338ca"
            style={styles.progressCard}>
            <View style={styles.progressTopRow}>
              <View>
                <View style={styles.progressLabelRow}>
                  <Ionicons name="star" size={18} color="#facc15" />
                  <ThemedText lightColor="#e0f2fe" darkColor="#e0f2fe" style={styles.progressLabel}>
                    Event Streak
                  </ThemedText>
                </View>
                <ThemedText style={styles.progressStat} lightColor="#f9fafb" darkColor="#f9fafb">
                  {eventsProgress.current} Events Attended
                </ThemedText>
                <ThemedText
                  lightColor="#e0e7ff"
                  darkColor="#c7d2fe"
                  style={styles.progressMeta}>
                  {eventsProgress.totalPoints} total points earned
                </ThemedText>
              </View>
              <View style={styles.streakPill}>
                <ThemedText lightColor="#fef2f2" darkColor="#fef2f2" style={styles.streakText}>
                  🔥 3 week streak
                </ThemedText>
              </View>
            </View>

            <View style={styles.progressBarRow}>
              <ThemedText lightColor="#e5e7eb" darkColor="#e5e7eb" style={styles.progressSmall}>
                Progress to next reward
              </ThemedText>
              <ThemedText lightColor="#e5e7eb" darkColor="#e5e7eb" style={styles.progressSmall}>
                {eventsProgress.current}/{eventsProgress.nextMilestone}
              </ThemedText>
            </View>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.progressHintRow}>
              <Ionicons name="gift" size={14} color="#e0f2fe" />
              <ThemedText lightColor="#e0f2fe" darkColor="#e0f2fe" style={styles.progressHintText}>
                Unlock +{eventsProgress.nextReward} bonus points at {eventsProgress.nextMilestone}{' '}
                events!
              </ThemedText>
            </View>
          </ThemedView>

          {/* Upcoming events list */}
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Upcoming events
            </ThemedText>
            <ThemedText type="link" style={styles.sectionLink}>
              See all
            </ThemedText>
          </View>

          <ThemedView style={styles.cardList}>
            {UPCOMING_EVENTS.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeaderRow}>
                  <View style={styles.eventTitleRow}>
                    <ThemedText style={styles.eventTitle}>{event.title}</ThemedText>
                    <View style={styles.chipRow}>
                      {event.featured && (
                        <View style={[styles.chip, styles.chipFeatured]}>
                          <Ionicons name="star" size={12} color="#fef3c7" />
                          <ThemedText style={styles.chipText} lightColor="#fef3c7" darkColor="#fef3c7">
                            Featured
                          </ThemedText>
                        </View>
                      )}
                      {event.eco && (
                        <View style={[styles.chip, styles.chipEco]}>
                          <ThemedText style={styles.chipText} lightColor="#dcfce7" darkColor="#dcfce7">
                            🌱 Eco
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.categoryPill}>
                    <ThemedText style={styles.categoryPillText}>{event.category}</ThemedText>
                  </View>
                </View>

                <View style={styles.eventMetaCol}>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#6b7280" />
                    <ThemedText style={styles.metaText}>
                      {event.date} · {event.time}
                    </ThemedText>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="location-outline" size={14} color="#6b7280" />
                    <ThemedText style={styles.metaText}>{event.location}</ThemedText>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="people-outline" size={14} color="#6b7280" />
                    <ThemedText style={styles.metaText}>
                      {event.attendees} students attending
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.eventFooterRow}>
                  <View style={styles.earnRow}>
                    <View style={styles.earnIconCircle}>
                      <Ionicons name="trending-up-outline" size={16} color="#4f46e5" />
                    </View>
                    <View>
                      <ThemedText style={styles.earnLabel}>Earn Points</ThemedText>
                      <ThemedText style={styles.earnValue}>+{event.points} pts</ThemedText>
                    </View>
                  </View>
                  <View style={styles.rsvpButton}>
                    <Ionicons name="ticket-outline" size={14} color="#f9fafb" />
                    <ThemedText style={styles.rsvpText} lightColor="#f9fafb" darkColor="#f9fafb">
                      RSVP
                    </ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </ThemedView>

          {/* Attended events */}
          <View style={styles.sectionHeaderRow}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Attended
            </ThemedText>
          </View>

          <ThemedView style={styles.cardList}>
            {ATTENDED_EVENTS.map((event) => (
              <View key={event.id} style={styles.attendedCard}>
                <View style={styles.attendedLeft}>
                  <View style={styles.attendedIconCircle}>
                    <Ionicons name="calendar-outline" size={18} color="#22c55e" />
                  </View>
                  <View>
                    <ThemedText style={styles.attendedTitle}>{event.title}</ThemedText>
                    <ThemedText style={styles.attendedDate}>{event.date}</ThemedText>
                  </View>
                </View>
                <View style={styles.attendedRight}>
                  <ThemedText style={styles.attendedPoints}>+{event.points}</ThemedText>
                  <ThemedText style={styles.attendedPointsLabel}>points</ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 20,
  },
  headerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: 'rgba(248,250,252,0.25)',
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
  progressCard: {
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressStat: {
    fontSize: 20,
    fontWeight: '600',
  },
  progressMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  streakPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(248,250,252,0.25)',
  },
  streakText: {
    fontSize: 12,
  },
  progressBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressSmall: {
    fontSize: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(248,250,252,0.4)',
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  progressHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  progressHintText: {
    fontSize: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionLink: {
    fontSize: 14,
  },
  cardList: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  eventCard: {
    borderRadius: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 10,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  eventTitleRow: {
    flex: 1,
    gap: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  chipFeatured: {
    backgroundColor: '#f97316',
  },
  chipEco: {
    backgroundColor: '#16a34a',
  },
  chipText: {
    fontSize: 11,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#1118270d',
    alignSelf: 'flex-start',
  },
  categoryPillText: {
    fontSize: 12,
    color: '#111827',
  },
  eventMetaCol: {
    marginTop: 6,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  eventFooterRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earnIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earnLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  earnValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
  rsvpText: {
    fontSize: 13,
    fontWeight: '600',
  },
  attendedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  attendedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  attendedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendedTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  attendedDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  attendedRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  attendedPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  attendedPointsLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
});
