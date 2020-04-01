import { PartyID } from "./party";
import { MapLocationID } from "../../world/interfaces";

export enum PartyEvent { ArrivedToLocation = 'party/arrived-to-location' };
export type ArrivedToLocationEventArgs = { partyId: PartyID; locationId: MapLocationID; }
