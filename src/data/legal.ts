export interface LegalField {
  /** Lo que falta, tal como se muestra en las páginas legales mientras esté pendiente. */
  label: string;
  value: string | null;
}

// Datos que debe aportar True Bite. Mientras un valor sea null, se muestra marcado
// en las páginas legales, junto con un aviso de borrador, y la compilación lo advierte.
export const legalFields = {
  'owner-name': { label: 'nombre completo o razón social', value: null },
  'owner-id': { label: 'número de cédula física o jurídica', value: null },
  'owner-address': { label: 'dirección física', value: null },
  'owner-email': { label: 'correo electrónico de contacto', value: null },
  hosting: { label: 'proveedor de hosting', value: null },
  'payment-methods': { label: 'medios de pago aceptados', value: null },
  'delivery-time': { label: 'plazo de entrega', value: null },
  'shipping-cost': { label: 'costo de envío por zona', value: null },
  'tax-status': { label: 'indicar si los precios incluyen IVA', value: null },
  'claims-time': { label: 'plazo de respuesta a reclamos', value: null },
} satisfies Record<string, LegalField>;

export const LEGAL_UPDATED = '3 de noviembre de 2026';

export const pendingLegalFields = (): LegalField[] =>
  Object.values<LegalField>(legalFields).filter((field) => field.value === null);
