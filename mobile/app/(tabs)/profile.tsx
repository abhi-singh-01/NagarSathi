import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { getAndroidPermissionNotes } from '@/src/services/permissionService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const androidNotes = getAndroidPermissionNotes();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profile" subtitle="Account & app settings" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() ?? 'N'}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.phone ? <Text style={styles.phone}>+91 {user.phone}</Text> : null}
        </Card>

        <Text style={styles.section}>About NagarSathi</Text>
        <Card>
          <Text style={styles.about}>
            NagarSathi (नगर साथी) empowers Indian citizens to report potholes, garbage,
            broken streetlights, water leaks, and sewage issues with photo evidence and
            precise GPS coordinates — helping municipalities respond faster.
          </Text>
        </Card>

        {Platform.OS === 'android' && androidNotes.length > 0 && (
          <>
            <Text style={styles.section}>Android Permissions</Text>
            <Card>
              {androidNotes.map((note) => (
                <View key={note} style={styles.permRow}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.permText}>{note}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        <Text style={styles.section}>App Info</Text>
        <Card>
          <InfoRow icon="information-circle-outline" label="Version" value="1.0.0" />
          <InfoRow icon="globe-outline" label="Region" value="India 🇮🇳" />
          <InfoRow
            icon="server-outline"
            label="Backend"
            value={process.env.EXPO_PUBLIC_API_URL ? 'Live API' : 'Local demo mode'}
          />
        </Card>

        <Button title="Sign Out" onPress={handleLogout} variant="outline" style={styles.logout} />
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={20} color={Theme.colors.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },
  profileCard: { alignItems: 'center', marginBottom: Theme.spacing.lg },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: Theme.colors.white },
  name: { fontSize: Theme.fontSize.xl, fontWeight: '700', color: Theme.colors.text },
  email: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary, marginTop: 4 },
  phone: { fontSize: Theme.fontSize.sm, color: Theme.colors.textMuted, marginTop: 2 },
  section: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
  },
  about: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary, lineHeight: 22 },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  permText: { flex: 1, fontSize: Theme.fontSize.sm, color: Theme.colors.text },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    gap: 10,
  },
  infoLabel: { flex: 1, fontSize: Theme.fontSize.sm, color: Theme.colors.text },
  infoValue: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary, fontWeight: '600' },
  logout: { marginTop: Theme.spacing.xl },
});
