import { VillageID } from "@rpg-village/village-manager-core";

import { turnSelector, useGameStateSelector, villageByIdSelector } from "@web/store/game";

import "./villagestats.scss";

export const VillageStats = (props: { villageId: VillageID }) => {
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const turn = useGameStateSelector(turnSelector);

  return (
    <div class="villagestats">
      <ul class="villagestats__list">
        <li class="villagestats__list-item">VillageId: {props.villageId}</li>
        <li class="villagestats__list-item">Turn: {turn()}</li>
        <li class="villagestats__list-item">Gold: {village().stash.resource.gold}</li>
        <li class="villagestats__list-item">Soul: {village().stash.resource.soul}</li>
      </ul>
    </div>
  );
};
