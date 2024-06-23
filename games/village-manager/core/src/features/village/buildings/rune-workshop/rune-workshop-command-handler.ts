import { injectable } from "inversify";
import { add, evolve } from "rambda";

import { commandHandler } from "@rpg-village/core";

import { Rune } from "@features/item";

import { VillageService } from "../../village-service";
import {
  CreateRuneCommandArgs,
  DismantleRuneCommandArgs,
  EmpowerRuneCommandArgs,
  ForgeDungeonKeyCommandArgs,
  RuneWorkshopCommand,
} from "./rune-workshop-command";
import { createDungeonKey, createRune } from "./utils";

@injectable()
export class RuneWorkshopCommandHandler {
  constructor(private villageService: VillageService) {}

  @commandHandler(RuneWorkshopCommand.ForgeDungeonKey)
  forgeDungeonKey(args: ForgeDungeonKeyCommandArgs) {
    const price = 50;
    const stash = this.villageService.getStash(args.villageId);
    if (stash.hasEnoughResource({ gold: price })) {
      stash.removeResource({ gold: price });

      const item = createDungeonKey();

      stash.addItems([item]);
    }
  }

  @commandHandler(RuneWorkshopCommand.CreateRune)
  createRune(args: CreateRuneCommandArgs) {
    const price = 50;
    const stash = this.villageService.getStash(args.villageId);
    if (stash.hasEnoughResource({ gold: price })) {
      stash.removeResource({ gold: price });

      const item = createRune();

      stash.addItems([item]);
    }
  }

  @commandHandler(RuneWorkshopCommand.EmpowerRune)
  empowerRune(args: EmpowerRuneCommandArgs) {
    const stash = this.villageService.getStash(args.villageId);
    if (stash.hasEnoughResource({ soul: args.soul })) {
      stash.removeResource({ soul: args.soul });

      stash.updateStashItem<Rune>(args.runeId, evolve({ soul: add(args.soul) }));
    }
  }

  @commandHandler(RuneWorkshopCommand.DismantleRune)
  dismantleRune(args: DismantleRuneCommandArgs) {
    const stash = this.villageService.getStash(args.villageId);
    const item = stash.takeItem<Rune>(args.runeId);

    if (item) {
      stash.addResource({ soul: item.soul });
    }
  }
}
