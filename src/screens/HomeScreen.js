import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { getExerciseCountLabel, LANGUAGE_OPTIONS } from '../constants/translations';
import { useLanguage } from '../context/LanguageContext';
import exercises from '../data/exercises.json';

const HOME_COPY = {
  en: {
    kicker: 'ELITE TRAINING',
    title: 'TRAIN HARD',
    subtitle: (exerciseCount, muscleCount) => `${exerciseCount} exercises • ${muscleCount} muscle groups`,
    sectionTitle: 'MUSCLE MAP',
    sectionHint: 'Pick your target and hit the library.',
    languageLabel: 'Language',
    changeLanguage: 'Change language',
    openLabel: 'Open group',
  },
  fr: {
    kicker: 'ENTRAINEMENT ELITE',
    title: 'ENTRAINE-TOI DUR',
    subtitle: (exerciseCount, muscleCount) => `${exerciseCount} exercices • ${muscleCount} groupes musculaires`,
    sectionTitle: 'CARTE MUSCULAIRE',
    sectionHint: 'Choisis ta cible et lance la séance.',
    languageLabel: 'Langue',
    changeLanguage: 'Changer la langue',
    openLabel: 'Ouvrir',
  },
  ar: {
    kicker: 'تدريب النخبة',
    title: 'تدرّب بقوة',
    subtitle: (exerciseCount, muscleCount) => `${exerciseCount} تمرين • ${muscleCount} مجموعات عضلية`,
    sectionTitle: 'خريطة العضلات',
    sectionHint: 'اختر هدفك وابدأ الهجوم.',
    languageLabel: 'اللغة',
    changeLanguage: 'تغيير اللغة',
    openLabel: 'افتح المجموعة',
  },
};

export default function HomeScreen({ navigation }) {
  const { isRTL, language, t } = useLanguage();
  const copy = HOME_COPY[language] || HOME_COPY.en;
  const muscleCards = Object.entries(exercises).map(([key, list]) => ({
    key,
    count: list.length,
    meta: theme.muscles[key] || theme.muscles.biceps,
  }));
  const totalExercises = muscleCards.reduce((sum, item) => sum + item.count, 0);
  const selectedLanguage =
    LANGUAGE_OPTIONS.find((item) => item.code === language)?.label || LANGUAGE_OPTIONS[0].label;

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <FlatList
        data={muscleCards}
        keyExtractor={(item) => item.key}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View>
            <View style={styles.heroCard}>
              <View style={styles.heroGlowPrimary} />
              <View style={styles.heroGlowAccent} />

              <Text style={[styles.heroKicker, textStyle]}>{copy.kicker}</Text>
              <Text style={[styles.heroTitle, textStyle]}>{copy.title}</Text>
              <Text style={[styles.heroSubtitle, textStyle]}>
                {copy.subtitle(totalExercises, muscleCards.length)}
              </Text>

              <View style={[styles.heroFooter, isRTL && styles.rowReverse]}>
                <View style={styles.languagePill}>
                  <Text style={styles.languagePillText}>
                    {copy.languageLabel}: {selectedLanguage}
                  </Text>
                </View>

                <Pressable
                  onPress={() => navigation.navigate('Language')}
                  style={({ pressed }) => [styles.heroButton, pressed && styles.heroButtonPressed]}
                >
                  <Text style={styles.heroButtonText}>{copy.changeLanguage}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, textStyle]}>{copy.sectionTitle}</Text>
              <Text style={[styles.sectionHint, textStyle]}>{copy.sectionHint}</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ExerciseList', { muscleKey: item.key })}
            style={({ pressed }) => [
              styles.card,
              {
                borderColor: item.meta.color,
                shadowColor: item.meta.color,
              },
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.cardTint, { backgroundColor: item.meta.tint }]} />

            <View style={styles.cardTopRow}>
              <View style={[styles.emojiBadge, { borderColor: item.meta.color }]}>
                <Text style={styles.cardEmoji}>{item.meta.emoji}</Text>
              </View>

              <View style={[styles.countBadge, { backgroundColor: item.meta.tint }]}>
                <Text style={[styles.countBadgeText, { color: item.meta.color }]}>{item.count}</Text>
              </View>
            </View>

            <Text style={[styles.cardTitle, textStyle]}>{t(`muscleGroups.${item.key}`)}</Text>
            <Text style={[styles.cardCount, textStyle]}>{getExerciseCountLabel(language, item.count)}</Text>
            <Text style={[styles.cardAction, textStyle]}>{copy.openLabel}</Text>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  columnWrapper: {
    gap: theme.spacing.md,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  heroGlowPrimary: {
    position: 'absolute',
    top: -10,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.primaryGlow,
  },
  heroGlowAccent: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: theme.colors.accentSoft,
  },
  heroKicker: {
    color: theme.colors.primary,
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.hero,
    lineHeight: 46,
    fontWeight: '900',
    letterSpacing: -1.5,
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 24,
    maxWidth: '85%',
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  languagePill: {
    flex: 1,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  languagePillText: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  heroButton: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  heroButtonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.96 }],
  },
  heroButtonText: {
    color: theme.colors.black,
    fontSize: theme.typography.caption,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  sectionHeader: {
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sectionHint: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
  },
  card: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    minHeight: 192,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.96 }],
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emojiBadge: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
  },
  cardEmoji: {
    fontSize: 24,
  },
  countBadge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  countBadgeText: {
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: theme.spacing.xs,
  },
  cardCount: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  cardAction: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
