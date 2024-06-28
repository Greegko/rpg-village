import { render } from "solid-js/web";

import { SpellBook } from "./controls/spellbook";
import { Game } from "./game";

const reactContainer = document.getElementById("battleground") as HTMLDivElement;

render(() => 
  <div>
    <Game>
      <SpellBook />
    </Game>
  </div>,reactContainer
);
