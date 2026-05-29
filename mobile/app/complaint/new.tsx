import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CategoryPicker } from '@/src/components/complaint/CategoryPicker';
import { ScreenHeader } from '@/src/components/layout/ScreenHeader';
import { Button } from '@/src/components/ui/Button';
import { LoadingOverlay } from '@/src/components/ui/LoadingOverlay';
import { Theme } from '@/src/constants/theme';
import { useComplaints } from '@/src/contexts/ComplaintsContext';
import { useLocation } from '@/src/hooks/useLocation';
import { usePermissions } from '@/src/hooks/usePermissions';
import { ComplaintCategory } from '@/src/types';
import { formatCoords } from '@/src/utils/format';
import { isValidDescription } from '@/src/utils/validation';

export default function NewComplaintScreen() {
  const { submitComplaint, isSubmitting } = useComplaints();
  const { requestAllForComplaint } = usePermissions();
  const { location, isLoading: locLoading, fetchLocation } = useLocation();

  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const capturePhoto = async () => {
    const perms = await requestAllForComplaint();
    if (!perms.camera) {
      Alert.alert('Camera Required', 'Please grant camera permission to capture complaint photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setErrors((e) => ({ ...e, photo: '' }));
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
      setErrors((e) => ({ ...e, photo: '' }));
    }
  };

  const captureLocation = async () => {
    try {
      await fetchLocation();
      setErrors((e) => ({ ...e, location: '' }));
    } catch (e) {
      Alert.alert('Location Error', e instanceof Error ? e.message : 'Could not get GPS');
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!category) next.category = 'Select a complaint category';
    if (!photoUri) next.photo = 'Capture or select a photo';
    if (!location) next.location = 'Capture GPS coordinates';
    if (!isValidDescription(description)) next.description = 'Description must be 10–500 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !category || !photoUri || !location) return;

    try {
      const complaint = await submitComplaint({
        category,
        description: description.trim(),
        photoUri,
        location: location.coords,
        address: location.address,
      });
      Alert.alert(
        'Complaint Submitted! 🎉',
        'Your issue has been forwarded to the municipal authorities. You can track its status in History.',
        [{ text: 'View Status', onPress: () => router.replace(`/complaint/${complaint.id}`) }]
      );
    } catch (e) {
      Alert.alert('Submission Failed', e instanceof Error ? e.message : 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="Report Issue" showBack />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.step}>1. Select Category</Text>
        <CategoryPicker selected={category} onSelect={setCategory} />
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}

        <Text style={styles.step}>2. Capture Photo</Text>
        {photoUri ? (
          <Pressable onPress={capturePhoto}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
          </Pressable>
        ) : (
          <View style={styles.photoActions}>
            <Pressable style={styles.photoBtn} onPress={capturePhoto}>
              <Ionicons name="camera" size={32} color={Theme.colors.primary} />
              <Text style={styles.photoBtnText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.photoBtn} onPress={pickFromGallery}>
              <Ionicons name="images" size={32} color={Theme.colors.primary} />
              <Text style={styles.photoBtnText}>Gallery</Text>
            </Pressable>
          </View>
        )}
        {errors.photo ? <Text style={styles.error}>{errors.photo}</Text> : null}

        <Text style={styles.step}>3. GPS Location</Text>
        <Pressable style={styles.locationBox} onPress={captureLocation}>
          <Ionicons name="location" size={28} color={Theme.colors.primary} />
          <View style={styles.locationText}>
            {location ? (
              <>
                <Text style={styles.coords}>
                  {formatCoords(location.coords.latitude, location.coords.longitude)}
                </Text>
                {location.coords.accuracy != null && (
                  <Text style={styles.accuracy}>Accuracy: ±{location.coords.accuracy.toFixed(0)}m</Text>
                )}
                {location.address ? (
                  <Text style={styles.address} numberOfLines={2}>{location.address}</Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.locationPlaceholder}>
                {locLoading ? 'Getting precise GPS…' : 'Tap to capture GPS coordinates'}
              </Text>
            )}
          </View>
          <Ionicons name="refresh" size={20} color={Theme.colors.primary} />
        </Pressable>
        {errors.location ? <Text style={styles.error}>{errors.location}</Text> : null}

        <Text style={styles.step}>4. Description</Text>
        <TextInput
          style={styles.textarea}
          multiline
          numberOfLines={4}
          placeholder="Describe the issue in detail (min. 10 characters)…"
          placeholderTextColor={Theme.colors.textMuted}
          value={description}
          onChangeText={setDescription}
          maxLength={500}
        />
        <Text style={styles.charCount}>{description.length}/500</Text>
        {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}

        <Button
          title="Submit Complaint"
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submit}
        />
      </ScrollView>
      <LoadingOverlay visible={isSubmitting} message="Uploading complaint…" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { padding: Theme.spacing.md, paddingBottom: Theme.spacing.xxl },
  step: {
    fontSize: Theme.fontSize.md,
    fontWeight: '700',
    color: Theme.colors.text,
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.sm,
  },
  photo: {
    width: '100%',
    height: 220,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.border,
  },
  photoActions: { flexDirection: 'row', gap: Theme.spacing.md },
  photoBtn: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
    padding: Theme.spacing.lg,
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  photoBtnText: { fontSize: Theme.fontSize.sm, fontWeight: '600', color: Theme.colors.primary },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: Theme.spacing.md,
  },
  locationText: { flex: 1 },
  coords: { fontSize: Theme.fontSize.sm, fontWeight: '700', color: Theme.colors.text },
  accuracy: { fontSize: Theme.fontSize.xs, color: Theme.colors.success, marginTop: 2 },
  address: { fontSize: Theme.fontSize.xs, color: Theme.colors.textSecondary, marginTop: 4 },
  locationPlaceholder: { fontSize: Theme.fontSize.sm, color: Theme.colors.textMuted },
  textarea: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.textMuted,
    marginTop: 4,
  },
  error: { color: Theme.colors.error, fontSize: Theme.fontSize.sm, marginTop: 4 },
  submit: { marginTop: Theme.spacing.xl },
});
