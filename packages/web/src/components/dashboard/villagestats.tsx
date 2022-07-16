import { generalSelector, useGameStateSelector, villageSelector } from "@web/store/game";

import "./villagestats.scss";

export const VillageStats = () => {
  const village = useGameStateSelector(villageSelector);
  const general = useGameStateSelector(generalSelector);

  return (
    <div className="villagestats">
      <ul className="villagestats__list">
        <li className="villagestats__list-item">Turn: {general.turn}</li>
        <li className="villagestats__list-item">Gold: {village.stash.resource.gold}</li>
      </ul>
    </div>
  );
};
