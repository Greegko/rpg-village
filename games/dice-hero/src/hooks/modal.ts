import { JSXElement, createSignal } from "solid-js";

const nullNode = () => null;

export const [modalContent, setModalContent] = createSignal<() => JSXElement>(nullNode);

export const useModal = () => {
  const show = (factory: () => JSXElement) => setModalContent(() => factory);

  const close = () => setModalContent(() => nullNode);

  return { show, close };
};
