/**
 * Theme Manager - Handles theme switching, language detection, and smooth animations
 * Features:
 * - Light/Dark theme switching with persistence
 * - Automatic language detection based on browser language
 * - Manual language switching with localStorage persistence
 * - Smooth CSS transitions and animations
 * - Responsive and accessible implementation
 */

class ThemeManager {
  constructor() {
    this.THEME_STORAGE_KEY = 'portfolio-theme';
    this.LANGUAGE_STORAGE_KEY = 'portfolio-language';
    this.THEME_CLASS = 'dark-theme';
    this.TRANSITION_CLASS = 'theme-transition';
    this.SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh'];
    
    this.initializeTheme();
    this.initializeLanguage();
    this.setupEventListeners();
    this.applyAnimationStyles();
  }

  /**
   * Initialize theme on page load
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Priority: saved theme > system preference > default (light)
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    this.setTheme(isDark, false); // false = no animation on initial load
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_STORAGE_KEY)) {
        this.setTheme(e.matches, true);
      }
    });
  }

  /**
   * Initialize language on page load
   */
  initializeLanguage() {
    // Priority: localStorage > browser language > default (en)
    const savedLanguage = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    
    if (savedLanguage && this.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      this.setLanguage(savedLanguage, false);
    } else {
      const browserLanguage = this.detectBrowserLanguage();
      this.setLanguage(browserLanguage, false);
    }
  }

  /**
   * Detect browser language and return the closest supported language
   */
  detectBrowserLanguage() {
    // Get the full language code (e.g., 'en-US', 'es-ES')
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Return supported language or default to English
    return this.SUPPORTED_LANGUAGES.includes(langCode) ? langCode : 'en';
  }

  /**
   * Set theme and apply transitions
   */
  setTheme(isDark, animate = true) {
    const htmlElement = document.documentElement;
    
    // Add transition class for smooth animation
    if (animate) {
      htmlElement.classList.add(this.TRANSITION_CLASS);
    }
    
    // Apply or remove dark theme class
    if (isDark) {
      htmlElement.classList.add(this.THEME_CLASS);
    } else {
      htmlElement.classList.remove(this.THEME_CLASS);
    }
    
    // Save preference
    localStorage.setItem(this.THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    
    // Update CSS custom properties for dynamic theming
    this.updateThemeVariables(isDark);
    
    // Dispatch custom event for theme change
    this.dispatchThemeChangeEvent(isDark);
    
    // Remove transition class after animation
    if (animate) {
      setTimeout(() => {
        htmlElement.classList.remove(this.TRANSITION_CLASS);
      }, 300);
    }
  }

  /**
   * Set language and update DOM
   */
  setLanguage(langCode, animate = true) {
    if (!this.SUPPORTED_LANGUAGES.includes(langCode)) {
      console.warn(`Language "${langCode}" not supported. Defaulting to English.`);
      langCode = 'en';
    }
    
    const htmlElement = document.documentElement;
    
    // Add fade animation
    if (animate) {
      htmlElement.style.opacity = '0.7';
      htmlElement.style.transition = 'opacity 0.3s ease-in-out';
    }
    
    // Update HTML lang attribute
    htmlElement.setAttribute('lang', langCode);
    
    // Save preference
    localStorage.setItem(this.LANGUAGE_STORAGE_KEY, langCode);
    
    // Update page content with translations
    setTimeout(() => {
      this.updatePageTranslations(langCode);
      
      if (animate) {
        htmlElement.style.opacity = '1';
        setTimeout(() => {
          htmlElement.style.transition = '';
        }, 300);
      }
      
      // Dispatch custom event for language change
      this.dispatchLanguageChangeEvent(langCode);
    }, 150);
  }

  /**
   * Update CSS custom properties for dynamic theming
   */
  updateThemeVariables(isDark) {
    const root = document.documentElement;
    
    if (isDark) {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#b0b0b0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--accent-color', '#6366f1');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--text-primary', '#1a1a1a');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e0e0e0');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--accent-color', '#6366f1');
    }
  }

  /**
   * Update page translations
   */
  updatePageTranslations(langCode) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(langCode, key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Update document title
    const titleElement = document.querySelector('title');
    if (titleElement) {
      titleElement.textContent = this.getTranslation(langCode, 'page-title');
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', this.getTranslation(langCode, 'page-description'));
    }
  }

  /**
   * Get translation for a given key and language
   */
  getTranslation(langCode, key) {
    const translations = {
      en: {
        'page-title': 'Portfolio',
        'page-description': 'Welcome to my portfolio',
        'theme-toggle': 'Toggle Theme',
        'language-select': 'Select Language',
      },
      es: {
        'page-title': 'Portafolio',
        'page-description': 'Bienvenido a mi portafolio',
        'theme-toggle': 'Cambiar Tema',
        'language-select': 'Seleccionar Idioma',
      },
      fr: {
        'page-title': 'Portefeuille',
        'page-description': 'Bienvenue dans mon portefeuille',
        'theme-toggle': 'Basculer le thème',
        'language-select': 'Sélectionner la langue',
      },
      de: {
        'page-title': 'Portfolio',
        'page-description': 'Willkommen in meinem Portfolio',
        'theme-toggle': 'Design wechseln',
        'language-select': 'Sprache wählen',
      },
      it: {
        'page-title': 'Portafoglio',
        'page-description': 'Benvenuto nel mio portfolio',
        'theme-toggle': 'Cambia tema',
        'language-select': 'Seleziona lingua',
      },
      pt: {
        'page-title': 'Portfólio',
        'page-description': 'Bem-vindo ao meu portfólio',
        'theme-toggle': 'Alternar tema',
        'language-select': 'Selecionar idioma',
      },
      ja: {
        'page-title': 'ポートフォリオ',
        'page-description': 'ポートフォリオへようこそ',
        'theme-toggle': 'テーマを切り替える',
        'language-select': '言語を選択',
      },
      zh: {
        'page-title': '作品集',
        'page-description': '欢迎来到我的作品集',
        'theme-toggle': '切换主题',
        'language-select': '选择语言',
      },
    };
    
    return translations[langCode]?.[key] || translations['en'][key] || key;
  }

  /**
   * Setup event listeners for theme and language controls
   */
  setupEventListeners() {
    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => this.toggleTheme());
      // Update button text
      this.updateThemeToggleButton();
    }
    
    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.setLanguage(e.target.value, true);
      });
      // Update selector to current language
      const currentLang = localStorage.getItem(this.LANGUAGE_STORAGE_KEY) || this.detectBrowserLanguage();
      languageSelect.value = currentLang;
    }
  }

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    const isDark = document.documentElement.classList.contains(this.THEME_CLASS);
    this.setTheme(!isDark, true);
    this.updateThemeToggleButton();
  }

  /**
   * Update theme toggle button appearance
   */
  updateThemeToggleButton() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      const isDark = document.documentElement.classList.contains(this.THEME_CLASS);
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      themeToggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    }
  }

  /**
   * Apply CSS animation styles
   */
  applyAnimationStyles() {
    if (document.getElementById('theme-animations')) return; // Already applied
    
    const style = document.createElement('style');
    style.id = 'theme-animations';
    style.textContent = `
      /* CSS Custom Properties - Default Light Theme */
      :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f5f5f5;
        --text-primary: #1a1a1a;
        --text-secondary: #666666;
        --border-color: #e0e0e0;
        --shadow-color: rgba(0, 0, 0, 0.1);
        --accent-color: #6366f1;
        --transition-duration: 0.3s;
        --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Dark Theme */
      html.dark-theme {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --border-color: #404040;
        --shadow-color: rgba(0, 0, 0, 0.3);
      }
      
      /* Smooth transitions */
      html.theme-transition,
      html.theme-transition *,
      html.theme-transition *::before,
      html.theme-transition *::after {
        transition: background-color var(--transition-duration) var(--transition-timing),
                    color var(--transition-duration) var(--transition-timing),
                    border-color var(--transition-duration) var(--transition-timing),
                    box-shadow var(--transition-duration) var(--transition-timing) !important;
      }
      
      /* Apply theme variables to common elements */
      body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color var(--transition-duration) var(--transition-timing),
                    color var(--transition-duration) var(--transition-timing);
      }
      
      a {
        color: var(--accent-color);
      }
      
      button, input, textarea, select {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-color: var(--border-color);
      }
      
      /* Animation for language switching */
      @keyframes fadeInOut {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
        100% {
          opacity: 1;
        }
      }
      
      /* Smooth rotation for theme toggle button */
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      #theme-toggle {
        cursor: pointer;
        background: none;
        border: none;
        font-size: 1.5rem;
        transition: transform var(--transition-duration) var(--transition-timing);
      }
      
      #theme-toggle:hover {
        animation: rotate 0.6s var(--transition-timing);
      }
      
      #theme-toggle:focus-visible {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      #language-select {
        padding: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
      }
      
      #language-select:focus-visible {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
      }
      
      /* Smooth text selection */
      ::selection {
        background-color: var(--accent-color);
        color: var(--bg-primary);
      }
      
      /* Scrollbar styling */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: var(--bg-secondary);
      }
      
      ::-webkit-scrollbar-thumb {
        background: var(--text-secondary);
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: var(--accent-color);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Dispatch custom event when theme changes
   */
  dispatchThemeChangeEvent(isDark) {
    const event = new CustomEvent('themeChange', {
      detail: { isDark, theme: isDark ? 'dark' : 'light' }
    });
    document.dispatchEvent(event);
  }

  /**
   * Dispatch custom event when language changes
   */
  dispatchLanguageChangeEvent(langCode) {
    const event = new CustomEvent('languageChange', {
      detail: { langCode, language: langCode }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.classList.contains(this.THEME_CLASS) ? 'dark' : 'light';
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'en';
  }

  /**
   * Reset to system preferences
   */
  resetToSystemPreferences() {
    localStorage.removeItem(this.THEME_STORAGE_KEY);
    localStorage.removeItem(this.LANGUAGE_STORAGE_KEY);
    location.reload();
  }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
} else {
  window.themeManager = new ThemeManager();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
