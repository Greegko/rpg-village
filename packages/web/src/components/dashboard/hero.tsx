import { values } from "ramda";
import { connect } from "react-redux";

import { Unit } from "@rpg-village/core";

import { GameStoreState } from "../../game";
import { openCharacterSheet } from "../../game/pages";
import { heroUnitsSelector } from "../../game/store/game";
import { Icons, ProgressBar } from "../core";

import "./hero.scss";

const propertyMapper = (state: GameStoreState, props: HeroProperties): HeroState => ({
  hero: values(heroUnitsSelector(state.game)).find(({ id }) => id === props.heroId)!,
});

interface HeroProperties {
  heroId: string;
}

interface HeroState {
  hero: Unit;
}

interface HeroActions {
  openCharacterSheet: typeof openCharacterSheet;
}

export const Hero = connect(propertyMapper, { openCharacterSheet })(
  ({ hero, openCharacterSheet }: HeroState & HeroActions) => (
    <div className="hero" onClick={() => openCharacterSheet(hero.id)}>
      <div className="hero__name">{hero.name}</div>
      <ProgressBar icon={Icons.Heart} color="crimson" value={hero.hp} maxValue={hero.maxhp} />
      <div className="hero__attack">Attack: {hero.dmg}</div>
    </div>
  ),
);
