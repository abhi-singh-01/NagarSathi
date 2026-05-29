import React, { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Theme } from '@/src/constants/theme';

const LazyMapScreen = React.lazy(() => import('@/src/screens/MapScreen'));

export default function MapTab() {
  return (
    <Suspense
      fallback={
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      }
    >
      <LazyMapScreen />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
});
