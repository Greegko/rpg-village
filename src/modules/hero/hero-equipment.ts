import { injectable, inject } from 'inversify';
import { assocPath, dissocPath, path } from 'ramda';
import { UnitID, UnitStore } from '@greegko/rpg-model';
import { Item, EquipmentPlace, Hero } from '../../models';

@injectable()
export class HeroEquipment {

  constructor(
    @inject('UnitStore') private unitStore: UnitStore<Hero>
  ){}

  equipItem(heroId: UnitID, item: Item, place: EquipmentPlace) {
    const hero = this.unitStore.get(heroId);
    const newHero = assocPath(['equipment', place], item, hero) as Hero;

    this.unitStore.update(heroId, newHero);
  }

  unEquipItem(heroId: UnitID, place: EquipmentPlace): Item {
    const hero = this.unitStore.get(heroId);
    const item = path(['equipment', place], hero) as Item;
    const newHero = dissocPath(['equipment', place], hero) as Hero;

    this.unitStore.update(heroId, newHero);
    return item;
  }
}
