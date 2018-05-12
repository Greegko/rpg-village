import { injectable, inject } from 'inversify';
import { assocPath, dissocPath, path } from 'ramda';
import { UnitID } from '@greegko/rpg-model';
import { Item, EquipmentPlace, Hero, HeroService } from '../../models';

@injectable()
export class HeroEquipment {

  constructor(
    @inject('HeroService') private heroService: HeroService
  ){}

  equipItem(heroId: UnitID, item: Item, place: EquipmentPlace) {
    const hero = this.heroService.getHero(heroId);
    const newHero = assocPath(['equipment', place], item, hero) as Hero;

    this.heroService.updateHero(heroId, newHero);
  }

  unEquipItem(heroId: UnitID, place: EquipmentPlace): Item {
    const hero = this.heroService.getHero(heroId);
    const item = path(['equipment', place], hero) as Item;
    const newHero = dissocPath(['equipment', place], hero) as Hero;

    this.heroService.updateHero(heroId, newHero);
    return item;
  }
}
