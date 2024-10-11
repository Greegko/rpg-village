import { render } from "solid-js/web";

import { App } from "./app";
import "./tailwind.css";

const appNode = document.getElementById("app");

render(() => <App />, appNode!);
