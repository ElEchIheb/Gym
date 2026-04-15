export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS.map((item) => item.code);

const translations = {
  en: {
    appName: 'Simple Gym App',
    chooseLanguage: 'Choose your language',
    languageHint: 'Pick a language before entering the app. You can change it again later.',
    continue: 'Continue',
    homeTitle: 'Home',
    pickMuscle: 'Choose a muscle group',
    homeHint: 'Tap a group to see simple exercises and easy instructions.',
    changeLanguage: 'Change language',
    exerciseListHint: 'Tap any exercise to open a bigger image and a short explanation.',
    aboutExercise: 'Short description',
    howToDoIt: 'How to do it',
    selectedLanguage: 'Selected language',
    emptyExercises: 'No exercises found.',
    muscleGroups: {
      biceps: 'Biceps',
      triceps: 'Triceps',
      chest: 'Chest',
      back: 'Back',
      shoulders: 'Shoulders',
      abs: 'Abs',
      forearms: 'Forearms',
      legs: 'Legs',
      calves: 'Calves',
      cardio: 'Cardio',
    },
  },
  fr: {
    appName: 'Application Gym Simple',
    chooseLanguage: 'Choisissez votre langue',
    languageHint: "Choisissez une langue avant d'entrer dans l'application. Vous pourrez la changer plus tard.",
    continue: 'Continuer',
    homeTitle: 'Accueil',
    pickMuscle: 'Choisissez un groupe musculaire',
    homeHint: 'Touchez un groupe pour voir des exercices simples et des consignes faciles.',
    changeLanguage: 'Changer de langue',
    exerciseListHint: 'Touchez un exercice pour voir une image plus grande et une courte explication.',
    aboutExercise: 'Courte description',
    howToDoIt: 'Comment le faire',
    selectedLanguage: 'Langue choisie',
    emptyExercises: 'Aucun exercice trouvé.',
    muscleGroups: {
      biceps: 'Biceps',
      triceps: 'Triceps',
      chest: 'Poitrine',
      back: 'Dos',
      shoulders: 'Épaules',
      abs: 'Abdos',
      forearms: 'Avant-bras',
      legs: 'Jambes',
      calves: 'Mollets',
      cardio: 'Cardio',
    },
  },
  ar: {
    appName: 'تطبيق الجيم البسيط',
    chooseLanguage: 'اختر لغتك',
    languageHint: 'اختر اللغة قبل الدخول إلى التطبيق. يمكنك تغييرها لاحقًا في أي وقت.',
    continue: 'متابعة',
    homeTitle: 'الرئيسية',
    pickMuscle: 'اختر مجموعة عضلية',
    homeHint: 'اضغط على أي مجموعة لرؤية تمارين بسيطة وتعليمات سهلة.',
    changeLanguage: 'تغيير اللغة',
    exerciseListHint: 'اضغط على أي تمرين لعرض صورة أكبر وشرح قصير.',
    aboutExercise: 'وصف قصير',
    howToDoIt: 'طريقة الأداء',
    selectedLanguage: 'اللغة المختارة',
    emptyExercises: 'لا توجد تمارين.',
    muscleGroups: {
      biceps: 'البايسبس',
      triceps: 'الترايسبس',
      chest: 'الصدر',
      back: 'الظهر',
      shoulders: 'الأكتاف',
      abs: 'البطن',
      forearms: 'الساعدان',
      legs: 'الساقان',
      calves: 'السمانة',
      cardio: 'الكارديو',
    },
  },
};

export function translate(language, key) {
  const path = key.split('.');
  let value = translations[language] || translations.en;

  for (const part of path) {
    value = value?.[part];
  }

  if (value !== undefined) {
    return value;
  }

  let fallback = translations.en;

  for (const part of path) {
    fallback = fallback?.[part];
  }

  return fallback ?? key;
}

export function getExerciseCountLabel(language, count) {
  if (language === 'fr') {
    return `${count} exercices`;
  }

  if (language === 'ar') {
    return `${count} تمارين`;
  }

  return `${count} exercises`;
}
