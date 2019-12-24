import { PartyBase } from "../../party";
import { UnitBase } from "../../unit";
import { AnyActivity } from '../../activity/interfaces';
import { GeneralGameStoreState } from './general-game-store-state';
import { WithID } from '../../../models';

export type GameState = {
  general: GeneralGameStoreState;
  units: { [key: string]: WithID<UnitBase> };
  parties: { [key: string]: WithID<PartyBase> };
  activities: { [key: string]: WithID<AnyActivity> };
};
