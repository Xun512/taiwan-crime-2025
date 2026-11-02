(() => {
  'use strict';
  const storageKey = 'taiwan-crime-2025-theme';
  const validModes = new Set(['light', 'dark', 'system']);
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const saved = localStorage.getItem(storageKey);
    if (validModes.has(saved)) preference = saved;
  } catch { /* Theme selection still works when browser storage is unavailable. */ }

  function applyTheme() {
    const resolved = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolved;
    document.querySelectorAll('[data-theme-mode]').forEach(button => {
      const selected = button.dataset.themeMode === preference;
      button.setAttribute('aria-pressed', String(selected));
    });
    const status = document.getElementById('themeStatus');
    if (status) {
      status.textContent = preference === 'system'
        ? `跟隨系統，目前使用${resolved === 'dark' ? '深色' : '淺色'}模式`
        : `目前使用${resolved === 'dark' ? '深色' : '淺色'}模式`;
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = resolved === 'dark' ? '#15272d' : '#f6f7f3';
  }

  // Apply before stylesheets and page content paint to avoid a light flash on reload.
  applyTheme();
  function setup() {
    document.querySelectorAll('[data-theme-mode]').forEach(button => {
      button.addEventListener('click', () => {
        preference = button.dataset.themeMode;
        try { localStorage.setItem(storageKey, preference); } catch { /* Keep the choice for this page session. */ }
        applyTheme();
      });
    });
    applyTheme();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
  const onSystemChange = () => { if (preference === 'system') applyTheme(); };
  if (systemTheme.addEventListener) systemTheme.addEventListener('change', onSystemChange);
  else systemTheme.addListener(onSystemChange);
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) {
      preference = validModes.has(event.newValue) ? event.newValue : 'system';
      applyTheme();
    }
  });
})();
