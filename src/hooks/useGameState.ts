import { useState, useCallback } from 'react';
import type { GameState, Screen, LessonProgress } from '../game/types.ts';
import { initializeProgress, updateLessonProgress, getTotalGems, getUnlockedKeysThrough } from '../game/progression.ts';

const TOTAL_LESSONS = 26;
const STORAGE_KEY = 'kingdomofvi_save';

function loadSavedState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function createNewGame(playerName: string): GameState {
  const progress = initializeProgress(TOTAL_LESSONS);
  return {
    playerName,
    currentScreen: { type: 'map' },
    currentLocation: 1,
    lessonProgress: progress,
    totalGems: 0,
    unlockedKeys: [],
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(() => loadSavedState());
  const [preGameScreen, setPreGameScreen] = useState<'title' | 'name-entry'>('title');

  const startNewGame = useCallback((playerName: string) => {
    const state = createNewGame(playerName);
    saveState(state);
    setGameState(state);
  }, []);

  const continueGame = useCallback(() => {
    // Just navigate to map with existing state
    setGameState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, currentScreen: { type: 'map' as const } };
      saveState(next);
      return next;
    });
  }, []);

  const goToNameEntry = useCallback(() => {
    clearSavedState();
    setGameState(null);
    setPreGameScreen('name-entry');
  }, []);

  const navigateTo = useCallback((screen: Screen) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, currentScreen: screen };
      saveState(next);
      return next;
    });
  }, []);

  const setLocation = useCallback((locationId: number) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, currentLocation: locationId };
      saveState(next);
      return next;
    });
  }, []);

  const completeLesson = useCallback((lessonId: number, gems: number, allLessons: { id: number; unlocks: string[] }[]) => {
    setGameState((prev) => {
      if (!prev) return prev;
      const newProgress = updateLessonProgress(prev.lessonProgress, lessonId, gems);
      const next: GameState = {
        ...prev,
        lessonProgress: newProgress,
        totalGems: getTotalGems(newProgress),
        unlockedKeys: getUnlockedKeysThrough(lessonId, allLessons as any),
      };
      saveState(next);
      return next;
    });
  }, []);

  const hasSavedGame = gameState !== null;

  return {
    gameState,
    hasSavedGame,
    preGameScreen,
    startNewGame,
    continueGame,
    goToNameEntry,
    navigateTo,
    setLocation,
    completeLesson,
  };
}
