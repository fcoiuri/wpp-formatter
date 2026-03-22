import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseWhatsApp } from '../utils/parser';

interface Props {
  value: string;
}

export default function Preview({ value }: Props) {
  const { t } = useTranslation();
  const html = useMemo(() => parseWhatsApp(value), [value]);

  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (!value.trim()) {
    return (
      <div className="flex flex-col items-center justify-center text-center w-full py-12 px-5" aria-live="polite">
        <div className="text-4xl mb-3" aria-hidden="true">
          💬
        </div>
        <h2 className="text-[15px] font-medium text-[#6a7e70] mb-1.5">{t('emptyTitle')}</h2>
        <p className="text-[12px] leading-relaxed text-[#8aa090] max-w-[200px]">{t('emptyDesc')}</p>
      </div>
    );
  }

  return (
    <div className="flex justify-end w-full" aria-live="polite" aria-atomic="true">
      <div
        className="max-w-[82%] rounded-[12px_2px_12px_12px] px-3 pt-2 pb-1.5 shadow-sm"
        style={{ backgroundColor: 'var(--wapp-bubble)' }}
        role="article"
        aria-label="Formatted message preview"
      >
        <div
          className="bubble-content text-[13.5px] leading-[1.65] text-neutral-950 dark:text-white"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10.5px] text-[#7a9e7e]">{time}</span>
          <span className="text-[11px] text-sky-400" aria-hidden="true">
            ✔✔
          </span>
        </div>
      </div>
    </div>
  );
}
