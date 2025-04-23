import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangeSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeSelectorProps) {
  // Set default end date to today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!endDate) {
      onEndDateChange(today);
    }
  }, [endDate, onEndDateChange]);

  // Set default start date to 2 months ago when user clicks into start date
  const handleStartDateFocus = () => {
    if (!startDate) {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      onStartDateChange(twoMonthsAgo.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium mb-2">Date Range</label>
        {startDate && (
          <button
            onClick={() => onStartDateChange('')}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            All Games
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            onFocus={handleStartDateFocus}
            placeholder="From (optional)"
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}