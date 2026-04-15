export function getLocalizedText(value, language) {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  return value[language] || value.en || '';
}

export function getLocalizedList(value, language) {
  if (!value) {
    return [];
  }

  return value[language] || value.en || [];
}
