import { createSignal, createEffect, Show, useContext } from "solid-js";
import { AssetManagerContext } from "../../context";

export const Asset = (props: { id: string }) => {
  const [src, setSrc] = createSignal<string>();
  const assetManager = useContext(AssetManagerContext);

  createEffect(() => assetManager && assetManager.getAssetAsBase64(props.id).then(base64 => setSrc(base64)));

  return (
    <Show when={src()} keyed>
      {src => <img src={src} />}
    </Show>
  );
};
