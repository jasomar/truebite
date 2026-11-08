import type { BenefitArt } from '../data/benefits.ts';
import { products, type Product } from '../data/products.ts';
import { pouch } from './pouch.ts';

// Imágenes de los beneficios: composiciones vectoriales con la paleta de la marca y el
// empaque real de cada producto. Cada una muestra solo lo que afirma su beneficio.
// Lienzo 800×640. El contenido importante queda entre x 120–680 e y 90–550, porque el
// marco recorta los bordes según la pantalla (más ancho en móvil, más alto en computadora).

const color = {
  cream: '#FBF6EC',
  ink: '#12343B',
  tealDark: '#0E5F70',
  tealDeep: '#0A4957',
  teal: '#2E9CB0',
  tealPale: '#D9EEF1',
  kraft: '#C9A26B',
  kraftDark: '#A67F4C',
  kraftPale: '#EEDFC6',
  red: '#C8372D',
} as const;

const POUCH_RATIO = 340 / 240;

const productById = (id: string): Product => {
  const product = products.find((item) => item.id === id);
  if (!product) throw new Error(`Producto no encontrado: ${id}`);
  return product;
};

/** Ubica el empaque ilustrado dentro de la composición, escalado a `width` de ancho. */
const placedPouch = (productId: string, art: BenefitArt, x: number, y: number, width: number, rotate = 0): string => {
  const height = width * POUCH_RATIO;
  // Se usa solo el contenido del SVG del empaque: un <svg> anidado tomaría el ancho de la
  // clase .pouch del sitio y se saldría de escala.
  const inner = pouch(productById(productId), `art-${art}`)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  const scale = width / 240;
  return `<g class="pouch" transform="translate(${x} ${y}) rotate(${rotate} ${width / 2} ${height}) scale(${scale})">${inner}</g>`;
};

/** Sombra de apoyo bajo un objeto, para asentarlo en el plano. */
const groundShadow = (cx: number, cy: number, rx: number): string =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.12}" fill="${color.ink}" opacity="0.12"/>`;

/** Trazo diagonal que niega un símbolo. */
const strike = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color.red}" stroke-width="16" stroke-linecap="round"/>`;

const canvas = (art: BenefitArt, background: string, body: string): string =>
  `<svg class="benefit-art" data-art="${art}" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <rect width="800" height="640" fill="${background}"/>
    ${body}
  </svg>`;

// Rico en hierro: el empaque de hígado junto a la ficha del hierro en la tabla periódica.
const iron = (): string =>
  canvas(
    'iron',
    color.kraftPale,
    `<circle cx="400" cy="330" r="250" fill="${color.cream}"/>
    ${groundShadow(250, 520, 125)}
    ${placedPouch('higado-de-res', 'iron', 130, 165, 240, -5)}
    ${groundShadow(570, 505, 130)}
    <g transform="translate(440 190) rotate(4 130 140)">
      <rect width="260" height="280" rx="30" fill="${color.tealDark}"/>
      <text x="28" y="56" fill="${color.kraftPale}" font-family="Nunito Variable, sans-serif" font-size="30" font-weight="800">26</text>
      <text x="130" y="186" text-anchor="middle" fill="${color.cream}" font-family="Fredoka Variable, sans-serif" font-size="128" font-weight="600">Fe</text>
      <text x="130" y="246" text-anchor="middle" fill="${color.kraftPale}" font-family="Nunito Variable, sans-serif" font-size="28" font-weight="700">Hierro</text>
    </g>`,
  );

// Sin conservantes artificiales: un frasco de laboratorio tachado junto al empaque.
const noPreservatives = (): string =>
  canvas(
    'no-preservatives',
    color.tealPale,
    `<circle cx="400" cy="330" r="250" fill="${color.cream}"/>
    ${groundShadow(250, 520, 125)}
    ${placedPouch('higado-de-cerdo', 'no-preservatives', 130, 165, 240, -5)}
    <circle cx="560" cy="330" r="128" fill="${color.tealPale}"/>
    <g fill="none" stroke="${color.ink}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round">
      <path d="M535 240h50M545 240v62l-50 92a14 14 0 0 0 12 21h106a14 14 0 0 0 12-21l-50-92v-62"/>
    </g>
    <path d="M512 380h96l17 31a6 6 0 0 1-5 9h-120a6 6 0 0 1-5-9Z" fill="${color.kraft}"/>
    <circle cx="545" cy="352" r="9" fill="${color.kraft}"/>
    <circle cx="572" cy="332" r="6" fill="${color.kraft}"/>
    <circle cx="560" cy="330" r="128" fill="none" stroke="${color.red}" stroke-width="16"/>
    ${strike(470, 240, 650, 420)}`,
  );

/** Espiga de trigo: tallo y granos alternados a cada lado. */
const wheat = (x: number, top: number, bottom: number): string => {
  const grains = Array.from({ length: 5 }, (_, i) => {
    const y = top + 30 + i * 46;
    return `<ellipse cx="${x - 26}" cy="${y}" rx="17" ry="34" transform="rotate(-32 ${x - 26} ${y})"/>
      <ellipse cx="${x + 26}" cy="${y + 20}" rx="17" ry="34" transform="rotate(32 ${x + 26} ${y + 20})"/>`;
  }).join('');
  return `<line x1="${x}" y1="${top}" x2="${x}" y2="${bottom}" stroke="${color.kraftDark}" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="${x}" cy="${top - 6}" rx="15" ry="32" fill="${color.kraft}"/>
    <g fill="${color.kraft}">${grains}</g>`;
};

// Libre de granos: el empaque de pechuga junto a una espiga de trigo tachada.
const grainFree = (): string =>
  canvas(
    'grain-free',
    color.cream,
    `<circle cx="400" cy="330" r="250" fill="${color.kraftPale}"/>
    ${groundShadow(250, 520, 125)}
    ${placedPouch('pechuga', 'grain-free', 130, 165, 240, -5)}
    ${groundShadow(565, 520, 70)}
    ${wheat(565, 190, 515)}
    ${strike(470, 470, 660, 230)}`,
  );

/** Copo de nieve de seis brazos. */
const snowflake = (cx: number, cy: number, r: number): string => {
  const arms = Array.from({ length: 6 }, (_, i) => {
    const angle = i * 60;
    return `<g transform="rotate(${angle} ${cx} ${cy})">
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}"/>
      <path d="M${cx - r * 0.24} ${cy - r * 0.78}L${cx} ${cy - r * 0.55}L${cx + r * 0.24} ${cy - r * 0.78}"/>
    </g>`;
  }).join('');
  return `<g fill="none" stroke="${color.tealDark}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">${arms}</g>`;
};

// Sin refrigeración: el empaque apoyado en un estante y un copo de nieve tachado.
const noFridge = (): string =>
  canvas(
    'no-fridge',
    color.kraft,
    `<circle cx="400" cy="320" r="250" fill="${color.kraftPale}"/>
    ${placedPouch('higado-de-cerdo', 'no-fridge', 160, 140, 240)}
    <rect x="110" y="480" width="580" height="22" rx="6" fill="${color.kraftDark}"/>
    <rect x="150" y="502" width="18" height="60" fill="${color.kraftDark}"/>
    <rect x="632" y="502" width="18" height="60" fill="${color.kraftDark}"/>
    <circle cx="560" cy="300" r="110" fill="${color.cream}"/>
    ${snowflake(560, 300, 78)}
    ${strike(480, 220, 640, 380)}`,
  );

const artworks: Record<BenefitArt, () => string> = {
  iron,
  'no-preservatives': noPreservatives,
  'grain-free': grainFree,
  'no-fridge': noFridge,
};

export const benefitArt = (art: BenefitArt): string => artworks[art]();
