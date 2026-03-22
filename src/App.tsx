import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toolbar, { TOOLS, type Tool } from './components/Toolbar';
import Preview from './components/Preview';
import LanguageSelector from './components/LanguageSelector';
import History from './components/History';
import { useSeoSync } from './hooks/useSeoSync';

const MAX_HISTORY = 6;

export default function App() {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [clearPending, setClearPending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useSeoSync();

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isLong = charCount > 1000;
  const hasText = text.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key !== 'Enter') return;

    const ta = textareaRef.current;
    if (!ta) return;

    const { selectionStart, value } = ta;

    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    const lineContent = value.substring(lineStart, selectionStart);

    const bulletMatch = lineContent.match(/^(\s*)([-*])\s(.+)/);

    const numberedMatch = lineContent.match(/^(\s*)(\d+)\.\s(.+)/);

    if (bulletMatch) {
      e.preventDefault();
      const [, indent, marker] = bulletMatch;
      const insertion = `\n${indent}${marker} `;
      const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionStart);
      setText(newValue);
      requestAnimationFrame(() => {
        ta.setSelectionRange(selectionStart + insertion.length, selectionStart + insertion.length);
      });
      return;
    }

    if (numberedMatch) {
      e.preventDefault();
      const [, indent, num] = numberedMatch;
      const nextNum = parseInt(num) + 1;
      const insertion = `\n${indent}${nextNum}. `;
      const newValue = value.substring(0, selectionStart) + insertion + value.substring(selectionStart);
      setText(newValue);
      requestAnimationFrame(() => {
        ta.setSelectionRange(selectionStart + insertion.length, selectionStart + insertion.length);
      });
      return;
    }
  };

  const handleFormat = useCallback(
    (tool: Tool) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = text.substring(start, end);
      const before = text.substring(0, start);
      const after = text.substring(end);

      let newText = '';
      let newStart = start;
      let newEnd = end;

      if (tool.wrap) {
        const [open, close] = tool.wrap;
        const inner = selected || 'texto';
        newText = `${before}${open}${inner}${close}${after}`;
        newStart = start + open.length;
        newEnd = newStart + inner.length;
      } else if (tool.prefix) {
        const inner = selected || 'texto';
        newText = `${before}${tool.prefix}${inner}${after}`;
        newStart = start + tool.prefix.length;
        newEnd = newStart + inner.length;
      }

      setText(newText);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(newStart, newEnd);
      });
    },
    [text],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === 'b') {
        e.preventDefault();
        handleFormat(TOOLS[0]!);
      }
      if (e.key === 'i') {
        e.preventDefault();
        handleFormat(TOOLS[1]!);
      }
      if (e.key === 'u') {
        e.preventDefault();
        handleFormat(TOOLS[2]!);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleFormat]);

  const handleCopy = async (): Promise<void> => {
    if (!hasText) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setHistory((prev) => {
        const trimmed = text.trim();
        return [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY);
      });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const ta = textareaRef.current;
      if (ta) {
        ta.select();
        document.execCommand('copy');
      }
    }
  };

  const handleClear = (): void => {
    if (!hasText) return;
    if (!clearPending) {
      setClearPending(true);
      setTimeout(() => setClearPending(false), 2500);
      return;
    }
    setText('');
    setClearPending(false);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="flex flex-col h-dvh max-w-[1280px] mx-auto bg-white dark:bg-neutral-900 shadow-xl"
      lang={i18n.resolvedLanguage}
    >
      <header className="flex-none h-[62px] bg-[#075E54]" role="banner">
        <div className="h-full flex items-center justify-between px-5 gap-3">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              aria-hidden="true"
              className="flex-none"
            >
              <rect width="32" height="32" rx="8" fill="#25D366" />
              <path
                d="M16 5C10.477 5 6 9.477 6 15c0 1.97.57 3.806 1.553 5.355L6 27l6.787-1.787A9.93 9.93 0 0016 26c5.523 0 10-4.477 10-10S21.523 5 16 5z"
                fill="white"
              />
              <path
                d="M13 12.5c-.3-.7-.6-.7-.9-.7-.2 0-.5 0-.7.2-.3.2-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4 1 2.9.8 3.4.7.5 0 1.6-.6 1.8-1.3.2-.6.2-1.1.1-1.3-.1-.1-.3-.2-.7-.4-.3-.2-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.1.1-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.7-1.5-2-.1-.3 0-.5.1-.6l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.6l-.9-2.2z"
                fill="#25D366"
              />
            </svg>
            <div>
              <h1 className="text-white text-[17px] font-semibold tracking-tight leading-tight">{t('appName')}</h1>
              <p className="text-white/60 text-[11px] font-light mt-0.5 hidden sm:block">{t('appTagline')}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div
        className="flex sm:hidden flex-none border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        role="tablist"
      >
        {(['editor', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={mobileTab === tab}
            onClick={() => setMobileTab(tab)}
            type="button"
            className={[
              'flex-1 py-3 text-[13px] font-medium flex items-center justify-center gap-1.5 border-b-2 transition-colors',
              mobileTab === tab
                ? 'text-[#128C7E] dark:text-[#25D366] border-[#25D366]'
                : 'text-neutral-400 dark:text-neutral-500 border-transparent',
            ].join(' ')}
          >
            {t(`mobileTab.${tab}`)}
            {tab === 'preview' && hasText && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 min-h-0 overflow-hidden" role="main">
        <section
          className={[
            'flex flex-col min-h-0 sm:border-r border-neutral-200 dark:border-neutral-600',
            mobileTab === 'preview' ? 'hidden sm:flex' : 'flex',
          ].join(' ')}
          aria-label={t('editorLabel')}
        >
          <div className="flex-none px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <span className="text-[10px] font-semibold tracking-[1.4px] uppercase text-neutral-400 dark:text-neutral-500">
              {t('editorLabel')}
            </span>
          </div>

          <Toolbar onFormat={handleFormat} />

          <div className="flex-1 overflow-hidden flex min-h-0">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder')}
              aria-label={t('editorLabel')}
              spellCheck
              autoComplete="off"
              className="flex-1 resize-none p-4 text-sm leading-7 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[#128C7E]/30 dark:focus:ring-[#25D366]/30 transition-shadow min-h-0 rounded-sm m-0.5"
            />
          </div>

          <div
            className={[
              'flex-none flex items-center justify-between gap-2 flex-wrap px-3.5 py-1.5 text-[11px] border-t border-neutral-200 dark:border-neutral-700',
              isLong ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-neutral-50 dark:bg-neutral-800',
            ].join(' ')}
          >
            <span className={isLong ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-400'}>
              <strong
                className={isLong ? 'text-amber-800 dark:text-amber-300' : 'text-neutral-600 dark:text-neutral-300'}
              >
                {charCount}
              </strong>{' '}
              {t('characters')}
              {' · '}
              <strong
                className={isLong ? 'text-amber-800 dark:text-amber-300' : 'text-neutral-600 dark:text-neutral-300'}
              >
                {wordCount}
              </strong>{' '}
              {t('words')}
            </span>
            {isLong && (
              <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                {t('charWarning')}
              </span>
            )}
          </div>
        </section>

        <section
          className={['flex flex-col min-h-0', mobileTab === 'editor' ? 'hidden sm:flex' : 'flex'].join(' ')}
          aria-label={t('previewLabel')}
        >
          <div className="flex-none px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <span className="text-[10px] font-semibold tracking-[1.4px] uppercase text-neutral-400 dark:text-neutral-500">
              {t('previewLabel')}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="min-h-full p-5 flex flex-col items-end chat-bg">
              <Preview value={text} />
            </div>
          </div>

          {history.length > 0 && <History items={history} onSelect={setText} />}

          <div className="flex-none flex gap-2 p-2.5 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <button
              onClick={() => {
                void handleCopy();
              }}
              disabled={!hasText}
              aria-live="polite"
              type="button"
              className={[
                'flex-1 py-2.5 rounded-[10px] text-[13px] font-medium transition-all border',
                copied
                  ? 'bg-[#25D366] text-white border-[#25D366]'
                  : !hasText
                    ? 'border-neutral-200 dark:border-neutral-700 text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                    : 'border-[#25D366] text-[#128C7E] dark:text-[#25D366] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer',
              ].join(' ')}
            >
              {copied ? `✓ ${t('copied')}` : t('copy')}
            </button>
            <button
              onClick={handleClear}
              disabled={!hasText}
              title={clearPending ? t('clearConfirm') : t('clear')}
              type="button"
              className={[
                'px-3.5 py-2.5 rounded-[10px] text-[13px] transition-all border whitespace-nowrap',
                clearPending
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                  : !hasText
                    ? 'border-neutral-200 dark:border-neutral-700 text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 cursor-pointer',
              ].join(' ')}
            >
              {clearPending ? t('clearConfirm') : t('clear')}
            </button>
          </div>
        </section>
      </main>

      <footer
        className="flex-none border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-5 py-2.5"
        role="contentinfo"
      >
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 text-center leading-relaxed">
          {t('appDescription')}
        </p>
      </footer>
    </div>
  );
}
