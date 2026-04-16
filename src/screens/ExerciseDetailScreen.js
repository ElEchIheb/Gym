import { ResizeMode, Video } from 'expo-av';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedList, getLocalizedText } from '../utils/localize';

const FALLBACK_MEDIA = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

const DETAIL_COPY = {
  en: {
    liveVideo: 'LIVE VIDEO',
    liveGif: 'LIVE GIF',
    target: 'TARGET',
    overview: 'WHY IT HITS',
    execution: 'EXECUTION',
    stepsLabel: (count) => `${count} steps`,
  },
  fr: {
    liveVideo: 'VIDEO LIVE',
    liveGif: 'GIF LIVE',
    target: 'CIBLE',
    overview: 'POURQUOI CA MARCHE',
    execution: 'EXECUTION',
    stepsLabel: (count) => `${count} étapes`,
  },
  ar: {
    liveVideo: 'فيديو حي',
    liveGif: 'GIF حي',
    target: 'الاستهداف',
    overview: 'لماذا يعمل',
    execution: 'التنفيذ',
    stepsLabel: (count) => `${count} خطوات`,
  },
};

function ExerciseMedia({ media, mediaTypeLabel }) {
  const [source, setSource] = useState(media || FALLBACK_MEDIA);
  const [isLoading, setIsLoading] = useState(true);
  const isVideo = source.toLowerCase().endsWith('.mp4');

  useEffect(() => {
    setSource(media || FALLBACK_MEDIA);
    setIsLoading(true);
  }, [media]);

  function handleError() {
    if (source !== FALLBACK_MEDIA) {
      setSource(FALLBACK_MEDIA);
      setIsLoading(true);
      return;
    }

    setIsLoading(false);
  }

  return (
    <View style={styles.mediaFrame}>
      {isVideo ? (
        <Video
          source={{ uri: source }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
          useNativeControls={false}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      ) : (
        <Image
          source={{ uri: source }}
          style={styles.media}
          resizeMode="cover"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={handleError}
        />
      )}

      <View style={styles.mediaShade} />
      <View style={styles.mediaTypePill}>
        <Text style={styles.mediaTypeText}>{mediaTypeLabel}</Text>
      </View>

      {isLoading ? (
        <View style={styles.mediaLoading}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

export default function ExerciseDetailScreen({ route }) {
  const { exercise, muscleKey } = route.params;
  const { isRTL, language, t } = useLanguage();
  const copy = DETAIL_COPY[language] || DETAIL_COPY.en;
  const steps = getLocalizedList(exercise.steps, language);
  const accent = theme.muscles[muscleKey] || theme.muscles.biceps;
  const mediaTypeLabel = exercise.media.toLowerCase().endsWith('.mp4') ? copy.liveVideo : copy.liveGif;

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <ExerciseMedia media={exercise.media} mediaTypeLabel={mediaTypeLabel} />

          <View style={styles.heroContent}>
            <View style={[styles.heroBadgeRow, isRTL && styles.rowReverse]}>
              <View style={[styles.heroBadge, { backgroundColor: accent.tint }]}>
                <Text style={[styles.heroBadgeText, { color: accent.color }]}>
                  {copy.target}: {t(`muscleGroups.${muscleKey}`)}
                </Text>
              </View>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeTextMuted}>{copy.stepsLabel(steps.length)}</Text>
              </View>
            </View>

            <Text style={[styles.title, textStyle]}>{getLocalizedText(exercise.name, language)}</Text>
            <Text style={[styles.description, textStyle]}>{getLocalizedText(exercise.description, language)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>{copy.overview}</Text>
          <Text style={[styles.sectionBody, textStyle]}>{getLocalizedText(exercise.description, language)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textStyle]}>{copy.execution}</Text>

          {steps.map((step, index) => (
            <View
              key={`${exercise.id}-step-${index + 1}`}
              style={[styles.stepRow, isRTL && styles.stepRowReverse]}
            >
              <View style={[styles.stepBadge, { shadowColor: accent.color }]}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>

              <View style={styles.stepContent}>
                <Text style={[styles.stepText, textStyle]}>{step}</Text>
              </View>
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
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  mediaFrame: {
    position: 'relative',
    width: '100%',
    height: 320,
    backgroundColor: theme.colors.surfaceAlt,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: theme.colors.overlay,
  },
  mediaTypePill: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    backgroundColor: 'rgba(13, 13, 13, 0.74)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mediaTypeText: {
    color: theme.colors.text,
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
  },
  mediaLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.skeleton,
  },
  heroContent: {
    padding: theme.spacing.xl,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  heroBadge: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroBadgeText: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroBadgeTextMuted: {
    color: theme.colors.text,
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  sectionBody: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  stepRowReverse: {
    flexDirection: 'row-reverse',
  },
  stepBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    ...theme.shadows.glow,
  },
  stepBadgeText: {
    color: theme.colors.black,
    fontSize: theme.typography.caption,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
    paddingTop: 6,
  },
  stepText: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
