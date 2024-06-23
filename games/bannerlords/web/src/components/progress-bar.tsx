export const ProgressBar = (props: { max: number; value: number }) => (
  <div class="inline-block bg-gray-300 w-[120px] h-4">
    <div
      class="bg-gray-700 h-4"
      style={{ width: (((props.value % props.max) / props.max) * 100).toString() + "%" }}
    ></div>
  </div>
);
