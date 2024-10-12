import { JSXElement, Show, createSignal } from "solid-js";

const nullNode = () => null;

export const [modalContent, setModalContent] = createSignal<() => JSXElement>(nullNode);

export const useModal = () => {
  const showModal = (contentFactory: () => JSXElement) => setModalContent(() => contentFactory);

  const closeModal = () => setModalContent(() => nullNode);

  return { showModal, closeModal };
};

export const ModalNode = () => (
  <Show when={modalContent()()}>
    <div class="absolute top-0 left-0 w-full h-full bg-black opacity-80"></div>
    <div class="absolute top-0 left-0 w-full h-full flex justify-center">
      <div class="self-center border border-white p-2">{modalContent()()}</div>
    </div>
  </Show>
);
