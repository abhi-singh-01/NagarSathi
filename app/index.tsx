import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
