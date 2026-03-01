import type { LessonDef } from './types.ts';
import { usedKey, totalKeystrokesUnder, usedComposed } from '../gemEvaluator.ts';

export const chapter3Lessons: LessonDef[] = [
  {
    id: 8,
    chapter: 3,
    title: "Scribe's Camp",
    subtitle: 'Nibble and Replace',
    mapLabel: 'SCRIBE',
    unlocks: ['x', 'r'],
    prerequisite: 7,
    story: 'A camp of apprentice scribes surrounds a crooked sign. They\'re embarrassed — the letters are wrong, and the kettle refuses to boil until the sign is fixed. A mentor offers two tiny tools: nibble and replace.',
    teach: 'x: delete the character under the cursor\nr{char}: replace the character under the cursor with {char}\n\nFast, surgical fixes without rewriting or changing modes.',
    scroll: {
      vignette: `  [==]      Scribe's Camp
 (____)     where mistakes become practice`,
      storyBeat: 'A scribe must erase a smudge and fix a rune.\nNibble one letter, replace one letter.',
      newPowerDescription: 'x (delete char) r (replace char)',
    },
    arena: {
      initialBuffer: `# SCRIBE'S CAMP
#
# Allowed Keys:
#   previous + x r
#
# QUEST:
#   - Use x at least 10 times total.
#   - Use r at least 5 times total.
#   - Repair the sign so it reads exactly:
#       WELCOME, TRAVELER!
#
# Tip: Use r for single-character fixes. Use x if you want a character gone.

CAMP SIGN (broken, slightly sad):
WELC0ME, TRAV3LER!

Camp notes:
- The 0 should become O
- The 3 should become E
- The kettle is judging you kindly.

Practice strip (use x to nibble):
xxxxxx  (delete some x's if you like)`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('x', 5),
      gem2: usedKey('r', 3),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The camp kettle whistles happily. The sign looks proud again.' },
  },
  {
    id: 9,
    chapter: 3,
    title: 'Gutter Alley',
    subtitle: 'Delete with Purpose',
    mapLabel: 'GUTTER',
    unlocks: ['d'],
    prerequisite: 8,
    story: 'You pass through a cluttered alley where flyers flap like startled birds. A tidy raccoon offers a broom and says, "Deletion is polite. Tell it how far to sweep."',
    teach: 'd is an operator: it deletes a range defined by a motion.\n  dw: delete to next word\n  d$: delete to end of line\n  d0: delete back to start of line\n  dd: delete whole line\n\nOperators + motions are the core power pattern.',
    scroll: {
      vignette: `  | | |     Gutter Alley
 (o_o_)     where clutter goes to vanish`,
      storyBeat: 'Deletion is not chaos. It is a polite request:\n"Remove this, as far as I motion."',
      newPowerDescription: 'd (delete operator) + motions: dw d$ d0 dd',
    },
    arena: {
      initialBuffer: `# GUTTER ALLEY
#
# Allowed Keys:
#   previous + d
#
# QUEST:
#   - Perform each at least once: dw, d$, d0
#   - Remove all "TRASH" tokens from the flyer.
#
# Hint: Put your cursor on the T in TRASH, then dw.

--- MARKET FLYER ---
Fresh apples! TRASH Fresh bread! TRASH Warm soup!
TRASH Cozy cloaks! 50% off! TRASH
Lantern oil, TRASH string, buttons, TRASH tiny bells!

Side quest doodle (optional):
trash? no thanks. tidy? yes please.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedComposed('dw', 1),
      gem2: (ctx) =>
        (ctx.composedCounts['dw'] ?? 0) >= 1 &&
        (ctx.composedCounts['d$'] ?? 0) >= 1,
      gem3: totalKeystrokesUnder(40),
    },
    award: { text: 'The alley sighs with relief. Tidiness is a spell, apparently.' },
  },
  {
    id: 10,
    chapter: 3,
    title: 'Chisel Workshop',
    subtitle: 'Change is Courage',
    mapLabel: 'CHISEL',
    unlocks: ['c'],
    prerequisite: 9,
    story: 'A stoneworker invites you to a warm workshop where runes are re-carved into soapstone. They explain: "Sometimes you don\'t just delete — you replace. c is the chisel that clears and lets you write."',
    teach: 'c is an operator like d, but after removing text it enters Insert mode.\n  cw: change a word\n  ce: change to end of word\n  c$: change to end of line\n\nRewrite quickly without manual delete + insert steps.',
    scroll: {
      vignette: `  /\\/\\      Chisel Workshop
 (____)     where words are re-carved`,
      storyBeat: 'Changing is brave: remove the old, write the new.\nThe c operator does both — smooth as butter.',
      newPowerDescription: 'c (change operator) + motions: cw ce c$',
    },
    arena: {
      initialBuffer: `# CHISEL WORKSHOP
#
# Allowed Keys:
#   previous + c
#
# QUEST:
#   - Perform each at least once: cw, ce, c$
#   - Make the recipe read exactly:
#       Add honey, stir gently, and smile.
#
# Tip: Use cw, type the replacement, then press Esc.

--- RECIPE CARD ---
Target: Add honey, stir gently, and smile.

Current: Add mud, stir angrily, and frown.

PRACTICE (optional):
1) Change the next word:   change_me
2) Change to end of line:  please change everything after here -> blah blah
3) Change to word end:     changeme!`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedComposed('cw', 1),
      gem2: (ctx) =>
        (ctx.composedCounts['cw'] ?? 0) >= 1 &&
        (ctx.composedCounts['ce'] ?? 0) >= 1,
      gem3: totalKeystrokesUnder(35),
    },
    award: { text: 'The workshop foreman pats your shoulder. "Nice chiseling. Very gentle."' },
  },
  {
    id: 11,
    chapter: 3,
    title: 'Paste Bazaar',
    subtitle: 'Yank and Offer',
    mapLabel: 'BAZAAR',
    unlocks: ['y', 'p', 'P'],
    prerequisite: 10,
    story: 'A lantern-lit bazaar sells snippets like spices. A merchant winks: "Why write the same thing three times? Take it once, place it many."',
    teach: 'y: yank (copy) text (operator + motion, like yw)\nyy: yank the whole line\np: paste after cursor (or below linewise)\nP: paste before cursor (or above linewise)\n\nReuse/move text quickly; pairs with Visual mode later.',
    scroll: {
      vignette: `  (o) (o)    Paste Bazaar
   \\|/       where snippets are traded`,
      storyBeat: 'To copy is to carry. To paste is to share.\nYank a line like a ribbon — place it neatly.',
      newPowerDescription: 'y (yank/copy) yy (yank line) p (paste after) P (paste before)',
    },
    arena: {
      initialBuffer: `# PASTE BAZAAR
#
# Allowed Keys:
#   previous + y p P
#
# QUEST:
#   - Copy the line labeled [GOOD] and paste it under each [NEED].
#   - Use yy at least once.
#   - Use both p and P at least once.
#
# Hint: yank a whole line with yy, then p pastes below, P pastes above.

[GOOD]  Cozy cocoa: add milk, add honey, stir, enjoy.

[NEED]  Sign A is blank below:
        ________________________________________

[NEED]  Sign B is blank below:
        ________________________________________

[NEED]  Sign C is blank below:
        ________________________________________

Vendor chatter:
- "Copy once, sip twice."
- "Pastes taste better when aligned."`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('y', 2),
      gem2: (ctx) => (ctx.keyCounts['p'] ?? 0) >= 1 && (ctx.keyCounts['P'] ?? 0) >= 1,
      gem3: totalKeystrokesUnder(20),
    },
    award: { text: 'A merchant hands you a sticker: "CERTIFIED SNIPPET COURIER."' },
  },
];
