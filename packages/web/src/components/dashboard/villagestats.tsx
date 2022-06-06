import { VillageCommand } from "@rpg-village/core";

import { generalSelector, useGameStateSelector, villageSelector } from "../../game/store/game";
import { useExecuteCommandDispatch } from "../../game/store/game-command";

import "./villagestats.scss";

export const VillageStats = () => {
  const village = useGameStateSelector(villageSelector);
  const general = useGameStateSelector(generalSelector);

  const executeCommand = useExecuteCommandDispatch();

  return (
    <div className="villagestats">
      <ul className="villagestats__list">
        <li className="villagestats__list-item">Turn: {general.turn}</li>
        <li className="villagestats__list-item">Gold: {village.stash.resource.gold}</li>
        <li className="villagestats__list-item">
          <button style={{ margin: 0 }} onClick={() => executeCommand({ command: VillageCommand.GenerateGold })}>
            Generate Gold
          </button>
        </li>
      </ul>
    </div>
  );
};
