import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, calculateSellItemPrice, heroFactory } from './lib';
import { HeroService, PartyService, PartyOwner, ItemID, Item, StashService, EventSystem, GameEvents } from '@greegko/rpg-model';
import { MapLocationType } from '../world/interfaces';
import { WorldMap } from '../world';
import { VillageStore } from './village-store';
import { VillageStash } from './village-stash';
import { Resource } from '../../models';
import { VillageEvents } from './interfaces';

@injectable()
export class VillageEventHandler {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('PartyService') private partyService: PartyService,
    @inject('HeroService') private heroService: HeroService,
    @inject('StashService') private stashService: StashService,
    @inject('WorldMap') private worldMap: WorldMap
  ) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(VillageEvents.BuildHouse, () => this.buildHouse());
    eventSystem.on(VillageEvents.GenerateGold, () => this.generateGold());
    eventSystem.on(VillageEvents.HireHero, () => this.hireHero());
    eventSystem.on(VillageEvents.SellItem, ({ itemId }) => this.sellItem(itemId));
    eventSystem.on(GameEvents.NewGame, () => this.createVillage());
  }


  createVillage() {
    const locationId = this.worldMap.createLocation(0, 0, true, MapLocationType.Village);
    const stashId = this.stashService.createStash();
    this.villageStore.assignStash(stashId);
    this.villageStore.assignLocation(locationId);
  }

  buildHouse() {
    const goldCost = newBuildingCost(1 + this.villageStore.getNumberOfHouses());

    if(this.villageStash.getResource().gold >= goldCost){
      this.villageStore.addHouse();
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  generateGold() {
    this.villageStash.addResource({ gold: 5 });
  }

  hireHero() {
    const herocount = this.heroService.getNumberOfHeroes();
    const goldCost = newHeroCost(1 + herocount);

    if(this.villageStash.getResource().gold >= goldCost && herocount < this.villageStore.getNumberOfHouses()){
      const heroId = this.heroService.createHero(heroFactory());

      this.partyService.createParty({ locationId: this.villageStore.getState().locationId, unitIds: [heroId], owner: PartyOwner.Player });
      this.villageStash.removeResource({ gold: goldCost });
    }
  }

  stashResource(resource: Resource) {
    this.villageStash.addResource(resource);
  }

  stashItems(items: Item[]) {
    this.villageStash.addItemsToStash(items);
  }

  sellItem(itemId: ItemID) {
    const item = this.villageStash.takeItemFromStash(itemId);
    this.villageStash.addResource(calculateSellItemPrice(item));
  }

}
