import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComplaintCard } from '@/src/components/complaint/ComplaintCard';
import { COMPLAINT_CATEGORIES } from '@/src/constants/categories';
import { Theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { useComplaints } from '@/src/contexts/ComplaintsContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { myComplaints, isLoading, refresh } = useComplaints();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onRefresh = useCallback(() => refresh(), [refresh]);

  const stats = {
    total: myComplaints.length,
    active: myComplaints.filter((c) => !['resolved', 'rejected'].includes(c.status)).length,
    resolved: myComplaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>नमस्ते, {user?.name?.split(' ')[0] ?? 'Citizen'} 👋</Text>
            <Text style={styles.subGreeting}>Report civic issues in your area</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="flag" size={16} color={Theme.colors.accent} />
          </View>
        </View>

        <Pressable style={styles.cta} onPress={() => router.push('/complaint/new')}>
          <View style={styles.ctaIcon}>
            <Ionicons name="camera" size={28} color={Theme.colors.white} />
          </View>
          <View style={styles.ctaText}>
            <Text style={styles.ctaTitle}>Report New Issue</Text>
            <Text style={styles.ctaSub}>Photo + GPS + Category</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Theme.colors.white} />
        </Pressable>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: Theme.colors.warning }]}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: Theme.colors.success }]}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {COMPLAINT_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              style={[styles.categoryPill, { borderColor: cat.color }]}
              onPress={() => router.push('/complaint/new')}
            >
              <Text style={[styles.categoryPillText, { color: cat.color }]}>{cat.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Complaints</Text>
        {myComplaints.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={40} color={Theme.colors.textMuted} />
            <Text style={styles.emptyText}>No complaints yet. Tap above to report your first issue!</Text>
          </View>
        ) : (
          myComplaints.slice(0, 5).map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c}
              onPress={() => router.push(`/complaint/${c.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  greeting: { fontSize: Theme.fontSize.xl, fontWeight: '800', color: Theme.colors.text },
  subGreeting: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary, marginTop: 4 },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Theme.colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadow.fab,
  },
  ctaIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { flex: 1, marginLeft: Theme.spacing.md },
  ctaTitle: { fontSize: Theme.fontSize.lg, fontWeight: '700', color: Theme.colors.white },
  ctaSub: { fontSize: Theme.fontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Theme.spacing.sm, marginBottom: Theme.spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    ...Theme.shadow.card,
  },
  statNum: { fontSize: Theme.fontSize.xxl, fontWeight: '800', color: Theme.colors.primary },
  statLabel: { fontSize: Theme.fontSize.xs, color: Theme.colors.textMuted, marginTop: 4 },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  categoriesScroll: { marginBottom: Theme.spacing.lg },
  categoryPill: {
    borderWidth: 1.5,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
  },
  categoryPillText: { fontSize: Theme.fontSize.sm, fontWeight: '600' },
  empty: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
    lineHeight: 22,
  },
});
