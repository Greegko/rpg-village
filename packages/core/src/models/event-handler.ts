import { EventSystem } from "../lib/event-system";

export interface EventHandler {
  init(e: EventSystem): void;
}
