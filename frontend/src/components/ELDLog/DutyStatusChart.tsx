import React from "react";

type DutyEntry = {
  from: number; // start hour (0-24, can be decimal e.g. 7.5)
  to: number; // end hour
  status: "Off" | "Sleeper" | "Driving" | "OnDuty";
};

type Props = Readonly<{
  entries: DutyEntry[];
}>;

const STATUS_ORDER: Record<DutyEntry["status"], number> = {
  Off: 0,
  Sleeper: 1,
  Driving: 2,
  OnDuty: 3,
};

export default function DutyStatusChart({ entries }: Props) {
  return (
    <div className="flex border border-gray-300 rounded-lg bg-white">
      <div className="flex flex-col justify-between py-4 pr-4 text-xs font-medium text-gray-700">
        <span>1. Off Duty</span>
        <span>2. Sleeper</span>
        <span>3. Driving</span>
        <span>4. On Duty</span>
      </div>

      <div className="flex-1 relative p-4">
        <div className="flex justify-between text-[10px] text-gray-600 mb-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={`hour-${i}`} className="w-0">
              {i}
            </span>
          ))}
        </div>

        
        <div className="relative h-40 border-t border-b border-gray-400">
          {["Off", "Sleeper", "Driving", "OnDuty"].map((status, i) => (
            <div
              key={status}
              className="absolute left-0 right-0 border-t border-gray-200"
              style={{ top: `${(i + 1) * 25}%` }}
            />
          ))}

        
          {entries.map((entry) => {
            const y = (STATUS_ORDER[entry.status] + 0.5) * 25;
            const xStart = (entry.from / 24) * 100;
            const xEnd = (entry.to / 24) * 100;
            const key = `${entry.from}-${entry.to}-${entry.status}`;

            return (
              <React.Fragment key={key}>
                {/* Horizontal line */}
                <div
                  className="absolute h-[2px] bg-black"
                  style={{
                    top: `${y}%`,
                    left: `${xStart}%`,
                    width: `${xEnd - xStart}%`,
                  }}
                />
                <div
                  className="absolute w-[2px] bg-black"
                  style={{
                    left: `${xStart}%`,
                    top: 0,
                    bottom: `${100 - y}%`,
                  }}
                />
                <div
                  className="absolute w-[2px] bg-black"
                  style={{
                    left: `${xEnd}%`,
                    top: 0,
                    bottom: `${100 - y}%`,
                  }}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
