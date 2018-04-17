import { injectable, inject } from 'inversify';
import { newBuildingCost, newHeroCost, calculateSellItemPrice } from './lib';
import { HeroService, UnitStore, PartyService, PartyOwner, LocationID, ItemID, Item, Resource } from '@greegko/rpg-model';
import { WorldStore } from '../world';
import { VillageStore } from './village-store';
import { VillageResource } from './village-resource';

@injectable()
export class Village {

  constructor(
    @inject('VillageStore') private villageStore: VillageStore,
    @inject('VillageResource') private villageResource: VillageResource,
    @inject('UnitStore') private unitStore: UnitStore,
    @inject('PartyService') private partyService: PartyService,
    @inject('HeroService') private heroService: HeroService,
    @inject('WorldStore') private worldStore: WorldStore,
  ){ }

  getVillageLocation(): LocationID {
    return this.worldStore.getCenterLocation().id;
  }

  buildHouse() {
    const goldCost = newBuildingCost(1 + this.villageStore.Houses);

    if(this.villageStore.Gold >= goldCost){
      this.villageStore.addHouse();
      this.villageResource.removeResource({ gold: goldCost });
    }
  }

  generateGold() {
    this.villageResource.addResource({ gold: 5 });
  }

  hireHero() {
    const herocount = this.heroService.getNumberOfHeroes();
    const goldCost = newHeroCost(1 + herocount);

    if(this.villageStore.Gold >= goldCost && herocount < this.villageStore.Houses){
      const hero = heroFactory();

      this.partyService.createParty({ locationId: this.getVillageLocation(), unitIds: [hero.id], owner: PartyOwner.Player });
      this.unitStore.addUnit(hero);
      this.villageResource.removeResource({ gold: goldCost });
    }
  }

  stashResource(resource: Resource) {
    this.villageResource.addResource(resource);
  }

  stashItems(items: Item[]) {
    this.villageStore.addItemsToStash(items);
  }

  sellItem(itemId: ItemID) {
    const item = this.villageStore.takeItemFromStash(itemId);
    this.villageResource.addResource(calculateSellItemPrice(item));
  }

}
