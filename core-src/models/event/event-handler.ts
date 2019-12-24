import { EventSystem } from '../../lib';

export interface EventHandler {
  init(e: EventSystem);
}
