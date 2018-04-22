import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, calculateSellItemPrice, heroFactory } from './lib';
import { HeroService, PartyService, PartyOwner, LocationID, ItemID, Item } from '@greegko/rpg-model';
import { WorldStore } from '../world';
import { VillageStore } from './village-store';
import { VillageStash } from './village-stash';
import { Resource } from '../../models';

@injectable()
export class Village {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageStash') private villageStash: VillageStash,
    @inject('PartyService') private partyService: PartyService,
    @inject('HeroService') private heroService: HeroService,
    @inject('WorldStore') private worldStore: WorldStore,
  ){ }

  getVillageLocation(): LocationID {
    return this.worldStore.getCenterLocation().id;
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

      this.partyService.createParty({ locationId: this.getVillageLocation(), unitIds: [heroId], owner: PartyOwner.Player });
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
