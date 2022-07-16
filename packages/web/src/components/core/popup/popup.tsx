import { useEffect, useRef, useState } from "react";

import "./popup.scss";

interface PopupProperties {
  content: () => JSX.Element;
  children: JSX.Element;
}

interface PopupStyle {
  top: number;
  left: number;
}

export const Popup = ({ children, content }: PopupProperties) => {
  const ref = useRef<HTMLElement>(null);
  const [popupStyle, setPopupStyle] = useState<PopupStyle>(null!);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setPopupStyle({
      top: ref.current!.offsetTop,
      left: ref.current!.offsetLeft + ref.current?.getClientRects()[0].width!,
    });
  }, [visible]);

  return (
    <span>
      {visible && (
        <div
          className="popup"
          style={popupStyle}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {content()}
        </div>
      )}
      <span ref={ref} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {children}
      </span>
    </span>
  );
};
