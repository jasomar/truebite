import type { Plugin } from 'vite';
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

/**
 * Convierte los datos en HTML al compilar: `<!-- @slot -->` inserta una plantilla y
 * `{{valor}}` inserta un dato. El contenido queda en el HTML final, así el sitio
 * funciona sin JavaScript y los buscadores lo leen completo.
 */
export const renderSections = (): Plugin => ({
  name: 'truebite:render-sections',
  buildEnd() {
    const pending = pendingLegalFields().map((field) => field.label);
    if (pending.length > 0) this.warn(`Datos legales pendientes en src/data/legal.ts: ${pending.join(', ')}`);
  },
  transformIndexHtml: {
    order: 'pre',
    handler: (html) =>
      html
        .replace(/<!-- @([\w-]+) -->/g, (match, slot: string) => {
          const render = htmlSlots[slot as keyof typeof htmlSlots];
          if (!render) throw new Error(`Slot desconocido: ${match}`);
          return render();
        })
        .replace(/\{\{([\w-]+)\}\}/g, (match, key: string) => {
          const value = textValues[key];
          if (value === undefined) throw new Error(`Valor desconocido: ${match}`);
          return value;
        }),
  },
});
