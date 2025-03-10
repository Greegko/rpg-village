import { DieSkeleton } from "./die-skeleton";

import "./die-number.scss";

interface DieNumber {
  number: number;
}

export const DieNumber = (props: DieNumber) => (
  <DieSkeleton number={props.number}>
    <div>
      <div class="dot one-1"></div>
    </div>
    <div>
      <div class="dot two-1"></div>
      <div class="dot two-2"></div>
    </div>
    <div>
      <div class="dot three-1"></div>
      <div class="dot three-2"></div>
      <div class="dot three-3"></div>
    </div>
    <div>
      <div class="dot four-1"></div>
      <div class="dot four-2"></div>
      <div class="dot four-3"></div>
      <div class="dot four-4"></div>
    </div>
    <div>
      <div class="dot five-1"></div>
      <div class="dot five-2"></div>
      <div class="dot five-3"></div>
      <div class="dot five-4"></div>
      <div class="dot five-5"></div>
    </div>
    <div>
      <div class="dot six-1"></div>
      <div class="dot six-2"></div>
      <div class="dot six-3"></div>
      <div class="dot six-4"></div>
      <div class="dot six-5"></div>
      <div class="dot six-6"></div>
    </div>
  </DieSkeleton>
);
