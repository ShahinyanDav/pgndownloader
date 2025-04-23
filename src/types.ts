export type Platform = 'lichess' | 'chess.com';
export type TimeControl = 'blitz' | 'rapid' | 'classical';

export interface DownloadOptions {
  platform: Platform;
  username: string;
  startDate: string;
  endDate: string;
  timeControl: TimeControl[];
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}