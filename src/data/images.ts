// Fotos genéricas y temporales de Unsplash. Se sirven desde su CDN, no desde este sitio.
// Para usar fotos propias, reemplazá estas rutas por archivos locales.
const unsplash = (id: string, width: number): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=70`;

const BENEFIT_WIDTH = 900;

export const genericImages = {
  dogChewingStick: unsplash('photo-1592468257342-8375cb556a69', BENEFIT_WIDTH),
  dogChewingBone: unsplash('photo-1741230081551-bc93d6094c43', BENEFIT_WIDTH),
  dogLicking: unsplash('photo-1741942731788-5712579ebb16', BENEFIT_WIDTH),
  labrador: unsplash('photo-1518717758536-85ae29035b6d', BENEFIT_WIDTH),
  catEating: unsplash('photo-1596854331442-3cf47265cefb', BENEFIT_WIDTH),
  catPortrait: unsplash('photo-1592194996308-7b43878e84a6', BENEFIT_WIDTH),
} as const;
