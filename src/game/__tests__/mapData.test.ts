import { describe, it, expect } from 'vitest';
import {
  MAP_NODES,
  MAP_EDGES,
  getAdjacentNodes,
  getNodeById,
  getChapterNodes,
  CHAPTER_NAMES,
} from '../mapData.ts';

describe('MAP_NODES', () => {
  it('has 26 nodes', () => {
    expect(MAP_NODES).toHaveLength(26);
  });

  it('nodes have unique ids 1-26', () => {
    const ids = MAP_NODES.map((n) => n.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 26 }, (_, i) => i + 1));
  });

  it('all nodes have required fields', () => {
    for (const node of MAP_NODES) {
      expect(node.label).toBeTruthy();
      expect(typeof node.row).toBe('number');
      expect(typeof node.col).toBe('number');
      expect(node.chapter).toBeGreaterThanOrEqual(1);
      expect(node.chapter).toBeLessThanOrEqual(8);
    }
  });
});

describe('MAP_EDGES', () => {
  it('has main road (25 edges) plus revisit loops', () => {
    expect(MAP_EDGES.length).toBeGreaterThanOrEqual(25);
  });

  it('all edges reference valid node ids', () => {
    const ids = new Set(MAP_NODES.map((n) => n.id));
    for (const edge of MAP_EDGES) {
      expect(ids.has(edge.from)).toBe(true);
      expect(ids.has(edge.to)).toBe(true);
    }
  });

  it('main road connects 1 through 26', () => {
    for (let i = 1; i < 26; i++) {
      const edge = MAP_EDGES.find((e) => e.from === i && e.to === i + 1);
      expect(edge).toBeDefined();
    }
  });

  it('has revisit loop from 7 to 5', () => {
    expect(MAP_EDGES.find((e) => e.from === 7 && e.to === 5)).toBeDefined();
  });

  it('has revisit loop from 14 to 9', () => {
    expect(MAP_EDGES.find((e) => e.from === 14 && e.to === 9)).toBeDefined();
  });

  it('has revisit loop from 22 to 10', () => {
    expect(MAP_EDGES.find((e) => e.from === 22 && e.to === 10)).toBeDefined();
  });
});

describe('getAdjacentNodes', () => {
  it('returns neighbors of node 1', () => {
    const adj = getAdjacentNodes(1);
    expect(adj).toContain(2);
  });

  it('returns both directions for edges', () => {
    // Edge from 1 to 2 means 2 is adjacent to 1 AND 1 is adjacent to 2
    expect(getAdjacentNodes(2)).toContain(1);
    expect(getAdjacentNodes(2)).toContain(3);
  });

  it('includes revisit loop neighbors', () => {
    // Node 7 connects to 6 (main road back), 8 (main road forward), and 5 (loop)
    const adj7 = getAdjacentNodes(7);
    expect(adj7).toContain(6);
    expect(adj7).toContain(8);
    expect(adj7).toContain(5);
  });

  it('returns sorted unique array', () => {
    const adj = getAdjacentNodes(14);
    for (let i = 1; i < adj.length; i++) {
      expect(adj[i]).toBeGreaterThan(adj[i - 1]);
    }
  });
});

describe('getNodeById', () => {
  it('finds existing node', () => {
    const node = getNodeById(1);
    expect(node?.label).toBe('TRAILHEAD');
  });

  it('returns undefined for non-existent node', () => {
    expect(getNodeById(99)).toBeUndefined();
  });
});

describe('getChapterNodes', () => {
  it('returns chapter 1 nodes (4 nodes)', () => {
    const nodes = getChapterNodes(1);
    expect(nodes).toHaveLength(4);
    expect(nodes.every((n) => n.chapter === 1)).toBe(true);
  });

  it('returns chapter 8 nodes (4 nodes)', () => {
    expect(getChapterNodes(8)).toHaveLength(4);
  });
});

describe('CHAPTER_NAMES', () => {
  it('has names for all 8 chapters', () => {
    for (let i = 1; i <= 8; i++) {
      expect(CHAPTER_NAMES[i]).toBeTruthy();
    }
  });
});
