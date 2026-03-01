import type { LessonDef } from './types.ts';
import { visitedPositions, usedKey, totalKeystrokesUnder } from '../gemEvaluator.ts';

export const chapter1Lessons: LessonDef[] = [
  {
    id: 1,
    chapter: 1,
    title: 'Trailhead Meadow',
    subtitle: 'The First Footsteps',
    mapLabel: 'TRAILHEAD',
    unlocks: ['Enter'],
    prerequisite: null,
    story: 'You wake on a dew-bright page of grass. A wooden signpost stands ahead, its ink still wet. The Kingdom itself seems to be writing around you. Before royal techniques, you must learn how to move at all.',
    teach: 'Arrow keys (training wheels): move the cursor one cell in the direction pressed.\nEnter: confirm/continue/interact.',
    scroll: {
      vignette: `   _/\\_
  /    \\     Trailhead Meadow
  | [] |     where the road begins
  |____|`,
      storyBeat: 'Welcome, traveler. The Kingdom of VI is written in runes, not mouse-clicks.\nFor now, use the old winds (arrow keys) to walk the road.',
      newPowerDescription: 'Arrow keys (training wheels) + Enter',
    },
    arena: {
      initialBuffer: `# TRAILHEAD MEADOW
# The grass is soft. The air smells like parchment.
#
# QUEST:
#   1) Use the arrow keys to move the @ to the ! signpost.
#   2) Press Enter.
#
# (Arrows are training wheels. You'll soon learn the home-row way.)

....................
....@..........!....
....................`,
      arrowsAllowed: true,
    },
    gems: {
      gem1: (ctx) => ctx.totalKeystrokes > 0,
      gem2: totalKeystrokesUnder(25),
      gem3: null,
    },
    award: { text: 'You found the signpost! The road ahead shimmers with possibility.' },
  },
  {
    id: 2,
    chapter: 1,
    title: 'Village of Home Row',
    subtitle: 'Four Winds, One Hand',
    mapLabel: 'HOME ROW',
    unlocks: ['h', 'j', 'k', 'l'],
    prerequisite: 1,
    story: 'The path leads to a sleepy village where cats lounge on sunlit keys. An innkeeper explains that royal scribes never hunt for arrows — their hands stay home, always ready.',
    teach: 'h: move cursor left one character\nj: move cursor down one line\nk: move cursor up one line\nl: move cursor right one character\n\nThese are the core Normal-mode motions used everywhere.',
    scroll: {
      vignette: `   /\\_/\\      Village of Home Row
  ( o.o )     the cats guard the keys
   > ^ <`,
      storyBeat: 'In this village, hands rest on home and never wander.\nFour winds guide you: left, down, up, right.',
      newPowerDescription: 'h (left) j (down) k (up) l (right)',
    },
    arena: {
      initialBuffer: `# VILLAGE OF HOME ROW
# The village cats demand you move properly.
#
# Allowed Keys:
#   h j k l
#
# QUEST:
#   - Use h/j/k/l at least 5 times each.
#   - Visit each bowl marked (1)(2)(3)(4) by placing cursor on it.

+--------------------------------------+
| (1)  Milk Bowl        (2)  Yarn Pile |
|                                      |
|   .........        ............      |
|   .       .        .          .      |
|   .   @   .        .          .      |
|   .       .        .          .      |
|   .........        ............      |
|                                      |
| (3)  Sunbeam         (4)  Fish Tin   |
+--------------------------------------+`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) =>
        (ctx.keyCounts['h'] ?? 0) >= 5 &&
        (ctx.keyCounts['j'] ?? 0) >= 5 &&
        (ctx.keyCounts['k'] ?? 0) >= 5 &&
        (ctx.keyCounts['l'] ?? 0) >= 5,
      gem2: visitedPositions(20),
      gem3: totalKeystrokesUnder(60),
    },
    award: { text: 'The cats nod solemnly. One offers you a tiny ribbon. You feel... proficient.' },
  },
  {
    id: 3,
    chapter: 1,
    title: 'Stonebridge of Lines',
    subtitle: 'To the Start, To the End',
    mapLabel: 'STONEBRIDGE',
    unlocks: ['0', '^', '$'],
    prerequisite: 2,
    story: 'Beyond the village is a stone bridge made of long, narrow slabs — each slab is a line. A bridge-warden insists: "If you can\'t reach the start and end of a line, you\'ll trip forever."',
    teach: '0: jump to the start of the line\n^: jump to the first non-blank character on the line\n$: jump to the end of the line\n\nFast line editing and pairing with operators later (d$, c^).',
    scroll: {
      vignette: `===[====]===     Stonebridge of Lines
   |  |          where lines begin and end`,
      storyBeat: 'Sometimes you must cross a line swiftly — no tiny steps.\nLearn the stones: to the start, to the first rune, to the end.',
      newPowerDescription: '0 (line start) ^ (first char) $ (line end)',
    },
    arena: {
      initialBuffer: `# STONEBRIDGE OF LINES
#
# Allowed Keys:
#   h j k l   0 ^ $
#
# QUEST:
#   - On each line below, land on the * using 0, ^, and $.
#   - Use each of 0 ^ $ at least 5 times.
#
# Tip: 0 goes to column 0. ^ goes to the first non-blank character.
#      Lines with leading spaces show the difference!

     Line A:            *---(end)
          Line B:      *
  Line C:                  *
       Line D:   *
            Line E:                 *
   Line F:        *
         Line G:              *
Line H: *
      Line I:            *
           Line J:                 *`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) =>
        (ctx.keyCounts['0'] ?? 0) >= 5 &&
        (ctx.keyCounts['^'] ?? 0) >= 5 &&
        (ctx.keyCounts['$'] ?? 0) >= 5,
      gem2: visitedPositions(30),
      gem3: totalKeystrokesUnder(50),
    },
    award: { text: 'The bridge hums approvingly. Your boots are now "line-wise."' },
  },
  {
    id: 4,
    chapter: 1,
    title: 'Cliffside Steps',
    subtitle: 'Top and Bottom of the World',
    mapLabel: 'CLIFFSIDE',
    unlocks: ['g', 'G'],
    prerequisite: 3,
    story: 'The road becomes a cliff path with a lookout at the top and a shell-strewn shore far below. A wind-sage laughs: "Some journeys are too long for walking. Learn the page-jumps."',
    teach: 'gg: jump to the top of the file (first line)\nG: jump to the bottom of the file (last line)\n\nInstant travel in big files; later you\'ll use counts like 10G.',
    scroll: {
      vignette: `   /\\            Cliffside Steps
  /  \\           the sky is a page
 /____\\          the sea is the bottom`,
      storyBeat: 'A hero must travel from the first page to the last.\nTwo spells do it in a blink.',
      newPowerDescription: 'gg (go to top) G (go to bottom)',
    },
    arena: {
      initialBuffer: `# CLIFFSIDE STEPS
#
# Allowed Keys:
#   h j k l   0 ^ $   gg G
#
# QUEST:
#   - Jump to the TOP (Line 1) using gg.
#   - Jump to the BOTTOM (last line) using G.
#   - Repeat each at least 3 times.

(1)  TOP OF CLIFF --- Wave hello here.
(2)  A winding path of chalk and thyme...
(3)  ...continues for many lines...
(4)  ...
(5)  ...
(6)  ...
(7)  ...
(8)  ...
(9)  ...
(10) ...
(11) ...
(12) ...
(13) ...
(14) ...
(15) ...
(16) ...
(17) ...
(18) ...
(19) ...
(20) ...
(21) ...
(22) ...
(23) ...
(24) ...
(25) ...
(26) ...
(27) ...
(28) ...
(29) ...
(30) ...
(31) ...
(32) ...
(33) ...
(34) ...
(35) ...
(36) ...
(37) ...
(38) ...
(39) ...
(40) SEA --- pebbles, foam, and a tiny seashell.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('g', 6),
      gem2: usedKey('G', 3),
      gem3: totalKeystrokesUnder(20),
    },
    award: { text: 'You master the page like a hawk masters the wind.' },
  },
];
