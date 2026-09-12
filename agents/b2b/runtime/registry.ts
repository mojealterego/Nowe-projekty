import type { AgentContext, ToolCall, ToolResult } from "./types.js";

export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  name: string;
  execute(context: AgentContext, input: TInput): Promise<ToolResult<TOutput>>;
}

export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>();

  register<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>): void {
    if (this.tools.has(tool.name)) throw new Error(`DUPLICATE_TOOL:${tool.name}`);
    this.tools.set(tool.name, tool as ToolDefinition);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  assertRegistered(call: ToolCall): ToolDefinition {
    const tool = this.tools.get(call.name);
    if (!tool) throw new Error(`UNKNOWN_TOOL:${call.name}`);
    return tool;
  }
}
