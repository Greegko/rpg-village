import "./asset.scss";

const assets = require("../../../assets/assets.json" as any) as AssetData[];

interface AssetData {
  file: string;
  id: string;
}

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
