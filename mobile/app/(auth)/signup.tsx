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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import { Theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';
import { isValidEmail, isValidPassword, isValidPhone } from '@/src/utils/validation';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Enter your full name';
    if (!isValidEmail(email)) next.email = 'Enter a valid email';
    if (phone && !isValidPhone(phone)) next.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!isValidPassword(password)) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone || undefined,
      });
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Signup Failed', e instanceof Error ? e.message : 'Please try again');
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
        <Text style={styles.heading}>Join NagarSathi</Text>
        <Text style={styles.subheading}>Be the change in your neighbourhood</Text>

        <View style={styles.form}>
          <Input label="Full Name" value={name} onChangeText={setName} placeholder="Rahul Sharma" error={errors.name} />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            error={errors.email}
          />
          <Input
            label="Mobile (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="9876543210"
            maxLength={10}
            error={errors.phone}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Min. 6 characters"
            error={errors.password}
          />
          <Button title="Create Account" onPress={handleSignup} loading={loading} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={styles.link}>Sign in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay visible={loading} message="Creating account…" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flexGrow: 1, padding: Theme.spacing.lg },
  heading: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: '800',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
  },
  subheading: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
    marginTop: 4,
  },
  form: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    ...Theme.shadow.card,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Theme.spacing.lg },
  footerText: { color: Theme.colors.textSecondary },
  link: { color: Theme.colors.primary, fontWeight: '700' },
});
