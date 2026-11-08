export const site = {
  name: 'True Bite',
  /** Dominio público sin barra final, por ejemplo 'https://truebite.cr'. Se usa en la vista previa al compartir. */
  url: null as string | null,
  /** Mostrar "Ingresar" y "Crear cuenta". Activar solo cuando las cuentas estén conectadas a un servidor. */
  accountsEnabled: false as boolean,
  whatsappNumber: '50672783978',
  whatsappDisplay: '7278-3978',
  instagramUrl: 'https://www.instagram.com/truebitecr/',
  causeName: 'Rescate Animal Ara',
  causeUrl: 'https://www.instagram.com/rescate_animal_ara/',
  deliveryZones: ['Moravia', 'Escazú', 'Correos de Costa Rica'],
} as const;
