
import { injectable, inject } from 'inversify';
import { EventSystem } from "../../../core-src";
import { HeroEquipItemArgs, HeroUnequipItemArgs, HeroEvents } from './hero-events';
import { StashItems } from '../stash';
import { HeroEquipment } from './hero-equipment';

@injectable()
export class HeroEventHandler {

  constructor(
    @inject('HeroEquipment') private heroEquipment: HeroEquipment,
    @inject('StashItems') private stashItems: StashItems,
  ) { }

  init(eventSystem: EventSystem) {
    eventSystem.on(
      HeroEvents.EquipItem,
      (equipItemArgs: HeroEquipItemArgs) => this._equipItem(equipItemArgs)
    );

    eventSystem.on(
      HeroEvents.UnequipItem,
      (unequipItemArgs: HeroUnequipItemArgs) => this._unequipEquipment(unequipItemArgs)
    );
  }

  private _equipItem({ heroId, itemId, stashId, place }: HeroEquipItemArgs) {
    const item = this.stashItems.takeItem(stashId, itemId);
    this.heroEquipment.equipItem(heroId, item, place);
  }

  private _unequipEquipment({ heroId, stashId, place }: HeroUnequipItemArgs) {
    const item = this.heroEquipment.unEquipItem(heroId, place);
    this.stashItems.addItems(stashId, [item]);
  }
}
