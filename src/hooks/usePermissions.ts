import { useCallback, useState } from 'react';
import {
  ensureCameraAndLocation,
  requestCameraPermission,
  requestLocationPermission,
  requestMediaLibraryPermission,
} from '@/src/services/permissionService';

export function usePermissions() {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestAllForComplaint = useCallback(async () => {
    setIsRequesting(true);
    try {
      return await ensureCameraAndLocation();
    } finally {
      setIsRequesting(false);
    }
  }, []);

  return {
    isRequesting,
    requestAllForComplaint,
    requestCamera: requestCameraPermission,
    requestLocation: requestLocationPermission,
    requestMediaLibrary: requestMediaLibraryPermission,
  };
}
