import { genericImages } from './images.ts';

export interface Benefit {
  title: string;
  text: string;
  image: string;
  /** Contenido SVG del icono, en una cuadrícula de 24×24. */
  icon: string;
}

// El orden de esta lista es el orden en que aparecen al hacer scroll.
export const benefits: readonly Benefit[] = [
  {
    title: 'Combate el sarro',
    text: 'Masticar una tira deshidratada le da trabajo a los dientes.',
    image: genericImages.dogChewingStick,
    icon: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 16v4M17 18h4"/>',
  },
  {
    title: 'Control del estrés',
    text: 'Un rato de masticar tranquilo.',
    image: genericImages.dogChewingBone,
    icon: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1 7.8 7.7 7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>',
  },
  {
    title: 'Rico en hierro',
    text: 'En los dos premios de hígado.',
    image: genericImages.dogLicking,
    icon: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0Z"/>',
  },
  {
    title: 'Sin conservantes artificiales',
    text: 'Así lo indica cada empaque.',
    image: genericImages.labrador,
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    title: 'Libre de granos',
    text: 'Así viene la pechuga.',
    image: genericImages.catEating,
    icon: '<circle cx="12" cy="12" r="10"/><path d="M5 5l14 14"/>',
  },
  {
    title: 'Sin refrigeración',
    text: 'Guardalos en un lugar fresco.',
    image: genericImages.catPortrait,
    icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  },
];
