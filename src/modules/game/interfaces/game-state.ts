import { Party } from "../../party";
import { Unit } from "../../unit/interfaces";
import { AnyActivity } from '../../activity/interfaces';
import { GeneralGameStoreState } from './general-game-store-state';
import { WithID } from '../../../models';

export type GameState = {
  general: GeneralGameStoreState;
  units: { [key: string]: WithID<Unit> };
  parties: { [key: string]: WithID<Party> };
  activities: { [key: string]: WithID<AnyActivity> };
};
