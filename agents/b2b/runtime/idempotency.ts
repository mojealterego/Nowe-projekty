export class IdempotencyStore {
  private readonly results = new Map<string, unknown>();

  has(key: string): boolean {
    return this.results.has(key);
  }

  get<T>(key: string): T | undefined {
    return this.results.get(key) as T | undefined;
  }

  set<T>(key: string, value: T): void {
    if (this.results.has(key)) throw new Error(`IDEMPOTENCY_CONFLICT:${key}`);
    this.results.set(key, value);
  }
}
