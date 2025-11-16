import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type QuickActionsProps = {
    onSend?: () => void;
    onTopUp?: () => void;
    onSave?: () => void;
};

export function QuickActions({ onSend, onTopUp, onSave }: QuickActionsProps) {
    const actions = [
        {
            icon: 'send-outline' as const,
            label: 'Send',
            onPress: onSend,
            color: '#2563eb', // blue
        },
        {
            icon: 'add-outline' as const,
            label: 'Top Up',
            onPress: onTopUp,
            color: '#10b981', // green
        },
        {
            icon: 'trending-up-outline' as const,
            label: 'Save',
            onPress: onSave,
            color: '#a855f7', // purple
        },
        {
            icon: 'people-outline' as const,
            label: 'Split',
            color: '#f97316', // orange
        },
    ];

    const handleDefaultPress = (label: string) => {
        Alert.alert(label, 'This action is coming soon!');
    };

    return (
        <ThemedView style={styles.container}>
            {actions.map((action) => (
                <Pressable
                    key={action.label}
                    style={styles.action}
                    onPress={() => (action.onPress ? action.onPress() : handleDefaultPress(action.label))}>
                    <View style={[styles.iconWrapper, { backgroundColor: action.color }]}>
                        <Ionicons name={action.icon} size={22} color="#ffffff" />
                    </View>
                    <ThemedText style={styles.label}>{action.label}</ThemedText>
                </Pressable>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    action: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#4b5563',
    },
});


