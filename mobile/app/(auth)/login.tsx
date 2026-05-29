import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import { Theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { isValidEmail, isValidPassword } from '@/src/utils/validation';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!isValidEmail(email)) next.email = 'Enter a valid email address';
    if (!isValidPassword(password)) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Login Failed', e instanceof Error ? e.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={40} color={Theme.colors.white} />
          </View>
          <Text style={styles.brand}>NagarSathi</Text>
          <Text style={styles.tagline}>नगर साथी — Your Civic Companion</Text>
          <Text style={styles.taglineEn}>Report issues. Track fixes. Build better cities.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome back</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            error={errors.password}
          />
          <Button title="Sign In" onPress={handleLogin} loading={loading} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to NagarSathi? </Text>
            <Link href="/(auth)/signup" asChild>
              <Text style={styles.link}>Create account</Text>
            </Link>
          </View>
        </View>

        <View style={styles.tricolor}>
          <View style={[styles.band, { backgroundColor: Theme.colors.saffron }]} />
          <View style={[styles.band, { backgroundColor: Theme.colors.white }]} />
          <View style={[styles.band, { backgroundColor: Theme.colors.green }]} />
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Signing in…" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flexGrow: 1, padding: Theme.spacing.lg },
  hero: { alignItems: 'center', marginBottom: Theme.spacing.xl, marginTop: Theme.spacing.lg },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadow.fab,
  },
  brand: { fontSize: Theme.fontSize.hero, fontWeight: '800', color: Theme.colors.primary },
  tagline: { fontSize: Theme.fontSize.md, color: Theme.colors.textSecondary, marginTop: 4 },
  taglineEn: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  form: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.card,
  },
  heading: {
    fontSize: Theme.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Theme.spacing.lg },
  footerText: { color: Theme.colors.textSecondary },
  link: { color: Theme.colors.primary, fontWeight: '700' },
  tricolor: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: Theme.spacing.xl,
  },
  band: { flex: 1 },
});
