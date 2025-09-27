
type Compliance = { hoursToday: number; cycleUsed: number; remaining: number };

export default function ComplianceSummary({ compliance }: { readonly compliance: Compliance }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-sm">
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Hours Today</span>
        <span className="font-semibold text-secondary">
          {compliance.hoursToday} hrs
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Cycle Used</span>
        <span className="font-semibold text-secondary">
          {compliance.cycleUsed} / 70 hrs
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Remaining</span>
        <span className="font-semibold text-accent-success">
          {compliance.remaining} hrs
        </span>
      </div>
    </div>
  );
}
