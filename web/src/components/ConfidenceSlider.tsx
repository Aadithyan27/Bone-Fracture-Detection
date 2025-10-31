type Props = {
  value: number; // 0..1
  onChange: (v: number) => void;
};

export default function ConfidenceSlider({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">Confidence Level</span>
        <span className="font-semibold">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
