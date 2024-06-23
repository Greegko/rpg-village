import { Show } from "solid-js";

import assets from "../../../assets/assets.json";

export type AssetSize = "icon";

export interface AssetProps {
  id: string;
  size: AssetSize;
}

export const Asset = (props: AssetProps) => {
  const asset = assets.find(asset => asset.id === props.id);

  return (
    <Show when={asset}>
      <img src={"assets/" + asset!.file} class={props.size === "icon" ? "w-[32px] h-[32px]" : ""} />
    </Show>
  );
};
