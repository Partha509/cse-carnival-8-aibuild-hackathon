import { ToolRegistry } from "./registry";
import { getCurrentDatetimeTool } from "./get-current-datetime";
import { getScheduleTool } from "./get-schedule";
import { getNextClassTool } from "./get-next-class";
import { getAssignmentsTool } from "./get-assignments";
import { getAnnouncementsTool } from "./get-announcements";
import { getEventsTool } from "./get-events";
import { checkRoomAvailabilityTool } from "./check-room-availability";

export type { ToolContext, ToolDefinition, ToolResult } from "./registry";
export { ToolRegistry, toolOk, toolError } from "./registry";

/**
 * Default registry used by the agent. Task 7 adds the three action tools
 * (book_room, register_for_event, cancel_registration) here.
 */
export function createDefaultRegistry(): ToolRegistry {
  return new ToolRegistry()
    .register(getCurrentDatetimeTool)
    .register(getScheduleTool)
    .register(getNextClassTool)
    .register(getAssignmentsTool)
    .register(getAnnouncementsTool)
    .register(getEventsTool)
    .register(checkRoomAvailabilityTool);
}
