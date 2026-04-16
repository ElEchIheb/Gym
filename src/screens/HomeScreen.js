import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import exercises from '../data/exercises.json';
import { theme } from '../constants/theme';
import { getExerciseCountLabel, LANGUAGE_OPTIONS } from '../constants/translations';
import { useLanguage } from '../context/LanguageContext';

const MUSCLE_META = {
  biceps: { emoji: '💪', color: '#E63946' },
  triceps: { emoji: '🦾', color: '#FF6B35' },
  chest: { emoji: '🫁', color: '#4CC9F0' },
  back: { emoji: '🔙', color: '#7209B7' },
  shoulders: { emoji: '🏋️', color: '#F72585' },
  abs: { emoji: '🔥', color: '#4361EE' },
  forearms: { emoji: '✊', color: '#06D6A0' },
  legs: { emoji: '🦵', color: '#FFB703' },
  calves: { emoji: '🦿', color: '#FB8500' },
  cardio: { emoji: '❤️', color: '#EF233C' },
};

export default function HomeScreen({ navigation }) {
  const { isRTL, language, t } = useLanguage();
  const muscleKeys = Object.keys(exercises);
  const currentLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language)?.label || 'English';

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };
  const cardTextStyle = {
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={muscleKeys}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ gap: theme.spacing.sm }}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={[styles.languageText, textStyle]}>
              {t('selectedLanguage')}: {currentLanguage}
            </Text>
            <Text style={[styles.title, textStyle]}>{t('pickMuscle')}</Text>
            <Text style={[styles.subtitle, textStyle]}>{t('homeHint')}</Text>

            <Pressable
              onPress={() => navigation.navigate('Language')}
              style={({ pressed }) => [
                styles.changeLanguageButton,
                isRTL && styles.alignEnd,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.changeLanguageText}>{t('changeLanguage')}</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const meta = MUSCLE_META[item] || { emoji: '🏋️', color: theme.colors.primary };

          return (
            <Pressable
              onPress={() => navigation.navigate('ExerciseList', { muscleKey: item })}
              style={({ pressed }) => [
                styles.groupCard,
                { borderColor: meta.color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.groupEmoji}>{meta.emoji}</Text>
              <Text style={[styles.groupTitle, cardTextStyle]}>{t(`muscleGroups.${item}`)}</Text>
              <Text style={[styles.groupCount, cardTextStyle]}>
                {getExerciseCountLabel(language, exercises[item].length)}
              </Text>
            </Pressable>
          );
        }}
      />
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
    gap: theme.spacing.sm,
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  languageText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  changeLanguageButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  changeLanguageText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  groupCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    minHeight: 130,
    marginBottom: theme.spacing.sm,
  },
  groupEmoji: {
    fontSize: 34,
  },
  groupTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  groupCount: {
    color: theme.colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  pressed: {
    opacity: 0.85,
  },
});
