import { BattleActivityType } from "@/features/battle";
import { MapCommand } from "@/features/map";
import { PartyOwner } from "@/features/party";
import { createState, test } from "@test/utils";
import { expect } from "vitest";

test("should start Battle activity", {
  initState: createState(({ party, unit, location, map }) => [
    map({ mapLocationIds: [location({ id: "battle-location", partyIds: ["party-x", "party-y"] })], modifiers: [] }),
    party({ id: "party-x", unitIds: [unit({ hp: 50 })], owner: PartyOwner.Player }),
    party({ id: "party-y", unitIds: [unit({ hp: 50 })], owner: PartyOwner.Enemy }),
  ]),
  commands: [{ command: MapCommand.Battle, args: { locationId: "battle-location" } }],
  expectedState: state => {
    expect(state.activities).withRandomId({ name: BattleActivityType.Battle });
    expect(state.battle).withRandomId({
      partyId: "party-x",
      defenderPartyId: "party-y",
    });
  },
});
