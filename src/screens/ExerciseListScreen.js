import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import exercises from '../data/exercises.json';
import { getLocalizedText } from '../utils/localize';

const FALLBACK_MEDIA = 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4';

const LIST_COPY = {
  en: {
    kicker: 'LIVE MEDIA',
    subtitle: (count) => `${count} exercises loaded and ready to hit.`,
    empty: 'No exercises found.',
    liveVideo: 'VIDEO',
    liveGif: 'GIF',
  },
  fr: {
    kicker: 'MEDIA LIVE',
    subtitle: (count) => `${count} exercices chargés et prêts à attaquer.`,
    empty: 'Aucun exercice trouvé.',
    liveVideo: 'VIDEO',
    liveGif: 'GIF',
  },
  ar: {
    kicker: 'وسائط حية',
    subtitle: (count) => `${count} تمارين جاهزة للانطلاق.`,
    empty: 'لا توجد تمارين.',
    liveVideo: 'فيديو',
    liveGif: 'GIF',
  },
};

function ExerciseMedia({ media, isActive, mediaTypeLabel }) {
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
          shouldPlay={isActive}
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

      <View style={styles.mediaBadge}>
        <Text style={styles.mediaBadgeText}>{mediaTypeLabel}</Text>
      </View>

      {isLoading ? (
        <View style={styles.mediaLoading}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

export default function ExerciseListScreen({ navigation, route }) {
  const { isRTL, language, t } = useLanguage();
  const copy = LIST_COPY[language] || LIST_COPY.en;
  const { muscleKey } = route.params;
  const accent = theme.muscles[muscleKey] || theme.muscles.biceps;
  const exerciseList = exercises[muscleKey] || [];
  const [visibleIds, setVisibleIds] = useState(new Set(exerciseList.slice(0, 2).map((item) => item.id)));
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  });
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    setVisibleIds(new Set(viewableItems.map(({ item }) => item.id)));
  });

  useEffect(() => {
    setVisibleIds(new Set(exerciseList.slice(0, 2).map((item) => item.id)));
  }, [muscleKey, exerciseList]);

  const textStyle = {
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={exerciseList}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        ListHeaderComponent={
          <View style={[styles.headerCard, { borderColor: accent.color }]}>
            <View style={[styles.headerTint, { backgroundColor: accent.tint }]} />
            <Text style={[styles.headerKicker, textStyle, { color: accent.color }]}>{copy.kicker}</Text>
            <Text style={[styles.headerTitle, textStyle]}>{t(`muscleGroups.${muscleKey}`)}</Text>
            <Text style={[styles.headerSubtitle, textStyle]}>{copy.subtitle(exerciseList.length)}</Text>
          </View>
        }
        ListEmptyComponent={<Text style={[styles.emptyText, textStyle]}>{copy.empty}</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => {
          const mediaTypeLabel = item.media.toLowerCase().endsWith('.mp4') ? copy.liveVideo : copy.liveGif;

          return (
            <Pressable
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: item, muscleKey })}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            >
              <ExerciseMedia
                media={item.media}
                isActive={visibleIds.has(item.id)}
                mediaTypeLabel={mediaTypeLabel}
              />

              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={[styles.cardChip, { backgroundColor: accent.tint }]}>
                    <Text style={[styles.cardChipText, { color: accent.color }]}>
                      {t(`muscleGroups.${muscleKey}`)}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.exerciseName, textStyle]}>{getLocalizedText(item.name, language)}</Text>
                <Text style={[styles.exerciseDescription, textStyle]}>
                  {getLocalizedText(item.description, language)}
                </Text>
              </View>
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
    paddingBottom: theme.spacing.xxxl,
  },
  headerCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    ...theme.shadows.card,
  },
  headerTint: {
    ...StyleSheet.absoluteFillObject,
  },
  headerKicker: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    lineHeight: 32,
    fontWeight: '900',
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  emptyText: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.xl,
  },
  separator: {
    height: theme.spacing.lg,
  },
  card: {
    overflow: 'hidden',
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.card,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.96 }],
  },
  mediaFrame: {
    position: 'relative',
    width: '100%',
    height: 230,
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
    height: 88,
    backgroundColor: theme.colors.overlay,
  },
  mediaBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    backgroundColor: 'rgba(13, 13, 13, 0.72)',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mediaBadgeText: {
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
  cardBody: {
    padding: theme.spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardIndex: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.caption,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cardChip: {
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
  },
  cardChipText: {
    fontSize: theme.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  exerciseName: {
    color: theme.colors.text,
    fontSize: theme.typography.cardTitle,
    lineHeight: 24,
    fontWeight: '900',
    marginBottom: theme.spacing.sm,
  },
  exerciseDescription: {
    color: theme.colors.secondaryText,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
