import { BattleActivityType } from "@features/battle";
import { PartyOwner } from "@features/party";
import { MapCommand } from "@modules/map";

import { createState, test } from "../../utils";

test("should start Battle activity", {
  initState: createState(({ party, unit, location, map }) => [
    map({ mapLocationIds: [location({ id: "battle-location", partyIds: ["party-x", "party-y"] })], modifiers: [] }),
    party({ id: "party-x", unitIds: [unit({ hp: 50 })], owner: PartyOwner.Player }),
    party({ id: "party-y", unitIds: [unit({ hp: 50 })], owner: PartyOwner.Enemy }),
  ]),
  commands: [{ command: MapCommand.Battle, args: { locationId: "battle-location" } }],
  expectedState: (state, t) => {
    t.withRandomId(state.activities, { name: BattleActivityType.Battle });
    t.withRandomId(state.battle, {
      partyId: "party-x",
      defenderPartyId: "party-y",
    });
  },
});
