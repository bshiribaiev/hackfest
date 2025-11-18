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
import { TransactionList } from '@/components/home/TransactionList';
import { BudgetPlanning } from '@/components/home/BudgetPlanning';
import { ChatInput } from '@/components/home/ChatInput';
import { SendMoneyModal } from '../../ui-design/SendMoneyModal';
import { TopUpWalletModal } from '../../ui-design/TopUpWalletModal';

type Recipient = { id: string; name: string };

export default function HomeScreen() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  // For the hackathon demo we use the seeded student with id = 6.
  const STUDENT_ID = 6;
  const { data: profile, reload } = useStudentProfile(STUDENT_ID);

  const balance = React.useMemo(() => {
    const wallet = (profile as any)?.wallet;
    if (!wallet) return 0;
    return Number(wallet.balance ?? 0);
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
        // Only count actual, non-fraud spending, not top ups or moves to savings
        if (t.fraudflag) return false;
        const category = (t.category ?? '').toString();
        if (category === 'top-up' || category === 'save-to-savings') return false;
        return new Date(created) >= weekAgo;
      })
      .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);
  }, [profile]);

  const savings = React.useMemo(() => {
    const wallet = (profile as any)?.wallet;
    if (!wallet) return 0;
    return Number(wallet.savings ?? 0);
  }, [profile]);

  const handleTopAISend = async (text: string) => {
    try {
      const advice = await askPurchaseAdvice(String(STUDENT_ID), text);
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

  const handleConfirm = async (
    type: 'Send' | 'Top Up' | 'Save',
    recipientInfo?: Recipient,
  ) => {
    if (!amount.trim()) {
      Alert.alert('Enter amount', 'Please enter an amount first.');
      return;
    }
    const numericAmount = Number(amount);

    try {
      await createTransaction(STUDENT_ID, {
        amount: numericAmount,
        category:
          type === 'Send'
            ? 'peer-transfer'
            : type === 'Top Up'
              ? 'top-up'
              : 'save-to-savings',
        merchant:
          type === 'Send'
            ? recipientInfo
              ? `Transfer to ${recipientInfo.name} (${recipientInfo.id})`
              : 'Student transfer'
            : type === 'Top Up'
              ? 'Campus top up'
              : 'Savings transfer',
        source: 'app',
      });

      // Reload profile so balance, spending and savings all come back from the DB.
      reload();

      const isPotentialFraud = type === 'Send' && numericAmount > 500;
      const title = isPotentialFraud ? 'Send flagged' : `${type} created`;
      const body = isPotentialFraud
        ? `This send of $${numericAmount.toFixed(
          2,
        )} looks suspicious, so we’ve flagged it for review and left your balance unchanged.`
        : `${type} of $${numericAmount.toFixed(2)} recorded.`;

      Alert.alert(title, body);
      setAmount('');
      setRecipient(null);
      setShowSendModal(false);
      setShowTopUpModal(false);
      setShowSaveModal(false);
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
          <BalanceCard balance={balance} spentThisWeek={spentThisWeek} savings={savings} />
          <QuickActions
            onSend={() => setShowSendModal(true)}
            onTopUp={() => setShowTopUpModal(true)}
            onSave={() => setShowSaveModal(true)}
          />
          {/* Budget planning section */}
          <BudgetPlanning profile={profile} onBudgetUpdated={reload} />
          <TransactionList transactions={(profile as any)?.recent_transactions ?? []} />
        </ThemedView>
      </ParallaxScrollView>

      {/* Send Money modal (visual design lives in ui/ui-design/SendMoneyModal.tsx) */}
      <SendMoneyModal
        visible={showSendModal}
        amount={amount}
        onAmountChange={setAmount}
        onClose={() => setShowSendModal(false)}
        onSend={(recip) => handleConfirm('Send', recip)}
      />

      {/* Top Up Wallet modal (visual design lives in ui/ui-design/TopUpWalletModal.tsx) */}
      <TopUpWalletModal
        visible={showTopUpModal}
        amount={amount}
        onAmountChange={setAmount}
        onClose={() => setShowTopUpModal(false)}
        onConfirm={() => handleConfirm('Top Up')}
      />

      {/* Simple demo modal for Save */}

      <Modal
        transparent
        animationType="slide"
        visible={showSaveModal}
        onRequestClose={() => setShowSaveModal(false)}>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            keyboardVerticalOffset={0}>
            <ThemedView style={styles.modalCard}>
              <WalletHeader />
              <ThemedText type="subtitle">Move money to savings</ThemedText>
              <TextInput
                style={styles.amountInput}
                placeholder="$0.00"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setShowSaveModal(false)} style={styles.secondaryButton}>
                  <ThemedText>Cancel</ThemedText>
                </Pressable>
                <Pressable onPress={() => handleConfirm('Save')} style={styles.primaryButton}>
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
