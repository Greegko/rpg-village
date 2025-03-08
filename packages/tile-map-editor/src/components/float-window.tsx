import { For, JSXElement, Show, createComputed, createSignal, onCleanup } from "solid-js";
import { StoreSetter, createStore, produce } from "solid-js/store";
import { render } from "solid-js/web";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

export interface FloatWindow {
  contentId: string;
  title: string;
  size: Size;
  position: Position;
  isCollapsed: boolean;
}

export const [windows, setWindows] = createStore<FloatWindow[]>([]);
const [contents, setContents] = createStore<Record<string, () => JSXElement>>({});

export const useWindowRoot = () => {
  const windowsContainer = document.createElement("div");
  document.body.appendChild(windowsContainer);

  createComputed(() => {
    render(
      () => (
        <For each={windows}>
          {(window, index) => (
            <Show when={contents[window.contentId]}>
              <WindowHost window={window} setWindow={(x: StoreSetter<FloatWindow, [number]>) => setWindows(index(), x)} />
            </Show>
          )}
        </For>
      ),
      windowsContainer,
    );

    onCleanup(() => document.body.removeChild(windowsContainer));
  });
};

export const useWindow = () => {
  const addWindow = (contentId: string, title: string, options?: Omit<FloatWindow, "contentId" | "title">) => {
    const windowProps = {
      contentId,
      title,
      size: { width: 300, height: 300 },
      position: { x: 100, y: 100 },
      isCollapsed: false,
      ...(options || {}),
    } as FloatWindow;
    setWindows(produce(x => x.push(windowProps)));
  };

  const setContent = (id: string, content: () => JSXElement) => {
    setContents(contents => ({ ...contents, [id]: content }));
  };

  return { addWindow, setContent };
};

interface WindowHostProps {
  window: FloatWindow;
  setWindow: (x: StoreSetter<FloatWindow, [number]>) => void;
}

const WindowHost = (props: WindowHostProps) => {
  const [isDragging, setIsDragging] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });

  const handleMouseDown = (event: MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: event.clientX - props.window.position.x,
      y: event.clientY - props.window.position.y,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging()) {
      props.setWindow(
        produce(
          window =>
            (window.position = {
              x: event.clientX - offset().x,
              y: event.clientY - offset().y,
            }),
        ),
      );
    } else if (isResizing()) {
      props.setWindow(
        produce(
          window =>
            (window.size = {
              width: event.clientX - props.window.position.x,
              height: event.clientY - props.window.position.y,
            }),
        ),
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  onCleanup(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  });

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  return (
    <div
      class="absolute bg-white border shadow-lg"
      style={{
        left: `${props.window.position.x}px`,
        top: `${props.window.position.y}px`,
        width: `${props.window.size.width}px`,
        height: props.window.isCollapsed ? `40px` : `${props.window.size.height}px`,
      }}
    >
      <div class="bg-gray-800 text-white p-2 cursor-move flex justify-between" onMouseDown={handleMouseDown}>
        <span>{props.window.title}</span>
        <span
          class="font-bold cursor-pointer"
          onClick={() => props.setWindow(produce(window => (window.isCollapsed = !window.isCollapsed)))}
        >
          {props.window.isCollapsed ? "+" : "-"}
        </span>
      </div>
      <Show when={contents[props.window.contentId]}>
        <div
          class="p-4 overflow-auto"
          classList={{ hidden: props.window.isCollapsed }}
          style={{ height: `${props.window.size.height - 40}px` }}
        >
          {contents[props.window.contentId]()}
        </div>
      </Show>
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        classList={{ hidden: props.window.isCollapsed }}
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
};
