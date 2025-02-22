import { evolve, forEach, values } from "remeda";

import { inject, injectable } from "@rpg-village/core";
import { eventHandler } from "@rpg-village/core";

import { ItemType, addItem } from "@features/item";
import { TimeEvent } from "@features/time";

import { VillageStore } from "./village-store";

@injectable()
export class VillageEventHandler {
  private villageStore = inject(VillageStore);

  @eventHandler(TimeEvent.NewDay)
  changeProsperity() {
    const villages = this.villageStore.getState();

    forEach(values(villages), village => this.villageStore.update(village.id, evolve({ prosperity: x => x + 1 })));
  }

  @eventHandler(TimeEvent.NewDay)
  produceProduct() {
    const villages = this.villageStore.getState();

    forEach(values(villages), village =>
      this.villageStore.update(village.id, evolve({ stash: stash => addItem(stash, { itemType: ItemType.Grain, amount: 5 }) })),
    );
  }
}
