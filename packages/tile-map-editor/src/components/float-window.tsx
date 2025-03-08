import { For, JSXElement, Show, createComputed, createSignal, onCleanup } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { render } from "solid-js/web";

interface FloatWindowProps {
  contentId: string;
  title: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

const [windows, setWindows] = createStore<FloatWindowProps[]>([]);
const [contents, setContents] = createStore<Record<string, () => JSXElement>>({});

export const useWindowRoot = () => {
  const windowsContainer = document.createElement("div");
  document.body.appendChild(windowsContainer);

  createComputed(() => {
    render(
      () => (
        <For each={windows}>
          {window => (
            <Show when={contents[window.contentId]}>
              <WindowHost title={window.title} width={window.width} height={window.height} top={window.top} left={window.left}>
                {contents[window.contentId]()}
              </WindowHost>
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
  const addWindow = (contentId: string, title: string, options?: Omit<FloatWindowProps, "contentId" | "title">) => {
    const windowProps = { contentId, title, width: 300, height: 300, top: 100, left: 100, ...(options || {}) } as FloatWindowProps;
    setWindows(produce(x => x.push(windowProps)));
  };

  const setContent = (id: string, content: () => JSXElement) => {
    setContents(contents => ({ ...contents, [id]: content }));
  };

  return { addWindow, setContent };
};

interface WindowHostProps {
  children: JSXElement;
  title: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

const WindowHost = (props: WindowHostProps) => {
  const [isCollapsed, setIsCollapsed] = createSignal(false);
  const [isDragging, setIsDragging] = createSignal(false);
  const [isResizing, setIsResizing] = createSignal(false);
  const [position, setPosition] = createSignal({ x: props.left, y: props.top });
  const [size, setSize] = createSignal({ width: props.width, height: props.height });
  const [offset, setOffset] = createSignal({ x: 0, y: 0 });

  const handleMouseDown = (event: MouseEvent) => {
    setIsDragging(true);
    setOffset({
      x: event.clientX - position().x,
      y: event.clientY - position().y,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging()) {
      setPosition({
        x: event.clientX - offset().x,
        y: event.clientY - offset().y,
      });
    } else if (isResizing()) {
      setSize({
        width: event.clientX - position().x,
        height: event.clientY - position().y,
      });
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
        left: `${position().x}px`,
        top: `${position().y}px`,
        width: `${size().width}px`,
        height: isCollapsed() ? `40px` : `${size().height}px`,
      }}
    >
      <div class="bg-gray-800 text-white p-2 cursor-move flex justify-between" onMouseDown={handleMouseDown}>
        <span>{props.title}</span>
        <span class="font-bold cursor-pointer" onClick={() => setIsCollapsed(val => !val)}>
          {isCollapsed() ? "+" : "-"}
        </span>
      </div>
      <div class="p-4 overflow-auto" classList={{ hidden: isCollapsed() }} style={{ height: `${size().height - 40}px` }}>
        {props.children}
      </div>
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        classList={{ hidden: isCollapsed() }}
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
};
