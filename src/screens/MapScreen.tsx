import { useState, useMemo, useLayoutEffect, useRef, type ReactNode, type JSX } from 'react';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { MAP_NODES, MAP_EDGES, getNodeById, CHAPTER_NAMES } from '../game/mapData.ts';
import { isLessonAccessible } from '../game/progression.ts';
import type { MapNode } from '../game/mapData.ts';
import type { LessonProgress } from '../game/types.ts';

interface MapScreenProps {
  currentLocation: number;
  lessonProgress: LessonProgress[];
  totalGems: number;
  playerName: string;
  onSelectLocation: (lessonId: number) => void;
  onMove: (locationId: number) => void;
}

interface MapCell {
  char: string;
  color: string;
}

interface Pos {
  row: number;
  col: number;
}

const ROWS = 40;
const COLS = 80;

// Pre-compute which cells are walkable (roads + node positions) — never changes
const WALKABLE: boolean[][] = computeWalkable();

export function MapScreen({
  currentLocation,
  lessonProgress,
  totalGems,
  playerName,
  onSelectLocation,
  onMove,
}: MapScreenProps) {
  const [playerPos, setPlayerPos] = useState<Pos>(() => {
    const node = getNodeById(currentLocation);
    return { row: node?.row ?? 35, col: node?.col ?? 10 };
  });

  const mapCells = useMemo(
    () => buildMap(playerPos, lessonProgress),
    [playerPos, lessonProgress],
  );

  const nodeHere = getNodeAtPos(playerPos.row, playerPos.col);
  const bannerLines = getBannerLines(lessonProgress, nodeHere);

  // Auto-scroll the map viewport to keep the player visible
  const mapScrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = mapScrollRef.current;
    if (!container) return;
    const lineHeight = 20; // leading-5 = 1.25rem = 20px
    const playerTop = playerPos.row * lineHeight;
    const playerBottom = playerTop + lineHeight;

    if (playerBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = playerBottom - container.clientHeight;
    }
    if (playerTop < container.scrollTop) {
      container.scrollTop = playerTop;
    }
  }, [playerPos.row]);

  useKeyCapture((key) => {
    let dr = 0, dc = 0;
    switch (key) {
      case 'k': case 'ArrowUp':    dr = -1; break;
      case 'j': case 'ArrowDown':  dr = 1;  break;
      case 'h': case 'ArrowLeft':  dc = -1; break;
      case 'l': case 'ArrowRight': dc = 1;  break;
      case 'Enter': {
        if (nodeHere && canEnter(nodeHere.id, currentLocation, lessonProgress)) {
          onSelectLocation(nodeHere.id);
        }
        return;
      }
      default: return;
    }

    const nr = playerPos.row + dr;
    const nc = playerPos.col + dc;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && WALKABLE[nr][nc]) {
      setPlayerPos({ row: nr, col: nc });
    }
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 font-mono text-sm">
      <div className="px-2 py-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-green-400">{playerName}'s Kingdom</span>
          <span className="text-amber-400">{totalGems} gems</span>
        </div>
        <ScrollBanner lines={bannerLines} />
      </div>
      <div ref={mapScrollRef} className="flex-1 min-h-0 overflow-y-auto buffer-viewport px-2 py-1">
        <pre className="terminal-text leading-5">
          {mapCells.map((row, r) => (
            <div key={r}>{renderRow(row)}</div>
          ))}
        </pre>
      </div>
      <div className="px-2 py-1 border-t border-gray-700 text-xs">
        <div className="flex justify-between">
          <span className="text-amber-400">
            {nodeHere ? nodeHere.label : 'On the road...'}
          </span>
          <span className="text-gray-500">
            {nodeHere
              ? '[hjkl] Move  [Enter] Enter location'
              : '[hjkl] Move'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Rendering ─────────────────────────────────────────────

function renderRow(cells: MapCell[]): ReactNode[] {
  const spans: ReactNode[] = [];
  let i = 0;
  while (i < cells.length) {
    let j = i + 1;
    while (j < cells.length && cells[j].color === cells[i].color) j++;
    const text = cells.slice(i, j).map(c => c.char).join('');
    spans.push(<span key={i} className={cells[i].color}>{text}</span>);
    i = j;
  }
  return spans;
}

// ─── Walkable Grid ─────────────────────────────────────────

function computeWalkable(): boolean[][] {
  const grid = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => false)
  );

  // Mark road cells
  for (const edge of MAP_EDGES) {
    const from = getNodeById(edge.from);
    const to = getNodeById(edge.to);
    if (!from || !to) continue;
    markRoadCells(grid, from.row, from.col, to.row, to.col);
  }

  // Mark node positions
  for (const node of MAP_NODES) {
    if (node.row >= 0 && node.row < ROWS && node.col >= 0 && node.col < COLS) {
      grid[node.row][node.col] = true;
    }
  }

  return grid;
}

function markRoadCells(grid: boolean[][], r1: number, c1: number, r2: number, c2: number) {
  const dr = r2 > r1 ? 1 : r2 < r1 ? -1 : 0;
  const dc = c2 > c1 ? 1 : c2 < c1 ? -1 : 0;

  let r = r1;
  let c = c1;

  // Vertical segment
  while (r !== r2) {
    r += dr;
    if (r === r2 && c === c2) break;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      grid[r][c] = true;
    }
  }

  // Horizontal segment
  while (c !== c2) {
    c += dc;
    if (r === r2 && c === c2) break;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      grid[r][c] = true;
    }
  }
}

// ─── Helpers ───────────────────────────────────────────────

function getNodeAtPos(row: number, col: number): MapNode | undefined {
  return MAP_NODES.find(n => n.row === row && n.col === col);
}

function canEnter(targetId: number, currentLocation: number, progress: LessonProgress[]): boolean {
  if (targetId <= currentLocation) return true;
  return isLessonAccessible(targetId, progress);
}

function getBannerLines(progress: LessonProgress[], nodeHere: MapNode | undefined): string[] {
  const nextLesson = MAP_NODES.find(n => {
    const p = progress.find(pr => pr.lessonId === n.id);
    return !p?.completed;
  });

  if (!nextLesson) {
    return [
      'All lessons complete!',
      'You are a true vi master.',
    ];
  }

  const chapterName = CHAPTER_NAMES[nextLesson.chapter] ?? '';

  if (nextLesson.id === 1) {
    return [
      'Welcome to the Kingdom of VI!',
      `Walk to ${nextLesson.label} and press Enter to begin.`,
    ];
  }

  if (nodeHere && nodeHere.id === nextLesson.id) {
    return [
      `You've arrived at ${nextLesson.label}.`,
      'Press Enter to start the lesson.',
    ];
  }

  return [
    `Next: ${nextLesson.label}`,
    `${chapterName} — Walk the road to reach it.`,
  ];
}

function ScrollBanner({ lines }: { lines: string[] }): JSX.Element {
  const W = 52;
  const dash = '-'.repeat(W + 2);
  const pad = ' '.repeat(W);

  return (
    <pre className="text-xs leading-4">
      <span className="text-amber-700">{`  .${dash}.`}</span>{'\n'}
      <span className="text-amber-700">{` / ${pad} \\`}</span>{'\n'}
      {lines.map((line, i) => (
        <span key={i}>
          <span className="text-amber-700">{'|'}</span>
          <span className="text-amber-300">{`   ${line.padEnd(W - 1)}`}</span>
          <span className="text-amber-700">{'|'}</span>
          {'\n'}
        </span>
      ))}
      <span className="text-amber-700">{` \\ ${pad} /`}</span>{'\n'}
      <span className="text-amber-700">{`  '${dash}'`}</span>
    </pre>
  );
}

// ─── Terrain Generation ────────────────────────────────────

function terrainHash(r: number, c: number): number {
  return ((r * 7 + c * 13 + r * c * 3) & 0xFFFF) % 100;
}

function isForestZone(r: number, c: number): boolean {
  if (r >= 6 && r <= 34 && c >= 0 && c <= 7) return true;
  if (r >= 32 && r <= 39 && c >= 0 && c <= 20) return true;
  if (r >= 15 && r <= 25 && c >= 8 && c <= 15) return true;
  if (r >= 3 && r <= 14 && c >= 26 && c <= 40) return true;
  if (r >= 6 && r <= 16 && c >= 44 && c <= 48) return true;
  if (r >= 14 && r <= 38 && c >= 68 && c <= 79) return true;
  if (r >= 28 && r <= 36 && c >= 22 && c <= 32) return true;
  return false;
}

function getTerrainCell(r: number, c: number): MapCell {
  const h = terrainHash(r, c);

  if (r < 3) {
    return { char: '^An^^nA^^A'[h % 10], color: 'text-gray-600' };
  }
  if (r === 3 && h < 50) {
    return { char: '^n^'[h % 3], color: 'text-gray-600' };
  }
  if (c > 77) {
    return { char: '^An'[h % 3], color: 'text-gray-600' };
  }
  if (c >= 42 && c <= 43 && r >= 3) {
    return { char: '~', color: 'text-blue-500' };
  }
  if (r >= 38 && h < 30) {
    return { char: '~', color: 'text-blue-800' };
  }
  if (r >= 3 && r <= 13 && c >= 55 && c <= 65) {
    if (r === 3 || r === 13) return { char: '#', color: 'text-gray-500' };
    if (c === 55 || c === 65) return { char: '#', color: 'text-gray-500' };
    if (h < 10) return { char: '.', color: 'text-gray-700' };
    return { char: ' ', color: 'text-gray-800' };
  }
  if (isForestZone(r, c)) {
    if (h < 65) {
      return { char: 'T^tT^Tt^'[h % 8], color: 'text-green-700' };
    }
    return { char: '.', color: 'text-green-900' };
  }
  if (h < 8) {
    return { char: 'T', color: 'text-green-700' };
  }
  const chars = '.,.  . ,.';
  return { char: chars[h % chars.length], color: 'text-green-900' };
}

// ─── Map Building ──────────────────────────────────────────

function buildMap(playerPos: Pos, progress: LessonProgress[]): MapCell[][] {
  const grid: MapCell[][] = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => getTerrainCell(r, c))
  );

  // Draw roads
  for (const edge of MAP_EDGES) {
    const from = getNodeById(edge.from);
    const to = getNodeById(edge.to);
    if (!from || !to) continue;
    drawRoad(grid, from.row, from.col, to.row, to.col);
  }

  // Place location markers and labels
  for (const node of MAP_NODES) {
    if (node.row >= ROWS || node.col >= COLS) continue;

    const completed = progress.find(p => p.lessonId === node.id)?.completed ?? false;

    if (completed) {
      grid[node.row][node.col] = { char: '*', color: 'text-yellow-500' };
    } else {
      grid[node.row][node.col] = { char: 'o', color: 'text-cyan-400' };
    }

    const label = node.label.slice(0, 10);
    if (node.row + 1 < ROWS) {
      for (let i = 0; i < label.length && node.col + i < COLS; i++) {
        grid[node.row + 1][node.col + i] = { char: label[i], color: 'text-amber-400' };
      }
    }
  }

  // Place player on top of everything
  grid[playerPos.row][playerPos.col] = { char: '@', color: 'text-yellow-300' };

  return grid;
}

function drawRoad(grid: MapCell[][], r1: number, c1: number, r2: number, c2: number) {
  const dr = r2 > r1 ? 1 : r2 < r1 ? -1 : 0;
  const dc = c2 > c1 ? 1 : c2 < c1 ? -1 : 0;

  let r = r1;
  let c = c1;

  while (r !== r2) {
    r += dr;
    if (r === r2 && c === c2) break;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      const isWater = c >= 42 && c <= 43;
      grid[r][c] = {
        char: isWater ? '=' : ':',
        color: isWater ? 'text-amber-500' : 'text-amber-800',
      };
    }
  }

  while (c !== c2) {
    c += dc;
    if (r === r2 && c === c2) break;
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      const isWater = c >= 42 && c <= 43;
      grid[r][c] = {
        char: isWater ? '=' : '-',
        color: isWater ? 'text-amber-500' : 'text-amber-800',
      };
    }
  }
}
