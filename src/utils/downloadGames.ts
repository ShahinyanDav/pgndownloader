import { DownloadOptions, Platform } from '../types';

const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadLichessGames(options: DownloadOptions): Promise<string> {
  const { username, startDate, endDate, timeControl, signal } = options;
  
  const params = new URLSearchParams({
    until: endDate ? new Date(endDate).getTime().toString() : '',
    perfType: timeControl.join(','),
    clocks: 'true',
    evals: 'true',
    opening: 'true'
  });

  // Only add since parameter if startDate is provided
  if (startDate) {
    params.append('since', new Date(startDate).getTime().toString());
  }

  const response = await fetch(
    `https://lichess.org/api/games/user/${username}?${params}`,
    {
      headers: {
        Accept: 'application/x-ndjson'
      },
      signal
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Lichess games: ${response.statusText}`);
  }

  return response.text();
}

async function downloadChessComGames(options: DownloadOptions): Promise<string> {
  const { username, startDate, endDate, onProgress, signal } = options;
  let allPgn = '';
  
  // Get all months between start date (or beginning of time) and end date
  const start = startDate ? new Date(startDate) : new Date(2007, 0, 1); // Chess.com was founded in 2007
  const end = endDate ? new Date(endDate) : new Date();
  const months: { year: number; month: number }[] = [];
  
  for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1
    });
  }

  for (let i = 0; i < months.length; i++) {
    // Check if download has been cancelled
    if (signal?.aborted) {
      throw new Error('Download cancelled');
    }

    const { year, month } = months[i];
    const monthStr = month.toString().padStart(2, '0');
    
    try {
      const response = await fetch(
        `https://api.chess.com/pub/player/${username}/games/${year}/${monthStr}/pgn`,
        { signal }
      );
      
      if (response.ok) {
        const monthPgn = await response.text();
        allPgn += monthPgn + '\n';
      }
      
      onProgress(Math.round((i + 1) / months.length * 100));
      await delay(RATE_LIMIT_DELAY);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Download cancelled');
      }
      console.error(`Failed to fetch games for ${year}/${monthStr}:`, error);
    }
  }

  return allPgn;
}

export async function downloadGames(options: DownloadOptions): Promise<void> {
  const { platform, username } = options;
  
  if (!username) {
    throw new Error('Username is required');
  }

  let pgn: string;
  
  try {
    pgn = await (platform === 'lichess' 
      ? downloadLichessGames(options)
      : downloadChessComGames(options));
      
    if (!pgn.trim()) {
      throw new Error('No games found for the specified criteria');
    }
    
    // Create and download file
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}_${platform}_games.pgn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error && error.message === 'Download cancelled') {
      throw error;
    }
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to download games'
    );
  }
}