import { PartyBase, UnitBase, WithID } from "../../../../core-src";
import { AnyActivity } from '../../activity/interfaces';
import { GeneralGameStoreState } from './general-game-store-state';

export type GameState = {
  general: GeneralGameStoreState;
  units: { [key: string]: WithID<UnitBase> };
  parties: { [key: string]: WithID<PartyBase> };
  activities: { [key: string]: WithID<AnyActivity> };
};
