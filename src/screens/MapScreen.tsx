import { useState, useMemo } from 'react';
import { useKeyCapture } from '../hooks/useKeyCapture.ts';
import { MAP_NODES, MAP_EDGES, getAdjacentNodes, getNodeById } from '../game/mapData.ts';
import { isLessonAccessible } from '../game/progression.ts';
import type { LessonProgress } from '../game/types.ts';

interface MapScreenProps {
  currentLocation: number;
  lessonProgress: LessonProgress[];
  totalGems: number;
  playerName: string;
  onSelectLocation: (lessonId: number) => void;
  onMove: (locationId: number) => void;
}

const MAP_ROWS = 40;
const MAP_COLS = 70;

export function MapScreen({
  currentLocation,
  lessonProgress,
  totalGems,
  playerName,
  onSelectLocation,
  onMove,
}: MapScreenProps) {
  const [cursor, setCursor] = useState(currentLocation);

  const mapGrid = useMemo(() => buildMapGrid(currentLocation, lessonProgress), [currentLocation, lessonProgress]);

  useKeyCapture((key) => {
    if (key === 'Enter') {
      if (cursor === currentLocation) {
        // Re-enter current location (scroll → lesson)
        onSelectLocation(cursor);
      } else if (canMoveTo(cursor, currentLocation, lessonProgress)) {
        // Move avatar to that location and enter it
        onSelectLocation(cursor);
      }
    }
    // Navigate between adjacent nodes
    if (key === 'h' || key === 'ArrowLeft') moveToNearest(cursor, 'left');
    if (key === 'l' || key === 'ArrowRight') moveToNearest(cursor, 'right');
    if (key === 'k' || key === 'ArrowUp') moveToNearest(cursor, 'up');
    if (key === 'j' || key === 'ArrowDown') moveToNearest(cursor, 'down');
  });

  function moveToNearest(from: number, direction: 'left' | 'right' | 'up' | 'down') {
    const currentNode = getNodeById(from);
    if (!currentNode) return;
    const adj = getAdjacentNodes(from);
    let best: number | null = null;
    let bestDist = Infinity;

    for (const id of adj) {
      const node = getNodeById(id);
      if (!node) continue;
      const dr = node.row - currentNode.row;
      const dc = node.col - currentNode.col;

      let isCorrectDir = false;
      switch (direction) {
        case 'left': isCorrectDir = dc < 0; break;
        case 'right': isCorrectDir = dc > 0; break;
        case 'up': isCorrectDir = dr < 0; break;
        case 'down': isCorrectDir = dr > 0; break;
      }

      if (isCorrectDir) {
        const dist = Math.abs(dr) + Math.abs(dc);
        if (dist < bestDist) {
          bestDist = dist;
          best = id;
        }
      }
    }

    if (best !== null) {
      setCursor(best);
    }
  }

  return (
    <div className="flex-1 flex flex-col font-mono text-sm">
      <div className="px-2 py-1 flex justify-between text-xs border-b border-gray-700">
        <span className="text-green-400">{playerName}'s Kingdom</span>
        <span className="text-amber-400">{totalGems} gems</span>
      </div>
      <div className="flex-1 overflow-hidden px-2 py-1">
        <pre className="terminal-text text-green-600 leading-5">
          {mapGrid}
        </pre>
      </div>
      <div className="px-2 py-1 border-t border-gray-700 text-xs">
        <div className="flex justify-between">
          <span className="text-amber-400">
            {getNodeById(cursor)?.label ?? '???'}
            {cursor === currentLocation ? ' (here)' : ''}
          </span>
          <span className="text-gray-500">[hjkl] Move  [Enter] Enter location</span>
        </div>
      </div>
    </div>
  );
}

function buildMapGrid(currentLocation: number, progress: LessonProgress[]): string {
  const grid: string[][] = Array.from({ length: MAP_ROWS }, () =>
    Array.from({ length: MAP_COLS }, () => ' ')
  );

  // Draw roads between connected nodes
  for (const edge of MAP_EDGES) {
    const from = getNodeById(edge.from);
    const to = getNodeById(edge.to);
    if (!from || !to) continue;
    drawRoad(grid, from.row, from.col, to.row, to.col);
  }

  // Place nodes (overwrite road characters)
  for (const node of MAP_NODES) {
    const label = node.label.slice(0, 10);
    const completed = progress.find((p) => p.lessonId === node.id)?.completed ?? false;
    const marker = node.id === currentLocation ? '@' : completed ? '*' : 'o';

    if (node.row < MAP_ROWS && node.col < MAP_COLS) {
      grid[node.row][node.col] = marker;
      // Write label below
      if (node.row + 1 < MAP_ROWS) {
        for (let i = 0; i < label.length && node.col + i < MAP_COLS; i++) {
          grid[node.row + 1][node.col + i] = label[i];
        }
      }
    }
  }

  return grid.map((row) => row.join('')).join('\n');
}

function drawRoad(grid: string[][], r1: number, c1: number, r2: number, c2: number) {
  // Draw a simple L-shaped path: vertical first, then horizontal
  const dr = r2 > r1 ? 1 : r2 < r1 ? -1 : 0;
  const dc = c2 > c1 ? 1 : c2 < c1 ? -1 : 0;

  let r = r1;
  let c = c1;

  // Vertical segment
  while (r !== r2) {
    r += dr;
    if (r === r2 && c === c2) break; // Don't overwrite destination
    if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && grid[r][c] === ' ') {
      grid[r][c] = '|';
    }
  }

  // Horizontal segment
  while (c !== c2) {
    c += dc;
    if (r === r2 && c === c2) break; // Don't overwrite destination
    if (r >= 0 && r < MAP_ROWS && c >= 0 && c < MAP_COLS && grid[r][c] === ' ') {
      grid[r][c] = '-';
    }
  }
}

function canMoveTo(targetId: number, currentLocation: number, progress: LessonProgress[]): boolean {
  // Can always move backward (to lower IDs) or to adjacent completed lessons
  if (targetId <= currentLocation) return true;
  // Can only move forward if current lesson is accessible
  return isLessonAccessible(targetId, progress);
}
