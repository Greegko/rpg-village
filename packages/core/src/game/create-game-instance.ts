import { inject } from "@lib/dependency-injection";

import { GameController } from "./game-controller";
import { GameInstance } from "./interfaces";

export type CreateGameInstance = () => GameInstance;

export const createGameInstance: CreateGameInstance = () => inject(GameController);
