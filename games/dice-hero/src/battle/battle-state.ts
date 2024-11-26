import { filter, isNonNullish, sample } from "remeda";
import { createComputed, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import { RollResult, rollDie } from "../data/die";
import { effectsStats, executeAttackEffects, executeSelfEffects } from "../data/effects";
import { Item, Unit } from "../data/model";
import { generateRewards, useReward } from "./reward";
import { generateNewEnemy, heroUnit } from "./units";

interface State {
  auto: number;
  turn: number;
  hero: Unit;
  activeDice: Item[];
  rolledDice: [Item, RollResult][];
  enemy: Unit;
  enemyRolledDice: [Item, RollResult][];
}

const [state, setState] = createStore<State>({
  auto: 0,
  turn: 0,
  hero: heroUnit,
  activeDice: [],
  rolledDice: [],
  enemy: generateNewEnemy(),
  enemyRolledDice: [],
});

export const useBattleState = () => {
  const toggleActiveDie = (die: Item) => {
    setState("activeDice", dice => (dice.includes(unwrap(die)) ? dice.filter(x => x !== unwrap(die)) : [...dice, unwrap(die)]));
  };

  const roll = () => {
    setState("turn", turn => turn + 1);
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

  const heroRolledDiceEffects = () => {
    return filter(
      state.rolledDice.flatMap(x => x[1][1]),
      isNonNullish,
    );
  };

  const enemyRolledDiceEffects = () => {
    return filter(
      state.enemyRolledDice.flatMap(x => x[1][1]),
      isNonNullish,
    );
  };

  const doTurn = () => {
    const heroEffects = [
      ...state.hero.buffs.flatMap(x => x.effect),
      ...state.hero.equipment.flatMap(x => x.effects),
      ...heroRolledDiceEffects(),
    ];

    const enemyEffects = [
      ...state.enemy.buffs.flatMap(x => x.effect),
      ...state.enemy.equipment.flatMap(x => x.effects),
      ...enemyRolledDiceEffects(),
    ];

    const heroEffectsStats = effectsStats(heroEffects);
    const enemyEffectsStats = effectsStats(enemyEffects);

    const newHeroPreStats = executeSelfEffects(heroEffectsStats, state.hero);
    const newEnemyPreStats = executeSelfEffects(enemyEffectsStats, state.enemy);

    const newEnemyStats = executeAttackEffects(heroEffectsStats, newEnemyPreStats, enemyEffectsStats);
    const newHeroStats = executeAttackEffects(enemyEffectsStats, newHeroPreStats, heroEffectsStats);

    setState("enemy", newEnemyStats);
    setState("hero", newHeroStats);
  };

  const heroEquipmentDice = () => state.hero.equipment.filter(x => x.die);

  onMount(() => {
    setState("activeDice", heroEquipmentDice());
  });

  createComputed(() => {
    const { showRewardScreen } = useReward();

    if (state.enemy.health[0] === 0) {
      const onRewardSelect = (item: Item) => {
        setState("hero", "equipment", items => [...items, item]);

        if (item.die) {
          setState("activeDice", dice => [...dice, item]);
        }

        setState("enemy", () => generateNewEnemy());
      };

      if (state.auto) {
        onRewardSelect(sample(generateRewards(), 1)[0]!);
      } else {
        showRewardScreen(generateRewards(), onRewardSelect);
      }
    }
  });

  let autoHandler: number = 0;
  createComputed(() => {
    clearInterval(autoHandler);
    if (state.auto) {
      autoHandler = setInterval(roll, 1000 / state.auto);
    }
  });

  const toggleAuto = () => setState("auto", auto => (auto + 1) % 5);

  return { roll, heroEquipmentDice, toggleActiveDie, state, heroRolledDiceEffects, enemyRolledDiceEffects, toggleAuto };
};
