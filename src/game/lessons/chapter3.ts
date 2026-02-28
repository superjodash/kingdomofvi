import type { LessonDef } from './types.ts';
import { usedKey, totalKeystrokesUnder, bufferMatchesTarget, usedComposed } from '../gemEvaluator.ts';

export const chapter3Lessons: LessonDef[] = [
  {
    id: 8,
    chapter: 3,
    title: "Scribe's Hut",
    subtitle: 'Enter the Runes',
    mapLabel: 'SCRIBE',
    unlocks: ['i', 'a', 'I', 'A', 'o', 'O', 'Esc'],
    prerequisite: 7,
    scroll: {
      vignette: `  ___
 /   \\    Scribe's Hut
 |___|    where ink meets parchment`,
      storyBeat: 'Until now you have only observed. Now you shall write.\nInsert mode lets you add runes to the page.',
      newPowerDescription: 'i/a/I/A/o/O (enter insert mode) Esc (return to normal)',
    },
    arena: {
      initialBuffer: `# SCRIBE'S HUT
#
# Allowed Keys:
#   previous + i a I A o O Esc
#
# QUEST:
#   - Type "hello world" on the blank line below.
#   - Use 'i' to enter insert mode, type, then Esc.

Type here:
`,
      targetBuffer: `# SCRIBE'S HUT
#
# Allowed Keys:
#   previous + i a I A o O Esc
#
# QUEST:
#   - Type "hello world" on the blank line below.
#   - Use 'i' to enter insert mode, type, then Esc.

Type here:
hello world`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: bufferMatchesTarget,
      gem2: totalKeystrokesUnder(25),
      gem3: totalKeystrokesUnder(18),
    },
    award: { text: 'Your first runes glow on the page. The scribe smiles warmly.' },
  },
  {
    id: 9,
    chapter: 3,
    title: "Blade's Edge",
    subtitle: 'Cut and Strike',
    mapLabel: 'BLADE',
    unlocks: ['x', 'r'],
    prerequisite: 8,
    scroll: {
      vignette: `   /|
  / |     Blade's Edge
 /__|     swift cuts, precise strikes`,
      storyBeat: 'x strikes a single rune away. r replaces it with another.\nPrecision over power.',
      newPowerDescription: 'x (delete char) r (replace char)',
    },
    arena: {
      initialBuffer: `# BLADE'S EDGE
#
# Allowed Keys:
#   previous + x r
#
# QUEST:
#   - Fix the typos below using x and r.

The quicx brown foz jumps over the lasy dog.
Vim is awwsome and efficeint.`,
      targetBuffer: `# BLADE'S EDGE
#
# Allowed Keys:
#   previous + x r
#
# QUEST:
#   - Fix the typos below using x and r.

The quick brown fox jumps over the lazy dog.
Vim is awesome and efficient.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: bufferMatchesTarget,
      gem2: usedKey('r', 3),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'Each stroke was precise. The blade approves.' },
  },
  {
    id: 10,
    chapter: 3,
    title: "Quill's Grace",
    subtitle: 'Delete and Change',
    mapLabel: 'QUILL',
    unlocks: ['d', 'c'],
    prerequisite: 9,
    scroll: {
      vignette: `   ~
  /|\\     Quill's Grace
  |||     delete with purpose, change with grace`,
      storyBeat: 'The quill does more than write—it can erase and rewrite.\nd deletes, c changes (deletes then inserts).',
      newPowerDescription: 'd (delete operator) c (change operator)',
    },
    arena: {
      initialBuffer: `# QUILL'S GRACE
#
# Allowed Keys:
#   previous + d c
#
# QUEST:
#   - Delete the WRONG words and change the BAD words.

This is a WRONG sentence that needs WRONG fixing.
The BAD weather is quite BAD today.`,
      targetBuffer: `# QUILL'S GRACE
#
# Allowed Keys:
#   previous + d c
#
# QUEST:
#   - Delete the WRONG words and change the BAD words.

This is a sentence that needs fixing.
The nice weather is quite nice today.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: bufferMatchesTarget,
      gem2: usedComposed('dw', 1),
      gem3: totalKeystrokesUnder(40),
    },
    award: { text: 'The quill dances in your hand. Delete and change are yours.' },
  },
  {
    id: 11,
    chapter: 3,
    title: 'Tailor\'s Workshop',
    subtitle: 'Cut and Sew',
    mapLabel: 'CUT&SEW',
    unlocks: ['y', 'p', 'P'],
    prerequisite: 10,
    scroll: {
      vignette: `  [===]
  | S |    Tailor's Workshop
  [===]    copy and paste with care`,
      storyBeat: 'The tailor copies patterns (yank) and pastes them elsewhere.\ny yanks, p pastes after, P pastes before.',
      newPowerDescription: 'y (yank/copy) p (paste after) P (paste before)',
    },
    arena: {
      initialBuffer: `# TAILOR'S WORKSHOP
#
# Allowed Keys:
#   previous + y p P
#
# QUEST:
#   - Copy the pattern line and paste it below.

Pattern: =--=--=--=--=
(paste the pattern here)`,
      targetBuffer: `# TAILOR'S WORKSHOP
#
# Allowed Keys:
#   previous + y p P
#
# QUEST:
#   - Copy the pattern line and paste it below.

Pattern: =--=--=--=--=
(paste the pattern here)
=--=--=--=--=`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: bufferMatchesTarget,
      gem2: usedKey('y', 2),
      gem3: totalKeystrokesUnder(15),
    },
    award: { text: 'A perfect copy! The tailor nods with pride.' },
  },
];
