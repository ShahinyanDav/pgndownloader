import React, { useState, useRef } from 'react';
import { Calendar, ChevronRight as ChessKnight, Download, Loader2, X } from 'lucide-react';
import { PlatformSelector } from './components/PlatformSelector';
import { DateRangeSelector } from './components/DateRangeSelector';
import { TimeControlSelector } from './components/TimeControlSelector';
import { downloadGames } from './utils/downloadGames';
import { Platform, TimeControl } from './types';

function App() {
  const [platform, setPlatform] = useState<Platform>('lichess');
  const [username, setUsername] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [timeControl, setTimeControl] = useState<TimeControl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const abortController = useRef<AbortController | null>(null);

  const handleDownload = async () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    // Create new AbortController for this download
    abortController.current = new AbortController();

    try {
      await downloadGames({
        platform,
        username,
        startDate,
        endDate,
        timeControl,
        onProgress: (progress) => setProgress(progress),
        signal: abortController.current.signal
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'Download cancelled') {
        setError('Download cancelled');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }
  };

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  const getButtonText = () => {
    if (!isLoading) {
      return (
        <>
          <Download className="w-5 h-5" />
          Download PGN
        </>
      );
    }

    if (platform === 'lichess') {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Downloading games...
        </>
      );
    }

    return (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Cancel Download
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <ChessKnight className="w-10 h-10" />
          <h1 className="text-3xl font-bold">Chess PGN Downloader</h1>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          <PlatformSelector platform={platform} onChange={setPlatform} />

          <div className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Enter your ${platform} username`}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <TimeControlSelector
              platform={platform}
              selected={timeControl}
              onChange={setTimeControl}
            />

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {isLoading && platform === 'chess.com' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Downloading games...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={isLoading ? handleCancel : handleDownload}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isLoading
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <X className="w-5 h-5" />
                    Cancel Download
                  </>
                ) : (
                  getButtonText()
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;