import { JSX, createSignal, onCleanup } from "solid-js";

interface FloatWindowProps {
  children: JSX.Element;
  title: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

export const FloatWindow = (props: FloatWindowProps) => {
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
