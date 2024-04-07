import { VillageID } from "@rpg-village/core";

import { generalSelector, useGameStateSelector, villageByIdSelector } from "@web/store/game";

import "./villagestats.scss";

export const VillageStats = (props: { villageId: VillageID }) => {
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const general = useGameStateSelector(generalSelector);

  return (
    <div className="villagestats">
      ID: {props.villageId}
      <ul className="villagestats__list">
        <li className="villagestats__list-item">Turn: {general.turn}</li>
        <li className="villagestats__list-item">Gold: {village.stash.resource.gold}</li>
        <li className="villagestats__list-item">Soul: {village.stash.resource.soul}</li>
      </ul>
    </div>
  );
};
