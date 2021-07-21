import { connect } from "react-redux";
import { VillageState, GeneralGameStoreState, VillageCommand } from "@rpg-village/core";
import { GameStoreState, executeCommand } from "../../game";

const storeDispatchers = { executeCommand };

const propertyMapper = (state: GameStoreState) => {
  return {
    village: state.game.village,
    general: state.game.general,
  };
};

interface VillageStatsProperties {
  village: VillageState;
  general: GeneralGameStoreState;
  executeCommand: typeof executeCommand;
}

import "./villagestats.scss";
export const VillageStats = connect(
  propertyMapper,
  storeDispatchers,
)(({ village, general, executeCommand }: VillageStatsProperties) => (
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
));
