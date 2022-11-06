import { identity } from "ramda";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

import { calculateUnitBattleStats, Item, nextLevelXp } from "@rpg-village/core";

import { unitByIdSelector, useGameStateSelector } from "@web/store/game";
import { changePage } from "@web/store/ui";
import { GamePageType } from "@web/store/ui/interface";

import { Icon, Icons, ProgressBar, Size } from "../core";
import { Col, Row } from "../core/grid";
import { ItemList } from "./item-list";

import "./hero.scss";

interface HeroProperties {
  heroId: string;
}

export const Hero = ({ heroId }: HeroProperties) => {
  const hero = useGameStateSelector(state => unitByIdSelector(state, heroId));
  const dispatch = useDispatch();

  const effects = calculateUnitBattleStats(hero);

  const userEquipment = useMemo(
    () => [hero.equipment.leftHand, hero.equipment.rightHand, hero.equipment.torso].filter(identity) as Item[],
    [hero.equipment],
  );

  return (
    <div
      className="hero"
      onClick={() => dispatch(changePage({ page: GamePageType.CharacterSheet, args: { unitId: hero.id } }))}
    >
      <div className="hero__name">{hero.name}</div>
      <Row>
        <Col col={1}>
          <Icon icon={Icons.Heart} size={Size.Tiny} />
        </Col>
        <Col col={7}>
          <ProgressBar color="crimson" value={hero.hp} maxValue={hero.maxhp} />
        </Col>
      </Row>
      <Row>
        <Col col={1}>XP</Col>
        <Col col={7}>
          <ProgressBar color="orange" value={hero.xp} maxValue={nextLevelXp(hero.level)} />
        </Col>
      </Row>

      <div className="hero__attack">Attack: {effects.dmg}</div>
      <ItemList items={userEquipment} listSize={6} smallDisplay={true} hideEmpty={true}></ItemList>
    </div>
  );
};
