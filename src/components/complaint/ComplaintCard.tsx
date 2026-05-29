import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryConfig } from '@/src/constants/categories';
import { Theme } from '@/src/constants/theme';
import { formatDate, truncate } from '@/src/utils/format';
import { Complaint } from '@/src/types';
import { Card } from '@/src/components/ui/Card';
import { StatusBadge } from '@/src/components/ui/StatusBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  onPress?: () => void;
}

export function ComplaintCard({ complaint, onPress }: ComplaintCardProps) {
  const category = getCategoryConfig(complaint.category);

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        {complaint.photoUri ? (
          <Image source={{ uri: complaint.photoUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons name="image-outline" size={28} color={Theme.colors.textMuted} />
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
            <Text style={styles.category}>{category.label}</Text>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {truncate(complaint.description, 90)}
          </Text>
          <View style={styles.meta}>
            <Ionicons name="location-outline" size={12} color={Theme.colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {complaint.address ?? `${complaint.location.latitude.toFixed(4)}, ${complaint.location.longitude.toFixed(4)}`}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.date}>{formatDate(complaint.createdAt)}</Text>
            <StatusBadge status={complaint.status} compact />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Theme.spacing.md },
  row: { flexDirection: 'row' },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: Theme.radius.md,
    backgroundColor: Theme.colors.border,
  },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, marginLeft: Theme.spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  category: { fontSize: Theme.fontSize.sm, fontWeight: '700', color: Theme.colors.text },
  description: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  metaText: { flex: 1, fontSize: Theme.fontSize.xs, color: Theme.colors.textMuted },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: Theme.fontSize.xs, color: Theme.colors.textMuted },
});
