import { EventSystem } from '../../../core-src/lib';

export interface EventHandler {
  init(e: EventSystem);
}
