import { Unit } from "@modules/unit";

export enum UnitEvent { Die = 'unit/die' };

export interface UnitEventDieArgs {
  unit: Unit;
}
