import React from "react";
import ProcurementReports from "./components/procurementReports";

function Report() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProcurementReports />

        {/* Placeholder for future reports */}
        <div className="bg-gray-100 dark:bg-slate-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">
              📊
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              More reports coming soon...
            </p>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-slate-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 text-4xl mb-2">
              📈
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              More reports coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
