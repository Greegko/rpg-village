import { append, evolve, find, head, values } from "rambda";

import { inject, injectable } from "@rpg-village/core";
import { GameCommand, GeneralGameStore, commandHandler } from "@rpg-village/core";

import { ActivityManager } from "@rpg-village/features/activity";

import { PortalCommand, PortalCommandEnterPortalArgs } from "@features/buildings/portal";
import { MapLocationType, MapService, MapSize, PartyMapService } from "@features/map";
import { PartyOwner, PartyService } from "@features/party";
import { UnitStore, isAlive } from "@features/unit";

import { VillageActivity, VillageCommand, VillageCommandHealPartyArgs, VillageCommandHeroHireArgs } from "./interfaces";
import { heroFactory, newHeroCost } from "./lib";
import { VillageService } from "./village-service";
import { VillageStore } from "./village-store";

@injectable()
export class VillageCommandHandler {
  private villageStore = inject(VillageStore);
  private villageService = inject(VillageService);
  private partyService = inject(PartyService);
  private unitStore = inject(UnitStore);
  private mapService = inject(MapService);
  private generalGameStore = inject(GeneralGameStore);
  private partyMapService = inject(PartyMapService);
  private activityManager = inject(ActivityManager);

  @commandHandler(VillageCommand.HireHero)
  hireHero(args: VillageCommandHeroHireArgs): void {
    const villageState = this.villageStore.get(args.villageId);
    const heroesCount = villageState.heroes.map(unitId => this.unitStore.get(unitId)).filter(isAlive).length;
    const goldCost = newHeroCost(1 + heroesCount);
    const villageStash = this.villageService.getStash(args.villageId);

    const houses = villageState.buildings.houses || 0;

    if (villageStash.hasEnoughResource({ gold: goldCost }) && heroesCount < houses) {
      const heroId = this.unitStore.add(heroFactory()).id;

      villageStash.removeResource({ gold: goldCost });
      this.villageStore.update(args.villageId, evolve({ heroes: append(heroId) }));

      const party = this.partyService.createParty({
        unitIds: [heroId],
        owner: PartyOwner.Player,
        stash: { resource: { gold: 0, soul: 0 }, items: [] },
      });

      this.partyMapService.setLocation(party.id, villageState.locationId);
    }
  }

  @commandHandler(VillageCommand.HealParty)
  healParty(healPartyArgs: VillageCommandHealPartyArgs): void {
    this.activityManager.startActivity(VillageActivity.Heal, {
      targetId: healPartyArgs.villageId,
      involvedTargetId: healPartyArgs.partyId,
    });
  }

  @commandHandler(GameCommand.NewGame)
  createVillage(): void {
    const map = this.mapService.createMap(MapLocationType.Village, MapSize.Endless, []);
    this.generalGameStore.set("worldMapId", map.id);

    this.villageStore.add({
      stash: { items: [], resource: { gold: 0, soul: 0 } },
      locationId: head(map.mapLocationIds)!,
      heroes: [],
      buildings: {
        houses: 0,
        blacksmith: 0,
        trainingField: 0,
        runeWorkshop: 0,
        portalSummoningStone: undefined,
        shop: undefined,
      },
    });
  }

  @commandHandler(PortalCommand.EnterPortal)
  enterPartyInPortal(args: PortalCommandEnterPortalArgs) {
    const partyLocation = this.partyMapService.getPartyLocation(args.partyId);
    const villages = values(this.villageStore.getState());
    const village = find(x => x.locationId === partyLocation!.id, villages);

    if (village && village.buildings.portalSummoningStone?.portals) {
      const summoningStone = village.buildings.portalSummoningStone;
      if (summoningStone) {
        const portal = summoningStone.portals.find(x => x.id === args.portalId);

        if (portal) {
          this.partyMapService.setLocation(args.partyId, portal.connectedLocationId);
        }
      }
    }
  }
}
