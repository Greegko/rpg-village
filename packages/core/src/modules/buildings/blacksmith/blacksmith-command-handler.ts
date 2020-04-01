import { injectable, inject } from 'inversify';
import { CommandSystem } from "../../../lib/command-system";
import { BlacksmithCommand, UpgradeItemCommandArgs } from './blacksmith-command';
import { EffectTarget, AttackEffectType, ItemID } from '../../../models';
import { append, evolve } from 'ramda';
import { UnitID, UnitService } from '../../unit';
import { getItem } from '../../../models/stash';
import { VillageStashService } from '../../village';

@injectable()
export class BlacksmithCommandHandler {
  constructor(
    @inject('UnitService') private unitService: UnitService,
    @inject('VillageStashService') private villageStashService: VillageStashService
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(BlacksmithCommand.UpgradeItem, (args: UpgradeItemCommandArgs) => this.upgradeItem(args.unitId, args.itemId));
  }

  upgradeItem(unitId: UnitID, itemId: ItemID) {
    const item = getItem(this.unitService.getUnit(unitId).stash, itemId);
    const price = (item.effects.length + 1) * 50;

    if (this.villageStashService.hasEnoughResource({ gold: price })) {
      const newItem = evolve({ effects: append(this.createDmgEffect()) }, item);
      this.unitService.updateStashItem(unitId, itemId, newItem);
      this.villageStashService.removeResource({ gold: price });
    }
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
