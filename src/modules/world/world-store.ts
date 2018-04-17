import { injectable } from 'inversify';
import { LocationID, Location, Store } from '@greegko/rpg-model';
import { append, findIndex, find, update, propEq, assoc } from 'ramda';
import { WorldStoreState } from './interfaces';

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

  getLocation(locationId: LocationID): Location {
    return find(propEq('id', locationId), this._state.locations);
  }

  getCenterLocation(): Location {
    return this._state.locations[0];
  }

  getLocations(): Location[] {
    return this._state.locations;
  }

  addLocation(location: Location) {
    const newLocations = append(location, this._state.locations);
    this._state = assoc('locations', newLocations, this._state);
  }

  exploreLocation(locationId: LocationID) {
    this._updateLocation({ ...this.getLocation(locationId), explored: true });
  }

  private _updateLocation(location: Location) {
    const locationIndex = findIndex(propEq('id', location.id), this._state.locations);
    const newLocations = update(locationIndex, location, this._state.locations);

    this._state = assoc('locations', newLocations, this._state);
  }

}
