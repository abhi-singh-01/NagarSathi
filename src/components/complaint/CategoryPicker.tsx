import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COMPLAINT_CATEGORIES } from '@/src/constants/categories';
import { Theme } from '@/src/constants/theme';
import { ComplaintCategory } from '@/src/types';

interface CategoryPickerProps {
  selected: ComplaintCategory | null;
  onSelect: (category: ComplaintCategory) => void;
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  construct: 'construct',
  trash: 'trash',
  bulb: 'bulb',
  water: 'water',
  warning: 'warning',
};

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  return (
    <View style={styles.grid}>
      {COMPLAINT_CATEGORIES.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[
              styles.chip,
              isSelected && { borderColor: cat.color, backgroundColor: `${cat.color}12` },
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: `${cat.color}20` }]}>
              <Ionicons
                name={iconMap[cat.icon] ?? 'alert-circle'}
                size={22}
                color={cat.color}
              />
            </View>
            <Text style={[styles.label, isSelected && { color: cat.color, fontWeight: '700' }]}>
              {cat.label}
            </Text>
            <Text style={styles.labelHi}>{cat.labelHi}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  chip: {
    width: '48%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  labelHi: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: 2,
  },
});
