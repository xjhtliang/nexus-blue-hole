
import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../i18n/types';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export const SimpleLanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppStore();

  return (
    <div className="flex space-x-2">
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "px-3 py-1 rounded-md text-sm transition-colors",
            language === lang.code
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          )}
          title={lang.nativeName}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};
