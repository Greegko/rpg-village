import { createSignal, useContext, createEffect, Show  } from "solid-js";

import { LoopContext } from "../contexts";

interface AssetProps {
  id: string;
}

export const Asset = (props: AssetProps) => {
  const loop = useContext(LoopContext);

  const [src, setSrc] = createSignal(undefined);

  createEffect(() => {
    loop.assetManager.getAssetAsBase64(props.id).then((base64) => setSrc(base64));
  });

  return <Show when={src()}><img src={src()} /></Show>;
};
