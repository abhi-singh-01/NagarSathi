import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Theme } from '@/src/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, showBack, rightAction }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Theme.spacing.sm }]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.right}>{rightAction}</View>
      </View>
      <View style={styles.tricolor}>
        <View style={[styles.band, { backgroundColor: Theme.colors.saffron }]} />
        <View style={[styles.band, { backgroundColor: Theme.colors.white, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: Theme.colors.border }]} />
        <View style={[styles.band, { backgroundColor: Theme.colors.green }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },
  backBtn: { padding: 4, marginRight: Theme.spacing.sm },
  backPlaceholder: { width: 32 },
  titles: { flex: 1 },
  title: { fontSize: Theme.fontSize.xl, fontWeight: '800', color: Theme.colors.text },
  subtitle: { fontSize: Theme.fontSize.sm, color: Theme.colors.textSecondary, marginTop: 2 },
  right: { minWidth: 32, alignItems: 'flex-end' },
  tricolor: {
    flexDirection: 'row',
    height: 3,
  },
  band: { flex: 1, height: 3 },
});
