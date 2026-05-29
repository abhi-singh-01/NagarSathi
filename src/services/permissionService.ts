import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export type PermissionType = 'camera' | 'location' | 'mediaLibrary';

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

const openSettingsAlert = (feature: string) => {
  Alert.alert(
    'Permission Required',
    `NagarSathi needs ${feature} access to report civic issues. Please enable it in Settings.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]
  );
};

export const requestCameraPermission = async (): Promise<PermissionResult> => {
  const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
  const granted = status === ImagePicker.PermissionStatus.GRANTED;
  if (!granted && !canAskAgain) {
    openSettingsAlert('camera');
  }
  return { granted, canAskAgain: canAskAgain ?? true };
};

export const requestMediaLibraryPermission = async (): Promise<PermissionResult> => {
  const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  const granted = status === ImagePicker.PermissionStatus.GRANTED;
  if (!granted && !canAskAgain) {
    openSettingsAlert('photo library');
  }
  return { granted, canAskAgain: canAskAgain ?? true };
};

export const requestLocationPermission = async (): Promise<PermissionResult> => {
  const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
  const granted = status === Location.PermissionStatus.GRANTED;
  if (!granted && !canAskAgain) {
    openSettingsAlert('location');
  }
  return { granted, canAskAgain: canAskAgain ?? true };
};

export const ensureCameraAndLocation = async (): Promise<{
  camera: boolean;
  location: boolean;
}> => {
  const [camera, location] = await Promise.all([
    requestCameraPermission(),
    requestLocationPermission(),
  ]);
  return { camera: camera.granted, location: location.granted };
};

export const getAndroidPermissionNotes = (): string[] => {
  if (Platform.OS !== 'android') return [];
  return [
    'Camera — capture complaint photos',
    'Fine location — pin exact issue on map',
    'Photos — optional gallery upload (Android 13+)',
  ];
};
