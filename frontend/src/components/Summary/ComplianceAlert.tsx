import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

type Props = { alerts: string[] };

export default function ComplianceAlert({ alerts }: Readonly<Props>) {
  const [visible, setVisible] = useState(true);

  if (!alerts || alerts.length === 0 || !visible) return null;

  return (
    <div className="relative bg-accent-danger/10 border border-accent-danger rounded-lg p-4 mb-6">
  
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-accent-danger" />
          <h4 className="font-semibold text-accent-danger">Compliance Alerts</h4>
        </div>

    
        <button
          onClick={() => setVisible(false)}
          className="text-accent-danger hover:text-accent-danger/80 transition"
          aria-label="Dismiss alerts"
        >
          <X className="w-5 h-5" />
        </button>
      </div>


      <ul className="space-y-1">
        {alerts.map((alert) => (
          <li key={alert} className="text-sm text-accent-danger">
            • {alert}
          </li>
        ))}
      </ul>
    </div>
  );
}
