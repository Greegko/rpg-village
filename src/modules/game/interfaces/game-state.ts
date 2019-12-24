import { PartyBase } from '@greegko/rpg-model';
import { UnitBase } from '@greegko/rpg-model';
import { AnyActivity } from '@greegko/rpg-model';
import { GeneralGameStoreState } from './general-game-store-state';
import { WithID } from '@greegko/rpg-model';

export type GameState = {
  general: GeneralGameStoreState;
  units: { [key: string]: WithID<UnitBase> };
  parties: { [key: string]: WithID<PartyBase> };
  activities: { [key: string]: WithID<AnyActivity> };
};
