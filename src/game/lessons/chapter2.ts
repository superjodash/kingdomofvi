import type { GemCheck, LessonDef } from './types.ts';
import { totalKeystrokesUnder, visitedPositions } from '../gemEvaluator.ts';

const MILESTONE_REQUIRED_MOVES: Array<readonly [string, string]> = [
  ['5', 'j'],
  ['7', 'k'],
  ['9', 'l'],
  ['3', 'w'],
  ['2', 'b'],
];

const MILESTONE_ALTAR_LINE = 19;
const MILESTONE_ALTAR_COLS = [5, 6, 7, 8, 9, 10, 11];

const usedKeySequence = (sequence: readonly string[]): GemCheck => (ctx) => {
  if (sequence.length === 0) return true;

  for (let i = 0; i <= ctx.keys.length - sequence.length; i++) {
    let matches = true;
    for (let j = 0; j < sequence.length; j++) {
      if (ctx.keys[i + j] !== sequence[j]) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }

  return false;
};

const usedAllMilestoneMoves: GemCheck = (ctx) =>
  MILESTONE_REQUIRED_MOVES.every((sequence) => usedKeySequence(sequence)(ctx));

const visitedMilestoneAltar: GemCheck = (ctx) =>
  MILESTONE_ALTAR_COLS.some((col) => ctx.cursorVisited.has(`${MILESTONE_ALTAR_LINE}:${col}`));

export const chapter2Lessons: LessonDef[] = [
  {
    id: 5,
    chapter: 2,
    title: 'Briarpath Crossing',
    subtitle: 'Leap by Words',
    mapLabel: 'BRIARPATH',
    unlocks: ['w', 'b', 'e'],
    prerequisite: 4,
    story: 'A hedgerow maze blocks the road. The briars snag your cloak when you step one letter at a time. A gardener shows you a trick: leap by words — the path becomes easy.',
    teach: 'w: move to the start of the next word\nb: move to the start of the previous word\ne: move to the end of the current/next word\n\nFast navigation and pairing with operators (dw, ce).',
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
    story: 'In the Old Oak Library, scrolls are full of punctuation and sticky tokens like tea_time@dawn. An owl librarian whispers: "Sometimes a word is too small. Travel by WORD."',
    teach: 'W: move to start of next WORD (whitespace-separated token)\nB: move to start of previous WORD\nE: move to end of current/next WORD\n\nGreat for code-like strings and symbol-heavy text.',
    scroll: {
      vignette: `  (:::)
  /___\\     Old Oak Library`,
      storyBeat: 'Some texts are full of symbols and punctuation — sticky like sap.\nBig WORD motions leap over them cleanly.',
      newPowerDescription: 'W (next WORD) B (back WORD) E (end of WORD)',
    },
    arena: {
      initialBuffer: `# OLD OAK LIBRARY
#
# Allowed Keys:
#   previous + W B E
#
# QUEST:
#   - Use W/B/E at least 5 times each.
#   - Stand on each rune token: <RUNE_1> <RUNE_2> <RUNE_3>

Scroll of Sticky Symbols:
<RUNE_1>  potion+milk=warm  quest_item:map  hello-world!
<RUNE_2>  (cozy) [cottage] {lantern} <bridge>
<RUNE_3>  dragons? no_thanks.  tea_time@dawn  yay!!!`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) =>
        (ctx.keyCounts['W'] ?? 0) >= 5 &&
        (ctx.keyCounts['B'] ?? 0) >= 5 &&
        (ctx.keyCounts['E'] ?? 0) >= 5,
      gem2: visitedPositions(15),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The owl stamps your passport: "APPROVED: BIG WORD TRAVELER."' },
  },
  {
    id: 7,
    chapter: 2,
    title: 'Milestone Shrine',
    subtitle: 'The Power of Counts',
    mapLabel: 'MILESTONE',
    unlocks: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    prerequisite: 6,
    story: 'A shrine of carved numbers hums beside the road. Each numeral glows warmly, like a candle in stone. A monk says, "A count is a promise. Speak it once, and your feet obey."',
    teach: 'Counts: prefix many motions/commands with a number to repeat them.\n  5j = move down 5 lines\n  3w = jump forward 3 words\n  9l = move right 9 characters\n\nHuge speed gains and fewer keystrokes.',
    scroll: {
      vignette: `    /\\
   /  \\    Milestone Shrine
  /____\\   numbers carved in stone`,
      storyBeat: 'Numbers are not math here — they\'re momentum.\nWhy walk five steps when you can declare five steps?',
      newPowerDescription: '1-9 (count prefix) e.g., 3w = three words forward',
    },
    arena: {
      initialBuffer: `# MILESTONE SHRINE
#
# Allowed Keys:
#   all previous + counts
#
# QUEST:
#   - Perform each at least once: 5j, 7k, 9l, 3w, 2b
#   - Reach the altar [ALTAR] and stand on it.

Path of Carved Numbers:
(1)  pebble pebble pebble pebble pebble
(2)  pebble pebble pebble pebble pebble
(3)  pebble pebble pebble pebble pebble
(4)  pebble pebble pebble pebble pebble
(5)  pebble pebble pebble pebble pebble
(6)  pebble pebble pebble pebble pebble
(7)  pebble pebble pebble pebble pebble
(8)  pebble pebble pebble pebble pebble
(9)  pebble pebble pebble pebble pebble
(10) [ALTAR] a small bowl of gems glows softly`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedAllMilestoneMoves,
      gem2: visitedMilestoneAltar,
      gem3: totalKeystrokesUnder(15),
    },
    award: { text: 'A gem chimes in the bowl. Numbers, it turns out, can be cozy.' },
  },
];
