import { filter, isNonNullish } from "remeda";
import { For, createComputed, createSelector, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import { RollResult, rollDie } from "../data/die";
import { effectsStats, executeAttackEffects, executeSelfEffects } from "../data/effects";
import { EffectType, Item, Unit } from "../data/model";
import { generateRewards, useReward } from "./reward";
import { generateNewEnemy, heroUnit } from "./units";

interface State {
  hero: Unit;
  activeDice: Item[];
  rolledDice: [Item, RollResult][];
  enemy: Unit;
  enemyRolledDice: [Item, RollResult][];
}

const [state, setState] = createStore<State>({
  hero: heroUnit,
  activeDice: [],
  rolledDice: [],
  enemy: generateNewEnemy(),
  enemyRolledDice: [],
});

export const Battle = () => {
  const { showRewardScreen } = useReward();

  const heroEquipmentDice = () => state.hero.equipment.filter(x => x.die);

  const toggleActiveDie = (die: Item) => {
    setState("activeDice", dice => (dice.includes(unwrap(die)) ? dice.filter(x => x !== unwrap(die)) : [...dice, unwrap(die)]));
  };

  onMount(() => {
    setState("activeDice", heroEquipmentDice());
  });

  createComputed(() => {
    if (state.enemy.health[0] === 0) {
      const onRewardSelect = (item: Item) => {
        setState("hero", "equipment", items => [...items, item]);

        if (item.die) {
          setState("activeDice", dice => [...dice, item]);
        }

        setState("enemy", () => generateNewEnemy());
      };

      showRewardScreen(generateRewards(), onRewardSelect);
    }
  });

  const onRoll = () => {
    setState(
      "rolledDice",
      state.activeDice.map(item => [item, rollDie(item.die!)] as [Item, RollResult]),
    );

    setState(
      "enemyRolledDice",
      state.enemy.equipment.filter(x => x.die).map(item => [item, rollDie(item.die!)] as [Item, RollResult]),
    );

    doTurn();
  };

  const doTurn = () => {
    const heroEffects = filter(
      [
        ...state.hero.buffs.flatMap(x => x.effect),
        ...state.hero.equipment.flatMap(x => x.effects),
        ...state.rolledDice.flatMap(x => x[1][1]),
      ],
      isNonNullish,
    );

    const enemyEffects = filter(
      [
        ...state.enemy.buffs.flatMap(x => x.effect),
        ...state.enemy.equipment.flatMap(x => x.effects),
        ...state.enemyRolledDice.flatMap(x => x[1][1]),
      ],
      isNonNullish,
    );

    const heroEffectsStats = effectsStats(heroEffects);
    const enemyEffectsStats = effectsStats(enemyEffects);

    const newHeroPreStats = executeSelfEffects(heroEffectsStats, state.hero);
    const newEnemyPreStats = executeSelfEffects(enemyEffectsStats, state.enemy);

    const newEnemyStats = executeAttackEffects(heroEffectsStats, newEnemyPreStats, enemyEffectsStats);
    const newHeroStats = executeAttackEffects(enemyEffectsStats, newHeroPreStats, heroEffectsStats);

    setState("enemy", newEnemyStats);
    setState("hero", newHeroStats);
  };

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
            onClick={onRoll}
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
