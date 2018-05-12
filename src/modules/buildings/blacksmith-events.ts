import { injectable } from 'inversify';
import { EventSystem, StashID, ItemID } from '@greegko/rpg-model';
import { BlacksmithEvents, UpgradeItemArgs } from './interfaces';

@injectable()
export class BlacksmithEventHandler {

  constructor() {}

  init(eventSystem: EventSystem) {
    eventSystem.on(BlacksmithEvents.UpgradeItem, (args: UpgradeItemArgs) => this.upgradeItem(args.stashId, args.itemId));
  }

  upgradeItem(stashId: StashID, itemId: ItemID) {

  }
}
