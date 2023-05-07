import { BattleActivityType, MapCommand, PartyOwner } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should start Battle activity", {
  initState: createState(({ party, unit, location, map }) => [
    map({ mapLocationIds: ["battle-location"], modifiers: [] }),
    party({
      id: "party-x",
      locationId: location({ id: "battle-location" }),
      unitIds: [unit({ hp: 50 })],
      owner: PartyOwner.Player,
    }),
    party({
      id: "party-y",
      locationId: location({ id: "battle-location" }),
      unitIds: [unit({ hp: 50 })],
      owner: PartyOwner.Enemy,
    }),
  ]),
  commands: [
    {
      command: MapCommand.Battle,
      args: { locationId: "battle-location" },
    },
  ],
  expectedState: (state, t) => {
    t.withRandomId(state.activities, { name: BattleActivityType.Battle });
    t.withRandomId(state.battle, {
      partyId: "party-x",
      defenderPartyId: "party-y",
    });
  },
});
