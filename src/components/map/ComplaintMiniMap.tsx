import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Theme } from '@/src/constants/theme';

interface ComplaintMiniMapProps {
  latitude: number;
  longitude: number;
  pinColor: string;
}

export default function ComplaintMiniMap({
  latitude,
  longitude,
  pinColor,
}: ComplaintMiniMapProps) {
  return (
    <MapView
      style={styles.map}
      scrollEnabled={false}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker coordinate={{ latitude, longitude }} pinColor={pinColor} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 160,
    marginHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
  },
});
