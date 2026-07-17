export const THEME_STORAGE_KEY = 'ember-theme';
export const DEFAULT_THEME_ID = 'ember-1';

export const emberThemes = [
  {
    id: 'ember-1',
    name: 'Minimal Classic',
    description: 'Default clean, flat appearance',
    sourceFile: 'Ember Final.dc.html',
    previewColors: ['#201C17', '#FFFFFF', '#EA580C', '#F5F3EE'],
  },
  {
    id: 'ember-4',
    name: 'Soft Clay',
    description: 'Warm rounded surfaces with soft tactile depth',
    sourceFile: 'Ember Final v4.dc.html',
    previewColors: ['#241C14', '#FFF2E0', '#FF7A29', '#FFE4CB'],
  },
  {
    id: 'ember-5',
    name: 'Skeuomorphic Wood',
    description: 'Premium warm physical surfaces',
    sourceFile: 'Ember Final v5.dc.html',
    previewColors: ['#241C14', '#F0E1C2', '#D14A05', '#D3BE97'],
  },
  {
    id: 'ember-6',
    name: 'Retro Diner',
    description: 'Vintage energy with restrained diner accents',
    sourceFile: 'Ember Final v6.dc.html',
    previewColors: ['#241C14', '#FBF0DC', '#C8511B', '#F6ECD3'],
  },
  {
    id: 'ember-7',
    name: 'Neumorphism',
    description: 'Soft raised and inset controls',
    sourceFile: 'Ember Final v7.dc.html',
    previewColors: ['#241C14', '#EAE3D5', '#A84418', '#FFFEF5'],
  },
  {
    id: 'ember-crystal',
    name: 'Glassmorphism',
    description: 'Layered translucent glass with stronger readable surfaces',
    sourceFile: 'Ember Crystal.dc.html',
    previewColors: ['#2B2018', '#FDF8F2', '#EA580C', '#FFFFFF'],
  },
];

export const themeIds = emberThemes.map((theme) => theme.id);

export function isThemeId(themeId) {
  return themeIds.includes(themeId);
}

export function normalizeThemeId(themeId) {
  return isThemeId(themeId) ? themeId : DEFAULT_THEME_ID;
}

export function readStoredTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME_ID;

  try {
    return normalizeThemeId(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function applyThemeAttribute(themeId = readStoredTheme()) {
  if (typeof document === 'undefined') return DEFAULT_THEME_ID;
  const normalized = normalizeThemeId(themeId);
  document.documentElement.setAttribute('data-theme', normalized);
  return normalized;
}
