
type Props = {
  readonly label: string;
  readonly value: string;
  readonly color: "primary" | "secondary" | "accent-success" | "accent-warning";
};

const colorMap: Record<Props["color"], string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  "accent-success": "bg-accent-success/10 text-accent-success",
  "accent-warning": "bg-accent-warning/10 text-accent-warning",
};

export default function LogSummaryCard({ label, value, color }: Props) {
  return (
    <div className={`p-3 rounded ${colorMap[color]}`}>
      <div className="font-semibold">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
