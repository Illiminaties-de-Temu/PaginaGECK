import { useState, useEffect, useLayoutEffect } from 'react';
import { translations } from '../i18n/translations';

// useLayoutEffect en cliente (corre antes del paint), useEffect en servidor (SSR/SSG no lo ejecuta)
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useLanguage() {
  // Siempre arranca con 'es' para que el HTML del servidor coincida con el cliente → sin mismatch
  const [lang, setLang] = useState('es');

  // Corre sincrónicamente antes del primer paint: lee localStorage y actualiza sin que el usuario vea el flash
  useIsomorphicLayoutEffect(() => {
    const stored = localStorage.getItem('geck-language') || 'es';
    if (stored !== 'es') setLang(stored);
  }, []);

  // Escucha cambios de idioma desde el Navbar
  useEffect(() => {
    const handler = (e) => setLang(e.detail.lang);
    window.addEventListener('geck-language-change', handler);
    return () => window.removeEventListener('geck-language-change', handler);
  }, []);

  return { lang, t: translations[lang] };
}
