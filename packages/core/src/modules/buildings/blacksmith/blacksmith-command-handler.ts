import { injectable, inject } from "inversify";
import { append, evolve } from "ramda";

import { CommandSystem } from "@core/command";
import { EffectTarget, AttackEffectType } from "@models/effect";
import { ItemID } from "@models/item";
import { UnitID, UnitService } from "@modules/unit";
import { getItem } from "@models/stash";
import { VillageStashService } from "@modules/village";
import { BlacksmithCommand, UpgradeItemCommandArgs } from "./blacksmith-command";

@injectable()
export class BlacksmithCommandHandler {
  constructor(
    @inject("UnitService") private unitService: UnitService,
    @inject("VillageStashService")
    private villageStashService: VillageStashService,
  ) {}

  init(commandSystem: CommandSystem) {
    commandSystem.on(BlacksmithCommand.UpgradeItem, (args: UpgradeItemCommandArgs) =>
      this.upgradeItem(args.unitId, args.itemId),
    );
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
      type: AttackEffectType.Dmg,
    };
  }
}
