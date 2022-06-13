import { useDispatch } from "react-redux";

import { unitByIdSelector, useGameStateSelector } from "@web/store/game";
import { changePage } from "@web/store/game-ui";
import { GamePageType } from "@web/store/game-ui/interface";

import { Icons, ProgressBar } from "../core";

import "./hero.scss";

interface HeroProperties {
  heroId: string;
}

export const Hero = ({ heroId }: HeroProperties) => {
  const hero = useGameStateSelector(state => unitByIdSelector(state, heroId));
  const dispatch = useDispatch();

  return (
    <div
      className="hero"
      onClick={() => dispatch(changePage({ page: GamePageType.CharacterSheet, args: { unitId: hero.id } }))}
    >
      <div className="hero__name">{hero.name}</div>
      <ProgressBar icon={Icons.Heart} color="crimson" value={hero.hp} maxValue={hero.maxhp} />
      <div className="hero__attack">Attack: {hero.dmg}</div>
    </div>
  );
};
