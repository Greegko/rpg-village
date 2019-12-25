import { injectable, inject } from 'inversify';
import { EventSystem } from "../../../lib/event-system";
import { BlacksmithEvents, UpgradeItemEventArgs } from './blacksmith-events';
import { EffectTarget, AttackEffectType, ItemID } from '../../../models';
import { append, evolve } from 'ramda';
import { UnitStore, UnitID } from '../../unit';
import { getItem, addItem, ItemStash, removeItem } from '../../../models/stash';

@injectable()
export class BlacksmithEventHandler {

  constructor(
    @inject('UnitStore') private unitStore: UnitStore
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(BlacksmithEvents.UpgradeItem, (args: UpgradeItemEventArgs) => this.upgradeItem(args.unitId, args.itemId));
  }

  upgradeItem(unitId: UnitID, itemId: ItemID) {
    const unit = this.unitStore.get(unitId);

    const item = getItem(unit.stash, itemId);
    const newItem = evolve({ effects: append(this.createDmgEffect()) }, item);

    const newUnit = evolve({
      stash: (stash: ItemStash) => addItem(removeItem(stash, itemId), newItem)
    })(unit);

    this.unitStore.update(unitId, newUnit);
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
