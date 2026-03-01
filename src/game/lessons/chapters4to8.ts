import type { LessonDef } from './types.ts';
import { usedKey, totalKeystrokesUnder, usedComposed, bufferMatchesTarget } from '../gemEvaluator.ts';

// Chapter 4 — Mirror Woods (12-14)
const chapter4: LessonDef[] = [
  {
    id: 12,
    chapter: 4,
    title: 'Lantern Grove',
    subtitle: 'Seek the Word',
    mapLabel: 'LANTERN',
    unlocks: ['/', 'n', 'N'],
    prerequisite: 11,
    story: 'In a misty grove, lanterns glow whenever you say their name. A ranger explains: "Don\'t wander. Search. Let the forest bring the matches to you."',
    teach: '/text + Enter: search forward for text\nn: next match\nN: previous match\n\nFast navigation and batch edits when combined with c/d and dot.',
    scroll: {
      vignette: `   .-.
  (   )   Lantern Grove
   \`-'    where words glow in the dark`,
      storyBeat: 'In the woods, you don\'t wander — you search.\nName the thing you want, and your feet follow.',
      newPowerDescription: '/ (search forward) n (next match) N (previous match)',
    },
    arena: {
      initialBuffer: `# LANTERN GROVE
#
# Allowed Keys:
#   previous + / n N
#
# QUEST:
#   - Search for "LANTERN" using /LANTERN
#   - Use n at least 5 times.
#   - Use N at least 2 times.
#   - Land on: [FOUND THE GOLDEN LANTERN]

Forest Notes:
mushroom  acorn  fern  moss
LANTERN  (a small one)  pebble
soft rain, sleepy birds
acorn  fern  LANTERN  (a bright one)
moss and tea and a warm scarf
LANTERN (a tiny one) hidden behind a stone
a rabbit sneezes politely
LANTERN (a golden one) shines at the path's end
[FOUND THE GOLDEN LANTERN]

(Optional practice)
Search for acorn, then hop matches with n.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('/', 1),
      gem2: usedKey('n', 5),
      gem3: usedKey('N', 2),
    },
    award: { text: 'The golden lantern warms your fingertips. You can find things now.' },
  },
  {
    id: 13,
    chapter: 4,
    title: 'Foxglove Fence',
    subtitle: 'Find on the Line',
    mapLabel: 'FOXGLOVE',
    unlocks: ['f', 'F', 't', 'T', ';', ','],
    prerequisite: 12,
    story: 'A fox in a knitted scarf guards a long fence of painted letters. "On a single line," it says, "you can hop straight to the character you want."',
    teach: 'f{char}: find next char on the line, land on it\nF{char}: find previous char on the line\nt{char}: find next char but land just before it\nT{char}: find previous char but land just after it\n;: repeat last f/F/t/T in same direction\n,: repeat last f/F/t/T in opposite direction',
    scroll: {
      vignette: `  |\\/|      Foxglove Fence
  |  |      where letters hide behind letters`,
      storyBeat: 'Sometimes you only need a tiny jump — on the same line.\nFind the letter. Hop to it. Repeat politely.',
      newPowerDescription: 'f/F (find char) t/T (till char) ;/, (repeat)',
    },
    arena: {
      initialBuffer: `# FOXGLOVE FENCE
#
# Allowed Keys:
#   previous + f F t T ; ,
#
# QUEST:
#   - On each line below, land on the target marked [X].
#   - Use f at least 5 times.
#   - Use t at least 3 times.
#   - Use ; at least 5 times.
#   - Use , at least 2 times.

A) foxglove--fence--fun--[X]--friends
B) teacups, tinycakes, tangerines, [X] jam
C) ribbon(rattle)rustle[r]... now find [X]!
D) one-two-three-four-five-six-[X]-eight
E) zipper zippy zaps [X] zoom

(Extra practice lines:)
F) find this X -> ..........X..........
G) to this X  -> ..........X..........`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('f', 5),
      gem2: usedKey(';', 5),
      gem3: usedKey(',', 2),
    },
    award: { text: 'A fox nods at you: "Good hops. Very precise."' },
  },
  {
    id: 14,
    chapter: 4,
    title: 'Echo Clearing',
    subtitle: 'Do It Again',
    mapLabel: 'ECHO',
    unlocks: ['.'],
    prerequisite: 13,
    story: 'In a clearing, birds repeat your whistle perfectly. A druid smiles: "If you did it once, the forest can echo it. Vim can too."',
    teach: '.: repeat the last change (last editing command)\n\nOne good edit becomes many. Classic pattern:\n/pattern -> edit once -> n -> . -> n -> .',
    scroll: {
      vignette: `  (())
 ( .. )    Echo Clearing
  (())     where actions repeat like birdsong`,
      storyBeat: 'You don\'t have to do the same work twice.\nIf you did it once, you can echo it.',
      newPowerDescription: '. (repeat last change)',
    },
    arena: {
      initialBuffer: `# ECHO CLEARING
#
# Allowed Keys:
#   previous + .
#
# QUEST:
#   - Replace every "sad" with "glad" using ONE manual change, then repeat with .
#   - Replace every "mud" with "tea" the same way.
#
# Tip: /sad -> change once -> n . n .

A little poem (currently grumpy):
sad clouds drift over mud puddles
sad frogs sip mud soup
sad squirrels complain about mud
sad birds wish for tea
sad hearts can learn to be glad

(Optional cozy bonus)
Turn "wish" into "sip" everywhere using the same echo trick.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('.', 2),
      gem2: usedKey('.', 8),
      gem3: totalKeystrokesUnder(40),
    },
    award: { text: 'The clearing echoes back your confidence. You grin. The poem does too.' },
  },
];

// Chapter 5 — Artisan's Forge (15-17) — Insert mode
const chapter5: LessonDef[] = [
  {
    id: 15,
    chapter: 5,
    title: 'Gate of Two Minds',
    subtitle: 'Normal and Insert',
    mapLabel: 'TWO MINDS',
    unlocks: ['i', 'Esc'],
    prerequisite: 14,
    story: 'A stone gate has two masks carved into it: one for walking, one for writing. The Gatekeeper offers you a muffin and says, "Most travelers fail because they forget which mind they\'re in."',
    teach: 'Normal mode: keys move/command\nInsert mode: keys type text\ni: enter Insert mode (insert before cursor)\nEsc: return to Normal mode (safe/home)\n\nThis is the central concept of vi/vim.',
    scroll: {
      vignette: `  __||__     Gate of Two Minds
 [__  __]    WALK or WRITE
    ||`,
      storyBeat: 'In Normal, you travel. In Insert, you write.\nKnow which mind you wear.',
      newPowerDescription: 'i (enter insert mode) Esc (return to normal)',
    },
    arena: {
      initialBuffer: `# GATE OF TWO MINDS
#
# Allowed Keys:
#   previous + i Esc
#
# QUEST:
#   - Enter Insert mode with i, type the missing words, then return with Esc.
#   - Fill all blanks [____] correctly.
#   - Switch modes at least 6 times.
#
# Cozy rule: If you get lost, press Esc. It is always home.

The Gatekeeper's Riddle:
In Normal mode, you [____].
In Insert mode, you [____].

Tiny Story:
Max the traveler holds a [____] and a [____].
(Choose: lantern, quill, map, muffin)

Optional silly line:
I came to write, not to [____].`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) => ctx.modeChanges >= 4,
      gem2: (ctx) => ctx.modeChanges >= 6,
      gem3: totalKeystrokesUnder(50),
    },
    award: { text: 'The Gate opens with a gentle click. The Gatekeeper offers you a muffin.' },
  },
  {
    id: 16,
    chapter: 5,
    title: "Blacksmith's Anvil",
    subtitle: 'Append Like a Pro',
    mapLabel: 'ANVIL',
    unlocks: ['a', 'A', 'I'],
    prerequisite: 15,
    story: 'At a warm forge, a blacksmith stamps labels onto cozy goods: cloaks, kettles, and cocoa mugs. They teach you three ways to start writing without fuss — at the right spot, every time.',
    teach: 'a: enter Insert mode after cursor (append)\nA: enter Insert mode at end of line\nI: enter Insert mode at first non-blank char\n\nFaster than moving + i; reduces keystrokes.',
    scroll: {
      vignette: `  (____)     Blacksmith's Anvil
  /|  |\\     add where it matters`,
      storyBeat: 'Sometimes you don\'t want to start writing — just append.\nDifferent doors for different starts.',
      newPowerDescription: 'a (append) A (append end of line) I (insert at first char)',
    },
    arena: {
      initialBuffer: `# BLACKSMITH'S ANVIL
#
# Allowed Keys:
#   previous + a A I
#
# QUEST:
#   - Add "VERY " before each adjective (use I).
#   - Add "!" to the end of each line (use A).
#   - Add <3 after "cloak" (use a).
#   - Each of a/A/I must be used at least twice.

Shop Labels (broken):
    sword -> sharp
    shield -> sturdy
    kettle -> whistly
    cloak -> cozy

Instructions:
- Add "VERY " before each adjective (use I)
- Add "!" to the end of each label (use A)
- Add a tiny heart <3 after "cloak" (use a)`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('a', 1),
      gem2: (ctx) =>
        (ctx.keyCounts['a'] ?? 0) >= 2 &&
        (ctx.keyCounts['A'] ?? 0) >= 2 &&
        (ctx.keyCounts['I'] ?? 0) >= 2,
      gem3: totalKeystrokesUnder(40),
    },
    award: { text: 'A hammer taps in applause. Your inserts land exactly where they should.' },
  },
  {
    id: 17,
    chapter: 5,
    title: 'Trapdoor Tavern',
    subtitle: 'Open New Lines',
    mapLabel: 'TRAPDOOR',
    unlocks: ['o', 'O'],
    prerequisite: 16,
    story: 'The Trapdoor Tavern is loud with laughter and spoon-clinks. The bartender needs to add menu items quickly. "Don\'t squeeze words between lines," they say. "Open fresh space like pulling a chair up to the table."',
    teach: 'o: open new line below and enter Insert mode\nO: open new line above and enter Insert mode\n\nInsert new lines without manual line breaks.',
    scroll: {
      vignette: `  ____       Trapdoor Tavern
 /____\\      where new lines appear
 | [] |`,
      storyBeat: 'Need a fresh line for a fresh thought?\nOpen one below, or one above.',
      newPowerDescription: 'o (open line below) O (open line above)',
    },
    arena: {
      initialBuffer: `# TRAPDOOR TAVERN
#
# Allowed Keys:
#   previous + o O
#
# QUEST:
#   - Insert three new menu items using o and O.
#   - Use o at least 3 times and O at least 2 times.
#   - Keep the list in alphabetical order.

TAVERN MENU (alphabetical):
- Apple tart
- Bread bowl stew
- Cocoa (extra marshmallow)
- Tea (with honey)

Add these items:
- Berry jam toast
- Carrot cake
- Cozy porridge

Optional cozy chatter:
"If you add a line, add a smile."`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('o', 3),
      gem2: usedKey('O', 2),
      gem3: totalKeystrokesUnder(50),
    },
    award: { text: 'The bartender slides a tiny mug toward you: "For your excellent line-opening."' },
  },
];

// Chapter 6 — Time Mage's Archives (18-19)
const chapter6: LessonDef[] = [
  {
    id: 18,
    chapter: 6,
    title: 'Hourglass Hall',
    subtitle: 'Undo and Redo',
    mapLabel: 'HOURGLASS',
    unlocks: ['u', 'Ctrl+r'],
    prerequisite: 17,
    story: 'You enter a quiet hall of hourglasses. A Time Mage offers you a scarf and says, "Edits are not permanent. Time can be rewound — then replayed."',
    teach: 'u: undo the last change\nCtrl-r: redo (reverse an undo)\n\nFearless editing and experimentation.',
    scroll: {
      vignette: `   _O_        Hourglass Hall
  /   \\       time is editable
  \\___/`,
      storyBeat: 'Mistakes are not doom. They\'re just drafts.\nTurn back time with u. Step forward with Ctrl-r.',
      newPowerDescription: 'u (undo) Ctrl+r (redo)',
    },
    arena: {
      initialBuffer: `# HOURGLASS HALL
#
# Allowed Keys:
#   previous + u Ctrl-r
#
# QUEST:
#   - Make 5 intentional edits (any mix of x, r, c, o, etc.).
#   - Undo at least 3 of them with u.
#   - Redo at least 2 of them with Ctrl-r.
#   - End with the sentence exactly:
#       Time is a cozy loop.
#
# Tip: Be playful -- make silly mistakes on purpose.

Sentence (start here):
Time is a cozi loop.

Play area (make harmless mistakes here):
- muffins are time machines
- cats are time wizards
- tea is a soft clock`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('u', 3),
      gem2: (ctx) => (ctx.keyCounts['Ctrl+r'] ?? 0) >= 2,
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The Time Mage bows. "You are courteous to causality."' },
  },
  {
    id: 19,
    chapter: 6,
    title: 'The Safe Word',
    subtitle: 'Write the Scroll',
    mapLabel: 'LEDGER',
    unlocks: [],
    prerequisite: 18,
    story: 'A small room holds the Royal Ledger — a book that remembers every sealed scroll. A librarian whispers, "Some magic begins with a colon. Write it down, and it stays."',
    teach: ': begins an Ex (command-line) command\n:w write/save\n:e edit/reload\n\nSaving and restoring are essential for real-world editing.',
    scroll: {
      vignette: `  _______     The Safe Word
 /_____ /\\    incantations begin with :
 \\____\\/     the ledger remembers`,
      storyBeat: 'Some magic begins with a colon.\nWriting saves your work to the Royal Ledger.',
      newPowerDescription: ':w (save) :e (reload)',
    },
    arena: {
      initialBuffer: `# THE SAFE WORD
#
# Allowed Keys:
#   previous + :w :e (Enter to submit)
#
# QUEST:
#   - Use :w to seal the scroll at least once.
#   - Use :e to unseal (reload) at least once.
#   - Ensure this exact line exists before your final :w:
#       SEALED BY THE TRAVELER
#
# Suggested flow:
#   1) Add the seal line
#   2) :w
#   3) Make a silly mistake
#   4) :e
#   5) :w again

Royal Ledger Note:
This parchment is unsealed.

Seal line goes here:

Scratch pad (mess this up once):
today's tea: oolong`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey(':', 1),
      gem2: usedKey(':', 3),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'A wax seal appears with a cute little crown imprint. Satisfying.' },
  },
];

// Chapter 7 — Forms & Shapes (20-22)
const chapter7: LessonDef[] = [
  {
    id: 20,
    chapter: 7,
    title: 'Banner Square',
    subtitle: 'Select with Visual',
    mapLabel: 'BANNER',
    unlocks: ['v', 'V'],
    prerequisite: 19,
    story: 'At Banner Square, townsfolk hang flags for the Cozy Fair. A tailor says, "To move cloth, you must select it first — see the shape of what you mean."',
    teach: 'v: Visual mode (characterwise selection)\nV: Visual Line mode (select whole lines)\n\nIn Visual mode you can apply operators: d to cut, y to copy, then paste with p/P.',
    scroll: {
      vignette: `  |\\/|       Banner Square
  |  |       where flags are measured`,
      storyBeat: 'Sometimes you need to select what you mean.\nVisual mode helps you see the shape of your intent.',
      newPowerDescription: 'v (visual mode) V (visual line mode)',
    },
    arena: {
      initialBuffer: `# BANNER SQUARE
#
# Allowed Keys:
#   previous + v V
#
# QUEST:
#   - Select the banner text using v at least once and V at least once.
#   - Move the text into the banner frame below.
#   - You may cut (d) and paste (p) to move it.

Loose Banner Text (move this):
WELCOME TO THE COZY FAIR
BRING TEA
BRING FRIENDS

Banner Frame (destination):
+------------------------+
|                        |
|                        |
|                        |
+------------------------+

Tailor note:
"Linewise is the secret to neat banners."`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey('v', 1),
      gem2: usedKey('V', 1),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The crowd cheers softly (as cozy crowds do). The banner flutters proudly.' },
  },
  {
    id: 21,
    chapter: 7,
    title: "Carpenter's Guild",
    subtitle: 'Words as Objects',
    mapLabel: 'CARPENTER',
    unlocks: [],
    prerequisite: 20,
    story: 'In the Carpenter\'s Guild, plank labels must be corrected precisely. A foreman taps a ruler: "Don\'t cut letters. Cut pieces. A word can be a piece."',
    teach: 'Text objects target meaningful chunks.\niw: "inner word" (just the word)\naw: "a word" (word + surrounding space)\n\nUsed with operators:\n  ciw: change inner word\n  daw: delete a word (and its space)\n  yiw: yank inner word',
    scroll: {
      vignette: `  [====]      Carpenter's Guild
  |____|      measure by meaning`,
      storyBeat: 'A carpenter doesn\'t cut "letters." They cut "pieces."\nIn Vim, pieces can be objects like "inner word."',
      newPowerDescription: 'iw/aw (word text objects) with d/c/y',
    },
    arena: {
      initialBuffer: `# CARPENTER'S GUILD
#
# Allowed Keys:
#   previous + text objects: iw aw (with d/c/y)
#
# QUEST:
#   - Fix each typo by changing ONLY the bad word (use ciw).
#   - Yank the word "twice" (yiw) and paste it into COPY.
#
# Tip: Put the cursor on the word -- then ciw.

Plank Labels:
1) This plank is splntered and should be splintered.
2) This plank is crookd and should be crooked.
3) This plank is smoth and should be smooth.

Guild Motto:
"measure twice, cut once"

COPY: __________

Optional practice:
Delete a word neatly with daw:  this_word_should_vanish  please`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) => ctx.totalKeystrokes > 0,
      gem2: usedComposed('ciw', 1),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The foreman hands you a tiny wooden star. It smells like pine.' },
  },
  {
    id: 22,
    chapter: 7,
    title: "The Sculptor's Trial",
    subtitle: 'Quotes and Brackets',
    mapLabel: 'SCULPTOR',
    unlocks: [],
    prerequisite: 21,
    story: 'A sculptor\'s studio is full of parentheses and brackets carved into stone. The sculptor says, "Boundaries are your friends. Carve what\'s inside — leave the rest untouched."',
    teach: 'i" / a": inside/around double quotes\ni) / a): inside/around parentheses\ni] / a]: inside/around square brackets\n\nExamples:\n  ci" change inside quotes\n  da) delete around parentheses\n  yi] yank inside brackets',
    scroll: {
      vignette: `  (())        Sculptor's Trial
  /__\\        carve what's inside`,
      storyBeat: 'A sculptor works within boundaries: quotes, parentheses, brackets.\nYour chisel can target "inside" or "around."',
      newPowerDescription: 'i"/a" i)/a) i]/a] (delimiter text objects)',
    },
    arena: {
      initialBuffer: `# THE SCULPTOR'S TRIAL
#
# Allowed Keys:
#   previous + text objects: i" a" i) a) i] a] (with d/c/y)
#
# QUEST:
#   - Change INSIDE the quotes using ci"
#   - Delete AROUND the parentheses using da)
#   - Yank INSIDE the brackets using yi] and paste after "COPIED:"
#
# Tip: Your cursor can be anywhere inside the object.

Spellbook Snippets:
1) The wizard whispers: "frobnicate the muffin"  (make it: "warm the muffin")
2) Secret aside: (do not read this part)  (remove the entire aside)
3) Treasure list: [gold gem teacup]  -> COPIED:

Optional practice:
Change inside parentheses: (tiny cozy secret)`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: (ctx) => ctx.totalKeystrokes > 0,
      gem2: usedComposed('ci"', 1),
      gem3: totalKeystrokesUnder(30),
    },
    award: { text: 'The sculptor smiles. "You carved meaning, not mess."' },
  },
];

// Chapter 8 — Workflow Halls + Castle of Exit (23-26)
const chapter8: LessonDef[] = [
  {
    id: 23,
    chapter: 8,
    title: 'Hall of Windows',
    subtitle: 'Split the View',
    mapLabel: 'WINDOWS',
    unlocks: [],
    prerequisite: 22,
    story: 'You enter a hall lined with glowing windows — each shows a different scroll at the same time. A steward says, "A royal editor keeps two thoughts on the table. Split the hall. Walk between panes."',
    teach: ':split create a horizontal split (stacked windows)\n:vsplit create a vertical split (side-by-side)\nCtrl-w + h/j/k/l: move between windows\n\nCompare and edit multiple things without leaving your workspace.',
    scroll: {
      vignette: `  []  []      Hall of Windows
  []__[]      many views, one mind`,
      storyBeat: 'Sometimes you want two scrolls at once.\nSplit the hall. Walk between panes.',
      newPowerDescription: ':split :vsplit (split windows) Ctrl-w + hjkl (navigate)',
    },
    arena: {
      initialBuffer: `# HALL OF WINDOWS
#
# Allowed Keys:
#   previous + :split :vsplit
#   Ctrl-w + h/j/k/l
#
# QUEST:
#   - Create one horizontal split and one vertical split.
#   - Move to each window at least once using Ctrl-w.
#
# Note: Your UI can simulate splits as panes.

Window Labels (fill these in their correct panes):
TOP:   __________________
LEFT:  __________________
RIGHT: __________________

Optional cozy prompt:
Write a tiny note in each pane about what you see.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey(':', 1),
      gem2: usedKey(':', 3),
      gem3: null,
    },
    award: { text: 'The windows sparkle. You can think in two places at once now. Cozy.' },
  },
  {
    id: 24,
    chapter: 8,
    title: 'Scroll Vaults',
    subtitle: 'Buffers and the :ls Lantern',
    mapLabel: 'VAULTS',
    unlocks: [],
    prerequisite: 23,
    story: 'A vault keeper shows you shelves of scrolls. "You can\'t hold every scroll open at once," they say. "But you can list them, step through them, and retire drafts politely."',
    teach: 'Buffers are open files/scrolls.\n:ls list open buffers\n:bnext next buffer\n:bprev previous buffer\n:bd delete/close current buffer\n\nReal projects involve multiple files.',
    scroll: {
      vignette: `  ______      Scroll Vaults
 /_____/\\     many scrolls, neatly stacked
 \\_____\\/`,
      storyBeat: 'A kingdom has many scrolls. Not all can be on the table.\nLearn to list them, switch them, and retire drafts politely.',
      newPowerDescription: ':ls :bnext :bprev :bd (buffer commands)',
    },
    arena: {
      initialBuffer: `# SCROLL VAULTS
#
# Allowed Keys:
#   previous + :ls :bnext :bprev :bd
#
# QUEST:
#   - Use :ls at least once.
#   - Use :bnext and :bprev to visit buffers.
#   - Close a buffer with :bd.

FINAL_SCROLL:
I CAN JUGGLE SCROLLS

Vault note:
Practice cycling through your buffers.`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey(':', 1),
      gem2: usedKey(':', 4),
      gem3: null,
    },
    award: { text: 'The vault keeper gives you a tiny brass key that is somehow also a bookmark.' },
  },
  {
    id: 25,
    chapter: 8,
    title: 'The Final Gate',
    subtitle: 'Quit Like Royalty',
    mapLabel: 'FINAL GATE',
    unlocks: [],
    prerequisite: 24,
    story: 'A final gate stands before the castle, with two doorways: one polite, one dramatic. A guard whispers: "Know whether you\'re carrying a candle. Save and leave... or flee without a trace."',
    teach: ':wq write (save) and quit\n:q! quit without saving (force)\nZZ (optional): save and quit shortcut\n\nLeaving correctly is part of proficiency.',
    scroll: {
      vignette: `  __||__     The Final Gate
 [__  __]    exits are choices
    ||`,
      storyBeat: 'To leave a room, you must know whether you\'re carrying a candle.\nSave and exit politely — or flee dramatically.',
      newPowerDescription: ':wq (save & quit) :q! (force quit)',
    },
    arena: {
      initialBuffer: `# THE FINAL GATE
#
# Allowed Keys:
#   previous + :wq :q! (optional ZZ)
#
# QUEST:
#   - Perform a "polite exit" using :wq after making a small edit.
#   - Re-enter and perform a "dramatic exit" using :q! after an unwanted edit.

Polite Exit Checklist:
- Add a period to the end of this sentence:
  I exit with grace

Dramatic Exit Checklist:
- Intentionally change a word in this sentence:
  I will not save this mistake
- Then :q! to abandon it`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: usedKey(':', 1),
      gem2: usedKey(':', 3),
      gem3: null,
    },
    award: { text: 'The gate swings open. The hinges whisper: "Well done."' },
  },
  {
    id: 26,
    chapter: 8,
    title: 'Castle of VI',
    subtitle: 'The Royal Proclamation',
    mapLabel: 'CASTLE',
    unlocks: [],
    prerequisite: 25,
    story: 'At last, the castle. The Royal Proclamation is damaged — smudged, mis-capitalized, sprinkled with tiny errors. Restore it using everything you\'ve learned — calmly, cleverly, cozily.',
    teach: 'Mastery: no new keys.\nCombine: search + next (/, n), repeat (.), operators + motions (dw, c$),\ntext objects (ci", da), counts (5j, 3w), then finish with :wq.',
    scroll: {
      vignette: `   |>>>
  /___\\       Castle of VI
  |[][]|`,
      storyBeat: 'At last, the castle. Restore the proclamation.\nThe Cozy Crown is counting on your keystrokes.',
      newPowerDescription: 'All unlocked abilities — mastery test',
    },
    arena: {
      initialBuffer: `# CASTLE OF VI -- FINAL EXAM
#
# Allowed Keys:
#   All unlocked abilities are permitted.
#   (Still no mouse.)
#
# QUEST (Minimum):
#   - Make the proclamation EXACTLY match the TARGET below.
#   - Save and exit with :wq.
#
# 2-GEM:
#   - Use search (/) and repeat (.) at least once each.
#   - Use at least one operator + motion combo (dw, c$, etc.)
#
# 3-GEM (Royal Rating):
#   - Use a text object edit (ci", da), etc.)
#   - Use a counted motion (5j, 3w)
#   - Use dot-repeat for a repeated fix

--- BROKEN PROCLAMATION (fix this) ---

Hear ye, hear ye!
By order of the cozy crown, all citizens must drink TEA at dawn.
Any who spill the tea shall be punished with ... a gentle towel.  (oops)

The royal motto is: "measure twice, cUt once"
The royal snack list: [muffin, jam, cocoa]

Signed,
Max the traVelr
Keeper of the Lantern, Friend of Cats

--- TARGET (what it must become) ---

Hear ye, hear ye!
By order of the Cozy Crown, all citizens must drink tea at dawn.
Any who spill the tea shall be punished with a gentle towel.

The royal motto is: "measure twice, cut once"
The royal snack list: [muffin, jam, cocoa]

Signed,
Max the Traveler
Keeper of the Lantern, Friend of Cats`,
      targetBuffer: `# CASTLE OF VI -- FINAL EXAM
#
# Allowed Keys:
#   All unlocked abilities are permitted.
#   (Still no mouse.)
#
# QUEST (Minimum):
#   - Make the proclamation EXACTLY match the TARGET below.
#   - Save and exit with :wq.
#
# 2-GEM:
#   - Use search (/) and repeat (.) at least once each.
#   - Use at least one operator + motion combo (dw, c$, etc.)
#
# 3-GEM (Royal Rating):
#   - Use a text object edit (ci", da), etc.)
#   - Use a counted motion (5j, 3w)
#   - Use dot-repeat for a repeated fix

--- BROKEN PROCLAMATION (fix this) ---

Hear ye, hear ye!
By order of the Cozy Crown, all citizens must drink tea at dawn.
Any who spill the tea shall be punished with a gentle towel.

The royal motto is: "measure twice, cut once"
The royal snack list: [muffin, jam, cocoa]

Signed,
Max the Traveler
Keeper of the Lantern, Friend of Cats

--- TARGET (what it must become) ---

Hear ye, hear ye!
By order of the Cozy Crown, all citizens must drink tea at dawn.
Any who spill the tea shall be punished with a gentle towel.

The royal motto is: "measure twice, cut once"
The royal snack list: [muffin, jam, cocoa]

Signed,
Max the Traveler
Keeper of the Lantern, Friend of Cats`,
      arrowsAllowed: false,
    },
    gems: {
      gem1: bufferMatchesTarget,
      gem2: (ctx) => (ctx.keyCounts['/'] ?? 0) >= 1 && (ctx.keyCounts['.'] ?? 0) >= 1,
      gem3: (ctx) =>
        (ctx.keyCounts['/'] ?? 0) >= 1 &&
        (ctx.keyCounts['.'] ?? 0) >= 1 &&
        ctx.totalKeystrokes <= 50,
    },
    award: { text: 'The throne room glows. The cats of Home Row parade in tiny capes. You are hereby titled: Royal Editor of VI.' },
  },
];

export const chapters4to8Lessons: LessonDef[] = [
  ...chapter4,
  ...chapter5,
  ...chapter6,
  ...chapter7,
  ...chapter8,
];
