import { For } from "solid-js";

import { EffectType, Item } from "../data/model";
import { useModal } from "../hooks/modal";

export function generateRewards(): Item[] {
  return [
    { name: "Simple Sword", effects: [{ type: EffectType.PhysicalDmg, value: 4 }] },
    { name: "Simple Shield", effects: [{ type: EffectType.Armor, value: 4 }] },
    {
      name: "Magic Ring",
      effects: [{ type: EffectType.HpRegen, value: 4 }],
      die: [[6, { name: "Death Wave", effects: [{ type: EffectType.MagicDmg, value: 5 }] }]],
    },
  ];
}

const RewardScreen = (props: { items: Item[]; onItemSelected: (item: Item) => void }) => {
  return (
    <div class="w-[700px] h-[500px]">
      Reward
      <div class="flex gap-4">
        <For each={props.items}>
          {item => (
            <div class="hover:bg-teal-700 cursor-pointer p-2" onClick={[props.onItemSelected, item]}>
              {item.name}
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export const useReward = () => {
  const { showModal, closeModal } = useModal();

  const showRewardScreen = (items: Item[], onRewardSelect: (item: Item) => void) => {
    showModal(() => <RewardScreen items={items} onItemSelected={item => (closeModal(), onRewardSelect(item))} />);
  };

  return { showRewardScreen };
};
