import { ToolRegistry } from "./registry";
import { getCurrentDatetimeTool } from "./get-current-datetime";

export type { ToolContext, ToolDefinition, ToolResult } from "./registry";
export { ToolRegistry, toolOk, toolError } from "./registry";

/**
 * Default registry used by the agent. Tasks 6 and 7 add the nine campus
 * tools here (one file per tool under this folder).
 */
export function createDefaultRegistry(): ToolRegistry {
  return new ToolRegistry().register(getCurrentDatetimeTool);
}
