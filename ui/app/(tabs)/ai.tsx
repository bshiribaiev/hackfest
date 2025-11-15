import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';

export default function AIScreen() {
  return (
    <ThemedView style={styles.root}>
      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          {/* Simple chat-style layout */}
          <View style={styles.chatBubbleAI}>
            <ThemedText style={styles.chatLabelAI}>AI</ThemedText>
            <ThemedText style={styles.chatTextAI}>
              Hi Alex, I’m your campus money assistant. Ask me anything about your spending, budget,
              or ways to save.
            </ThemedText>
          </View>
          <View style={{ height: 16 }} />
        </ThemedView>
      </ParallaxScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={4}>
        <SafeAreaView style={styles.safeArea} edges={[]}>
          <ThemedView style={styles.chatInputWrapper}>
            <ChatInput />
          </ThemedView>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
  screen: {
    gap: 16,
  },
  chatBubbleAI: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    backgroundColor: '#eef2ff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 56,
  },
  chatLabelAI: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 2,
  },
  chatLabelUser: {
    fontSize: 11,
    color: '#e5e7eb',
    marginBottom: 2,
    textAlign: 'right',
  },
  chatTextAI: {
    fontSize: 13,
    color: '#111827',
  },
  chatTextUser: {
    fontSize: 13,
    color: '#e5e7eb',
  },
  chatInputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
});
