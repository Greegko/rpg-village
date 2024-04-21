import "reflect-metadata";
import { render } from "solid-js/web";

import "./main.css";

const App = () => <div>Bannerlords</div>;
render(() => <App />, document.getElementById("game")!);
