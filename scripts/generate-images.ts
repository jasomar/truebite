// Genera public/og-image.png (vista previa al compartir) y public/apple-touch-icon.png.
// Uso: npm run images   (necesita Google Chrome; otra ruta con CHROME_PATH=/ruta/a/chrome)
// Volvé a correrlo cuando cambien el logo, los productos o el titular.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { products } from '../src/data/products.ts';
import { pouch } from '../src/templates/pouch.ts';

const root = resolve(import.meta.dirname, '..');
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const font = (name: string): string =>
  pathToFileURL(join(root, 'node_modules/@fontsource-variable', name)).href;

const fontFaces = `
  @font-face { font-family: 'Fredoka'; font-weight: 300 700; src: url('${font('fredoka/files/fredoka-latin-wght-normal.woff2')}') format('woff2'); }
  @font-face { font-family: 'Nunito'; font-weight: 200 1000; src: url('${font('nunito/files/nunito-latin-wght-normal.woff2')}') format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  .pouch text { fill: #fff; font-family: 'Fredoka'; }
  .pouch__brand { font-size: 13px; font-weight: 600; letter-spacing: .14em; }
  .pouch__name { font-size: 22px; font-weight: 600; }
  .pouch__meta { font-size: 10px; font-weight: 500; letter-spacing: .1em; }
`;

const pawMark = (size: number): string => `<svg width="${size}" height="${size}" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="#0E5F70"/>
  <g fill="#FBF6EC"><ellipse cx="16" cy="20.5" rx="6.5" ry="5.5"/><ellipse cx="8.5" cy="15" rx="2.5" ry="3.2"/>
  <ellipse cx="13" cy="9.8" rx="2.5" ry="3.4"/><ellipse cx="19" cy="9.8" rx="2.5" ry="3.4"/><ellipse cx="23.5" cy="15" rx="2.5" ry="3.2"/></g>
</svg>`;

const ogPage = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${fontFaces}
  body { width: 1200px; height: 630px; overflow: hidden; background: #FBF6EC; color: #12343B; font-family: 'Nunito';
    display: grid; grid-template-columns: 1fr 520px; align-items: center; gap: 24px; padding: 64px 56px 64px 72px; }
  .brand { display: flex; align-items: center; gap: 14px; font: 600 34px 'Fredoka'; }
  h1 { margin-top: 36px; font: 600 72px/1.02 'Fredoka'; letter-spacing: -.01em; }
  h1 em { font-style: normal; color: #0E5F70; }
  p { margin-top: 24px; font-size: 28px; line-height: 1.35; }
  .art { position: relative; height: 470px; }
  .blob { position: absolute; inset: 40px 0 0; border-radius: 58% 42% 46% 54% / 48% 56% 44% 52%; background: #D9EEF1; }
  .p { position: absolute; top: 120px; width: 168px; }
  .p1 { left: 0; transform: rotate(-4deg); } .p2 { right: 0; transform: rotate(4deg); } .p3 { left: 176px; top: 70px; z-index: 1; }
  .badge { position: absolute; right: -6px; bottom: -4px; z-index: 2; width: 132px; height: 132px; border-radius: 50%;
    background: #C8372D; color: #fff; display: grid; place-content: center; text-align: center; transform: rotate(-8deg);
    font: 700 40px/1 'Fredoka'; }
  .badge span { font: 500 15px/1.1 'Fredoka'; }
</style></head><body>
  <div>
    <div class="brand">${pawMark(56)}True Bite</div>
    <h1>Premios <em>100% proteína</em> para perros y gatos</h1>
    <p>Hechos en Costa Rica. El 15% de cada compra ayuda a perritos rescatados.</p>
  </div>
  <div class="art"><div class="blob"></div>
    ${products.slice(0, 3).map((product, i) => `<div class="p p${i + 1}">${pouch(product, `og${i}`)}</div>`).join('')}
    <div class="badge">15%<span>para el rescate</span></div>
  </div>
</body></html>`;

const iconPage = `<!doctype html><html><head><style>* { margin: 0; } body { width: 180px; height: 180px; background: #0E5F70; }
  svg { display: block; }</style></head><body>${pawMark(180).replace('<circle cx="16" cy="16" r="16" fill="#0E5F70"/>', '')}</body></html>`;

const shoot = (html: string, width: number, height: number, output: string): void => {
  const dir = mkdtempSync(join(tmpdir(), 'truebite-img-'));
  const page = join(dir, 'page.html');
  writeFileSync(page, html);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--user-data-dir=${join(dir, 'profile')}`,
    `--window-size=${width},${height}`,
    '--virtual-time-budget=3000',
    `--screenshot=${output}`,
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  rmSync(dir, { recursive: true, force: true });
  console.log(`Generado ${output}`);
};

shoot(ogPage, 1200, 630, join(root, 'public/og-image.png'));
shoot(iconPage, 180, 180, join(root, 'public/apple-touch-icon.png'));
