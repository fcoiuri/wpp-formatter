import React from 'react';
import { useTranslation } from 'react-i18next';

export interface Tool {
  id: string;
  label: string;
  labelStyle: React.CSSProperties;
  syntax: string;
  wrap?: [string, string];
  prefix?: string;
  shortcut?: string;
}

export const TOOLS: Tool[] = [
  { id: 'bold', label: 'B', labelStyle: { fontWeight: 700 }, syntax: '*text*', wrap: ['*', '*'], shortcut: 'Ctrl+B' },
  { id: 'italic', label: 'I', labelStyle: { fontStyle: 'italic', fontWeight: 400 }, syntax: '_text_', wrap: ['_', '_'], shortcut: 'Ctrl+I' },
  { id: 'strikethrough', label: 'S', labelStyle: { textDecoration: 'line-through' }, syntax: '~text~', wrap: ['~', '~'], shortcut: 'Ctrl+U' },
  { id: 'inlineCode', label: '</>', labelStyle: { fontFamily: 'monospace', fontSize: '11px' }, syntax: '`text`', wrap: ['`', '`'] },
  { id: 'codeBlock', label: '{ }', labelStyle: { fontFamily: 'monospace', fontSize: '11px' }, syntax: '```text```', wrap: ['```\n', '\n```'] },
  { id: 'quote', label: '❝', labelStyle: {}, syntax: '> text', prefix: '> ' },
  { id: 'bulletList', label: '•—', labelStyle: { fontSize: '13px' }, syntax: '- text', prefix: '- ' },
  { id: 'numberedList', label: '1.', labelStyle: { fontSize: '12px' }, syntax: '1. text', prefix: '1. ' },
];

interface Props {
  onFormat: (tool: Tool) => void;
}

export default function Toolbar({ onFormat }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className="flex-none flex flex-wrap gap-1 px-2.5 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
      role="toolbar"
      aria-label="Formatting tools"
    >
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          title={`${t(`toolbar.${tool.id}`)}${tool.shortcut ? ` (${tool.shortcut})` : ''}`}
          aria-label={t(`toolbar.${tool.id}`)}
          onClick={() => onFormat(tool)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[12px] text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800 hover:text-[#128C7E] dark:hover:text-[#25D366] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <span style={tool.labelStyle}>{tool.label}</span>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono hidden md:inline">
            {tool.syntax}
            {/* {tool.syntax.replace('text', t('toolbar.text'))} */}
          </span>
        </button>
      ))}
    </div>
  );
}
