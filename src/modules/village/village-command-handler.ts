import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, heroFactory } from './lib';
import { CommandSystem } from '../../lib/command-system';
import { PartyService, PartyOwner } from "../party";
import { GameCommand } from '../game/interfaces';
import { MapLocationType } from '../world/interfaces';
import { WorldMap } from '../world';
import { VillageStore } from './village-store';
import { VillageStash } from './village-stash';
import { Resource, Item } from '../../models';
import { VillageCommand } from './interfaces';
import { UnitService } from '../unit';

@injectable()
export class VillageCommandHandler {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('PartyService') private partyService: PartyService,
    @inject('UnitService') private unitService: UnitService,
    @inject('WorldMap') private worldMap: WorldMap
  ) { }

  init(commandSystem: CommandSystem) {
    commandSystem.on(VillageCommand.BuildHouse, () => this.buildHouse());
    commandSystem.on(VillageCommand.GenerateGold, () => this.generateGold());
    commandSystem.on(VillageCommand.HireHero, () => this.hireHero());
    commandSystem.on(GameCommand.NewGame, () => this.createVillage());
  }


  createVillage(): void {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    this.villageStore.set('stash', { items: [], resource: {} });
    this.villageStore.set('locationId', locationId);
  }

  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getNumberOfHouses());

    if (this.villageStash.hasEnoughResource({ gold: goldCost })) {
      this.villageStore.addHouse();
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  generateGold(): void {
    this.villageStash.addResource({ gold: 5 });
  }

  hireHero(): void {
    const heroesCount = this.villageStore.getState().heroes.length;
    const goldCost = newHeroCost(1 + heroesCount);

    if (this.villageStash.hasEnoughResource({ gold: goldCost }) && heroesCount < this.villageStore.getNumberOfHouses()) {
      const heroId = this.unitService.createUnit(heroFactory());

      this.villageStore.addHero(heroId);
      this.partyService.createParty({ locationId: this.villageStore.getState().locationId, unitIds: [heroId], owner: PartyOwner.Player });
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  stashResource(resource: Resource): void {
    this.villageStash.addResource(resource);
  }

  stashItems(items: Item[]): void {
    this.villageStash.addItems(items);
  }
}
