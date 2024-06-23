import { EntityID, Position, createActorFactory } from "@rpg-village/client-features";

type Dependencies = {
  getMapPosition: (entityId: EntityID) => Position;
};

type Actions =
  | "pickUpResouceFromVillage"
  | "travelToVillage"
  | "travelToTown"
  | "enterTown"
  | "leaveTown"
  | "disband"
  | "enterVillage"
  | "leaveVillage";

type Events =
  | "resourcePickedFromVillage"
  | "townInEntryDistance"
  | "enteredInTown"
  | "villageInEntryDistance"
  | "enteredInVillage"
  | "townLeft"
  | "villageLeft"
  | "onDusk";

type Context = {
  townId: string;
  villageId: string;
  villagerId: string;
  marketFinished: boolean;
};

export const villagerActorFactory = createActorFactory<Context, Actions, Dependencies, Events>(
  ({ switchTo, setContext, executeAction }) => ({
    initial: "Spawned",
    states: {
      Spawned: {
        onEnter: () => executeAction("pickUpResouceFromVillage"),
        onEvent: {
          resourcePickedFromVillage: () => executeAction("leaveVillage"),
          villageLeft: () => switchTo("SellResourceInMarket"),
        },
      },
      Idle: {
        onEnter({}, { marketFinished }) {
          if (marketFinished) switchTo("ReturnToVillage");

          switchTo("SellResourceInMarket");
        },
      },
      SellResourceInMarket: {
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
              enteredInTown: () => switchTo("waitingInTown"),
            },
          },
          waitingInTown: {
            onEnter: ({}, { marketFinished }) => {
              if (!marketFinished) switchTo("market");
            },
          },
          leavingTown: {
            onEnter: () => executeAction("leaveTown"),
            onEvent: {
              townLeft: () => switchTo("ReturnToVillage"),
            },
          },
          market: {
            onEvent: {
              onDusk: () => {
                setContext(context => ({ ...context, marketFinished: true }));
                switchTo("ReturnToVillage");
              },
            },
          },
        },
      },
      ReturnToVillage: {
        onEnter: ({ getMapPosition }, { villagerId }) => {
          if (!getMapPosition(villagerId)) {
            switchTo("leaveTown");
          } else {
            switchTo("travelBackToVillage");
          }
        },
        states: {
          leaveTown: {
            onEnter: () => executeAction("leaveTown"),
            onEvent: {
              villageLeft: () => switchTo("travelBackToVillage"),
            },
          },
          travelBackToVillage: {
            onEnter: () => executeAction("travelToVillage"),
            onEvent: {
              villageInEntryDistance: () => switchTo("enterVillage"),
            },
          },
          enterVillage: {
            onEnter: () => executeAction("enterVillage"),
            onEvent: { enteredInVillage: () => switchTo("disband") },
          },
          disband: {
            onEnter: () => executeAction("disband"),
          },
        },
      },
    },
  }),
);
