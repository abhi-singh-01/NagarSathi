import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ComplaintCard } from '@/src/components/complaint/ComplaintCard';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Theme } from '@/src/constants/theme';
import { useComplaints } from '@/src/contexts/ComplaintsContext';

export default function HistoryScreen() {
  const { myComplaints, isLoading, refresh } = useComplaints();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onRefresh = useCallback(() => refresh(), [refresh]);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Complaint History"
        subtitle={`${myComplaints.length} complaints filed`}
      />
      <FlatList
        data={myComplaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Theme.colors.primary} />
        }
        renderItem={({ item }) => (
          <ComplaintCard complaint={item} onPress={() => router.push(`/complaint/${item.id}`)} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="No complaints yet"
            subtitle="Your filed complaints will appear here with live status updates."
            actionLabel="Report an Issue"
            onAction={() => router.push('/complaint/new')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  list: { padding: Theme.spacing.md, flexGrow: 1 },
});
