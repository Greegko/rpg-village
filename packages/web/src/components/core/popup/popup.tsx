import { JSX, Show, createEffect, createSignal } from "solid-js";

interface PopupProperties {
  content: () => JSX.Element;
  children: JSX.Element;
}

interface PopupStyle {
  top: string;
  left: string;
}

export const Popup = (props: PopupProperties) => {
  let ref: HTMLElement;

  const [popupStyle, setPopupStyle] = createSignal<PopupStyle>(null!);
  const [visible, setVisible] = createSignal(false);

  createEffect(() => {
    if (visible()) return;

    setPopupStyle({
      top: ref.offsetTop + "px",
      left: ref.offsetLeft + ref.getClientRects()[0].width! + "px",
    });
  });

  return (
    <span class="popup">
      <Show when={visible()}>
        <div
          class="absolute z-10 bg-black"
          style={{ ...popupStyle() }}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {props.content()}
        </div>
      </Show>
      <span ref={ref!} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {props.children}
      </span>
    </span>
  );
};
