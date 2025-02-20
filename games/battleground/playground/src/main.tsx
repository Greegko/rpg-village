import { render } from "solid-js/web";

import { Game } from "./game";

const reactContainer = document.getElementById("battleground") as HTMLDivElement;

render(() => <Game />, reactContainer);
