import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';

import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { getCategoryConfig } from '@/src/constants/categories';
import { Theme } from '@/src/constants/theme';
import { useComplaints } from '@/src/contexts/ComplaintsContext';
import { requestLocationPermission } from '@/src/services/permissionService';

const INDIA_CENTER: Region = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const { complaints, isLoading, refresh } = useComplaints();
  const [userRegion, setUserRegion] = useState<Region | null>(null);

  useEffect(() => {
    refresh();
    loadUserLocation();
  }, [refresh]);

  const loadUserLocation = async () => {
    const { granted } = await requestLocationPermission();
    if (!granted) return;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const region: Region = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setUserRegion(region);
    mapRef.current?.animateToRegion(region, 800);
  };

  const fitAllMarkers = useCallback(() => {
    if (complaints.length === 0) return;
    const coords = complaints.map((c) => ({
      latitude: c.location.latitude,
      longitude: c.location.longitude,
    }));
    mapRef.current?.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
      animated: true,
    });
  }, [complaints]);

  useEffect(() => {
    if (complaints.length > 0) fitAllMarkers();
  }, [complaints, fitAllMarkers]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Complaint Map" subtitle={`${complaints.length} issues on map`} />
      {isLoading && complaints.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={userRegion ?? INDIA_CENTER}
          showsUserLocation
          showsMyLocationButton
        >
          {complaints.map((c) => {
            const cat = getCategoryConfig(c.category);
            return (
              <Marker
                key={c.id}
                coordinate={{
                  latitude: c.location.latitude,
                  longitude: c.location.longitude,
                }}
                pinColor={cat.color}
                onCalloutPress={() => router.push(`/complaint/${c.id}`)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{cat.label}</Text>
                    <StatusBadge status={c.status} compact />
                    <Text style={styles.calloutTap}>Tap for details →</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  callout: { minWidth: 160, padding: 4 },
  calloutTitle: { fontWeight: '700', fontSize: 14, marginBottom: 6 },
  calloutTap: { fontSize: 11, color: Theme.colors.primary, marginTop: 6 },
});
