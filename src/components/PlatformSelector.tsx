import React from 'react';
import { Platform } from '../types';

interface PlatformSelectorProps {
  platform: Platform;
  onChange: (platform: Platform) => void;
}

export function PlatformSelector({ platform, onChange }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange('lichess')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          platform === 'lichess'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Lichess
      </button>
      <button
        onClick={() => onChange('chess.com')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          platform === 'chess.com'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Chess.com
      </button>
    </div>
  );
}