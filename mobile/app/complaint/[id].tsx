import { useLocalSearchParams } from 'expo-router';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const LazyMiniMap = React.lazy(() => import('@/src/components/map/ComplaintMiniMap'));

import { StatusTimeline } from '@/src/components/complaint/StatusTimeline';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { getCategoryConfig } from '@/src/constants/categories';
import { Theme } from '@/src/constants/theme';
import { useComplaints } from '@/src/contexts/ComplaintsContext';
import { complaintService } from '@/src/services/complaintService';
import { Complaint } from '@/src/types';
import { formatCoords, formatDate } from '@/src/utils/format';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getComplaint } = useComplaints();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const data = await getComplaint(id);
    setComplaint(data);
    setLoading(false);
  }, [id, getComplaint]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.loader}>
        <Text style={styles.notFound}>Complaint not found</Text>
      </View>
    );
  }

  const category = getCategoryConfig(complaint.category);
  const progress = complaintService.getStatusProgress(complaint.status);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Complaint Details" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: complaint.photoUri }} style={styles.photo} />

        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: `${category.color}18` }]}>
            <Text style={[styles.categoryText, { color: category.color }]}>{category.label}</Text>
          </View>
          <StatusBadge status={complaint.status} />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{Math.round(progress)}% complete</Text>
        </View>

        <Text style={styles.description}>{complaint.description}</Text>

        <View style={styles.metaCard}>
          <MetaItem icon="📍" label="Coordinates" value={formatCoords(complaint.location.latitude, complaint.location.longitude)} />
          {complaint.address && <MetaItem icon="🏙️" label="Address" value={complaint.address} />}
          <MetaItem icon="📅" label="Filed on" value={formatDate(complaint.createdAt)} />
          <MetaItem icon="🔄" label="Last updated" value={formatDate(complaint.updatedAt)} />
        </View>

        <Text style={styles.sectionTitle}>Location on Map</Text>
        <Suspense
          fallback={
            <View style={styles.mapFallback}>
              <ActivityIndicator color={Theme.colors.primary} />
            </View>
          }
        >
          <LazyMiniMap
            latitude={complaint.location.latitude}
            longitude={complaint.location.longitude}
            pinColor={category.color}
          />
        </Suspense>

        <Text style={styles.sectionTitle}>Status Timeline</Text>
        <StatusTimeline history={complaint.statusHistory} />
      </ScrollView>
    </View>
  );
}

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaIcon}>{icon}</Text>
      <View style={styles.metaContent}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { paddingBottom: Theme.spacing.xxl },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFound: { color: Theme.colors.textSecondary },
  photo: { width: '100%', height: 240, backgroundColor: Theme.colors.border },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Theme.radius.full },
  categoryText: { fontWeight: '700', fontSize: Theme.fontSize.sm },
  progressSection: { paddingHorizontal: Theme.spacing.md, marginBottom: Theme.spacing.md },
  progressBar: {
    height: 8,
    backgroundColor: Theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Theme.colors.primary, borderRadius: 4 },
  progressLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: 6,
    textAlign: 'right',
  },
  description: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    lineHeight: 24,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  metaCard: {
    backgroundColor: Theme.colors.surface,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadow.card,
  },
  metaRow: { flexDirection: 'row', marginBottom: Theme.spacing.md },
  metaIcon: { fontSize: 18, marginRight: Theme.spacing.sm, marginTop: 2 },
  metaContent: { flex: 1 },
  metaLabel: { fontSize: Theme.fontSize.xs, color: Theme.colors.textMuted, fontWeight: '600' },
  metaValue: { fontSize: Theme.fontSize.sm, color: Theme.colors.text, marginTop: 2 },
  sectionTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
    margin: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  mapFallback: {
    height: 160,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
