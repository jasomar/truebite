export interface Product {
  id: string;
  name: string;
  priceCRC: number;
  weightG: number;
  highlights: readonly string[];
  /** Colores de la carne que se ve por la ventana del empaque. */
  meat: { base: string; shade: string };
}

const sharedHighlights = ['Sin conservantes artificiales'];

// Para agregar un producto, sumá un objeto a esta lista y volvé a compilar.
export const products: readonly Product[] = [
  {
    id: 'higado-de-cerdo',
    name: 'Hígado de cerdo',
    priceCRC: 2500,
    weightG: 60,
    highlights: [...sharedHighlights, 'Rico en hierro'],
    meat: { base: '#3A2622', shade: '#1F1412' },
  },
  {
    id: 'higado-de-res',
    name: 'Hígado de res',
    priceCRC: 3000,
    weightG: 60,
    highlights: [...sharedHighlights, 'Rico en hierro'],
    meat: { base: '#4A2C20', shade: '#2A1810' },
  },
  {
    id: 'pechuga',
    name: 'Pechuga',
    priceCRC: 3500,
    weightG: 60,
    highlights: [...sharedHighlights, 'Libre de granos'],
    meat: { base: '#D9A384', shade: '#B97C5E' },
  },
];
