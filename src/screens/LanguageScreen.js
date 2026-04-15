import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { LANGUAGE_OPTIONS } from '../constants/translations';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageScreen({ navigation }) {
  const { isLoading, isRTL, language, setLanguage, t } = useLanguage();

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  async function handleContinue() {
    await setLanguage(language);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <Text style={[styles.eyebrow, textStyle]}>{t('appName')}</Text>
          <Text style={[styles.title, textStyle]}>{t('chooseLanguage')}</Text>
          <Text style={[styles.subtitle, textStyle]}>{t('languageHint')}</Text>
        </View>

        <View style={styles.languageList}>
          {LANGUAGE_OPTIONS.map((item) => {
            const isSelected = item.code === language;

            return (
              <Pressable
                key={item.code}
                onPress={() => setLanguage(item.code)}
                style={({ pressed }) => [
                  styles.languageCard,
                  isSelected && styles.languageCardSelected,
                  pressed && styles.languageCardPressed,
                  isRTL && styles.rowReverse,
                ]}
              >
                <Text style={[styles.languageLabel, textStyle]}>{item.label}</Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={handleContinue} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>{t('continue')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
  languageList: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
    flex: 1,
    justifyContent: 'center',
  },
  languageCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  languageCardPressed: {
    opacity: 0.9,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  languageLabel: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: theme.spacing.md,
  },
  radioSelected: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#052814',
    fontSize: 18,
    fontWeight: '800',
  },
});
