import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, translate } from '../constants/translations';

const LANGUAGE_STORAGE_KEY = '@simple-gym-app/language';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (isMounted && savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.log('Unable to load language', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  async function setLanguage(nextLanguage) {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.log('Unable to save language', error);
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoading,
        isRTL: language === 'ar',
        setLanguage,
        t: (key) => translate(language, key),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
