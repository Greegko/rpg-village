import { identity } from "rambda";

import { Item, nextLevelXp } from "@rpg-village/core";

import { unitByIdSelector, useGameStateSelector } from "@web/store/game";
import { GamePageType, setPage } from "@web/store/ui";

import { Col, Icon, Icons, ProgressBar, Row, Size } from "../core";
import { ItemList } from "./item-list";

import "./hero.scss";

interface HeroProperties {
  heroId: string;
}

export const Hero = (props: HeroProperties) => {
  const hero = useGameStateSelector(state => unitByIdSelector(state, props.heroId));

  const userEquipment = () =>
    [hero().equipment.leftHand, hero().equipment.rightHand, hero().equipment.torso].filter(identity) as Item[];

  return (
    <div class="hero" onClick={() => setPage(GamePageType.CharacterSheet, { unitId: hero().id })}>
      <div class="hero__name">{hero().name}</div>
      <Row>
        <Col col={1}>
          <Icon icon={Icons.Heart} size={Size.Tiny} />
        </Col>
        <Col col={7}>
          <ProgressBar color="crimson" value={hero().hp} maxValue={hero().maxhp} />
        </Col>
      </Row>
      <Row>
        <Col col={1}>XP</Col>
        <Col col={7}>
          <ProgressBar color="orange" value={hero().xp} maxValue={nextLevelXp(hero().level)} />
        </Col>
      </Row>

      <div class="hero__attack">Attack: {hero().dmg}</div>
      <ItemList items={userEquipment()} listSize={6} smallDisplay={true} hideEmpty={true}></ItemList>
    </div>
  );
};
