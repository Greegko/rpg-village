import { PartyBase } from '../../core-src';
import { MapLocationID } from '../modules/world/interfaces';

export type Party = PartyBase & {
  locationId: MapLocationID;
}
