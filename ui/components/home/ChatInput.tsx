import React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';

type ChatInputProps = {
    /**
     * Optional callback for when the user sends a message.
     * If not provided, a simple "coming soon" alert is shown (used on non-AI tabs).
     */
    onSend?: (text: string) => Promise<void> | void;
    placeholder?: string;
};

export function ChatInput({ onSend, placeholder }: ChatInputProps) {
    const [value, setValue] = React.useState('');
    const [sending, setSending] = React.useState(false);

    const handleSend = async () => {
        if (!value.trim()) return;
        const text = value.trim();

        if (!onSend) {
            // Default behaviour for tabs that haven't wired up AI yet.
            Alert.alert('AI Chat (coming soon)', text);
            setValue('');
            return;
        }

        try {
            setSending(true);
            await Promise.resolve(onSend(text));
            setValue('');
        } catch (error) {
            console.error('Failed to send AI message', error);
            Alert.alert(
                'Something went wrong',
                error instanceof Error ? error.message : 'Please try again.',
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <ThemedView style={styles.wrapper}>
            <View style={styles.inputContainer}>
                <Ionicons name="sparkles-outline" size={18} color="#6b7280" />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder ?? 'Ask the AI about your money...'}
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={setValue}
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                />
                <Pressable
                    onPress={handleSend}
                    disabled={!value.trim() || sending}
                    style={({ pressed }) => [
                        styles.sendButton,
                        ((!value.trim() || sending) || pressed) && styles.sendButtonDisabled,
                        pressed && value.trim() && !sending && styles.sendButtonPressed,
                    ]}>
                    <Ionicons name="arrow-up" size={20} color="#ffffff" />
                </Pressable>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        // Margin handled by parent
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#f3f4f6',
        gap: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 4,
        fontSize: 14,
        color: '#111827',
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: '#4f46e5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#e5e7eb',
    },
    sendButtonPressed: {
        backgroundColor: '#4338ca',
    },
});


