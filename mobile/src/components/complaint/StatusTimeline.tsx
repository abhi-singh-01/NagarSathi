import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STATUS_COLORS, STATUS_LABELS, Theme } from '@/src/constants/theme';
import { formatDate } from '@/src/utils/format';
import { StatusHistoryEntry } from '@/src/types';

interface StatusTimelineProps {
  history: StatusHistoryEntry[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <View style={styles.container}>
      {sorted.map((entry, index) => {
        const color = STATUS_COLORS[entry.status] ?? Theme.colors.primary;
        const isLast = index === sorted.length - 1;
        return (
          <View key={`${entry.status}-${entry.timestamp}`} style={styles.item}>
            <View style={styles.lineCol}>
              <View style={[styles.dot, { backgroundColor: color }]} />
              {!isLast && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <Text style={[styles.status, { color }]}>{STATUS_LABELS[entry.status]}</Text>
              {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
              <Text style={styles.time}>{formatDate(entry.timestamp)}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: Theme.spacing.sm },
  item: { flexDirection: 'row', minHeight: 64 },
  lineCol: { width: 24, alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Theme.colors.border,
    marginVertical: 4,
  },
  content: { flex: 1, paddingBottom: Theme.spacing.md, paddingLeft: Theme.spacing.sm },
  status: { fontSize: Theme.fontSize.md, fontWeight: '700' },
  note: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
});
