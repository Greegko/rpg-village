import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, heroFactory } from './lib';
import { EventSystem } from '../../lib/event-system';
import { PartyService, PartyOwner } from "../party";
import { GameEvents } from '../game/interfaces';
import { MapLocationType } from '../world/interfaces';
import { WorldMap } from '../world';
import { VillageStore } from './village-store';
import { VillageStash } from './village-stash';
import { Resource, Item } from '../../models';
import { VillageEvents } from './interfaces';
import { PlayerStash } from '../player';
import { UnitService } from '../unit';

@injectable()
export class VillageEventHandler {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('PlayerStash') private playerStash: PlayerStash,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitService') private unitService: UnitService,
    @inject('WorldMap') private worldMap: WorldMap
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(VillageEvents.BuildHouse, () => this.buildHouse());
    eventSystem.on(VillageEvents.GenerateGold, () => this.generateGold());
    eventSystem.on(VillageEvents.HireHero, () => this.hireHero());
    eventSystem.on(GameEvents.NewGame, () => this.createVillage());
  }


  createVillage(): void {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    this.villageStore.set('stash', { items: [], resource: {} });
    this.villageStore.set('locationId', locationId);
  }

  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getNumberOfHouses());

    if (this.playerStash.getResource().gold >= goldCost) {
      this.villageStore.addHouse();
      this.playerStash.removeResource({ gold: goldCost });
    }
  }

  generateGold(): void {
    this.playerStash.addResource({ gold: 5 });
  }

  hireHero(): void {
    const heroesCount = this.villageStore.getState().heroes.length;
    const goldCost = newHeroCost(1 + heroesCount);

    if (this.playerStash.getResource().gold >= goldCost && heroesCount < this.villageStore.getNumberOfHouses()) {
      const heroId = this.unitService.createUnit(heroFactory());

      this.partyService.createParty({ locationId: this.villageStore.getState().locationId, unitIds: [heroId], owner: PartyOwner.Player });
      this.playerStash.removeResource({ gold: goldCost });
    }
  }

  stashResource(resource: Resource): void {
    this.playerStash.addResource(resource);
  }

  stashItems(items: Item[]): void {
    this.villageStash.addItemsToStash(items);
  }
}
