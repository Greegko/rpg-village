import { EventSystem } from "./event-system";

export interface EventHandler {
  init(e: EventSystem): void;
}
