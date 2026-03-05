import './styles/terminal.css';
import { Shell } from './components/Shell.tsx';
import { TitleScreen } from './screens/TitleScreen.tsx';
import { NameEntryScreen } from './screens/NameEntryScreen.tsx';
import { MapScreen } from './screens/MapScreen.tsx';
import { LocationScrollScreen } from './screens/LocationScrollScreen.tsx';
import { LessonScreen } from './screens/LessonScreen.tsx';
import { AwardScreen } from './screens/AwardScreen.tsx';
import { useGameState } from './hooks/useGameState.ts';
import { ALL_LESSONS, getLessonById } from './game/lessons/index.ts';
import { getArenaAllowedKeys } from './game/progression.ts';

function App() {
  const {
    gameState,
    hasSavedGame,
    preGameScreen,
    startNewGame,
    continueGame,
    goToNameEntry,
    navigateTo,
    setLocation,
    completeLesson,
  } = useGameState();

  // No game state yet — show title or name entry
  if (!gameState) {
    if (preGameScreen === 'name-entry') {
      return (
        <Shell>
          <NameEntryScreen onSubmit={(name) => startNewGame(name)} />
        </Shell>
      );
    }

    return (
      <Shell>
        <TitleScreen
          hasSavedGame={false}
          onNewGame={goToNameEntry}
          onContinue={() => {}}
        />
      </Shell>
    );
  }

  const screen = gameState.currentScreen;

  return (
    <Shell>
      {screen.type === 'title' && (
        <TitleScreen
          hasSavedGame={hasSavedGame}
          onNewGame={goToNameEntry}
          onContinue={continueGame}
        />
      )}

      {screen.type === 'name-entry' && (
        <NameEntryScreen onSubmit={(name) => startNewGame(name)} />
      )}

      {screen.type === 'map' && (
        <MapScreen
          currentLocation={gameState.currentLocation}
          lessonProgress={gameState.lessonProgress}
          totalGems={gameState.totalGems}
          playerName={gameState.playerName}
          onSelectLocation={(lessonId) => {
            setLocation(lessonId);
            navigateTo({ type: 'location-scroll', lessonId });
          }}
          onMove={(locationId) => {
            setLocation(locationId);
          }}
          onHome={() => navigateTo({ type: 'title' })}
        />
      )}

      {screen.type === 'location-scroll' && (() => {
        const lesson = getLessonById(screen.lessonId);
        if (!lesson) return <div>Lesson not found</div>;
        return (
          <LocationScrollScreen
            lesson={lesson}
            onContinue={() => navigateTo({ type: 'lesson', lessonId: screen.lessonId })}
            onBack={() => navigateTo({ type: 'map' })}
          />
        );
      })()}

      {screen.type === 'lesson' && (() => {
        const lesson = getLessonById(screen.lessonId);
        if (!lesson) return <div>Lesson not found</div>;
        const allowedKeys = getArenaAllowedKeys(lesson.id, ALL_LESSONS);
        return (
          <LessonScreen
            lesson={lesson}
            allowedKeys={allowedKeys}
            onComplete={(gems) => {
              completeLesson(lesson.id, gems, ALL_LESSONS);
              navigateTo({ type: 'award', lessonId: lesson.id, gems });
            }}
            onQuit={() => navigateTo({ type: 'map' })}
          />
        );
      })()}

      {screen.type === 'award' && (() => {
        const lesson = getLessonById(screen.lessonId);
        if (!lesson) return <div>Lesson not found</div>;
        return (
          <AwardScreen
            lessonTitle={lesson.title}
            awardText={lesson.award.text}
            gems={screen.gems}
            onContinue={() => navigateTo({ type: 'map' })}
          />
        );
      })()}
    </Shell>
  );
}

export default App;
