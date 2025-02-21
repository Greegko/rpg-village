## SeededRandom

Keeping seeded random in chain

```ts
const random = new SeededRandom("game-seed-id");
```

## Actor

Simple state machine decision framework for AI

Example

```ts
type ActorActions = "moveTowardsEnemy" | "attackEnemy";
type ActorContext = { heroId: string; targetEnemyId?: string };
type ActorDependencies = { getNextEnemy: () => string; getPositionById: (id: string) => Position };
type ActorEvents = "enemyInRange" | "noMoreEnemyClose";

const createActor = createActorFactory(({ switchTo, setContext, executeAction }) => ({
  initial: "Idle",
  states: {
    Idle: {
      onEnter: ({ getNextEnemy }) => {
        setContext({ targetEnemyId: getNextEnemy() });
        swtichTo("Move");
      },
    },
    Move: { onEnter: () => executeAction("moveTowardsEnemy"), onEvent: { enemyInRange: () => switchTo("Attack") } },
    Attack: { onEnter: () => executeAction("attackEnemy"), onEvent: { noMoreEnemyClose: () => switchTo("Idle") } },
  },
}));

const mapObservator = new MapObservator();

const heroAttackRange = 5;

// prettier-ignore
const actor = createActor(
  { // Dependencies
    getNextEnemy: () => "enemyId", getPositionById: (id: string) => {}
  }, 
  { // Actions
    moveTowardsEnemy: ({ getPositionById }, { heroId, targetEnemyId }) => moveUnit(getPositionById(heroId), getPositionById(targetEnemyId)),
  }, 
  { // Event Listeneres
    enemyInRange: ({ getPositionById }, { heroId, targetEnemyId }) => mapObservator.onEventByPosition(getPositionById(heroId), heroAttackRange),
  },
  { heroId: "my-hero!" }, // Context
);

actor.start(); // action: moveTowardsEnemy and start listening to `enemyInRange`

mapObservator.moveEntity("enemyId", { x: 5, y: 5 }); // `enemyInRange` event triggers => state change to `Attack` and execute action: `attackEnemy`
```

## MapObservator

Util for event based collision detection on reactive way, based on circle range

```ts
const mapObservator = new MapObservator();
const sightRange = 5;
mapObservator.onEventByPosition({ x: 10, y: 0 }, sightRange)
  .pipe(filter(x => x.eventType === MapObservatorEvent.Enter))
  .subscribe(
    ({ elementId, eventType }) => console.log('Element: ', elementId, eventType)
  );

// Game State
mapObservator.moveEntity('1', { x: 0: y: 0 });

mapObservator.moveEntity('1', { x: 5: y: 0 }); // log: Element: 1 enter
mapObservator.moveEntity('1', { x: 7: y: 0 }); // log: Element: 1 move
mapObservator.moveEntity('1', { x: 11: y: 0 }); // log: Element: 1 exit
```

## SpatialHash

Util for collision detections between rectangles

```ts
type Node = { id: string; position: { x: number; y: number }; size: number };
const hash = new SpatialHash<Node>(50, x =>
  toRectangleFromPoints(x.position, { x: x.position.x + x.size, y: x.position.y + x.size }),
);

hash.add({ id: 5, position: { x: 10, y: 10 }, size: 2 });

hash.search(toRectangleFromPoint({ x: 12, y: 12 })); // Set<[{ id: 5, ... }]>
hash.search(toRectangleFromPoints({ x: 8, y: 8 }, { x: 15, y: 15 })); // Set<[{ id: 5, ... }]>
hash.search(toRectangleFromPoints({ x: 0, y: 0 }, { x: 5, y: 5 })); // Set<[]>
```
