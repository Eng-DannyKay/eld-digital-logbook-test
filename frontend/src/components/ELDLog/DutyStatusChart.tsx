
type DutyChart = boolean[][];

const dutyStatuses = [
  { label: "Off Duty", color: "bg-gray-200" },
  { label: "Sleeper", color: "bg-accent-success" },
  { label: "Driving", color: "bg-primary" },
  { label: "On Duty", color: "bg-accent-warning" },
];

export default function DutyStatusChart({ dutyChart }: { readonly dutyChart: DutyChart }) {
  return (
    <div className="mb-6">
      <h4 className="font-semibold text-secondary mb-3">Duty Status Chart</h4>
      <div className="bg-gray-100 rounded-lg p-4">
    
        <div className="grid grid-cols-24 gap-1 mb-2">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="text-xs text-center font-mono text-gray-500">
              {i.toString().padStart(2, "0")}
            </div>
          ))}
        </div>

        {/* Rows */}
        {dutyStatuses.map((status, rowIndex) => (
          <div key={status.label} className="flex items-center mb-2">
            <div className="w-24 text-sm font-medium text-secondary">{status.label}</div>
            <div className="grid grid-cols-24 gap-1 flex-1">
              {Array.from({ length: 24 }, (_, hourIndex) => {
                const isActive = dutyChart[rowIndex]?.[hourIndex];
                return (
                  <div
                    key={hourIndex}
                    className={`h-5 border border-gray-300 ${
                      isActive ? status.color : "bg-white"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
