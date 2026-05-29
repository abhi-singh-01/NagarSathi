import { useCallback, useState } from 'react';
import { getCurrentPreciseLocation, LocationResult } from '@/src/services/locationService';

export function useLocation() {
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getCurrentPreciseLocation();
      setLocation(result);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not get location';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { location, isLoading, error, fetchLocation, setLocation };
}
