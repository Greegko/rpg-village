import { createInjectableToken } from "@greegko/tiny-di";

import { SeededRandom } from "@rpg-village/utils/random";

export const RandomContextToken = createInjectableToken<SeededRandom>("SeededRandomContext");
