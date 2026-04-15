import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import exercises from '../data/exercises.json';
import { theme } from '../constants/theme';
import { getExerciseCountLabel, LANGUAGE_OPTIONS } from '../constants/translations';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { isRTL, language, t } = useLanguage();
  const muscleKeys = Object.keys(exercises);
  const currentLanguage = LANGUAGE_OPTIONS.find((item) => item.code === language)?.label || 'English';

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={muscleKeys}
        keyExtractor={(item) => item}
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
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ExerciseList', { muscleKey: item })}
            style={({ pressed }) => [
              styles.groupCard,
              isRTL && styles.rowReverse,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.groupTextWrap}>
              <Text style={[styles.groupTitle, textStyle]}>{t(`muscleGroups.${item}`)}</Text>
              <Text style={[styles.groupCount, textStyle]}>
                {getExerciseCountLabel(language, exercises[item].length)}
              </Text>
            </View>
            <Text style={styles.groupArrow}>{isRTL ? '<' : '>'}</Text>
          </Pressable>
        )}
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
    gap: theme.spacing.md,
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  groupTextWrap: {
    flex: 1,
    gap: 4,
  },
  groupTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  groupCount: {
    color: theme.colors.muted,
    fontSize: 14,
  },
  groupArrow: {
    color: theme.colors.primary,
    fontSize: 26,
    fontWeight: '700',
    marginStart: theme.spacing.md,
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  pressed: {
    opacity: 0.9,
  },
});
