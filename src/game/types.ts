export interface GameState {
  playerName: string;
  currentScreen: Screen;
  currentLocation: number;
  lessonProgress: LessonProgress[];
  totalGems: number;
  unlockedKeys: string[];
}

export type Screen =
  | { type: 'title' }
  | { type: 'name-entry' }
  | { type: 'map' }
  | { type: 'location-scroll'; lessonId: number }
  | { type: 'lesson'; lessonId: number }
  | { type: 'award'; lessonId: number; gems: number };

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  bestGems: number;
  attempts: number;
}
