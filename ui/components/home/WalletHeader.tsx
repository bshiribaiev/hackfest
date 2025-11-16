import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function WalletHeader() {
    return (
        <ThemedView lightColor="#f9fafb" darkColor="#020617" style={styles.container}>
            <View style={styles.left}>
                <View style={styles.avatar}>
                    <ThemedText type="defaultSemiBold" style={styles.avatarText}>
                        KS
                    </ThemedText>
                </View>
                <View>
                    <View style={styles.nameRow}>
                        <ThemedText type="defaultSemiBold">Kevin Smith</ThemedText>
                    </View>
                    <View style={styles.subtitleRow}>
                        <Image
                            source={require('@/assets/images/rutgers.png')}
                            style={styles.rutgersImage}
                            resizeMode="contain"
                        />
                        <ThemedText style={styles.subtitle}>ID: STU-2024-1847</ThemedText>
                    </View>
                </View>
            </View>

            <View style={styles.right}>
                <Ionicons name="notifications-outline" size={22} color="#9ca3af" />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 16,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    rutgersImage: {
        width: 18,
        height: 18,
    },
    subtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    right: {
        marginLeft: 12,
    },
});


