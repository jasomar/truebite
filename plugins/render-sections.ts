import type { HtmlTagDescriptor, Plugin } from 'vite';
import { LEGAL_UPDATED, legalFields, pendingLegalFields, type LegalField } from '../src/data/legal.ts';
import { site } from '../src/data/site.ts';
import { htmlSlots } from '../src/templates/sections.ts';
import { generalOrderUrl } from '../src/ts/services/whatsapp.ts';

const textValues: Record<string, string> = {
  'whatsapp-url': generalOrderUrl(),
  'whatsapp-display': site.whatsappDisplay,
  'instagram-url': site.instagramUrl,
  'cause-url': site.causeUrl,
  'cause-name': site.causeName,
  year: String(new Date().getFullYear()),
  'legal-updated': LEGAL_UPDATED,
  ...Object.fromEntries(
    Object.entries<LegalField>(legalFields).map(([key, field]) => [
      key,
      field.value ?? `<mark>[Pendiente: ${field.label}]</mark>`,
    ]),
  ),
};

const OG_IMAGE = { path: '/og-image.png', width: 1200, height: 630 };

/** Rutas públicas de cada página. index.html se publica como la raíz. */
const publicPath = (htmlPath: string): string => (htmlPath.endsWith('/index.html') ? '/' : htmlPath);

const absolute = (path: string): string => (site.url ? `${site.url}${path}` : path);

// Etiquetas comunes a todas las páginas: íconos y vista previa al compartir (WhatsApp,
// Instagram, Facebook, X). Sin site.url las rutas quedan relativas y la compilación avisa,
// porque varias plataformas solo leen la imagen con una URL completa.
const headTags = (htmlPath: string, html: string): HtmlTagDescriptor[] => {
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? site.name;
  const description = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });
  const tags: HtmlTagDescriptor[] = [
    { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }, injectTo: 'head' },
    meta({ property: 'og:site_name', content: site.name }),
    meta({ property: 'og:title', content: title }),
    meta({ property: 'og:description', content: description }),
    meta({ property: 'og:image', content: absolute(OG_IMAGE.path) }),
    meta({ property: 'og:image:width', content: String(OG_IMAGE.width) }),
    meta({ property: 'og:image:height', content: String(OG_IMAGE.height) }),
    meta({ property: 'og:image:alt', content: 'Tres empaques de premios True Bite y el titular Premios 100% proteína para perros y gatos' }),
    meta({ name: 'twitter:card', content: 'summary_large_image' }),
  ];
  if (site.url) {
    const url = absolute(publicPath(htmlPath));
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url }, injectTo: 'head' }, meta({ property: 'og:url', content: url }));
  }
  return tags;
};

/**
 * Convierte los datos en HTML al compilar: `<!-- @slot -->` inserta una plantilla y
 * `{{valor}}` inserta un dato. El contenido queda en el HTML final, así el sitio
 * funciona sin JavaScript y los buscadores lo leen completo.
 */
// Fuentes del primer render. Precargarlas evita que el texto salte al cambiar de la fuente
// del sistema a la propia (en las páginas legales eso movía el contenido).
const PRELOADED_FONTS = ['fredoka-latin-wght-normal', 'nunito-latin-wght-normal'];

/** Inserta <link rel="preload"> para las fuentes, con su nombre final ya compilado. */
export const preloadFonts = (): Plugin => ({
  name: 'truebite:preload-fonts',
  transformIndexHtml: {
    order: 'post',
    handler: (_html, context) => {
      if (!context.bundle) return [];
      return Object.values(context.bundle)
        .filter((file) => PRELOADED_FONTS.some((font) => file.fileName.includes(`/${font}.`)))
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file.fileName}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head-prepend' as const,
        }));
    },
  },
});

export const renderSections = (): Plugin => ({
  name: 'truebite:render-sections',
  buildEnd() {
    const pending = pendingLegalFields().map((field) => field.label);
    if (pending.length > 0) this.warn(`Datos legales pendientes en src/data/legal.ts: ${pending.join(', ')}`);
    if (!site.url) this.warn('Falta site.url en src/data/site.ts: sin dominio no hay URL canónica y la imagen al compartir puede no mostrarse.');
  },
  transformIndexHtml: {
    order: 'pre',
    handler: (source, context) => {
      const html = source
        .replace(/<!-- @([\w-]+) -->/g, (match, slot: string) => {
          const render = htmlSlots[slot as keyof typeof htmlSlots];
          if (!render) throw new Error(`Slot desconocido: ${match}`);
          return render();
        })
        .replace(/\{\{([\w-]+)\}\}/g, (match, key: string) => {
          const value = textValues[key];
          if (value === undefined) throw new Error(`Valor desconocido: ${match}`);
          return value;
        });
      return { html, tags: headTags(context.path, html) };
    },
  },
});
