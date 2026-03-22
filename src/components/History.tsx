import { useTranslation } from 'react-i18next';

interface Props {
  items: string[];
  onSelect: (text: string) => void;
}

export default function History({ items, onSelect }: Props) {
  const { t } = useTranslation();
  if (!items.length) return null;

  return (
    <div
      className="flex-none px-3 py-2 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
      aria-label={t('historyTitle')}
    >
      <span className="block text-[9.5px] font-semibold tracking-[1.2px] uppercase text-neutral-400 dark:text-neutral-500 mb-1.5">
        {t('historyTitle')}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(item)}
            title={item}
            className="max-w-[180px] truncate bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full px-2.5 py-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-[#128C7E] dark:hover:text-[#25D366] transition-colors cursor-pointer"
          >
            {item.length > 35 ? `${item.slice(0, 35)}…` : item}
          </button>
        ))}
      </div>
    </div>
  );
}
