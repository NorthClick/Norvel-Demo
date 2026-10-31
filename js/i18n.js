(function() {
  function getNestedValue(obj, key) {
    return key.split('.').reduce(function(o, k) { return o && o[k]; }, obj);
  }

  function applyTranslations(lang) {
    var translations = window.SITE_I18N && window.SITE_I18N[lang];
    if (!translations) return;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n'));
      if (val !== undefined) el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n-html'));
      if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var val = getNestedValue(translations, el.getAttribute('data-i18n-placeholder'));
      if (val !== undefined) el.setAttribute('placeholder', val);
    });
  }

  function updateLangButtons(lang) {
    document.querySelectorAll('.lang-switcher button, .lang-switcher a').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function detectLang() {
    var stored = localStorage.getItem('site-lang');
    if (stored) return stored;
    var browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2);
    if (['es', 'en', 'pt'].indexOf(browserLang) !== -1) return browserLang;
    return 'es';
  }

  window.setLang = function(lang) {
    localStorage.setItem('site-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
    updateLangButtons(lang);
  };

  document.addEventListener('DOMContentLoaded', function() {
    var lang = detectLang();
    window.setLang(lang);
  });
})();
