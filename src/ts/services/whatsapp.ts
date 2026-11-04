import { site } from '../../data/site.ts';

export const whatsappUrl = (message: string): string =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const generalOrderUrl = (): string =>
  whatsappUrl('¡Hola True Bite! Quiero hacer un pedido.');

export const productOrderUrl = (productName: string, weightG: number, price: string): string =>
  whatsappUrl(`¡Hola True Bite! Quiero pedir ${productName} (${weightG} g, ${price}).`);
