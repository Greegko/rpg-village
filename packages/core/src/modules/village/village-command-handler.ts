import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, heroFactory } from './lib';
import { CommandSystem } from '../../lib/command-system';
import { PartyService, PartyOwner } from "../party";
import { GameCommand } from '../game/interfaces';
import { MapLocationType } from '../world/interfaces';
import { WorldMap } from '../world';
import { VillageStore } from './village-store';
import { VillageStashService } from './village-stash-service';
import { Resource, Item } from '../../models';
import { VillageCommand } from './interfaces';
import { UnitService } from '../unit';
import { append, inc } from 'ramda';

@injectable()
export class VillageCommandHandler {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStashService') private villageStash: VillageStashService,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitService') private unitService: UnitService,
    @inject('WorldMap') private worldMap: WorldMap,
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(VillageCommand.BuildHouse, () => this.buildHouse());
    commandSystem.on(VillageCommand.GenerateGold, () => this.generateGold());
    commandSystem.on(VillageCommand.HireHero, () => this.hireHero());
    commandSystem.on(GameCommand.NewGame, () => this.createVillage());
  }


  createVillage(): void {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    this.worldMap.revealNewLocations(locationId);
    this.villageStore.set('stash', { items: [], resource: {} });
    this.villageStore.set('locationId', locationId);
  }

  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getState().houses);

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.update('houses', inc);
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  generateGold(): void {
    this.villageStash.addResource({ gold: 5 });
  }

  hireHero(): void {
    const villageState = this.villageStore.getState();
    const heroesCount = villageState.heroes.length;
    const goldCost = newHeroCost(1 + heroesCount);

    if (this.villageStash.hasEnoughResource({ gold: goldCost }) && heroesCount < villageState.houses) {
      const heroId = this.unitService.addUnit(heroFactory());

      this.villageStash.removeResource({ gold: goldCost });
      this.villageStore.update('heroes', append(heroId));
      this.partyService.createParty({
        locationId: this.villageStore.getState().locationId,
        unitIds: [heroId],
        owner: PartyOwner.Player,
        stash: { resource: { gold: 0 }, items: [] }
      });
    }
  }

  stashResource(resource: Resource): void {
    this.villageStash.addResource(resource);
  }

  stashItems(items: Item[]): void {
    this.villageStash.addItems(items);
  }
}
