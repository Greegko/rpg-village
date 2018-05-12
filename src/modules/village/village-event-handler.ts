import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, heroFactory } from './lib';
import { PartyService, PartyOwner, StashService, EventSystem, GameEvents } from '@greegko/rpg-model';
import { MapLocationType } from '../world/interfaces';
import { WorldMap } from '../world';
import { VillageStore } from './village-store';
import { VillageStash } from './village-stash';
import { Resource, Item, Party, HeroService } from '../../models';
import { VillageEvents } from './interfaces';
import { PlayerStash } from '../player';

@injectable()
export class VillageEventHandler {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('PlayerStash') private playerStash: PlayerStash,
    @inject('PartyService') private partyService: PartyService<Party>,
    @inject('HeroService') private heroService: HeroService,
    @inject('StashService') private stashService: StashService,
    @inject('WorldMap') private worldMap: WorldMap
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(VillageEvents.BuildHouse, () => this.buildHouse());
    eventSystem.on(VillageEvents.GenerateGold, () => this.generateGold());
    eventSystem.on(VillageEvents.HireHero, () => this.hireHero());
    eventSystem.on(GameEvents.NewGame, () => this.createVillage());
  }


  createVillage(): void {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    const stashId = this.stashService.createStash();
    this.villageStore.assignStash(stashId);
    this.villageStore.assignLocation(locationId);
  }

  buildHouse(): void {
    const goldCost = newBuildingCost(1 + this.villageStore.getNumberOfHouses());

    if(this.playerStash.getResource().gold >= goldCost){
      this.villageStore.addHouse();
      this.playerStash.removeResource({ gold: goldCost });
    }
  }

  generateGold(): void {
    this.playerStash.addResource({ gold: 5 });
  }

  hireHero(): void {
    const herocount = this.heroService.getNumberOfHeroes();
    const goldCost = newHeroCost(1 + herocount);

    if(this.playerStash.getResource().gold >= goldCost && herocount < this.villageStore.getNumberOfHouses()){
      const heroId = this.heroService.createHero(heroFactory());

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
