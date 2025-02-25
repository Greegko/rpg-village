import { Random } from "../../utils";
import { createInjectableToken } from "../injection-container";

export const RandomContextToken = createInjectableToken<Random>("RandomContext");
