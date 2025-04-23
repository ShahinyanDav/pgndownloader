import React from 'react';
import { Platform, TimeControl } from '../types';

interface TimeControlSelectorProps {
  platform: Platform;
  selected: TimeControl[];
  onChange: (timeControls: TimeControl[]) => void;
}

export function TimeControlSelector({
  platform,
  selected,
  onChange,
}: TimeControlSelectorProps) {
  const timeControls: TimeControl[] =
    platform === 'lichess'
      ? ['blitz', 'rapid', 'classical']
      : ['blitz', 'rapid'];

  const toggleTimeControl = (control: TimeControl) => {
    if (selected.includes(control)) {
      onChange(selected.filter((tc) => tc !== control));
    } else {
      onChange([...selected, control]);
    }
  };

  const selectAll = () => {
    onChange(timeControls);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Time Controls</label>
        <div className="space-x-2 text-sm">
          <button
            onClick={selectAll}
            className="text-blue-400 hover:text-blue-300"
          >
            Select All
          </button>
          <span className="text-gray-500">|</span>
          <button
            onClick={clearAll}
            className="text-blue-400 hover:text-blue-300"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {timeControls.map((control) => (
          <button
            key={control}
            onClick={() => toggleTimeControl(control)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              selected.includes(control)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {control}
          </button>
        ))}
      </div>
    </div>
  );
}