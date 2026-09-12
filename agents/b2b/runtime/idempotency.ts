export class IdempotencyStore {
  private readonly results = new Map<string, unknown>();

  private key(tenantId: string, idempotencyKey: string): string {
    return `${tenantId}:${idempotencyKey}`;
  }

  has(tenantId: string, idempotencyKey: string): boolean {
    return this.results.has(this.key(tenantId, idempotencyKey));
  }

  get<T>(tenantId: string, idempotencyKey: string): T | undefined {
    return this.results.get(this.key(tenantId, idempotencyKey)) as T | undefined;
  }

  set<T>(tenantId: string, idempotencyKey: string, value: T): void {
    const key = this.key(tenantId, idempotencyKey);
    if (this.results.has(key)) throw new Error(`IDEMPOTENCY_CONFLICT:${tenantId}:${idempotencyKey}`);
    this.results.set(key, value);
  }
}
