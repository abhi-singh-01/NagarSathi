import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS, STATUS_LABELS, Theme } from '@/src/constants/theme';
import { ComplaintStatus } from '@/src/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  compact?: boolean;
}

export function StatusBadge({ status, compact }: StatusBadgeProps) {
  const color = STATUS_COLORS[status] ?? Theme.colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: `${color}18` }, compact && styles.compact]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, compact && styles.compactText]}>
        {STATUS_LABELS[status] ?? status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
  },
  compact: { paddingHorizontal: 8, paddingVertical: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { fontSize: Theme.fontSize.sm, fontWeight: '600' },
  compactText: { fontSize: Theme.fontSize.xs },
});
