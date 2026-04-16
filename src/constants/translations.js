export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Francais' },
  { code: 'ar', label: 'العربية' },
];

export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS.map((item) => item.code);

const translations = {
  en: {
    appName: 'Train Hard',
    chooseLanguage: 'Choose your language',
    languageHint: 'Set your language before you enter the training floor. You can change it again any time.',
    continue: 'Enter the app',
    homeTitle: 'Train Hard',
    pickMuscle: 'Choose your target',
    homeHint: 'Hit a muscle group to unlock live media drills and clean coaching cues.',
    changeLanguage: 'Change language',
    exerciseListHint: 'Tap an exercise to open the immersive detail view with autoplay media and step-by-step guidance.',
    aboutExercise: 'Why it hits',
    howToDoIt: 'Execution',
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
    appName: 'Train Hard',
    chooseLanguage: 'Choisissez votre langue',
    languageHint: 'Choisissez votre langue avant dentrer dans la zone dentrainement. Vous pouvez la modifier a tout moment.',
    continue: 'Entrer dans lapp',
    homeTitle: 'Train Hard',
    pickMuscle: 'Choisissez votre cible',
    homeHint: 'Touchez un groupe musculaire pour ouvrir des exercices avec media live et consignes claires.',
    changeLanguage: 'Changer la langue',
    exerciseListHint: 'Touchez un exercice pour ouvrir une vue detaillee avec media automatique et etapes guidees.',
    aboutExercise: 'Pourquoi ca marche',
    howToDoIt: 'Execution',
    selectedLanguage: 'Langue selectionnee',
    emptyExercises: 'Aucun exercice trouve.',
    muscleGroups: {
      biceps: 'Biceps',
      triceps: 'Triceps',
      chest: 'Poitrine',
      back: 'Dos',
      shoulders: 'Epaules',
      abs: 'Abdos',
      forearms: 'Avant-bras',
      legs: 'Jambes',
      calves: 'Mollets',
      cardio: 'Cardio',
    },
  },
  ar: {
    appName: 'تدرّب بقوة',
    chooseLanguage: 'اختر لغتك',
    languageHint: 'حدد لغتك قبل دخول منطقة التدريب. يمكنك تغييرها في اي وقت.',
    continue: 'ادخل التطبيق',
    homeTitle: 'تدرّب بقوة',
    pickMuscle: 'اختر هدفك',
    homeHint: 'اضغط على مجموعة عضلية لفتح تمارين بوسائط حية وتعليمات واضحة.',
    changeLanguage: 'تغيير اللغة',
    exerciseListHint: 'اضغط على التمرين لفتح عرض تفصيلي مع تشغيل تلقائي للوسائط وخطوات واضحة.',
    aboutExercise: 'لماذا يعمل',
    howToDoIt: 'التنفيذ',
    selectedLanguage: 'اللغة المختارة',
    emptyExercises: 'لا توجد تمارين.',
    muscleGroups: {
      biceps: 'البايسبس',
      triceps: 'الترايسبس',
      chest: 'الصدر',
      back: 'الظهر',
      shoulders: 'الاكتاف',
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
    return `${count} تمرين`;
  }

  return `${count} exercises`;
}
