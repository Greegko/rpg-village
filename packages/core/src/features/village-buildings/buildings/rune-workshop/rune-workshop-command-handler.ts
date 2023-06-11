import { injectable } from "inversify";
import { add, evolve } from "rambda";

import { commandHandler } from "@core";

import { VillageStashService } from "@features/village";
import { Rune } from "@models";

import { DismantleRuneCommandArgs, EmpowerRuneCommandArgs, RuneWorkshopCommand } from "./rune-workshop-command";
import { createDungeonKey, createRune } from "./utils";

@injectable()
export class RuneWorkshopCommandHandler {
  constructor(private villageStashService: VillageStashService) {}

  @commandHandler(RuneWorkshopCommand.ForgeDungeonKey)
  forgeDungeonKey() {
    const price = 50;
    if (this.villageStashService.hasEnoughResource({ gold: price })) {
      this.villageStashService.removeResource({ gold: price });

      const item = createDungeonKey();

      this.villageStashService.addItems([item]);
    }
  }

  @commandHandler(RuneWorkshopCommand.CreateRune)
  createRune() {
    const price = 50;
    if (this.villageStashService.hasEnoughResource({ gold: price })) {
      this.villageStashService.removeResource({ gold: price });

      const item = createRune();

      this.villageStashService.addItems([item]);
    }
  }

  @commandHandler(RuneWorkshopCommand.EmpowerRune)
  empowerRune(args: EmpowerRuneCommandArgs) {
    if (this.villageStashService.hasEnoughResource({ soul: args.soul })) {
      this.villageStashService.removeResource({ soul: args.soul });

      this.villageStashService.updateStashItem<Rune>(args.runeId, evolve({ soul: add(args.soul) }));
    }
  }

  @commandHandler(RuneWorkshopCommand.DismantleRune)
  dismantleRune(args: DismantleRuneCommandArgs) {
    const item = this.villageStashService.takeItem<Rune>(args.runeId);

    if (item) {
      this.villageStashService.addResource({ soul: item.soul });
    }
  }
}
