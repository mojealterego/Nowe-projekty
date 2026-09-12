export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  timeoutMs?: number;
}

export async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 100;
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await withTimeout(operation(), options.timeoutMs ?? 10_000);
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
    }
  }
  throw lastError;
}
