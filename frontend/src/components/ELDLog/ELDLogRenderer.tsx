type Entry = {
  from: number;
  to: number;
  status: "Driving" | "Off" | "Sleeper" | "OnDuty";
};

const statusStyle: Record<Entry["status"], string> = {
  Driving: "bg-primary text-white",
  Off: "bg-gray-300",
  Sleeper: "bg-accent-success text-white",
  OnDuty: "bg-accent-warning text-white",
};

export default function ELDLogRenderer({
  day,
  entries,
}: {
  readonly day: number;
  readonly entries: readonly Entry[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-secondary">Day {day}</h3>
      <div className="relative border border-gray-300 rounded-lg h-20 bg-gray-100">
        {entries.map((e) => (
          <div
            key={`${e.from}-${e.to}-${e.status}`}
            className={`absolute top-0 h-20 ${
              statusStyle[e.status]
            } opacity-90 flex items-end pl-1`}
            style={{
              left: `${(e.from / 24) * 100}%`,
              width: `${((e.to - e.from) / 24) * 100}%`,
            }}
          >
            <span className="text-[10px] font-semibold">{e.status}</span>
          </div>
        ))}

        <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-gray-500 px-1">
          {Array.from({ length: 7 }).map((_, i) => {
            const hour = i * 4;
            return <span key={hour}>{hour}h</span>;
          })}
        </div>
      </div>
    </div>
  );
}
