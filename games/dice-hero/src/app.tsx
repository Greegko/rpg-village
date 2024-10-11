import { Battle } from "./battle";
import { modalContent } from "./hooks/modal";

export const App = () => (
  <div>
    <Battle />
    {modalContent()()}
  </div>
);
