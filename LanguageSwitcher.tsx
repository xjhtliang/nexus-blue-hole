
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../../i18n/types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation('common');
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === language
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (languageCode: LanguageCode) => {
    setLanguage(languageCode); // Updates store, i18n instance, and localStorage
    setIsOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        aria-label={t('language.switch')}
        title={t('language.switch')}
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        <svg
          className={cn("w-4 h-4 transition-transform duration-200", isOpen ? "rotate-180" : "")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "flex items-center w-full px-4 py-2 text-sm transition-colors",
                  language === lang.code
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span className="text-lg mr-3 leading-none">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
                {language === lang.code && (
                  <svg
                    className="ml-auto w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
