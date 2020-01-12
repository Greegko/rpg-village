import { injectable, inject } from "inversify";
import { CommandHandler } from "../../models";
import { CommandSystem } from "../../lib/command-system";
import { WorldCommand, WorldActivity, BattleCommandArgs } from "./interfaces";
import { ActivityManager } from "../activity";
import { PartyService, PartyOwner } from "../party";
import { BattleActivityType } from "../battle/interfaces";


@injectable()
export class WorldCommandHandler implements CommandHandler {
  constructor(
    @inject('ActivityManager') private activityManager: ActivityManager,
    @inject('PartyService') private partyService: PartyService,
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(WorldCommand.Travel, (args: any) => this.travelCommand(args));
    commandSystem.on(WorldCommand.Explore, (args: any) => this.exploreCommand(args));
    commandSystem.on(WorldCommand.Battle, (args: any) => this.battleCommand(args));
  }

  private travelCommand(travelArgs: any) {
    this.activityManager.startActivity(WorldActivity.Travel, travelArgs);
  }

  private exploreCommand(exploreArgs: any) {
    this.activityManager.startActivity(WorldActivity.Explore, exploreArgs);
  }

  private battleCommand(battleArgs: BattleCommandArgs) {
    const parties = this.partyService.getPartiesOnLocation(battleArgs.locationId);

    const playerParty = parties.find(party => party.owner === PartyOwner.Player);
    const enemyParty = parties.find(party => party.owner === PartyOwner.Enemy);

    if (playerParty && enemyParty) {
      this.activityManager.startActivity(BattleActivityType.Battle, { partyXId: playerParty.id, partyYId: enemyParty.id });
    }
  }
}
