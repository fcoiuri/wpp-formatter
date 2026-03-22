import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Locale {
  code: string;
  flag: string;
  name: string;
}

const LOCALES: Locale[] = [
  { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const resolveLocale = (lang: string): Locale => {
    if (lang.startsWith('pt')) return LOCALES[0]!;
    if (lang.startsWith('es')) return LOCALES[2]!;
    return LOCALES[1]!;
  };

  const currentLang = i18n.resolvedLanguage ?? i18n.language;
  const current = resolveLocale(currentLang);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: string): void => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-2.5 py-1.5 text-white text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <span className="text-[8px] opacity-70" aria-hidden="true">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 top-[calc(100%+6px)] min-w-[150px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-[10px] shadow-lg overflow-hidden z-50"
        >
          {LOCALES.map((loc) => {
            const isActive = current.code === loc.code;
            return (
              <li
                key={loc.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(loc.code)}
                className={[
                  'flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] cursor-pointer transition-colors',
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-700 font-medium text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50',
                ].join(' ')}
              >
                <span>{loc.flag}</span>
                <span>{loc.name}</span>
                {isActive && (
                  <span className="ml-auto text-[#25D366] text-[13px]" aria-hidden="true">
                    ✓
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
