import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedList, getLocalizedText } from '../utils/localize';

export default function ExerciseDetailScreen({ route }) {
  const { exercise } = route.params;
  const { isRTL, language, t } = useLanguage();
  const steps = getLocalizedList(exercise.steps, language);

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: exercise.image }} style={styles.image} />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>{t('aboutExercise')}</Text>
          <Text style={[styles.exerciseDescription, textStyle]}>
            {getLocalizedText(exercise.description, language)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>{t('howToDoIt')}</Text>

          {steps.map((step, index) => (
            <View key={`${exercise.id}-step-${index + 1}`} style={[styles.stepRow, isRTL && styles.stepRowReverse]}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, textStyle]}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceSoft,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  exerciseDescription: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  stepRowReverse: {
    flexDirection: 'row-reverse',
  },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#052814',
    fontSize: 14,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
