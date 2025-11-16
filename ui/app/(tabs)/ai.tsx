import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/components/home/ChatInput';
import { askPurchaseAdvice } from '@/lib/api';

type ChatMessage = {
  id: string;
  role: 'ai' | 'user';
  text: string;
  status?: 'GO' | 'CAREFUL' | 'NOPE';
};

export default function AIScreen() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'ai',
      text: "Hi Alex, I’m your campus money assistant. Ask me anything about your spending, budget, or ways to save.",
    },
  ]);
  const [isThinking, setIsThinking] = React.useState(false);

  const handleSend = async (text: string) => {
    const idBase = Date.now().toString();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${idBase}`, role: 'user', text },
    ]);

    // Add temporary AI "thinking" message
    const tempId = `ai-${idBase}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        role: 'ai',
        text: 'Let me take a quick look at your budgets and recent spending…',
      },
    ]);

    try {
      setIsThinking(true);
      const advice = await askPurchaseAdvice('6', text);

      const combinedText =
        advice.suggestion && advice.suggestion.trim().length > 0
          ? `${advice.message}\n\n${advice.suggestion}`
          : advice.message;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
              ...m,
              text: combinedText,
              status: advice.status,
            }
            : m,
        ),
      );
    } catch (error) {
      console.error('AI advice failed', error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
              ...m,
              text:
                'Sorry, I had trouble reaching the AI service. Please check your connection and try again.',
            }
            : m,
        ),
      );
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ThemedView style={styles.root}>
      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          {messages.map((msg) => {
            const isAI = msg.role === 'ai';
            const bubbleStyle = isAI ? styles.chatBubbleAI : styles.chatBubbleUser;
            const labelStyle = isAI ? styles.chatLabelAI : styles.chatLabelUser;
            const textStyle = isAI ? styles.chatTextAI : styles.chatTextUser;

            return (
              <View key={msg.id} style={bubbleStyle}>
                <ThemedText style={labelStyle}>
                  {isAI ? 'AI' : 'You'}
                </ThemedText>
                {msg.status && (
                  <ThemedText style={styles.statusPill}>
                    {msg.status === 'GO'
                      ? 'Looks good ✅'
                      : msg.status === 'CAREFUL'
                        ? 'Be careful ⚠️'
                        : 'Not a great idea 🚫'}
                  </ThemedText>
                )}
                <ThemedText style={textStyle}>{msg.text}</ThemedText>
              </View>
            );
          })}
          <View style={{ height: 16 }} />
        </ThemedView>
      </ParallaxScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={4}>
        <SafeAreaView style={styles.safeArea} edges={[]}>
          <ThemedView style={styles.chatInputWrapper}>
            <ChatInput
              onSend={handleSend}
              placeholder={
                isThinking
                  ? 'Thinking about your last question…'
                  : 'Ask the AI about your money...'
              }
            />
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
  chatBubbleUser: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    backgroundColor: '#4f46e5',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
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
  statusPill: {
    fontSize: 11,
    color: '#111827',
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 4,
  },
  chatInputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 10,
    backgroundColor: '#ffffff',
  },
});
