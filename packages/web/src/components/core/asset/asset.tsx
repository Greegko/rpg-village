import assets from "../../../assets/assets.json";

import "./asset.scss";

export type AssetSize = "icon";

export interface AssetProps {
  id: string;
  size: AssetSize;
}

export const Asset = ({ id, size }: AssetProps) => {
  const asset = assets.find(asset => asset.id === id);

  if (!asset) return null;

  return <img src={"assets/" + asset.file} className={size === "icon" ? "asset-icon" : ""} />;
};
