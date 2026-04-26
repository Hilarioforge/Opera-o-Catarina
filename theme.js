// =====================================================
// SISTEMA DE TEMA GLOBAL — Operação Catarina
// Aplica dark mode e cor de destaque em todas as páginas
// =====================================================

const ACCENT_PALETTES = {
  rosa:   { name: 'Rosa',    emoji: '🌸', accent: '#ec4899', mid: '#f9a8d4', light: '#fce7f3', border: '#fad4e8', bg: '#fff5f9', surface2: '#fce7f3', muted: '#b07090' },
  lilas:  { name: 'Lilás',   emoji: '💜', accent: '#a855f7', mid: '#d8b4fe', light: '#f3e8ff', border: '#e9d5ff', bg: '#faf5ff', surface2: '#f3e8ff', muted: '#9061c2' },
  azul:   { name: 'Azul',   emoji: '💙', accent: '#3b82f6', mid: '#93c5fd', light: '#eff6ff', border: '#bfdbfe', bg: '#f0f8ff', surface2: '#dbeafe', muted: '#5b87c5' },
  verde:  { name: 'Verde',   emoji: '🍃', accent: '#10b981', mid: '#6ee7b7', light: '#ecfdf5', border: '#a7f3d0', bg: '#f0fdf4', surface2: '#d1fae5', muted: '#5a9e85' },
  pessego:{ name: 'Pêssego', emoji: '🍑', accent: '#f97316', mid: '#fdba74', light: '#fff7ed', border: '#fed7aa', bg: '#fffbf5', surface2: '#ffedd5', muted: '#c27a4a' },
};

const DARK_OVERRIDES = {
  bg:       '#1a1a2e',
  surface:  '#16213e',
  surface2: '#0f3460',
  border:   '#2a2a4a',
  text:     '#f0e6ff',
  muted:    '#8888aa',
  navBg:    '#16213e',
  navBorder:'#2a2a4a',
};

const LIGHT_BASE = {
  surface: '#ffffff',
  text:    '#3b1a2e',
  navBg:   '#ffffff',
};

function getPrefs() {
  try {
    return JSON.parse(localStorage.getItem('catarina_prefs') || '{}');
  } catch { return {}; }
}

function savePrefs(prefs) {
  localStorage.setItem('catarina_prefs', JSON.stringify(prefs));
}

function applyTheme(prefs) {
  const dark   = prefs.dark   || false;
  const color  = prefs.color  || 'rosa';
  const palette = ACCENT_PALETTES[color] || ACCENT_PALETTES.rosa;

  const root = document.documentElement;

  // Cor de destaque
  root.style.setProperty('--pink',      palette.accent);
  root.style.setProperty('--pink-mid',  palette.mid);
  root.style.setProperty('--pink-light',palette.light);
  root.style.setProperty('--border',    palette.border);
  root.style.setProperty('--muted',     palette.muted);

  if (dark) {
    // Dark mode
    root.style.setProperty('--bg',       DARK_OVERRIDES.bg);
    root.style.setProperty('--surface',  DARK_OVERRIDES.surface);
    root.style.setProperty('--surface2', DARK_OVERRIDES.surface2);
    root.style.setProperty('--border',   DARK_OVERRIDES.border);
    root.style.setProperty('--text',     DARK_OVERRIDES.text);
    root.style.setProperty('--muted',    DARK_OVERRIDES.muted);
    document.body.classList.add('dark');
    // Nav e bottom-nav
    document.querySelectorAll('.bottom-nav').forEach(el => {
      el.style.background = DARK_OVERRIDES.navBg;
      el.style.borderColor = DARK_OVERRIDES.navBorder;
    });
    // Meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', DARK_OVERRIDES.bg);
  } else {
    // Light mode
    root.style.setProperty('--bg',       palette.bg);
    root.style.setProperty('--surface',  '#ffffff');
    root.style.setProperty('--surface2', palette.surface2);
    root.style.setProperty('--text',     '#3b1a2e');
    document.body.classList.remove('dark');
    document.querySelectorAll('.bottom-nav').forEach(el => {
      el.style.background = '#ffffff';
      el.style.borderColor = palette.border;
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', palette.light);
  }
}

// Aplica assim que o script carrega (antes do paint)
(function() {
  const prefs = getPrefs();
  // Aplica vars básicas antes do DOM estar pronto para evitar flash
  const dark = prefs.dark || false;
  const color = prefs.color || 'rosa';
  const palette = ACCENT_PALETTES[color] || ACCENT_PALETTES.rosa;
  const root = document.documentElement;
  root.style.setProperty('--pink', palette.accent);
  root.style.setProperty('--pink-mid', palette.mid);
  root.style.setProperty('--pink-light', palette.light);
  root.style.setProperty('--border', dark ? DARK_OVERRIDES.border : palette.border);
  root.style.setProperty('--muted', dark ? DARK_OVERRIDES.muted : palette.muted);
  root.style.setProperty('--bg',      dark ? DARK_OVERRIDES.bg      : palette.bg);
  root.style.setProperty('--surface', dark ? DARK_OVERRIDES.surface : '#ffffff');
  root.style.setProperty('--surface2',dark ? DARK_OVERRIDES.surface2 : palette.surface2);
  root.style.setProperty('--text',    dark ? DARK_OVERRIDES.text    : '#3b1a2e');
  if (dark) document.documentElement.classList.add('dark-init');
})();

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getPrefs());
});

// Exporta para uso nas páginas
window.CatTheme = {
  getPrefs,
  savePrefs,
  applyTheme,
  ACCENT_PALETTES,
};
