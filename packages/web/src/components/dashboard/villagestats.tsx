import { connect } from "react-redux";

import { GeneralGameStoreState, VillageCommand, VillageState } from "@rpg-village/core";

import { GameStoreState } from "../../game";
import { ExecuteCommand } from "../../game/store/game-command";

import "./villagestats.scss";

const propertyMapper = (state: GameStoreState) => {
  return {
    village: state.game.village,
    general: state.game.general,
  };
};

interface VillageStatsProperties {
  village: VillageState;
  general: GeneralGameStoreState;
}

export const VillageStats = connect(
  propertyMapper,
  ExecuteCommand,
)(({ village, general, executeCommand }: VillageStatsProperties & ExecuteCommand) => (
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
