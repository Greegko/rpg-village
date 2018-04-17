import { injectable, inject } from 'inversify';
import { Village } from './village';
import { EventSystem } from '@greegko/rpg-model';
import { VillageEvents } from './interfaces';

@injectable()
export class VillageEventHandler {

  constructor(@inject('Village') private village: Village) {}

  init(eventSystem: EventSystem) {
    eventSystem.on(VillageEvents.BuildHouse, () => this.village.buildHouse());
    eventSystem.on(VillageEvents.GenerateGold, () => this.village.generateGold());
    eventSystem.on(VillageEvents.HireHero, () => this.village.hireHero());
    eventSystem.on(VillageEvents.SellItem, ({ itemId }) => this.village.sellItem(itemId));
  }

}
