import { createSignal } from "solid-js";

import { effectsStats } from "./data/effects";
import { EffectType, Unit } from "./data/model";

const enemyUnit: Unit = {
  name: "Wolf",
  buffs: [],
  gold: 0,
  health: [100, 100],
  mana: [0, 0],
  stash: [],
  equipment: [],
};

const heroUnit: Unit = {
  name: "The Protagonist",
  buffs: [],
  gold: 0,
  health: [100, 100],
  mana: [0, 0],
  stash: [],
  equipment: [],
};

export const Battle = () => {
  const [enemy, setEnemy] = createSignal<Unit>(enemyUnit);
  const [hero, setHero] = createSignal<Unit>(heroUnit);

  return (
    <div>
      <div class="flex">
        <div class="w-[250px]"></div>
        <div class="flex-[2]"></div>
        <div class="flex-1">
          <EnemyDisplay unit={enemy()} />
        </div>
      </div>
    </div>
  );
};

interface EnemyDisplayProps {
  unit: Unit;
}

const EnemyDisplay = (props: EnemyDisplayProps) => (
  <div>
    {props.unit.name}

    <div>
      HP: {props.unit.health[0]} / {props.unit.health[1]}
      Mana: {props.unit.mana[0]} / {props.unit.mana[1]}
    </div>

    <EffectsDisplay effects={effectsStats(props.unit.buffs.map(x => x.effect))} />
  </div>
);

const EffectsDisplay = (props: { effects: Record<EffectType, number> }) => (
  <div>
    Armor: {props.effects[EffectType.Armor]}
    Melee: {props.effects[EffectType.MeleeDmg]}
    Ranged: {props.effects[EffectType.RangedDmg]}
    Magic: {props.effects[EffectType.MagicDmg]}
  </div>
);
