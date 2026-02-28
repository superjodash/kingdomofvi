import type { LessonDef } from './types.ts';
import { usedKey, totalKeystrokesUnder, bufferMatchesTarget, usedComposed } from '../gemEvaluator.ts';

// Chapter 4 — Mirror Woods (12-14)
const chapter4: LessonDef[] = [
  {
    id: 12, chapter: 4, title: 'Seeking Glade', subtitle: 'Search the Page',
    mapLabel: 'SEEK', unlocks: ['/'], prerequisite: 11,
    scroll: { vignette: '  ?   Seeking Glade', storyBeat: 'Search for patterns with / and find your way.', newPowerDescription: '/ (search forward)' },
    arena: { initialBuffer: '# SEEKING GLADE\n# Use / to search.\n# QUEST: Find the word "treasure" below.\n\nThe forest hides many things.\nBehind the old tree is a treasure chest.\nInside you find a golden key.', arrowsAllowed: false },
    gems: { gem1: usedKey('/', 1), gem2: totalKeystrokesUnder(15), gem3: null },
    award: { text: 'You found it! The search spell is powerful.' },
  },
  {
    id: 13, chapter: 4, title: 'Find-Char Falls', subtitle: 'Leap to a Letter',
    mapLabel: 'FIND', unlocks: ['f', 'F', 't', 'T', ';', ','], prerequisite: 12,
    scroll: { vignette: '  ~~  Find-Char Falls', storyBeat: 'f leaps forward to a character. F leaps backward.', newPowerDescription: 'f/F (find char) t/T (till char) ;/, (repeat)' },
    arena: { initialBuffer: '# FIND-CHAR FALLS\n# Use f/F/t/T to jump to characters.\n# QUEST: Navigate using find commands.\n\nThe quick brown fox jumps over the lazy dog.\nA-B-C-D-E-F-G-H-I-J-K-L-M-N-O-P', arrowsAllowed: false },
    gems: { gem1: usedKey('f', 3), gem2: usedKey(';', 1), gem3: totalKeystrokesUnder(20) },
    award: { text: 'Precise leaps! The waterfall applauds.' },
  },
  {
    id: 14, chapter: 4, title: 'Echo Chamber', subtitle: 'The Dot Repeats',
    mapLabel: 'REPEAT', unlocks: ['.', 'n', 'N'], prerequisite: 13,
    scroll: { vignette: '  ...  Echo Chamber', storyBeat: '. repeats your last change. n/N repeat your last search.', newPowerDescription: '. (repeat last change) n/N (next/prev search match)' },
    arena: { initialBuffer: '# ECHO CHAMBER\n# Use . to repeat edits and n/N for searches.\n# QUEST: Delete all "TODO" markers.\n\nTODO: fix this\nThis is fine.\nTODO: and this\nAlso fine.\nTODO: last one', arrowsAllowed: false },
    gems: { gem1: usedKey('.', 2), gem2: usedKey('n', 1), gem3: totalKeystrokesUnder(25) },
    award: { text: 'The echo fades. Efficiency is your song now.' },
  },
];

// Chapter 5 — Artisan's Forge (15-17)
const chapter5: LessonDef[] = [
  {
    id: 15, chapter: 5, title: "Yank Master's Bench", subtitle: 'Copy with Precision',
    mapLabel: 'YANK', unlocks: [], prerequisite: 14,
    scroll: { vignette: '  [Y]  Yank Master', storyBeat: 'Combine yank with motions for precise copying.', newPowerDescription: 'Yank + motions (yw, y$, etc.)' },
    arena: { initialBuffer: '# YANK MASTER\n# QUEST: Copy words and lines precisely.\n\nfirst second third\nalpha beta gamma', arrowsAllowed: false },
    gems: { gem1: usedComposed('yy', 1), gem2: usedKey('p', 2), gem3: totalKeystrokesUnder(20) },
    award: { text: 'Copied with the precision of a master artisan.' },
  },
  {
    id: 16, chapter: 5, title: 'Paste Palace', subtitle: 'Place with Purpose',
    mapLabel: 'PASTE', unlocks: [], prerequisite: 15,
    scroll: { vignette: '  [P]  Paste Palace', storyBeat: 'p pastes after, P pastes before. Master both.', newPowerDescription: 'p/P mastery with operators' },
    arena: { initialBuffer: '# PASTE PALACE\n# QUEST: Rearrange the lines.\n\nLine C\nLine A\nLine B', arrowsAllowed: false },
    gems: { gem1: (ctx) => ctx.totalKeystrokes > 0, gem2: usedKey('p', 1), gem3: totalKeystrokesUnder(15) },
    award: { text: 'Everything in its right place.' },
  },
  {
    id: 17, chapter: 5, title: 'Register Vault', subtitle: 'Named Registers',
    mapLabel: 'REGISTER', unlocks: [], prerequisite: 16,
    scroll: { vignette: '  [R]  Register Vault', storyBeat: 'For now, master the unnamed register through practice.', newPowerDescription: 'Register mastery through practice' },
    arena: { initialBuffer: '# REGISTER VAULT\n# QUEST: Practice yank, delete, and paste combinations.\n\nAAAA BBBB CCCC DDDD\n1111 2222 3333 4444', arrowsAllowed: false },
    gems: { gem1: (ctx) => ctx.totalKeystrokes > 0, gem2: usedKey('y', 1), gem3: totalKeystrokesUnder(20) },
    award: { text: 'The vault remembers all. So do you.' },
  },
];

// Chapter 6 — Time Mage's Archives (18-19)
const chapter6: LessonDef[] = [
  {
    id: 18, chapter: 6, title: "Time Mage's Study", subtitle: 'Undo the Past',
    mapLabel: 'UNDO', unlocks: ['u'], prerequisite: 17,
    scroll: { vignette: '  [u]  Time Mage', storyBeat: 'u undoes the last change. Time itself bends to your will.', newPowerDescription: 'u (undo)' },
    arena: { initialBuffer: '# TIME MAGE\n# QUEST: Make changes then undo them.\n\nThis text is perfect.\nDo not change it permanently.', arrowsAllowed: false },
    gems: { gem1: usedKey('u', 3), gem2: totalKeystrokesUnder(20), gem3: null },
    award: { text: 'Time bows to your command.' },
  },
  {
    id: 19, chapter: 6, title: 'Redo Springs', subtitle: 'Forward Through Time',
    mapLabel: 'REDO', unlocks: ['Ctrl+r'], prerequisite: 18,
    scroll: { vignette: '  [^R]  Redo Springs', storyBeat: 'Ctrl-r redoes what was undone. Balance in all things.', newPowerDescription: 'Ctrl+r (redo)' },
    arena: { initialBuffer: '# REDO SPRINGS\n# QUEST: Undo then redo changes.\n\nOriginal text here.\nMore original text.', arrowsAllowed: false },
    gems: { gem1: usedKey('u', 1), gem2: (ctx) => (ctx.keyCounts['Ctrl+r'] ?? 0) >= 1, gem3: null },
    award: { text: 'Past and future are yours to navigate.' },
  },
];

// Chapter 7 — Forms & Shapes (20-22)
const chapter7: LessonDef[] = [
  {
    id: 20, chapter: 7, title: 'Visual Courtyard', subtitle: 'Select and Act',
    mapLabel: 'VISUAL', unlocks: ['v'], prerequisite: 19,
    scroll: { vignette: '  [v]  Visual Courtyard', storyBeat: 'v enters visual mode. Select text, then act on it.', newPowerDescription: 'v (visual mode)' },
    arena: { initialBuffer: '# VISUAL COURTYARD\n# QUEST: Select and delete text using visual mode.\n\nSelect THIS PART and delete it.\nKeep this line intact.', arrowsAllowed: false },
    gems: { gem1: usedKey('v', 1), gem2: usedKey('d', 1), gem3: totalKeystrokesUnder(15) },
    award: { text: 'Your selections are precise as a jeweler\'s eye.' },
  },
  {
    id: 21, chapter: 7, title: 'Line Gallery', subtitle: 'Select Whole Lines',
    mapLabel: 'VIS-LINE', unlocks: ['V'], prerequisite: 20,
    scroll: { vignette: '  [V]  Line Gallery', storyBeat: 'V selects entire lines. Efficient for big changes.', newPowerDescription: 'V (visual line mode)' },
    arena: { initialBuffer: '# LINE GALLERY\n# QUEST: Select and delete whole lines.\n\nKeep this.\nDELETE THIS LINE\nKeep this too.\nDELETE THIS LINE TOO\nAnd keep this.', arrowsAllowed: false },
    gems: { gem1: usedKey('V', 1), gem2: usedKey('d', 1), gem3: totalKeystrokesUnder(20) },
    award: { text: 'Whole lines bend to your will.' },
  },
  {
    id: 22, chapter: 7, title: 'Text Object Temple', subtitle: 'Inner and Around',
    mapLabel: 'TEXTOBJ', unlocks: [], prerequisite: 21,
    scroll: { vignette: '  {i}  Text Object Temple', storyBeat: 'Text objects let you act on words, quotes, parens.\ndiw deletes inner word. da" deletes around quotes.', newPowerDescription: 'iw/aw, i"/a", i)/a), i]/a] (text objects)' },
    arena: { initialBuffer: '# TEXT OBJECT TEMPLE\n# QUEST: Use text objects to edit.\n\nChange the "old word" to "new".\nDelete (this part) completely.\nRemove [these brackets] too.', arrowsAllowed: false },
    gems: { gem1: (ctx) => ctx.totalKeystrokes > 0, gem2: usedComposed('diw', 1), gem3: totalKeystrokesUnder(25) },
    award: { text: 'Text objects are the crown jewels of vim.' },
  },
];

// Chapter 8 — Halls of Workflow + Castle of Exit (23-26)
const chapter8: LessonDef[] = [
  {
    id: 23, chapter: 8, title: 'Split Hall', subtitle: 'Divide the View',
    mapLabel: 'SPLIT', unlocks: [':'], prerequisite: 22,
    scroll: { vignette: '  [||]  Split Hall', storyBeat: ':split and :vsplit divide your view.', newPowerDescription: ':split :vsplit (split windows)' },
    arena: { initialBuffer: '# SPLIT HALL\n# QUEST: Try :split and :vsplit commands.\n\nThis buffer can be viewed in splits.\nTry it out!', arrowsAllowed: false },
    gems: { gem1: usedKey(':', 1), gem2: totalKeystrokesUnder(20), gem3: null },
    award: { text: 'The view multiplies. More windows, more power.' },
  },
  {
    id: 24, chapter: 8, title: 'Buffer Bazaar', subtitle: 'Many Files',
    mapLabel: 'BUFFERS', unlocks: [], prerequisite: 23,
    scroll: { vignette: '  [B]  Buffer Bazaar', storyBeat: ':ls lists buffers. :bnext and :bprev navigate them.', newPowerDescription: ':ls :bnext :bprev :bd (buffer commands)' },
    arena: { initialBuffer: '# BUFFER BAZAAR\n# QUEST: Practice buffer commands.\n\nUse :ls to see your buffers.\nThis is the main buffer.', arrowsAllowed: false },
    gems: { gem1: usedKey(':', 1), gem2: totalKeystrokesUnder(15), gem3: null },
    award: { text: 'You navigate buffers like a seasoned merchant.' },
  },
  {
    id: 25, chapter: 8, title: 'Save Shrine', subtitle: 'Preserve Your Work',
    mapLabel: 'SAVE', unlocks: [], prerequisite: 24,
    scroll: { vignette: '  [:w]  Save Shrine', storyBeat: ':w saves your work. Always save before quitting.', newPowerDescription: ':w (save) :e (reload)' },
    arena: { initialBuffer: '# SAVE SHRINE\n# QUEST: Make a change and save with :w.\n\nEdit this line and save.', arrowsAllowed: false },
    gems: { gem1: usedKey(':', 1), gem2: totalKeystrokesUnder(15), gem3: null },
    award: { text: 'Your work is safe. The shrine glows warmly.' },
  },
  {
    id: 26, chapter: 8, title: 'Castle of Exit', subtitle: 'The Final Gate',
    mapLabel: 'EXIT', unlocks: [], prerequisite: 25,
    scroll: { vignette: '  [ZZ]  Castle of Exit', storyBeat: ':wq saves and quits. :q! quits without saving.\nYou have mastered the Kingdom of VI!', newPowerDescription: ':wq (save & quit) :q! (force quit)' },
    arena: { initialBuffer: '# CASTLE OF EXIT\n# QUEST: Save and quit with :wq.\n\nCongratulations, brave traveler!\nYou have mastered the Kingdom of VI.\n\nType :wq to complete your journey.', arrowsAllowed: false },
    gems: { gem1: usedKey(':', 1), gem2: totalKeystrokesUnder(10), gem3: null },
    award: { text: 'The gates open. You are now a Vi Master. The kingdom celebrates!' },
  },
];

export const chapters4to8Lessons: LessonDef[] = [
  ...chapter4,
  ...chapter5,
  ...chapter6,
  ...chapter7,
  ...chapter8,
];
