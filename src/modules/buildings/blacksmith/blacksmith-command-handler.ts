import { injectable, inject } from 'inversify';
import { CommandSystem } from "../../../lib/command-system";
import { BlacksmithCommand, UpgradeItemCommandArgs } from './blacksmith-command';
import { EffectTarget, AttackEffectType, ItemID } from '../../../models';
import { append, evolve } from 'ramda';
import { UnitStore, UnitID } from '../../unit';
import { getItem, addItem, ItemStash, removeItem } from '../../../models/stash';

@injectable()
export class BlacksmithCommandHandler {

  constructor(
    @inject('UnitStore') private unitStore: UnitStore
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(BlacksmithCommand.UpgradeItem, (args: UpgradeItemCommandArgs) => this.upgradeItem(args.unitId, args.itemId));
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
