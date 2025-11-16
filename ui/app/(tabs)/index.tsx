import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { askPurchaseAdvice, createTransaction } from '@/lib/api';
import { WalletHeader } from '@/components/home/WalletHeader';
import { BalanceCard } from '@/components/home/BalanceCard';
import { QuickActions } from '@/components/home/QuickActions';
import { CampusLocations } from '@/components/home/CampusLocations';
import { MTACard } from '@/components/home/MTACard';
import { TransactionList } from '@/components/home/TransactionList';
import { ChatInput } from '@/components/home/ChatInput';

export default function HomeScreen() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [amount, setAmount] = useState('');
  const { data: profile } = useStudentProfile(1);

  const balance = React.useMemo(() => {
    if (!profile) return 387.5;
    const budgets = (profile as any).budgets ?? [];
    const overall = budgets.find(
      (b: any) => b.category === 'overall' && b.period === 'weekly',
    );
    const limit = overall ? Number(overall.limit_amount ?? 0) : 0;

    const txs = (profile as any).recent_transactions ?? [];
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    const spentThisWeek = txs
      .filter((t: any) => {
        const created = t.createdat ?? t.created_at;
        if (!created) return false;
        return new Date(created) >= weekAgo;
      })
      .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

    if (limit > 0) {
      return Math.max(0, limit - spentThisWeek);
    }
    return 387.5;
  }, [profile]);

  const spentThisWeek = React.useMemo(() => {
    if (!profile) return 127.5;
    const txs = (profile as any).recent_transactions ?? [];
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    return txs
      .filter((t: any) => {
        const created = t.createdat ?? t.created_at;
        if (!created) return false;
        return new Date(created) >= weekAgo;
      })
      .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);
  }, [profile]);

  const savings = React.useMemo(() => {
    if (!profile) return 89.2;
    const snap = (profile as any).leaderboard_position;
    return snap ? Number(snap.total_savings ?? 0) : 89.2;
  }, [profile]);

  const handleTopAISend = async (text: string) => {
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

  const handleConfirm = async (type: 'Send' | 'Top Up') => {
    if (!amount.trim()) {
      Alert.alert('Enter amount', 'Please enter an amount first.');
      return;
    }
    const numericAmount = Number(amount);

    try {
      await createTransaction(1, {
        amount: numericAmount,
        category: type === 'Send' ? 'peer-transfer' : 'top-up',
        merchant: type === 'Send' ? 'Student transfer' : 'Campus top up',
        source: 'app',
      });

      Alert.alert(
        `${type} created`,
        `${type} of $${numericAmount.toFixed(2)} recorded (demo backend).`,
      );
      setAmount('');
      setShowSendModal(false);
      setShowTopUpModal(false);
    } catch (err) {
      Alert.alert(
        'Something went wrong',
        err instanceof Error ? err.message : 'Failed to reach backend.',
      );
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.chatInputWrapper}>
          <ChatInput onSend={handleTopAISend} />
        </ThemedView>
      </SafeAreaView>
      <ParallaxScrollView>
        <ThemedView style={styles.screen}>
          <WalletHeader />
          <BalanceCard
            balance={balance}
            spentThisWeek={spentThisWeek}
            savings={savings}
          />
          <QuickActions
            onSend={() => setShowSendModal(true)}
            onTopUp={() => setShowTopUpModal(true)}
          />
          <CampusLocations />
          <MTACard />
          <TransactionList />
        </ThemedView>
      </ParallaxScrollView>

      {/* Simple demo modals for Send and Top Up */}
      <Modal
        transparent
        animationType="slide"
        visible={showSendModal}
        onRequestClose={() => setShowSendModal(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={0}>
            <ThemedView style={styles.modalCard}>
              <WalletHeader />
              <ThemedText type="subtitle">Send money</ThemedText>
              <TextInput
                style={styles.amountInput}
                placeholder="$0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setShowSendModal(false)} style={styles.secondaryButton}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={() => handleConfirm('Send')} style={styles.primaryButton}>
                  <ThemedText lightColor="#ffffff" darkColor="#ffffff">
                    Confirm
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="slide"
        visible={showTopUpModal}
        onRequestClose={() => setShowTopUpModal(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={0}>
            <ThemedView style={styles.modalCard}>
              <WalletHeader />
              <ThemedText type="subtitle">Top up wallet</ThemedText>
              <TextInput
                style={styles.amountInput}
                placeholder="$0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setShowTopUpModal(false)} style={styles.secondaryButton}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={() => handleConfirm('Top Up')} style={styles.primaryButton}>
                  <ThemedText lightColor="#ffffff" darkColor="#ffffff">
                    Confirm
                  </ThemedText>
                </Pressable>
              </View>
            </ThemedView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#4f46e5',
  },
});
