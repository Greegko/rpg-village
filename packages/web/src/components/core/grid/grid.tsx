export interface RowProperties {
  children: JSX.Element | JSX.Element[];
}

export const Row = ({ children }: RowProperties) => <div style={{ display: "flex" }}>{children}</div>;

export interface ColProperties {
  col: number;
  children: JSX.Element | string;
}

export const Col = ({ col, children }: ColProperties) => <div style={{ flex: col }}>{children}</div>;
