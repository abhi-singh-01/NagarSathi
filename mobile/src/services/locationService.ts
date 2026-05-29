import * as Location from 'expo-location';
import { LocationCoords } from '@/src/types';
import { requestLocationPermission } from './permissionService';

export interface LocationResult {
  coords: LocationCoords;
  address?: string;
}

export const getCurrentPreciseLocation = async (): Promise<LocationResult> => {
  const { granted } = await requestLocationPermission();
  if (!granted) {
    throw new Error('Location permission is required to report civic issues.');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.BestForNavigation,
    mayShowUserSettingsDialog: true,
  });

  const coords: LocationCoords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    altitude: position.coords.altitude,
  };

  let address: string | undefined;
  try {
    const [geo] = await Location.reverseGeocodeAsync({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    if (geo) {
      const parts = [
        geo.name,
        geo.street,
        geo.district,
        geo.city,
        geo.region,
        geo.postalCode,
      ].filter(Boolean);
      address = parts.join(', ');
    }
  } catch {
    // reverse geocode optional
  }

  return { coords, address };
};

export const watchLocation = (
  callback: (coords: LocationCoords) => void
): { remove: () => void } => {
  let subscription: Location.LocationSubscription | null = null;

  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 5,
      timeInterval: 3000,
    },
    (pos) => {
      callback({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    }
  ).then((sub) => {
    subscription = sub;
  });

  return {
    remove: () => subscription?.remove(),
  };
};
