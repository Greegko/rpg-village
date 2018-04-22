import { injectable } from 'inversify';
import { LocationID, Store } from '@greegko/rpg-model';
import { append, findIndex, find, update, propEq, assoc } from 'ramda';
import { WorldStoreState, MapLocation } from './interfaces';

const WorldStoreStateInit: WorldStoreState = { locations: [] };

@injectable()
export class WorldStore implements Store<WorldStoreState> {

  private _state: WorldStoreState = WorldStoreStateInit;

  init(state: WorldStoreState) {
    this._state = state;
  }

  getState(): WorldStoreState {
    return this._state;
  }

  getLocation(locationId: LocationID): MapLocation {
    return find(propEq('id', locationId), this._state.locations);
  }

  getLocations(): MapLocation[] {
    return this._state.locations;
  }

  addLocation(location: MapLocation) {
    const newLocations = append(location, this._state.locations);
    this._state = assoc('locations', newLocations, this._state);
  }

  exploreLocation(locationId: LocationID) {
    this._updateLocation({ ...this.getLocation(locationId), explored: true });
  }

  private _updateLocation(location: MapLocation) {
    const locationIndex = findIndex(propEq('id', location.id), this._state.locations);
    const newLocations = update(locationIndex, location, this._state.locations);

    this._state = assoc('locations', newLocations, this._state);
  }

}
