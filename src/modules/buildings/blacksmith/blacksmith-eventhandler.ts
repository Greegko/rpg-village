import { injectable } from 'inversify';
import { EventSystem, StashID, ItemID } from '@greegko/rpg-model';
import { BlacksmithEvents, UpgradeItemEventArgs } from './blacksmith-events';

@injectable()
export class BlacksmithEventHandler {

  constructor() {}

  init(eventSystem: EventSystem) {
    eventSystem.on(BlacksmithEvents.UpgradeItem, (args: UpgradeItemEventArgs) => this.upgradeItem(args.stashId, args.itemId));
  }

  upgradeItem(stashId: StashID, itemId: ItemID) {

  }
}
