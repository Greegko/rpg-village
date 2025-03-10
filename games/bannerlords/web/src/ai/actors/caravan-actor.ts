import { createActorFactory } from "@rpg-village/utils/actor";
import { EntityID } from "@rpg-village/utils/map-observator";
import { Position } from "@rpg-village/utils/node";

type Dependencies = {
  getMapPosition: (entityId: EntityID) => Position;
};

type Actions = "travelToTown" | "enterTown" | "leaveTown" | "findNewNextTown" | "trading";

type Events = "townInEntryDistance" | "enteredInTown" | "townLeft" | "marketFinished";

type Context = {
  nextTownId: string;
};

export const villagerActorFactory = createActorFactory<Context, Actions, Dependencies, Events>(({ switchTo, executeAction }) => ({
  initial: "Idle",
  states: {
    Idle: {
      onEnter: () => switchTo("TravelToNextDestination"),
    },
    TravelToNextDestination: {
      initial: "travelToTown",
      states: {
        travelToTown: {
          onEnter: () => executeAction("travelToTown"),
          onEvent: {
            townInEntryDistance: () => switchTo("arrivedToTown"),
          },
        },
        arrivedToTown: {
          onEnter: () => executeAction("enterTown"),
          onEvent: {
            enteredInTown: () => switchTo("market"),
          },
        },
        market: {
          onEnter: () => executeAction("trading"),
          onEvent: {
            marketFinished: () => switchTo("Idle"),
          },
        },
      },
    },
  },
}));
