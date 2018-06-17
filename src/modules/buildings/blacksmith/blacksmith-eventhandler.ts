import { injectable, inject } from 'inversify';
import { EventSystem, StashID, ItemID } from '@greegko/rpg-model';
import { BlacksmithEvents, UpgradeItemEventArgs } from './blacksmith-events';
import { StashItems } from '../../stash';
import { EffectTarget, AttackEffectType } from '../../../models';
import { append, evolve } from 'ramda';

@injectable()
export class BlacksmithEventHandler {

  constructor(
    @inject('StashItems') private stashItems: StashItems
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(BlacksmithEvents.UpgradeItem, (args: UpgradeItemEventArgs) => this.upgradeItem(args.stashId, args.itemId));
  }

  upgradeItem(stashId: StashID, itemId: ItemID) {
    const item = this.stashItems.takeItem(stashId, itemId);
    const newItem = evolve({ effects: append(this.createDmgEffect()) }, item);
    this.stashItems.addItems(stashId, [newItem]);
  }

  private createDmgEffect() {
    return {
      target: EffectTarget.Unit,
      isPercentage: false,
      value: 2,
      type: AttackEffectType.Dmg
    };
  }
}
