import { render } from "solid-js/web";

import { Game } from "./game";
import "./main.css";

render(() => <Game />, document.getElementById("battleground")!);
