import { For, createSelector } from "solid-js";
import { unwrap } from "solid-js/store";

import { effectsStats } from "../data/effects";
import { Effect, EffectType, Item, Unit } from "../data/model";
import { useBattleState } from "./battle-state";

export const Battle = () => {
  const { state, toggleAuto, roll, heroEquipmentDice, toggleActiveDie, heroRolledDiceEffects, enemyRolledDiceEffects } = useBattleState();

  const isActiveDie = createSelector<Item[], Item>(
    () => state.activeDice,
    (a, b) => b.includes(a),
  );

  return (
    <div>
      <span onClick={() => console.log(unwrap(state))}>Log State</span> {" - "}
      <span onClick={() => toggleAuto()} classList={{ "text-red-600": state.auto > 0 }}>
        Auto {state.auto || ""}
      </span>
      {" - "}
      <span>Turn: {state.turn}</span>
      <div class="flex">
        <div class="w-[250px]">
          <UnitDisplay unit={state.hero} rolledEffects={heroRolledDiceEffects()} />
        </div>
        <div class="flex-[2]">
          <div class="flex">
            <div>
              <div>
                <For each={heroEquipmentDice()}>
                  {item => (
                    <span onClick={[toggleActiveDie, item]}>
                      <ItemDieDisplay item={item} active={isActiveDie(item)} />
                    </span>
                  )}
                </For>
              </div>
              <div>
                <For each={state.rolledDice}>
                  {([item, rollResult]) => (
                    <>
                      {item.name}: {rollResult[0] + 1}
                    </>
                  )}
                </For>
              </div>
            </div>
            <div>
              <div>
                <For each={state.enemyRolledDice}>
                  {([item, rollResult]) => (
                    <>
                      {item.name}: {rollResult[0] + 1}
                    </>
                  )}
                </For>
              </div>
            </div>
          </div>
          <div
            class="border border-white w-[150px] rounded-xl m-2 p-2 text-center text-2xl cursor-pointer hover:bg-slate-700"
            onClick={roll}
          >
            Roll
          </div>
        </div>
        <div class="flex-1">
          <UnitDisplay unit={state.enemy} rolledEffects={enemyRolledDiceEffects()} />
        </div>
      </div>
    </div>
  );
};

interface UnitDisplayProps {
  unit: Unit;
  rolledEffects: Effect[];
}

const UnitDisplay = (props: UnitDisplayProps) => {
  const effects = () => {
    return effectsStats([
      ...props.unit.buffs.map(x => x.effect),
      ...props.unit.equipment.flatMap(x => x.effects || []),
      ...props.rolledEffects,
    ]);
  };

  return (
    <div>
      {props.unit.name}

      <div>
        HP: {props.unit.health[0]} / {props.unit.health[1]}
        Mana: {props.unit.mana[0]} / {props.unit.mana[1]}
      </div>

      <EffectsDisplay effects={effects()} />
    </div>
  );
};
const EffectsDisplay = (props: { effects: Record<EffectType, number> }) => (
  <div>
    Armor: {props.effects[EffectType.Armor]}
    Melee: {props.effects[EffectType.PhysicalDmg]}
    Magic: {props.effects[EffectType.MagicDmg]}
  </div>
);

const ItemDieDisplay = (props: { item: Item; active: boolean }) => {
  return <div classList={{ "text-red-700": !props.active }}>{props.item.name}</div>;
};
