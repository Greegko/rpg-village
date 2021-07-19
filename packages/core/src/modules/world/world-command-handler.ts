import { injectable, inject } from "inversify";
import { CommandHandler, CommandSystem } from "@core/command";
import { ActivityManager } from "@modules/activity";
import { PartyService, PartyOwner } from "@modules/party";
import { BattleActivityType } from "@modules/battle";
import { WorldCommand, WorldActivity, BattleCommandArgs } from "./interfaces";


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
    this.activityManager.startPartyActivity(WorldActivity.Travel, travelArgs);
  }

  private exploreCommand(exploreArgs: any) {
    this.activityManager.startPartyActivity(WorldActivity.Explore, exploreArgs);
  }

  private battleCommand(battleArgs: BattleCommandArgs) {
    const parties = this.partyService.getPartiesOnLocation(battleArgs.locationId);

    const playerParty = parties.find(party => party.owner === PartyOwner.Player);
    const enemyParty = parties.find(party => party.owner === PartyOwner.Enemy);

    if (playerParty && enemyParty) {
      this.activityManager.startPartyActivity(BattleActivityType.Battle, { partyId: playerParty.id, involvedPartyId: enemyParty.id });
    }
  }
}
