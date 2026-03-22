# WApp Formatter

A polished, production-ready WhatsApp message formatter built with **Vite + React + TypeScript + Tailwind CSS v4 + react-i18next**.

## Features

- ✅ All WhatsApp formatting: bold, italic, strikethrough, inline code, code block, quote, bullet list, numbered list
- ✅ Real-time preview styled exactly like WhatsApp bubbles
- ✅ Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)
- ✅ Copy to clipboard with visual feedback
- ✅ Message history (last 6 copied messages)
- ✅ Character & word counter with long-message warning
- ✅ Dark mode (follows system preference)
- ✅ Fully responsive — desktop two-column, mobile tabs
- ✅ **i18n**: Portuguese (pt-BR), English (en), Spanish (es) — auto-detected from browser
- ✅ **SEO**: meta tags, Open Graph, Twitter Card, JSON-LD structured data, sitemap, robots.txt
- ✅ PWA-ready (manifest.json)

## Project Structure

```
wapp-formatter/
├── index.html              # Entry HTML with full SEO meta tags + JSON-LD
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx
    ├── App.jsx             # Main layout + logic (Tailwind classes)
    ├── App.css             # All styles (responsive, dark mode)
    ├── index.css           # Global reset
    ├── components/
    │   ├── Toolbar.jsx     # Formatting buttons
    │   ├── Preview.jsx     # WhatsApp bubble preview
    │   ├── LanguageSelector.jsx
    │   └── History.jsx     # Recent messages chips
    ├── hooks/
    │   └── useLocale.js    # Language detection + dynamic SEO updates
    ├── i18n/
    │   └── translations.js # All UI strings in 3 languages
    └── utils/
        └── parser.js       # WhatsApp markdown → HTML parser
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## SEO Checklist (before deploying)

1. Replace `https://wappformatter.app` with your actual domain in:
   - `index.html` (canonical, OG, hreflang)
   - `public/sitemap.xml`
   - `public/robots.txt`

2. Add real images:
   - `/public/og-image.png` (1200×630px)
   - `/public/favicon.svg`
   - `/public/apple-touch-icon.png` (180×180px)
   - `/public/icon-192.png` and `/public/icon-512.png` (PWA)

3. Submit `sitemap.xml` to [Google Search Console](https://search.google.com/search-console)

## Internationalization

Language is auto-detected from `navigator.languages` (browser setting).  
User preference is persisted in `localStorage`.  
`document.title`, meta description, and keywords update dynamically per language.

To add a new language: add an entry to `src/i18n/translations.js` and include the locale code in `SUPPORTED_LOCALES`.

## Deployment

Works on any static host: **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**.

```bash
npm run build
# deploy the ./dist folder
```
