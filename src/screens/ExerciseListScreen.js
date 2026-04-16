import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import exercises from '../data/exercises.json';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedText } from '../utils/localize';

export default function ExerciseListScreen({ navigation, route }) {
  const { isRTL, language, t } = useLanguage();
  const { muscleKey } = route.params;
  const exerciseList = exercises[muscleKey] || [];

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={exerciseList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={[styles.headerText, textStyle]}>{t('exerciseListHint')}</Text>
          </View>
        }
        ListEmptyComponent={<Text style={[styles.emptyText, textStyle]}>{t('emptyExercises')}</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
              defaultSource={{
                uri: `https://via.placeholder.com/900x500/141b24/6ee7b7?text=${encodeURIComponent(
                  getLocalizedText(item.name, language).toUpperCase()
                )}`,
              }}
            />
            <View style={styles.cardBody}>
              <Text style={[styles.exerciseName, textStyle]}>{getLocalizedText(item.name, language)}</Text>
              <Text style={[styles.exerciseDescription, textStyle]}>
                {getLocalizedText(item.description, language)}
              </Text>
            </View>
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
  },
  headerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerText: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surfaceSoft,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  exerciseName: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '800',
  },
  exerciseDescription: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.9,
  },
});
