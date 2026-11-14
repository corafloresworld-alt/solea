(() => {
  const copy = {
    es: {
      menuLabel: 'Menú', menuOpenLabel: 'Abrir o cerrar el menú', homeLabel: 'SOLÉA — inicio', languageLabel: 'Idioma',
      instagramLabel: 'Instagram de SOLÉA', tiktokLabel: 'TikTok de SOLÉA', mainNavigationLabel: 'Navegación principal',
      eventsMenuLabel: 'Abrir el menú de eventos', navConcept: 'El concepto', navEvents: 'Eventos',
      navHost: 'Acoge SOLÉA', navContact: 'Contacto', quoteButton: 'Solicitar presupuesto',
      privateMenuTitle: 'Eventos privados', privateMenuButton: 'Ver eventos privados',
      professionalMenuTitle: 'Eventos profesionales', professionalMenuButton: 'Ver eventos profesionales',
      referenceLabel: 'Visual ilustrativo'
    },
    en: {
      menuLabel: 'Menu', menuOpenLabel: 'Open or close the menu', homeLabel: 'SOLÉA — home', languageLabel: 'Language',
      instagramLabel: 'SOLÉA on Instagram', tiktokLabel: 'SOLÉA on TikTok', mainNavigationLabel: 'Main navigation',
      eventsMenuLabel: 'Open the events menu', navConcept: 'The concept', navEvents: 'Events',
      navHost: 'Host SOLÉA', navContact: 'Contact', quoteButton: 'Request a quote',
      privateMenuTitle: 'Private events', privateMenuButton: 'Explore private events',
      professionalMenuTitle: 'Corporate events', professionalMenuButton: 'Explore corporate events',
      referenceLabel: 'Illustrative visual'
    }
  };

  const languageButtons = document.querySelectorAll('[data-language]');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-navigation');
  const eventsMenuTrigger = document.querySelector('#events-menu-trigger');
  const eventsMenu = document.querySelector('#events-menu');

  function setLanguage(language, persist = true) {
    const selected = language === 'en' ? 'en' : 'es';
    const strings = copy[selected];
    document.documentElement.lang = selected;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = strings[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const value = strings[element.dataset.i18nAria];
      if (value) element.setAttribute('aria-label', value);
    });
    languageButtons.forEach((button) => {
      const active = button.dataset.language === selected;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (persist) {
      try { localStorage.setItem('solea-home-language', selected); } catch (_) { /* Keep the selected language for this page view. */ }
    }
  }

  function closeEventsMenu() {
    eventsMenu.hidden = true;
    eventsMenuTrigger.setAttribute('aria-expanded', 'false');
  }

  function closeMenu() {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    closeEventsMenu();
  }

  languageButtons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    closeEventsMenu();
    menuToggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  eventsMenuTrigger.addEventListener('click', () => {
    const open = eventsMenuTrigger.getAttribute('aria-expanded') !== 'true';
    eventsMenu.hidden = !open;
    eventsMenuTrigger.setAttribute('aria-expanded', String(open));
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-dropdown')) closeEventsMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  let initialLanguage = 'es';
  try { if (localStorage.getItem('solea-home-language') === 'en') initialLanguage = 'en'; } catch (_) { /* Spanish is the default. */ }
  setLanguage(initialLanguage, false);
})();

