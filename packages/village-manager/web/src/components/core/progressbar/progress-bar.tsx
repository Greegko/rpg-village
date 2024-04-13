import "./progress-bar.scss";

interface ProgressBarProperties {
  maxValue: number;
  value: number;
  color: string;
}

export const ProgressBar = ({ maxValue, value, color }: ProgressBarProperties) => (
  <div class="flex justify-between">
    <div class="progressbar__placeholder h-[12px] bg-[#333]">
      <div
        class="progressbar__liquid h-[12px]"
        style={{ "background-color": color, width: Math.max(0, (value / maxValue) * 100) + "%" }}
      />
      <div class="progressbar__value">
        {Math.ceil(Math.max(0, value))} / {maxValue}
      </div>
    </div>
  </div>
);
