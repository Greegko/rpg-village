import { inject, injectable } from "inversify";
import { EventSystem } from "@core/event";
import { EntityStore, EntityUpdater } from "@core/store";
import { Unit, UnitID } from "./interfaces";

export enum UnitStoreEvent { Update = 'unitStore/update' };

export interface UnitStoreEventUpdateArgs { unit: Unit };

@injectable()
export class UnitStore extends EntityStore<Unit, UnitID> {
  constructor(@inject("EventSystem") private eventSystem: EventSystem) {
    super();
  }

  update(entityId: UnitID, entityOrUpdater: Partial<Unit> | EntityUpdater<Unit>): void {
    //@ts-ignore
    super.update(entityId, entityOrUpdater);
    this.eventSystem.fire(UnitStoreEvent.Update, { unit: this.get(entityId) });
  }
}
