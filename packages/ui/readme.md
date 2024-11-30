## UI Components

Modal

```ts
const { showModal, closeModal } = useModal();

const showRewardScreen = (items: Item[], onRewardSelect: (item: Item) => void) => {
  showModal(() => <RewardScreen items={items} onItemSelected={item => (closeModal(), onRewardSelect(item))} />);
};
```
