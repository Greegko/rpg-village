import { Battle } from "./battle/battle";
import { modalContent } from "./hooks/modal";

export const App = () => (
  <div>
    <Battle />
    {modalContent()()}
  </div>
);
