export type AppErrorKind = 'network' | 'timeout' | 'not-found' | 'invalid-data' | 'unknown';

export class AppError extends Error {
  constructor(
    readonly kind: AppErrorKind,
    message?: string,
  ) {
    super(message ?? kind);
    this.name = 'AppError';
  }
}

export interface UserMessage {
  title: string;
  message: string;
  canRetry: boolean;
}

export function toUserMessage(error: unknown): UserMessage {
  const kind = error instanceof AppError ? error.kind : 'unknown';
  switch (kind) {
    case 'network':
      return {
        title: 'Sin conexión',
        message: 'No pudimos conectarnos. Revisa tu conexión a internet.',
        canRetry: true,
      };
    case 'timeout':
      return {
        title: 'Tardó demasiado',
        message: 'El servidor no respondió a tiempo. Intenta de nuevo.',
        canRetry: true,
      };
    case 'not-found':
      return {
        title: 'No encontrado',
        message: 'Lo que buscas no existe.',
        canRetry: false,
      };
    case 'invalid-data':
      return {
        title: 'Datos inesperados',
        message: 'El servidor devolvió información que no pudimos leer.',
        canRetry: true,
      };
    default:
      return {
        title: 'Algo salió mal',
        message: 'Ocurrió un error inesperado. Intenta de nuevo.',
        canRetry: true,
      };
  }
}
