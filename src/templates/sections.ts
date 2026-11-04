import { benefits, type Benefit } from '../data/benefits.ts';
import { pendingLegalFields } from '../data/legal.ts';
import { products, type Product } from '../data/products.ts';
import { site } from '../data/site.ts';
import { productOrderUrl } from '../ts/services/whatsapp.ts';
import { pouch } from './pouch.ts';

const priceFormat = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number): string => priceFormat.format(amount);

const whatsappIcon = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.9 5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200Zm4.500-6.100c-.25-.12-1.450-.72-1.680-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.170-.28.190-.53.060a6.700 6.700 0 0 1-3.300-2.880c-.25-.430.25-.400.720-1.330.08-.170.04-.310-.020-.430-.060-.120-.550-1.330-.760-1.820-.200-.480-.400-.410-.550-.420h-.470c-.170 0-.430.060-.660.310-.230.250-.870.850-.870 2.070s.890 2.400 1.010 2.570c.120.170 1.750 2.670 4.240 3.750 1.580.680 2.200.740 2.990.620.480-.070 1.450-.590 1.660-1.170.200-.570.200-1.060.140-1.170-.060-.100-.220-.160-.470-.280Z"/></svg>`;

const productCard = (product: Product): string => {
  const price = formatPrice(product.priceCRC);
  const highlights = product.highlights.map((h) => `<li>${h}</li>`).join('');
  return `<li class="product-card" data-reveal>
    <div class="product-card__art">${pouch(product, 'card')}</div>
    <div class="product-card__body">
      <div class="product-card__head">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__price">${price}<span> · ${product.weightG} g</span></p>
      </div>
      <ul class="product-card__highlights">${highlights}</ul>
      <a class="button button--primary button--block" href="${productOrderUrl(product.name, product.weightG, price)}" target="_blank" rel="noopener">
        ${whatsappIcon}<span>Pedir ${product.name.toLowerCase()}</span>
      </a>
    </div>
  </li>`;
};

const benefitItem = (benefit: Benefit, index: number): string => `<li class="benefit${index === 0 ? ' is-active' : ''}" data-benefit>
    <div class="benefit__card">
      <img class="benefit__photo" src="${benefit.image}" alt="" loading="lazy" decoding="async" width="900" height="600">
      <div class="benefit__body">
        <svg class="benefit__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${benefit.icon}</svg>
        <h3 class="benefit__title">${benefit.title}</h3>
        <p class="benefit__text">${benefit.text}</p>
      </div>
    </div>
  </li>`;

const benefitStage = (): string =>
  benefits
    .map(
      (benefit, index) =>
        `<img class="benefits__stage-photo${index === 0 ? ' is-active' : ''}" src="${benefit.image}" alt="" loading="lazy" decoding="async" width="900" height="600" data-benefit-photo>`,
    )
    .join('');

const heroPouches = (): string =>
  products
    .slice(0, 3)
    .map((product, index) => `<div class="hero__pouch hero__pouch--${index + 1}">${pouch(product, 'hero')}</div>`)
    .join('');

const jsonLd = (): string => {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: site.name,
        sameAs: [site.instagramUrl],
        telephone: `+${site.whatsappNumber}`,
      },
      ...products.map((product) => ({
        '@type': 'Product',
        name: `${product.name} deshidratado ${site.name}`,
        category: 'Premios para mascotas',
        brand: { '@type': 'Brand', name: site.name },
        weight: { '@type': 'QuantitativeValue', value: product.weightG, unitCode: 'GRM' },
        offers: {
          '@type': 'Offer',
          price: product.priceCRC,
          priceCurrency: 'CRC',
          availability: 'https://schema.org/InStock',
        },
      })),
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
};

const siteFooter = (): string => `<footer class="site-footer">
      <div class="container site-footer__inner">
        <p class="brand__name">True Bite</p>
        <ul class="site-footer__links">
          <li><a href="{{whatsapp-url}}" target="_blank" rel="noopener">WhatsApp {{whatsapp-display}}</a></li>
          <li><a href="{{instagram-url}}" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="/terminos.html">Términos</a></li>
          <li><a href="/privacidad.html">Privacidad</a></li>
          <li><a href="/terminos.html#reclamos">Reclamos</a></li>
        </ul>
        <p class="site-footer__legal">© {{year}} True Bite. Hecho en Costa Rica.</p>
      </div>
    </footer>`;

const legalHeader = (): string => `<header class="legal-header">
      <div class="container legal-header__inner">
        <a class="brand brand__name" href="/">True Bite</a>
        <a class="text-link" href="/">Volver al inicio</a>
      </div>
    </header>`;

// Desaparece solo cuando se completan todos los datos de legal.ts.
const draftNotice = (): string =>
  pendingLegalFields().length > 0
    ? '<p class="legal__draft">Borrador: faltan los datos marcados y debe revisarlo un abogado antes de publicarlo.</p>'
    : '';

export const htmlSlots = {
  'hero-pouches': heroPouches,
  'product-cards': () => products.map(productCard).join(''),
  'benefit-items': () => benefits.map(benefitItem).join(''),
  'benefit-stage': benefitStage,
  'json-ld': jsonLd,
  'whatsapp-icon': () => whatsappIcon,
  'site-footer': siteFooter,
  'legal-header': legalHeader,
  'draft-notice': draftNotice,
} as const;
