import { PartyID } from "@features/party";

export type MapLocationID = string & { __typeGuard: "map-location-id" };
export enum MapLocationType {
  Empty,
  Village,
  Field,
  Portal,
  Boss,
}

export type MapLocation = {
  id: MapLocationID;
  type: MapLocationType;
  explored: boolean;
  x: number;
  y: number;
  partyIds: PartyID[];
};
