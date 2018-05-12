import { PartyBase } from '@greegko/rpg-model';
import { MapLocationID } from '../modules/world/interfaces';

export type Party = PartyBase & {
  locationId: MapLocationID;
}
