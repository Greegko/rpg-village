import { OptionCommand } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should remove option object", {
  initState: createState(({ option, village }) => [
    option({
      id: "option-id",
      items: [{ id: "option-item-id", item: { name: "option-buy-item" } }],
    }),
    village(),
  ]),
  commands: [{ command: OptionCommand.ChooseOption, args: { optionId: "option-id", optionItemId: "option-item-id" } }],
  expectedState: (state, t) => t.is(state.options["option-id"], undefined),
});

test("should put into village items the choosed option", {
  initState: createState(({ option, village }) => [
    option({
      id: "option-id",
      items: [{ id: "option-item-id", item: { name: "option-buy-item" } }],
    }),
    village({ stash: { items: [] } }),
  ]),
  commands: [{ command: OptionCommand.ChooseOption, args: { optionId: "option-id", optionItemId: "option-item-id" } }],
  expectedState: { village: { stash: { items: [{ name: "option-buy-item" }] } } },
});
