import type { LessonDef } from './types.ts';
import { usedKey, totalKeystrokesUnder, visitedPositions } from '../gemEvaluator.ts';

export const chapter2Lessons: LessonDef[] = [
  {
    id: 5,
    chapter: 2,
    title: 'Briarpath Crossing',
    subtitle: 'Leap by Words',
    mapLabel: 'BRIARPATH',
    unlocks: ['w', 'b', 'e'],
    prerequisite: 4,
    scroll: {
      vignette: `  ~~~~~~~
==\\___/==    Briarpath Crossing
   | |`,
      storyBeat: 'The briars are thick; stepping letter by letter takes all day.\nLeap by words: forward, back, and to the word\'s edge.',
      newPowerDescription: 'w (next word) b (back word) e (end of word)',
    },
    arena: {
      initialBuffer: `# BRIARPATH CROSSING
#
# Allowed Keys:
#   previous + w b e
#
# QUEST:
#   - Use w/b/e at least 5 times each.
#   - Visit each lantern [*] by landing your cursor on it.

Lantern Trail:
[*] mossy stones beside a babbling brook
soft bread warm tea tiny quilts
[*] a hedgehog wearing a thimble-hat
gentle rain on sleepy rooftops
[*] the bridge creaks but kindly
the creek giggles at your boots
[*] you arrive with a smile`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) =>
        (ctx.keyCounts['w'] ?? 0) >= 5 &&
        (ctx.keyCounts['b'] ?? 0) >= 5 &&
        (ctx.keyCounts['e'] ?? 0) >= 5,
      gem2: visitedPositions(20),
      gem3: totalKeystrokesUnder(40),
    },
    award: { text: 'The creek applauds with little splashes. Your steps are word-wise now.' },
  },
  {
    id: 6,
    chapter: 2,
    title: 'Old Oak Library',
    subtitle: 'Big WORDs, Big Leaps',
    mapLabel: 'OLD OAK',
    unlocks: ['W', 'B', 'E'],
    prerequisite: 5,
    scroll: {
      vignette: `  (:::)
  /___\\     Old Oak Library`,
      storyBeat: 'Some texts are full of symbols and punctuation—sticky like sap.\nBig WORD motions leap over them cleanly.',
      newPowerDescription: 'W (next WORD) B (back WORD) E (end of WORD)',
    },
    arena: {
      initialBuffer: `# OLD OAK LIBRARY
#
# Allowed Keys:
#   previous + W B E
#
# QUEST:
#   - Use W/B/E at least 3 times each.
#   - Navigate through the library catalog below.

Catalog Entry #1:  book.title="A-Journey-Through-Vim"
Catalog Entry #2:  shelf[3].row{7}  => (fiction/fantasy)
Catalog Entry #3:  author.name="The-Friendly-Scribe"
Catalog Entry #4:  isbn:978-3-16-148410-0 / price=$12.50
Catalog Entry #5:  tags=[cozy,adventure,keyboard]`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) =>
        (ctx.keyCounts['W'] ?? 0) >= 3 &&
        (ctx.keyCounts['B'] ?? 0) >= 3 &&
        (ctx.keyCounts['E'] ?? 0) >= 3,
      gem2: visitedPositions(15),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The oak creaks with approval. Big leaps suit you well.' },
  },
  {
    id: 7,
    chapter: 2,
    title: 'Counting Tower',
    subtitle: 'The Power of Numbers',
    mapLabel: 'COUNTING',
    unlocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    prerequisite: 6,
    scroll: {
      vignette: `   [7]
   [5]       Counting Tower
   [3]       numbers multiply your power
   [1]`,
      storyBeat: 'Every motion can be multiplied.\nType a number before any key to repeat it.',
      newPowerDescription: '1-9 (count prefix) e.g., 3w = three words forward',
    },
    arena: {
      initialBuffer: `# COUNTING TOWER
#
# Allowed Keys:
#   previous + 1-9 (count prefix)
#
# QUEST:
#   - Use counts with motions (e.g., 3j, 5l, 2w).
#   - Reach the treasure [T] at the bottom-right.

Start here -->
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
.........................................................
...................................................[T]`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) => ctx.totalKeystrokes > 0,
      gem2: (ctx) => {
        // Check that at least one digit was used
        for (let d = 1; d <= 9; d++) {
          if ((ctx.keyCounts[String(d)] ?? 0) >= 1) return true;
        }
        return false;
      },
      gem3: totalKeystrokesUnder(15),
    },
    award: { text: 'The tower bell rings once for every clever shortcut you found.' },
  },
];
