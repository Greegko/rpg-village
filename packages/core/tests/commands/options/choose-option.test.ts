import { OptionCommand } from "@features/options";

import { createState, test } from "../../utils";

test("should remove option object", {
  initState: createState(({ option, village }) => [
    option({
      id: "option-id",
      items: [{ id: "option-item-id", item: { name: "option-buy-item" } }],
    }),
    village({ id: "villageId" }),
  ]),
  commands: [
    {
      command: OptionCommand.ChooseOption,
      args: { villageId: "villageId", optionId: "option-id", optionItemId: "option-item-id" },
    },
  ],
  expectedState: (state, t) => t.undefined(state.options["option-id"]),
});

test("should put into village items the choosed option", {
  initState: createState(({ option, village }) => [
    option({
      id: "option-id",
      items: [{ id: "option-item-id", item: { name: "option-buy-item" } }],
    }),
    village({ id: "villageId", stash: { items: [] } }),
  ]),
  commands: [
    {
      command: OptionCommand.ChooseOption,
      args: { villageId: "villageId", optionId: "option-id", optionItemId: "option-item-id" },
    },
  ],
  expectedState: { villages: { villageId: { stash: { items: [{ name: "option-buy-item" }] } } } },
});
