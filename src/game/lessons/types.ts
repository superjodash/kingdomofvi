export interface GemContext {
  finalLines: string[];
  targetLines: string[] | null;
  keyCounts: Record<string, number>;
  composedCounts: Record<string, number>;
  totalKeystrokes: number;
  modeChanges: number;
  cursorVisited: Set<string>;
}

export type GemCheck = (ctx: GemContext) => boolean;

export interface LessonDef {
  id: number;
  chapter: number;
  title: string;
  subtitle: string;
  mapLabel: string;
  unlocks: string[];
  prerequisite: number | null;
  scroll: {
    vignette: string;
    storyBeat: string;
    newPowerDescription: string;
  };
  arena: {
    initialBuffer: string;
    targetBuffer?: string;
    arrowsAllowed: boolean;
  };
  gems: {
    gem1: GemCheck;
    gem2: GemCheck;
    gem3: GemCheck | null;
  };
  award: {
    text: string;
  };
}
