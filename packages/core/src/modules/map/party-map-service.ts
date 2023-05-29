import { injectable } from "inversify";
import { append, evolve, find, values, without } from "rambda";

import { Party, PartyID, PartyStore } from "@modules/party";

import { MapLocation, MapLocationID } from "./interfaces";
import { MapLocationStore } from "./map-location-store";

@injectable()
export class PartyMapService {
  constructor(private mapLocationStore: MapLocationStore, private partyStore: PartyStore) {}

  setLocation(partyId: PartyID, locationId: MapLocationID) {
    const oldLocation = this.getPartyLocation(partyId);

    if (oldLocation) {
      this.mapLocationStore.update(oldLocation.id, evolve({ partyIds: without([partyId]) }));
    }

    this.mapLocationStore.update(locationId, evolve({ partyIds: append(partyId) }));
  }

  getPartiesOnLocation(locationId: MapLocationID): Party[] {
    return this.mapLocationStore.get(locationId).partyIds.map(partyId => this.partyStore.get(partyId));
  }

  getPartyLocation(partyId: PartyID): MapLocation | undefined {
    return find(x => x.partyIds.includes(partyId), values(this.mapLocationStore.getState()));
  }
}
