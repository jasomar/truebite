export type BenefitArt = 'iron' | 'no-preservatives' | 'grain-free' | 'no-fridge';

export interface Benefit {
  title: string;
  text: string;
  /** Composición de src/templates/benefit-art.ts que acompaña al beneficio. */
  art: BenefitArt;
  /** Contenido SVG del icono, en una cuadrícula de 24×24. */
  icon: string;
}

// El orden de esta lista es el orden en que aparecen al hacer scroll.
export const benefits: readonly Benefit[] = [
  {
    title: 'Rico en hierro',
    text: 'En los dos premios de hígado.',
    art: 'iron',
    icon: '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0Z"/>',
  },
  {
    title: 'Sin conservantes artificiales',
    text: 'Así lo indica cada empaque.',
    art: 'no-preservatives',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  },
  {
    title: 'Libre de granos',
    text: 'Así viene la pechuga.',
    art: 'grain-free',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M5 5l14 14"/>',
  },
  {
    title: 'Sin refrigeración',
    text: 'Guardalos en un lugar fresco.',
    art: 'no-fridge',
    icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  },
];
