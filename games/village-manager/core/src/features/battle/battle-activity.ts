import { inject } from "@rpg-village/core";
import { EventSystem } from "@rpg-village/core";

import { Activity, ActivityHandler, injectableActivity } from "@rpg-village/features/activity";

import { PartyID, PartyService } from "@features/party";

import { BattleService } from "./battle-service";
import { BattleActivityType as BattleActivityTypeName, BattleEvent, BattleID } from "./interfaces";

type BattleState = { battleId: BattleID };

export type BattleActivityStartArgs = { targetId: PartyID; involvedTargetId: PartyID };

type BattleActivityType = Activity<BattleState, PartyID, PartyID, BattleActivityStartArgs>;

@injectableActivity(BattleActivityTypeName.Battle)
export class BattleActivity implements ActivityHandler<BattleActivityType> {
  private partyService = inject(PartyService);
  private battleService = inject(BattleService);
  private eventSystem = inject(EventSystem);

  start({ targetId, involvedTargetId }: BattleActivityStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(targetId, involvedTargetId),
    };
  }

  isRunnable({ targetId, involvedTargetId }: BattleActivityStartArgs) {
    return this.partyService.isPartyAlive(targetId) && this.partyService.isPartyAlive(involvedTargetId);
  }

  execute(activity: BattleActivityType): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: BattleActivityType): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve({ state }: BattleActivityType) {
    const battle = this.battleService.getBattle(state.battleId);

    const [winnerPartyId, looserPartyId] = this.partyService.isPartyAlive(battle.partyId)
      ? [battle.partyId, battle.defenderPartyId]
      : [battle.defenderPartyId, battle.partyId];

    this.eventSystem.fire(BattleEvent.Finished, { looserPartyId, winnerPartyId });

    this.battleService.removeBattle(state.battleId);
  }
}
