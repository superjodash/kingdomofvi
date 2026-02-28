export interface MapNode {
  id: number;
  label: string;
  row: number;
  col: number;
  chapter: number;
}

export interface MapEdge {
  from: number;
  to: number;
}

// Node positions on the ASCII map grid (row, col)
// The map is roughly 40 rows x 70 cols
export const MAP_NODES: MapNode[] = [
  // Chapter 1 — Roads of Motion (1-4)
  { id: 1,  label: 'TRAILHEAD',   row: 35, col: 10, chapter: 1 },
  { id: 2,  label: 'HOME ROW',    row: 32, col: 14, chapter: 1 },
  { id: 3,  label: 'COUNTING',    row: 29, col: 18, chapter: 1 },
  { id: 4,  label: 'LINE ENDS',   row: 26, col: 14, chapter: 1 },

  // Chapter 2 — Wordsmith's Trail (5-7)
  { id: 5,  label: 'WORD WALK',   row: 23, col: 18, chapter: 2 },
  { id: 6,  label: 'WORD LEAP',   row: 20, col: 22, chapter: 2 },
  { id: 7,  label: 'BIG WORDS',   row: 17, col: 18, chapter: 2 },

  // Chapter 3 — Blade & Quill (8-11)
  { id: 8,  label: 'SCRIBE',      row: 14, col: 22, chapter: 3 },
  { id: 9,  label: 'BLADE',       row: 11, col: 18, chapter: 3 },
  { id: 10, label: 'QUILL',       row: 8,  col: 22, chapter: 3 },
  { id: 11, label: 'CUT&SEW',     row: 5,  col: 18, chapter: 3 },

  // Chapter 4 — Mirror Woods (12-14)
  { id: 12, label: 'SEEK',        row: 5,  col: 30, chapter: 4 },
  { id: 13, label: 'FIND',        row: 8,  col: 34, chapter: 4 },
  { id: 14, label: 'REPEAT',      row: 11, col: 30, chapter: 4 },

  // Chapter 5 — Artisan's Forge (15-17)
  { id: 15, label: 'YANK',        row: 14, col: 34, chapter: 5 },
  { id: 16, label: 'PASTE',       row: 17, col: 38, chapter: 5 },
  { id: 17, label: 'REGISTER',    row: 20, col: 34, chapter: 5 },

  // Chapter 6 — Time Mage's Archives (18-19)
  { id: 18, label: 'UNDO',        row: 20, col: 46, chapter: 6 },
  { id: 19, label: 'REDO',        row: 17, col: 50, chapter: 6 },

  // Chapter 7 — Forms & Shapes (20-22)
  { id: 20, label: 'VISUAL',      row: 14, col: 46, chapter: 7 },
  { id: 21, label: 'VIS-LINE',    row: 11, col: 50, chapter: 7 },
  { id: 22, label: 'TEXTOBJ',     row: 8,  col: 46, chapter: 7 },

  // Chapter 8 — Halls of Workflow + Castle of Exit (23-26)
  { id: 23, label: 'SPLIT',       row: 5,  col: 50, chapter: 8 },
  { id: 24, label: 'BUFFERS',     row: 5,  col: 58, chapter: 8 },
  { id: 25, label: 'SAVE',        row: 8,  col: 58, chapter: 8 },
  { id: 26, label: 'EXIT',        row: 11, col: 58, chapter: 8 },
];

// Main road + revisit loops
export const MAP_EDGES: MapEdge[] = [
  // Main road: 1 → 26
  { from: 1,  to: 2  },
  { from: 2,  to: 3  },
  { from: 3,  to: 4  },
  { from: 4,  to: 5  },
  { from: 5,  to: 6  },
  { from: 6,  to: 7  },
  { from: 7,  to: 8  },
  { from: 8,  to: 9  },
  { from: 9,  to: 10 },
  { from: 10, to: 11 },
  { from: 11, to: 12 },
  { from: 12, to: 13 },
  { from: 13, to: 14 },
  { from: 14, to: 15 },
  { from: 15, to: 16 },
  { from: 16, to: 17 },
  { from: 17, to: 18 },
  { from: 18, to: 19 },
  { from: 19, to: 20 },
  { from: 20, to: 21 },
  { from: 21, to: 22 },
  { from: 22, to: 23 },
  { from: 23, to: 24 },
  { from: 24, to: 25 },
  { from: 25, to: 26 },

  // Revisit loop 1: After 7, loop back to 5-6
  { from: 7, to: 5 },

  // Revisit loop 2: After 14, loop back to 9-13
  { from: 14, to: 9 },

  // Revisit loop 3: After 22, loop back to 10-11
  { from: 22, to: 10 },
];

export function getAdjacentNodes(nodeId: number): number[] {
  const neighbors: number[] = [];
  for (const edge of MAP_EDGES) {
    if (edge.from === nodeId) neighbors.push(edge.to);
    if (edge.to === nodeId) neighbors.push(edge.from);
  }
  return [...new Set(neighbors)].sort((a, b) => a - b);
}

export function getNodeById(nodeId: number): MapNode | undefined {
  return MAP_NODES.find((n) => n.id === nodeId);
}

export function getChapterNodes(chapter: number): MapNode[] {
  return MAP_NODES.filter((n) => n.chapter === chapter);
}

export const CHAPTER_NAMES: Record<number, string> = {
  1: 'Roads of Motion',
  2: "Wordsmith's Trail",
  3: 'Blade & Quill',
  4: 'Mirror Woods',
  5: "Artisan's Forge",
  6: "Time Mage's Archives",
  7: 'Forms & Shapes',
  8: 'Halls of Workflow',
};
