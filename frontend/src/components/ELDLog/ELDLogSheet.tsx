import { FileText } from "lucide-react";
import { useState } from "react";
import DutyStatusChart from "./DutyStatusChart";
import LogSummaryCard from "./LogSummaryCard";
import RemarksBox from "./RemarksBox";

type DutyChart = boolean[][];

type Sheet = {
  date: string;
  driver: string;
  vehicle: string;
  dutyChart: DutyChart;
  summary: {
    drivingTime: string;
    onDutyTime: string;
    cycleHours: string;
    availableHours: string;
  };
  remarks: string;
};

export default function ELDLogSheet({
  logData,
}: {
  readonly logData?: { readonly sheets: readonly Sheet[] };
}) {
  const [currentSheet, setCurrentSheet] = useState(0);

  if (!logData?.sheets) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          ELD log sheets will be generated after planning
        </p>
      </div>
    );
  }

  const sheet = logData.sheets[currentSheet];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-secondary flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Daily Log Sheet
        </h3>
        {logData.sheets.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSheet(Math.max(0, currentSheet - 1))}
              disabled={currentSheet === 0}
              className="px-3 py-1 bg-primary-light text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Day {currentSheet + 1} of {logData.sheets.length}
            </span>
            <button
              onClick={() =>
                setCurrentSheet(
                  Math.min(logData.sheets.length - 1, currentSheet + 1)
                )
              }
              disabled={currentSheet === logData.sheets.length - 1}
              className="px-3 py-1 bg-primary-light text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg border mb-6">
        <div>
          <span className="font-semibold text-secondary">Date:</span>{" "}
          {sheet.date}
        </div>
        <div>
          <span className="font-semibold text-secondary">Driver:</span>{" "}
          {sheet.driver}
        </div>
        <div>
          <span className="font-semibold text-secondary">Vehicle:</span>{" "}
          {sheet.vehicle}
        </div>
      </div>

      <DutyStatusChart dutyChart={sheet.dutyChart} />

      <div className="grid grid-cols-4 gap-4 text-sm my-6">
        <LogSummaryCard
          label="Driving Time"
          value={sheet.summary.drivingTime}
          color="primary"
        />
        <LogSummaryCard
          label="On Duty Time"
          value={sheet.summary.onDutyTime}
          color="accent-success"
        />
        <LogSummaryCard
          label="Cycle Hours"
          value={sheet.summary.cycleHours}
          color="accent-warning"
        />
        <LogSummaryCard
          label="Available Hours"
          value={sheet.summary.availableHours}
          color="secondary"
        />
      </div>

      <RemarksBox remarks={sheet.remarks} />
    </div>
  );
}
