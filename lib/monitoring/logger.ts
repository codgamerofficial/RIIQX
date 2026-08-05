export interface LogContext {
  module?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export function logError(error: unknown, context: LogContext = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error('[RIIQX ERROR LOG]:', {
    message: errorMessage,
    module: context.module || 'SYSTEM',
    action: context.action || 'UNKNOWN',
    userId: context.userId || 'ANONYMOUS',
    timestamp: new Date().toISOString(),
    metadata: context.metadata || {},
    stack,
  });
}

export function logEvent(name: string, data: Record<string, any> = {}) {
  console.log(`[RIIQX EVENT LOG] [${name}]:`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}
