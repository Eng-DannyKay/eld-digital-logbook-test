import type { Activity } from "../types/trip";

export type DutyChart = boolean[][]; // 4 rows × 24 hours

/**
 * Generate a duty chart (24h × 4 statuses) from trip activities.
 * Rows: [0] Off Duty, [1] Sleeper, [2] Driving, [3] On Duty
 */
export function generateDutyChart(activities: Activity[]): DutyChart {
  const dutyChart: DutyChart = Array(4)
    .fill(null)
    .map(() => Array(24).fill(false));

  const statusMap: Record<string, number> = {
    off_duty: 0,
    sleeper: 1,
    driving: 2,
    on_duty: 3,
    break: 0, 
  };

  activities.forEach((activity) => {
    const startHour = parseInt(activity.start.split(":")[0], 10);
    const endHour = parseInt(activity.end.split(":")[0], 10);

    const rowIndex = statusMap[activity.type] ?? 0;

    for (let h = startHour; h < endHour; h++) {
      if (h >= 0 && h < 24) {
        dutyChart[rowIndex][h] = true;
      }
    }
  });

  return dutyChart;
}
