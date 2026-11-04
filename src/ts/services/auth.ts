export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export type AuthResult = { ok: true } | { ok: false; message: string };

const NOT_CONNECTED: AuthResult = {
  ok: false,
  message: 'Las cuentas todavía no están disponibles. Mientras tanto, podés pedir por WhatsApp.',
};

// PENDIENTE: conectar a un servidor de cuentas. Estas funciones no envían ni guardan
// ningún dato. Son el único punto que hay que cambiar: el modal ya maneja el resultado.
// Al conectarlas, guardar la fecha y la versión de los términos aceptados: la Ley 8968
// pide que el consentimiento conste por escrito. El modal solo envía si está marcado.
export const login = async (_data: LoginData): Promise<AuthResult> => NOT_CONNECTED;

export const register = async (_data: RegisterData): Promise<AuthResult> => NOT_CONNECTED;
