import { injectable } from "inversify";
import { add, evolve } from "ramda";

import { commandHandler } from "@core/command";

import { Rune } from "@models/item";
import { VillageStashService } from "@modules/village";

import { EmpowerRuneCommandArgs, RuneWorkshopCommand } from "./rune-workshop-command";
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
}
