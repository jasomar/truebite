import type { Product } from '../data/products.ts';

const escapeXml = (text: string): string => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Ilustración temporal del empaque. Se reemplaza cuando existan las fotos originales. */
export const pouch = (product: Product, context: string): string => {
  const { name, meat } = product;
  const id = `${context}-${product.id}`;
  const strips = [
    { x: 58, y: 208, w: 26, h: 88, r: -5 },
    { x: 88, y: 200, w: 30, h: 100, r: 3 },
    { x: 122, y: 206, w: 24, h: 92, r: -3 },
    { x: 150, y: 202, w: 28, h: 96, r: 5 },
  ]
    .map(
      (s) =>
        `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="10" fill="${meat.base}" transform="rotate(${s.r} ${s.x + s.w / 2} ${s.y + s.h / 2})"/>` +
        `<path d="M${s.x + 8} ${s.y + 12}q5 34 -1 ${s.h - 24}" stroke="${meat.shade}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    )
    .join('');

  return `<svg class="pouch" viewBox="0 0 240 340" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="kraft-${id}" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#D8B684"/><stop offset="1" stop-color="#BE9560"/>
      </linearGradient>
      <clipPath id="window-${id}"><rect x="46" y="194" width="148" height="112" rx="14"/></clipPath>
    </defs>
    <path d="M26 22q0-14 14-14h160q14 0 14 14l8 292q0 18-18 18H36q-18 0-18-18z" fill="url(#kraft-${id})"/>
    <path d="M26 36h188" stroke="#A67F4C" stroke-width="2" stroke-dasharray="2 5"/>
    <rect x="34" y="62" width="172" height="118" rx="6" fill="#2E9CB0"/>
    <text x="120" y="88" text-anchor="middle" class="pouch__brand">TRUE BITE</text>
    <text x="120" y="122" text-anchor="middle" class="pouch__name">${escapeXml(name)}</text>
    <text x="120" y="142" text-anchor="middle" class="pouch__meta">DESHIDRATADO</text>
    <text x="120" y="162" text-anchor="middle" class="pouch__meta">100% PROTEÍNA</text>
    <rect x="46" y="194" width="148" height="112" rx="14" fill="#F2E7D2"/>
    <g clip-path="url(#window-${id})">${strips}</g>
    <rect x="46" y="194" width="148" height="112" rx="14" fill="none" stroke="#A67F4C" stroke-width="2"/>
    <path d="M62 204l18 90" stroke="#fff" stroke-opacity=".35" stroke-width="7" stroke-linecap="round"/>
  </svg>`;
};
