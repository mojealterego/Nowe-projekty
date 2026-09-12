import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import type { AuditEvent } from "./types.js";

export interface AuditStore {
  append(event: AuditEvent): Promise<void>;
}

export class JsonlAuditStore implements AuditStore {
  constructor(private readonly filePath: string) {}

  async append(event: AuditEvent): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(event)}\n`, "utf8");
  }
}

export class MemoryAuditStore implements AuditStore {
  readonly events: AuditEvent[] = [];
  async append(event: AuditEvent): Promise<void> {
    this.events.push(event);
  }
}
