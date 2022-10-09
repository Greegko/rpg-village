import "./progress-bar.scss";

interface ProgressBarProperties {
  maxValue: number;
  value: number;
  color: string;
}

export const ProgressBar = ({ maxValue, value, color }: ProgressBarProperties) => (
  <div className="progressbar">
    <div className="progressbar__placeholder" style={{ backgroundColor: "#333", height: 12 }}>
      <div
        className="progressbar__liquid"
        style={{ backgroundColor: color, width: Math.max(0, (value / maxValue) * 100) + "%", height: 12 }}
      />
      <div className="progressbar__value">
        {Math.ceil(Math.max(0, value))} / {maxValue}
      </div>
    </div>
  </div>
);
