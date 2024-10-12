import { For, createSelector } from "solid-js";
import { unwrap } from "solid-js/store";

import { effectsStats } from "../data/effects";
import { EffectType, Item, Unit } from "../data/model";
import { useBattleState } from "./battle-state";

export const Battle = () => {
  const { roll, toggleActiveDie, state } = useBattleState();

  const heroEquipmentDice = () => state.hero.equipment.filter(x => x.die);

  const isActiveDie = createSelector<Item[], Item>(
    () => state.activeDice,
    (a, b) => b.includes(a),
  );

  return (
    <div>
      <span onClick={() => console.log(unwrap(state))}>Log State</span>
      <div class="flex">
        <div class="w-[250px]">
          <UnitDisplay unit={state.hero} />
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
          <UnitDisplay unit={state.enemy} />
        </div>
      </div>
    </div>
  );
};

interface UnitDisplayProps {
  unit: Unit;
}

const UnitDisplay = (props: UnitDisplayProps) => (
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
    Melee: {props.effects[EffectType.PhysicalDmg]}
    Magic: {props.effects[EffectType.MagicDmg]}
  </div>
);

const ItemDieDisplay = (props: { item: Item; active: boolean }) => {
  return <div classList={{ "text-red-700": !props.active }}>{props.item.name}</div>;
};
