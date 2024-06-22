import { entries, isNonNull, omit, set } from "remeda";
import { Observable, Subject, concat, concatMap, filter, first, map, scan, shareReplay, tap } from "rxjs";

import { getVectorDistance } from "../utils/vector";

export type Position = { x: number; y: number };

export type EntityID = string;

interface Movement {
  entityId: EntityID;
  position: Position | null;
}

export enum MapObservatorEventType {
  Enter,
  Exit,
  Move,
}

type LastKnownPositionMap = Record<EntityID, Position>;

export type MapObservatorEvent = { entityId: EntityID; position: Position | null; eventType: MapObservatorEventType };

export class MapObservator {
  private movementSubject$ = new Subject<Movement>();
  private lastKnownPosition$: Observable<LastKnownPositionMap> = this.movementSubject$.pipe(
    scan(
      (acc, curr) => (curr.position !== null ? set(acc, curr.entityId, curr.position) : omit(acc, [curr.entityId])),
      {} as LastKnownPositionMap,
    ),
    shareReplay(),
  );

  private movementsInit$ = this.lastKnownPosition$.pipe(
    first(),
    concatMap(lastKnownPosition => entries(lastKnownPosition).map(([entityId, position]) => ({ entityId, position }))),
  );

  constructor() {
    this.lastKnownPosition$.subscribe().unsubscribe();
  }

  moveEntity(entityId: EntityID, position: Position | null) {
    this.movementSubject$.next({ entityId, position });
  }

  onEventByPosition(position: Position, range: number): Observable<MapObservatorEvent> {
    const inRange = (pos: Position) => getVectorDistance(pos, position) <= range;

    const visibleMap: Record<EntityID, boolean> = {};

    return concat(this.movementsInit$, this.movementSubject$).pipe(
      map(({ entityId, position }) => {
        const c = position && inRange(position);

        if (c) {
          if (visibleMap[entityId]) {
            return { entityId, position, eventType: MapObservatorEventType.Move } as MapObservatorEvent;
          } else {
            return { entityId, position, eventType: MapObservatorEventType.Enter } as MapObservatorEvent;
          }
        }

        if (visibleMap[entityId]) {
          return { entityId, position, eventType: MapObservatorEventType.Exit } as MapObservatorEvent;
        }

        return null;
      }),
      filter(isNonNull),
      tap(x => (visibleMap[x.entityId] = x.eventType !== MapObservatorEventType.Exit)),
    );
  }
}
