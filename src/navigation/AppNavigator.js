import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../constants/theme';
import { getLocalizedText } from '../utils/localize';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import HomeScreen from '../screens/HomeScreen';
import LanguageScreen from '../screens/LanguageScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { language, t } = useLanguage();

  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          animation: 'fade_from_bottom',
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: '800',
            letterSpacing: 0.3,
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Language"
          component={LanguageScreen}
          options={{
            title: t('appName'),
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            title: t('homeTitle'),
          }}
        />
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={({ route }) => ({
            title: t(`muscleGroups.${route.params.muscleKey}`),
          })}
        />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={({ route }) => ({
            title: getLocalizedText(route.params.exercise.name, language),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
