import { injectable } from "inversify";

import { commandHandler } from "@core/command";

import { VillageStashService } from "@modules/village";

import { RuneWorkshopCommand } from "./rune-workshop-command";
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
}
