import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useSeoSync(): void {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.resolvedLanguage ?? i18n.language;
    document.documentElement.lang = lang;
    document.title = t('seo.title');

    const setMeta = (
      selector: string,
      attrName: string,
      attrValue: string,
      content: string,
    ): void => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta(
      'meta[name="description"]',
      'name',
      'description',
      t('seo.description'),
    );
    setMeta('meta[name="keywords"]', 'name', 'keywords', t('seo.keywords'));
    setMeta(
      'meta[property="og:title"]',
      'property',
      'og:title',
      t('seo.title'),
    );
    setMeta(
      'meta[property="og:description"]',
      'property',
      'og:description',
      t('seo.description'),
    );
    setMeta(
      'meta[name="twitter:title"]',
      'name',
      'twitter:title',
      t('seo.title'),
    );
    setMeta(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      t('seo.description'),
    );
  }, [i18n.resolvedLanguage, i18n.language, t]);
}
