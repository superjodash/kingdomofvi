# Kingdom of VI — Lessons (26 Locations)

This is the **expanded** content pack: every location includes **Story**, **Teach**, **Scroll**, a **large lesson buffer**, gem criteria, and award copy.

> Defaults
> - Lessons are keyboard-only. No mouse.
> - Arrow keys are disabled in arenas unless explicitly stated.
> - Previously unlocked keys remain available (and can earn higher gem ratings).

## Chapter 1 — Roads of Motion

### 1) Trailhead Meadow — The First Footsteps
**Chapter:** Roads of Motion  
**Map label:** TRAILHEAD  
**Unlocks:** `← ↑ ↓ →` (map only), `Enter`  
**Prerequisite:** none

#### Story (why you're here)
You wake on a dew-bright page of grass. A wooden signpost stands ahead, its ink still wet. The Kingdom itself seems to be *writing* around you. Before royal techniques, you must learn how to *move* at all.

#### Teach (what the new keys do)
- **Arrow keys (training wheels):** move the cursor one cell in the direction pressed.
- **Enter:** confirm/continue/interact (enter a location, dismiss a scroll, submit a prompt).

#### Scroll (modal)
```text
   _/\\_
  /    \\     Trailhead Meadow
  | [] |     where the road begins
  |____|
```
Welcome, traveler. The Kingdom of VI is written in runes, not mouse-clicks.
For now, use the old winds (arrow keys) to walk the road.

#### Lesson Arena (buffer)
```text
# TRAILHEAD MEADOW
# The grass is soft. The air smells like parchment.
#
# QUEST:
#   1) Use the arrow keys to move the @ to the ! signpost.
#   2) Press Enter.
#
# (Arrows are training wheels. You'll soon learn the home-row way.)

....................
....@..........!....
....................
```

#### Gems (1–3)
- **1 gem:** reach `!` and press Enter
- **2 gems:** do it with few extra moves
- **3 gems:** not offered (warm-up)

#### Award (modal)
You found the signpost! The road ahead shimmers with possibility.

---

### 2) Village of Home Row — Four Winds, One Hand
**Chapter:** Roads of Motion  
**Map label:** HOME ROW  
**Unlocks:** `h j k l`  
**Prerequisite:** 1

#### Story (why you're here)
The path leads to a sleepy village where cats lounge on sunlit keys. An innkeeper explains that royal scribes never hunt for arrows—their hands stay home, always ready.

#### Teach (what the new keys do)
- **`h`**: move cursor **left** one character
- **`j`**: move cursor **down** one line
- **`k`**: move cursor **up** one line
- **`l`**: move cursor **right** one character

Why it matters: these are the core Normal-mode motions used everywhere.

#### Scroll (modal)
```text
   /\\_/\\      Village of Home Row
  ( o.o )     the cats guard the keys
   > ^ <
```
In this village, hands rest on home and never wander.
Four winds guide you: left, down, up, right.

#### Lesson Arena (buffer)
```text
# VILLAGE OF HOME ROW
# The village cats demand you move properly.
#
# Allowed Keys:
#   h j k l
#
# QUEST:
#   - Use h/j/k/l at least 5 times each.
#   - Visit each bowl marked (1)(2)(3)(4) by placing @ on it.

┌──────────────────────────────────────┐
│ (1)  Milk Bowl        (2)  Yarn Pile │
│                                      │
│   .........        ............      │
│   .       .        .          .      │
│   .   @   .        .          .      │
│   .       .        .          .      │
│   .........        ............      │
│                                      │
│ (3)  Sunbeam         (4)  Fish Tin   │
└──────────────────────────────────────┘
```

#### Gems (1–3)
- **1 gem:** `h/j/k/l` used **≥ 5** each
- **2 gems:** also visit all four markers
- **3 gems:** “swift steps” (mostly direct paths)

#### Award (modal)
The cats nod solemnly. One offers you a tiny ribbon. You feel… proficient.

---

### 3) Stonebridge of Lines — To the Start, To the End
**Chapter:** Roads of Motion  
**Map label:** STONEBRIDGE  
**Unlocks:** `0` `^` `$`  
**Prerequisite:** 2

#### Story (why you're here)
Beyond the village is a stone bridge made of long, narrow slabs—each slab is a *line*. A bridge-warden insists: 'If you can’t reach the start and end of a line, you’ll trip forever.'

#### Teach (what the new keys do)
- **`0`**: jump to the **start of the line**
- **`^`**: jump to the **first non-blank character** on the line
- **`$`**: jump to the **end of the line**

Why it matters: fast line editing and pairing with operators later (`d$`, `c^`).

#### Scroll (modal)
```text
===[====]===     Stonebridge of Lines
   |  |          where lines begin and end
```
Sometimes you must cross a line swiftly—no tiny steps.
Learn the stones: to the start, to the first rune, to the end.

#### Lesson Arena (buffer)
```text
# STONEBRIDGE OF LINES
#
# Allowed Keys:
#   h j k l   0 ^ $
#
# QUEST:
#   - On each line below, land on ♦ using 0, ^, and $.
#   - Use each of 0 ^ $ at least 5 times.

Line A:            ♦---(end)
Line B:      ♦
Line C:                  ♦
Line D:   ♦
Line E:                 ♦
Line F:        ♦
Line G:              ♦
Line H: ♦
Line I:            ♦
Line J:                 ♦
```

#### Gems (1–3)
- **1 gem:** use `0/^/$` **≥ 5** each
- **2 gems:** touch ♦ on at least 8 lines
- **3 gems:** touch ♦ on all lines with minimal lateral travel

#### Award (modal)
The bridge hums approvingly. Your boots are now “line-wise.”

---

### 4) Cliffside Steps — Top and Bottom of the World
**Chapter:** Roads of Motion  
**Map label:** CLIFFSIDE  
**Unlocks:** `gg` `G`  
**Prerequisite:** 3

#### Story (why you're here)
The road becomes a cliff path with a lookout at the top and a shell-strewn shore far below. A wind-sage laughs: 'Some journeys are too long for walking. Learn the page-jumps.'

#### Teach (what the new keys do)
- **`gg`**: jump to the **top of the file** (first line)
- **`G`**: jump to the **bottom of the file** (last line)

Why it matters: instant travel in big files; later you’ll use counts like `10G` (go to line 10).

#### Scroll (modal)
```text
   /\\            Cliffside Steps
  /  \\           the sky is a page
 /____\\          the sea is the bottom
```
A hero must travel from the first page to the last.
Two spells do it in a blink.

#### Lesson Arena (buffer)
```text
# CLIFFSIDE STEPS
#
# Allowed Keys:
#   h j k l   0 ^ $   gg G
#
# QUEST:
#   - Jump to the TOP (Line 1) using gg.
#   - Jump to the BOTTOM (last line) using G.
#   - Repeat each at least 3 times.
#   - Find the seashell 🐚 at the bottom and stand on it.

(1)  ☁️  ☁️  ☁️  TOP OF CLIFF — Wave hello here.
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
(40) SEA — pebbles, foam, and a tiny 🐚 seashell.
```

#### Gems (1–3)
- **1 gem:** `gg` and `G` used **≥ 3** each
- **2 gems:** also touch 🐚
- **3 gems:** “swift steps” (more jumps than walking)

#### Award (modal)
You master the page like a hawk masters the wind.

---

## Chapter 2 — Wordsmith’s Trail

### 5) Briarpath Crossing — Leap by Words
**Chapter:** Wordsmith’s Trail  
**Map label:** BRIARPATH  
**Unlocks:** `w` `b` `e`  
**Prerequisite:** 4

#### Story (why you're here)
A hedgerow maze blocks the road. The briars snag your cloak when you step one letter at a time. A gardener shows you a trick: leap by *words*—the path becomes easy.

#### Teach (what the new keys do)
- **`w`**: move to the **start of the next word**
- **`b`**: move to the **start of the previous word**
- **`e`**: move to the **end of the current/next word**

Why it matters: fast navigation and pairing with operators (`dw`, `ce`).

#### Scroll (modal)
```text
  ~~~~~~~
==\\___/==    Briarpath Crossing
   | |
```
The briars are thick; stepping letter by letter takes all day.
Leap by **words**: forward, back, and to the word’s edge.

#### Lesson Arena (buffer)
```text
# BRIARPATH CROSSING
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
[*] you arrive with a smile
```

#### Gems (1–3)
- **1 gem:** `w/b/e` used **≥ 5** each
- **2 gems:** touch all four [*] lines
- **3 gems:** mostly word hops (few single-letter moves)

#### Award (modal)
The creek applauds with little splashes. Your steps are word-wise now.

---

### 6) Old Oak Library — Big WORDs, Big Leaps
**Chapter:** Wordsmith’s Trail  
**Map label:** OLD OAK  
**Unlocks:** `W` `B` `E`  
**Prerequisite:** 5

#### Story (why you're here)
In the Old Oak Library, scrolls are full of punctuation and sticky tokens like `tea_time@dawn`. An owl librarian whispers: 'Sometimes a *word* is too small. Travel by *WORD*.'

#### Teach (what the new keys do)
- **`W`**: move to start of next **WORD** (whitespace-separated token)
- **`B`**: move to start of previous WORD
- **`E`**: move to end of current/next WORD

Why it matters: great for code-like strings and symbol-heavy text.

#### Scroll (modal)
```text
   🌳
  (:::)
  /___\\     Old Oak Library
```
Some texts are full of symbols and punctuation—sticky like sap.
Big WORD motions leap over them cleanly.

#### Lesson Arena (buffer)
```text
# OLD OAK LIBRARY
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
<RUNE_3>  dragons? no_thanks.  tea_time@dawn  yay!!!
```

#### Gems (1–3)
- **1 gem:** `W/B/E` used **≥ 5** each
- **2 gems:** touch all three runes
- **3 gems:** use WORD hops for travel; land precisely with small moves

#### Award (modal)
The owl stamps your passport: “APPROVED: BIG WORD TRAVELER.”

---

### 7) Milestone Shrine — The Power of Counts
**Chapter:** Wordsmith’s Trail  
**Map label:** MILESTONE  
**Unlocks:** Counts (e.g., `5j`, `3w`, `9l`)  
**Prerequisite:** 6

#### Story (why you're here)
A shrine of carved numbers hums beside the road. Each numeral glows warmly, like a candle in stone. A monk says, 'A count is a promise. Speak it once, and your feet obey.'

#### Teach (what the new keys do)
- **Counts**: prefix many motions/commands with a number to repeat them.
  - `5j` = move down 5 lines
  - `3w` = jump forward 3 words
  - `9l` = move right 9 characters

Why it matters: huge speed gains and fewer keystrokes.

#### Scroll (modal)
```text
    /\\ 
   /  \\    Milestone Shrine
  /____\\   numbers carved in stone
```
Numbers are not math here—they’re momentum.
Why walk five steps when you can *declare* five steps?

#### Lesson Arena (buffer)
```text
# MILESTONE SHRINE
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
(10) [ALTAR] a small bowl of gems glows softly
```

#### Gems (1–3)
- **1 gem:** perform the required counted moves
- **2 gems:** reach [ALTAR] using at least 3 counted moves
- **3 gems:** use counts for nearly all movement

#### Award (modal)
A gem chimes in the bowl. Numbers, it turns out, can be cozy.

---

## Chapter 3 — Blade & Quill

### 8) Scribe’s Camp — Nibble and Replace
**Chapter:** Blade & Quill  
**Map label:** SCRIBE CAMP  
**Unlocks:** `x` `r`  
**Prerequisite:** 7

#### Story (why you're here)
A camp of apprentice scribes surrounds a crooked sign. They’re embarrassed—the letters are wrong, and the kettle refuses to boil until the sign is fixed. A mentor offers two tiny tools: nibble and replace.

#### Teach (what the new keys do)
- **`x`**: delete the **character under the cursor**
- **`r{char}`**: **replace** the character under the cursor with `{char}`

Why it matters: fast, surgical fixes without rewriting or changing modes.

#### Scroll (modal)
```text
  [==]      Scribe’s Camp
 (____)     where mistakes become practice
```
A scribe must erase a smudge and fix a rune.
Nibble one letter, replace one letter.

#### Lesson Arena (buffer)
```text
# SCRIBE'S CAMP
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
# Tip: Use r for single-character fixes. Use x if you truly want a character gone.

╔══════════════════════════════════════╗
║   CAMP SIGN (broken, slightly sad)   ║
╠══════════════════════════════════════╣
║   WELC0ME, TRAV3LER!                 ║
╚══════════════════════════════════════╝

Camp notes:
- The 0 should become O
- The 3 should become E
- The kettle is judging you kindly.

Practice strip (use x to nibble):
xxxxxx  (delete some x's if you like)

```

#### Gems (1–3)
- **1 gem:** fix the sign text
- **2 gems:** also meet x/r usage counts
- **3 gems:** prefer `r` for surgical edits; minimal extra deletions

#### Award (modal)
The camp kettle whistles happily. The sign looks proud again.

---

### 9) Gutter Alley — Delete with Purpose
**Chapter:** Blade & Quill  
**Map label:** GUTTER ALLEY  
**Unlocks:** `d` (operator)  
**Prerequisite:** 8

#### Story (why you're here)
You pass through a cluttered alley where flyers flap like startled birds. A tidy raccoon offers a broom and says, 'Deletion is polite. Tell it *how far* to sweep.'

#### Teach (what the new keys do)
- **`d`** is an **operator**: it deletes a *range* defined by a motion.
Common combos:
- **`dw`**: delete to next word (delete a word)
- **`d$`**: delete to end of line
- **`d0`**: delete back to start of line

Why it matters: operators + motions are the core power pattern.

#### Scroll (modal)
```text
  | | |     Gutter Alley
 (o_o_)     where clutter goes to vanish
```
Deletion is not chaos. It is a polite request:
“Remove **this**, as far as I motion.”

#### Lesson Arena (buffer)
```text
# GUTTER ALLEY
#
# Allowed Keys:
#   previous + d
#
# QUEST:
#   - Perform each at least once: dw, d$, d0
#   - Remove all "TRASH" tokens from the flyer.
#
# Cozy hint: Put your cursor on the T in TRASH, then choose the smallest broom.

┌──────────────────────── MARKET FLYER ────────────────────────┐
│ Fresh apples! TRASH Fresh bread! TRASH Warm soup!            │
│ TRASH Cozy cloaks! 50% off! TRASH                            │
│ Lantern oil, TRASH string, buttons, TRASH tiny bells!        │
└──────────────────────────────────────────────────────────────┘

Side quest doodle (optional):
trash? no thanks. tidy? yes please.

```

#### Gems (1–3)
- **1 gem:** remove all TRASH
- **2 gems:** also do `dw` / `d$` / `d0` at least once each
- **3 gems:** remove TRASH with minimal edits by choosing best motion

#### Award (modal)
The alley sighs with relief. Tidiness is a spell, apparently.

---

### 10) Chisel Workshop — Change is Courage
**Chapter:** Blade & Quill  
**Map label:** CHISEL  
**Unlocks:** `c` (operator)  
**Prerequisite:** 9

#### Story (why you're here)
A stoneworker invites you to a warm workshop where runes are re-carved into soapstone. They explain: 'Sometimes you don’t just delete—you *replace*. `c` is the chisel that clears and lets you write.'

#### Teach (what the new keys do)
- **`c`** is an **operator** like `d`, but after removing text it enters **Insert mode**.
Common combos:
- **`cw`**: change a word
- **`ce`**: change to end of word
- **`c$`**: change to end of line

Why it matters: rewrite quickly without manual delete + insert steps.

#### Scroll (modal)
```text
  /\\/\\      Chisel Workshop
 (____)     where words are re-carved
```
Changing is brave: remove the old, write the new.
The `c` operator does both—smooth as butter.

#### Lesson Arena (buffer)
```text
# CHISEL WORKSHOP
#
# Allowed Keys:
#   previous + c
#
# QUEST:
#   - Perform each at least once: cw, ce, c$
#   - Make the recipe read exactly:
#       Add honey, stir gently, and smile.
#
# Tip: If you use `cw`, type the replacement, then press Esc to return home.

╔════════════════════════ RECIPE CARD ═════════════════════════╗
║ Target: Add honey, stir gently, and smile.                   ║
╠══════════════════════════════════════════════════════════════╣
║ Current: Add mud, stir angrily, and frown.                   ║
╚══════════════════════════════════════════════════════════════╝

PRACTICE (optional but helps gems):
1) Change the next word:   change_me
2) Change to end of line:  please change everything after here -> blah blah blah
3) Change to word end:     changeme!

```

#### Gems (1–3)
- **1 gem:** recipe line matches target
- **2 gems:** perform `cw`/`ce`/`c$` at least once each
- **3 gems:** smallest correct changes + minimal movement (counts and word motions help)

#### Award (modal)
The workshop foreman pats your shoulder. “Nice chiseling. Very gentle.”

---

### 11) Paste Bazaar — Yank and Offer
**Chapter:** Blade & Quill  
**Map label:** BAZAAR  
**Unlocks:** `y` `p` `P` (optional `yy`)  
**Prerequisite:** 10

#### Story (why you're here)
A lantern-lit bazaar sells snippets like spices. A merchant winks: 'Why write the same thing three times? Take it once, place it many.'

#### Teach (what the new keys do)
- **`y`**: **yank** (copy) text (often operator + motion, like `yw`)
- **`yy`** (common): yank the **whole line** (optional to teach explicitly)
- **`p`**: paste **after** cursor (or below linewise)
- **`P`**: paste **before** cursor (or above linewise)

Why it matters: reuse/move text quickly; pairs with Visual mode later.

#### Scroll (modal)
```text
  (¤) (¤)    Paste Bazaar
   \\|/      where snippets are traded
```
To copy is to carry. To paste is to share.
Yank a line like a ribbon—place it neatly.

#### Lesson Arena (buffer)
```text
# PASTE BAZAAR
#
# Allowed Keys:
#   previous + y p P
#
# QUEST:
#   - Copy the line labeled [GOOD] and paste it under each [NEED].
#   - Use yy at least once (or linewise equivalent).
#   - Use both p and P at least once.
#
# Hint: If you yank a whole line, pasting with p/P places it below/above.

[GOOD]  Cozy cocoa: add milk, add honey, stir, enjoy.

[NEED]  Sign A is blank below:
        ________________________________________

[NEED]  Sign B is blank below:
        ________________________________________

[NEED]  Sign C is blank below:
        ________________________________________

Vendor chatter:
- "Copy once, sip twice."
- "Pastes taste better when aligned."
```

#### Gems (1–3)
- **1 gem:** [GOOD] appears under each [NEED]
- **2 gems:** also use both `p` and `P`
- **3 gems:** efficient yanks + minimal repositioning (counts/0/$ help)

#### Award (modal)
A merchant hands you a sticker: “CERTIFIED SNIPPET COURIER.”

---

## Chapter 4 — Mirror Woods

### 12) Lantern Grove — Seek the Word
**Chapter:** Mirror Woods  
**Map label:** LANTERN GROVE  
**Unlocks:** `/` `n` `N`  
**Prerequisite:** 11

#### Story (why you're here)
In a misty grove, lanterns glow whenever you say their name. A ranger explains: 'Don’t wander. Search. Let the forest bring the matches to you.'

#### Teach (what the new keys do)
- **`/text` + Enter**: search **forward** for `text`
- **`n`**: next match
- **`N`**: previous match

Why it matters: fast navigation and batch edits when combined with `c`/`d` and `.`.

#### Scroll (modal)
```text
   .-.
  (   )   Lantern Grove
   `-'    where words glow in the dark
```
In the woods, you don’t wander—you **search**.
Name the thing you want, and your feet follow.

#### Lesson Arena (buffer)
```text
# LANTERN GROVE
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
Search for acorn, then hop matches with n.

```

#### Gems (1–3)
- **1 gem:** reach [FOUND...] via search
- **2 gems:** meet n/N usage counts
- **3 gems:** use search + counts (`3n`) with minimal manual movement

#### Award (modal)
The golden lantern warms your fingertips. You can *find* things now.

---

### 13) Foxglove Fence — Find on the Line
**Chapter:** Mirror Woods  
**Map label:** FOXGLOVE  
**Unlocks:** `f` `F` `t` `T` `;` `,`  
**Prerequisite:** 12

#### Story (why you're here)
A fox in a knitted scarf guards a long fence of painted letters. ‘On a single line,’ it says, ‘you can hop straight to the character you want.’

#### Teach (what the new keys do)
- **`f{char}`**: find next `{char}` **on the line**, land **on** it
- **`F{char}`**: find previous `{char}` on the line
- **`t{char}`**: find next `{char}` but land **just before** it
- **`T{char}`**: find previous `{char}` but land **just after** it
- **`;`**: repeat last `f/F/t/T` in same direction
- **`,`**: repeat last `f/F/t/T` in opposite direction

Why it matters: precise in-line navigation + very fast edits with operators.

#### Scroll (modal)
```text
  |\\/|      Foxglove Fence
  |  |      where letters hide behind letters
```
Sometimes you only need a tiny jump—on the same line.
Find the letter. Hop to it. Repeat politely.

#### Lesson Arena (buffer)
```text
# FOXGLOVE FENCE
#
# Allowed Keys:
#   previous + f F t T ; ,
#
# QUEST:
#   - On each line below, land on the target marked [X].
#   - Use f ≥ 5 times.
#   - Use t ≥ 3 times.
#   - Use ; ≥ 5 times.
#   - Use , ≥ 2 times.
#
# Hint: 'tX' lands just BEFORE X. 'fX' lands ON X.

A) foxglove--fence--fun--[X]--friends
B) teacups, tinycakes, tangerines, [X] jam
C) ribbon(rattle)rustle[r]... now find [X]!
D) one-two-three-four-five-six-[X]-eight
E) zipper zippy zaps [X] zoom

(Extra practice lines:)
F) find this X -> ..........X..........
G) to this X  -> ..........X..........

```

#### Gems (1–3)
- **1 gem:** touch [X] on lines A–E
- **2 gems:** meet usage counts (f/t/;/,)
- **3 gems:** use `;` repeats heavily after an initial find (efficiency)

#### Award (modal)
A fox nods at you: “Good hops. Very precise.”

---

### 14) Echo Clearing — Do It Again
**Chapter:** Mirror Woods  
**Map label:** ECHO  
**Unlocks:** `.`  
**Prerequisite:** 13

#### Story (why you're here)
In a clearing, birds repeat your whistle perfectly. A druid smiles: ‘If you did it once, the forest can echo it. Vim can too.’

#### Teach (what the new keys do)
- **`.`**: repeat the **last change** (last editing command)

Why it matters: one good edit becomes many. Classic pattern: `/pattern` → edit once → `n` → `.`

#### Scroll (modal)
```text
  (())
 ( .. )    Echo Clearing
  (())     where actions repeat like birdsong
```
You don’t have to do the same work twice.
If you did it once, you can **echo** it.

#### Lesson Arena (buffer)
```text
# ECHO CLEARING
#
# Allowed Keys:
#   previous + .
#
# QUEST:
#   - Replace every "sad" with "glad" using ONE manual change, then repeat with .
#   - Replace every "mud" with "tea" the same way.
#
# Tip: /sad → change once → n . n .

A little poem (currently grumpy):
sad clouds drift over mud puddles
sad frogs sip mud soup
sad squirrels complain about mud
sad birds wish for tea
sad hearts can learn to be glad

(Optional cozy bonus)
Turn "wish" into "sip" everywhere using the same echo trick.

```

#### Gems (1–3)
- **1 gem:** final poem has no “sad” and no “mud”
- **2 gems:** use `.` at least 8 times
- **3 gems:** use `/` + `n` + `.` for almost all edits (few manual changes)

#### Award (modal)
The clearing echoes back your confidence. You grin. The poem does too.

---

## Chapter 5 — Artisan’s Forge (Modes & Insert Family)

### 15) Gate of Two Minds — Normal and Insert
**Chapter:** Artisan’s Forge  
**Map label:** TWO MINDS  
**Unlocks:** `i` `Esc`  
**Prerequisite:** 14

#### Story (why you're here)
A stone gate has two masks carved into it: one for walking, one for writing. The Gatekeeper offers you a muffin and says, 'Most travelers fail because they forget which mind they’re in.'

#### Teach (what the new keys do)
- **Normal mode**: keys move/command
- **Insert mode**: keys type text
- **`i`**: enter Insert mode (insert before cursor)
- **`Esc`**: return to Normal mode (safe/home)

Why it matters: this is the central concept of vi/vim.

#### Scroll (modal)
```text
  __||__     Gate of Two Minds
 [__  __]    WALK or WRITE
    ||
```
In **Normal**, you travel. In **Insert**, you write.
Know which mind you wear.

#### Lesson Arena (buffer)
```text
# GATE OF TWO MINDS
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
I came to write, not to [____].

```

#### Gems (1–3)
- **1 gem:** fill blanks correctly
- **2 gems:** meet mode-switch count
- **3 gems:** minimal extra movement before inserting

#### Award (modal)
The Gate opens with a gentle click. The Gatekeeper offers you a muffin.

---

### 16) Blacksmith’s Anvil — Append Like a Pro
**Chapter:** Artisan’s Forge  
**Map label:** ANVIL  
**Unlocks:** `a` `A` `I`  
**Prerequisite:** 15

#### Story (why you're here)
At a warm forge, a blacksmith stamps labels onto cozy goods: cloaks, kettles, and cocoa mugs. They teach you three ways to start writing without fuss—at the right spot, every time.

#### Teach (what the new keys do)
- **`a`**: enter Insert mode **after** cursor (append)
- **`A`**: enter Insert mode at **end of line**
- **`I`**: enter Insert mode at **first non-blank** char

Why it matters: faster than moving + `i`; reduces keystrokes.

#### Scroll (modal)
```text
  (____)     Blacksmith’s Anvil
  /|  |\\     add where it matters
```
Sometimes you don’t want to start writing—just **append**.
Different doors for different starts.

#### Lesson Arena (buffer)
```text
# BLACKSMITH'S ANVIL
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
- Add a tiny heart <3 after "cloak" (use a)

```

#### Gems (1–3)
- **1 gem:** labels updated as instructed
- **2 gems:** use a/A/I at least twice each
- **3 gems:** minimal cursor repositioning; choose best insert variant first

#### Award (modal)
A hammer taps in applause. Your inserts land exactly where they should.

---

### 17) Trapdoor Tavern — Open New Lines
**Chapter:** Artisan’s Forge  
**Map label:** TRAPDOOR  
**Unlocks:** `o` `O`  
**Prerequisite:** 16

#### Story (why you're here)
The Trapdoor Tavern is loud with laughter and spoon-clinks. The bartender needs to add menu items quickly. ‘Don’t squeeze words between lines,’ they say. ‘Open fresh space like pulling a chair up to the table.’

#### Teach (what the new keys do)
- **`o`**: open **new line below** and enter Insert mode
- **`O`**: open **new line above** and enter Insert mode

Why it matters: insert new lines without manual line breaks.

#### Scroll (modal)
```text
  ____       Trapdoor Tavern
 /____\\      where new lines appear
 | [] |
```
Need a fresh line for a fresh thought?
Open one below, or one above.

#### Lesson Arena (buffer)
```text
# TRAPDOOR TAVERN
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
"If you add a line, add a smile."
```

#### Gems (1–3)
- **1 gem:** all items added, alphabetical order maintained
- **2 gems:** meet o/O usage counts
- **3 gems:** open lines at correct spot first (minimal movement/reordering)

#### Award (modal)
The bartender slides a tiny mug toward you: “For your excellent line-opening.”

---

## Chapter 6 — Time Mage’s Archives

### 18) Hourglass Hall — Undo and Redo
**Chapter:** Time Mage’s Archives  
**Map label:** HOURGLASS  
**Unlocks:** `u` `Ctrl-r`  
**Prerequisite:** 17

#### Story (why you're here)
You enter a quiet hall of hourglasses. A Time Mage offers you a scarf and says, ‘Edits are not permanent. Time can be rewound—then replayed.’

#### Teach (what the new keys do)
- **`u`**: **undo** the last change
- **`Ctrl-r`**: **redo** (reverse an undo)

Why it matters: fearless editing and experimentation.

#### Scroll (modal)
```text
   _O_        Hourglass Hall
  /   \\       time is editable
  \\___/
```
Mistakes are not doom. They’re just drafts.
Turn back time with `u`. Step forward with `Ctrl-r`.

#### Lesson Arena (buffer)
```text
# HOURGLASS HALL
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
# Tip: Be playful—make silly mistakes on purpose.

Sentence (start here):
Time is a cozi loop.

Play area (make harmless mistakes here):
- muffins are time machines
- cats are time wizards
- tea is a soft clock

```

#### Gems (1–3)
- **1 gem:** final sentence correct
- **2 gems:** meet undo/redo counts
- **3 gems:** demonstrate controlled fixing: change → undo → redo → refine

#### Award (modal)
The Time Mage bows. “You are courteous to causality.”

---

### 19) The Safe Word — Write the Scroll
**Chapter:** Time Mage’s Archives  
**Map label:** LEDGER  
**Unlocks:** `:w` `:e`  
**Prerequisite:** 18

#### Story (why you're here)
A small room holds the Royal Ledger—a book that remembers every sealed scroll. A librarian whispers, 'Some magic begins with a colon. Write it down, and it stays.'

#### Teach (what the new keys do)
- **`:`** begins an Ex (command-line) command
- **`:w`**: **write/save**
- **`:e`**: **edit/reload**

Why it matters: saving and restoring are essential for real-world editing.

#### Scroll (modal)
```text
  _______     The Safe Word
 /_____ /\\    incantations begin with :
 \\____\\/     the ledger remembers
```
Some magic begins with a colon.
Writing saves your work to the Royal Ledger.

#### Lesson Arena (buffer)
```text
# THE SAFE WORD
#
# Allowed Keys:
#   previous + :w :e (Enter to submit)
#
# QUEST:
#   - Use :w to seal the scroll at least once.
#   - Use :e to unseal (reload) at least once.
#   - Ensure this exact line exists before your final :w:
#       SEALED BY MAX
#
# Suggested cozy flow for 3 gems:
#   1) Add the seal line
#   2) :w
#   3) Make a silly mistake
#   4) :e
#   5) :w again

Royal Ledger Note:
This parchment is unsealed.

Seal line goes here:

Scratch pad (intentionally mess this up once):
today's tea: oolong

```

#### Gems (1–3)
- **1 gem:** perform :w successfully
- **2 gems:** also perform :e successfully
- **3 gems:** demonstrate restore loop (save → mistake → reload → save)

#### Award (modal)
A wax seal appears with a cute little crown imprint. Satisfying.

---

## Chapter 7 — Forms & Shapes (Visual + Text Objects)

### 20) Banner Square — Select with Visual
**Chapter:** Forms & Shapes  
**Map label:** BANNER  
**Unlocks:** `v` `V`  
**Prerequisite:** 19

#### Story (why you're here)
At Banner Square, townsfolk hang flags for the Cozy Fair. A tailor says, ‘To move cloth, you must select it first—see the shape of what you mean.’

#### Teach (what the new keys do)
- **`v`**: Visual mode (characterwise selection)
- **`V`**: Visual Line mode (select whole lines)

In Visual mode you can apply operators: `d` to cut, `y` to copy, then paste with `p/P`.

#### Scroll (modal)
```text
  |\\/|       Banner Square
  |  |       where flags are measured
```
Sometimes you need to *select* what you mean.
Visual mode helps you see the shape of your intent.

#### Lesson Arena (buffer)
```text
# BANNER SQUARE
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
"Linewise is the secret to neat banners."
```

#### Gems (1–3)
- **1 gem:** banner text placed inside the frame
- **2 gems:** use both v and V at least once
- **3 gems:** linewise selection for the multi-line move; minimal rework

#### Award (modal)
The crowd cheers softly (as cozy crowds do). The banner flutters proudly.

---

### 21) Carpenter’s Guild — Words as Objects
**Chapter:** Forms & Shapes  
**Map label:** CARPENTER  
**Unlocks:** `iw` `aw` (text objects, used with operators)  
**Prerequisite:** 20

#### Story (why you're here)
In the Carpenter’s Guild, plank labels must be corrected precisely. A foreman taps a ruler: 'Don’t cut letters. Cut pieces. A word can be a piece.'

#### Teach (what the new keys do)
- **Text objects** target meaningful chunks.
- **`iw`**: “inner word” (just the word)
- **`aw`**: “a word” (word + surrounding space)

Used with operators:
- **`ciw`** change inner word
- **`daw`** delete a word (and its space)
- **`yiw`** yank inner word

#### Scroll (modal)
```text
  [====]      Carpenter’s Guild
  |____|      measure by meaning
```
A carpenter doesn’t cut “letters.” They cut “pieces.”
In Vim, pieces can be **objects** like “inner word.”

#### Lesson Arena (buffer)
```text
# CARPENTER'S GUILD
#
# Allowed Keys:
#   previous + text objects: iw aw (with d/c/y)
#
# QUEST:
#   - Fix each typo by changing ONLY the bad word (use ciw).
#   - Yank the word "twice" (yiw) and paste it into COPY.
#
# Tip: Put the cursor on the word itself—then ciw.

Plank Labels:
1) This plank is {splntered} and should be {splintered}.
2) This plank is {crookd} and should be {crooked}.
3) This plank is {smoth} and should be {smooth}.

Guild Motto:
"measure twice, cut once"

COPY: __________

Optional practice:
Delete a word neatly with daw:  this_word_should_vanish  please

```

#### Gems (1–3)
- **1 gem:** all three typos corrected
- **2 gems:** also fill COPY using `yiw` + paste
- **3 gems:** use `ciw` for all corrections; no collateral deletion

#### Award (modal)
The foreman hands you a tiny wooden star. It smells like pine.

---

### 22) The Sculptor’s Trial — Quotes and Brackets
**Chapter:** Forms & Shapes  
**Map label:** SCULPTOR  
**Unlocks:** `i" a" i) a) i] a]` (text objects)  
**Prerequisite:** 21

#### Story (why you're here)
A sculptor’s studio is full of parentheses and brackets carved into stone. The sculptor says, 'Boundaries are your friends. Carve what’s inside—leave the rest untouched.'

#### Teach (what the new keys do)
- **`i"` / `a"`**: inside/around double quotes
- **`i)` / `a)`**: inside/around parentheses
- **`i]` / `a]`**: inside/around square brackets

Examples:
- **`ci"`** change inside quotes
- **`da)`** delete around parentheses
- **`yi]`** yank inside brackets

#### Scroll (modal)
```text
  (())        Sculptor’s Trial
  /__\\        carve what’s inside
```
A sculptor works within boundaries: quotes, parentheses, brackets.
Your chisel can target “inside” or “around.”

#### Lesson Arena (buffer)
```text
# THE SCULPTOR'S TRIAL
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
Change inside parentheses: (tiny cozy secret)

```

#### Gems (1–3)
- **1 gem:** all three tasks complete
- **2 gems:** use the specified object commands (`ci"`, `da)`, `yi]`)
- **3 gems:** precise edits, no collateral damage, minimal repositioning

#### Award (modal)
The sculptor smiles. “You carved meaning, not mess.”

---

## Chapter 8 — Workflow Halls + Castle of Exit

### 23) Hall of Windows — Split the View
**Chapter:** Workflow Halls  
**Map label:** WINDOWS  
**Unlocks:** `:split` `:vsplit`, `Ctrl-w` + `h/j/k/l`  
**Prerequisite:** 22

#### Story (why you're here)
You enter a hall lined with glowing windows—each shows a different scroll at the same time. A steward says, 'A royal editor keeps two thoughts on the table. Split the hall. Walk between panes.'

#### Teach (what the new keys do)
- **`:split`**: create a **horizontal split** (stacked windows)
- **`:vsplit`**: create a **vertical split** (side-by-side windows)
- **`Ctrl-w` + `h/j/k/l`**: move between windows (left/down/up/right)

Why it matters: compare and edit multiple things without leaving your workspace.

#### Scroll (modal)
```text
  []  []      Hall of Windows
  []__[]      many views, one mind
```
Sometimes you want two scrolls at once.
Split the hall. Walk between panes.

#### Lesson Arena (buffer)
```text
# HALL OF WINDOWS
#
# Allowed Keys:
#   previous + :split :vsplit
#   Ctrl-w + h/j/k/l
#
# QUEST:
#   - Create one horizontal split and one vertical split (any order).
#   - Move to each window at least once using Ctrl-w.
#   - In each window, write the window's name:
#       TOP: SUN
#       LEFT: MOON
#       RIGHT: STAR
#
# Note: Your UI can simulate splits as panes.

Window Labels (fill these in their correct panes):
TOP:   __________________
LEFT:  __________________
RIGHT: __________________

Optional cozy prompt:
Write a tiny note in each pane about what you see out that window.

```

#### Gems (1–3)
- **1 gem:** splits created + labels correct
- **2 gems:** move via Ctrl-w at least 6 times
- **3 gems:** efficient pane switching; correct placements first try

#### Award (modal)
The windows sparkle. You can think in two places at once now. Cozy.

---

### 24) Scroll Vaults — Buffers and the :ls Lantern
**Chapter:** Workflow Halls  
**Map label:** VAULTS  
**Unlocks:** `:ls` `:bnext` `:bprev` `:bd`  
**Prerequisite:** 23

#### Story (why you're here)
A vault keeper shows you shelves of scrolls. 'You can’t hold every scroll open at once,' they say. ‘But you can list them, step through them, and retire drafts politely.’

#### Teach (what the new keys do)
- **Buffers** are open files/scrolls.
- **`:ls`**: list open buffers
- **`:bnext`**: next buffer
- **`:bprev`**: previous buffer
- **`:bd`**: delete/close current buffer

Why it matters: real projects involve multiple files—buffers keep you nimble.

#### Scroll (modal)
```text
  ______      Scroll Vaults
 /_____/\\     many scrolls, neatly stacked
 \\_____\\/
```
A kingdom has many scrolls. Not all can be on the table.
Learn to list them, switch them, and retire drafts politely.

#### Lesson Arena (buffer)
```text
# SCROLL VAULTS
#
# Allowed Keys:
#   previous + :ls :bnext :bprev :bd
#
# QUEST:
#   - Open three buffers (your lesson can spawn them):
#       NOTE_SCROLL, DRAFT_SCROLL, FINAL_SCROLL
#   - Use :ls at least once.
#   - Use :bnext and :bprev to visit each buffer.
#   - Close DRAFT_SCROLL with :bd.
#   - End in FINAL_SCROLL with this line present:
#       I CAN JUGGLE SCROLLS

FINAL_SCROLL:
I CAN JUGGLE SCROLLS

(If your implementation shows buffer names, they should match the quest text.
If it doesn’t, you can still validate that the user performed the commands.)

```

#### Gems (1–3)
- **1 gem:** visit all buffers and end in FINAL_SCROLL with line present
- **2 gems:** use :ls and :bd as required
- **3 gems:** efficient buffer hopping (few redundant hops)

#### Award (modal)
The vault keeper gives you a tiny brass key that is somehow also a bookmark.

---

### 25) The Final Gate — Quit Like Royalty
**Chapter:** Castle of Exit  
**Map label:** FINAL GATE  
**Unlocks:** `:wq` `:q!` (optional `ZZ`)  
**Prerequisite:** 24

#### Story (why you're here)
A final gate stands before the castle, with two doorways: one polite, one dramatic. A guard whispers: 'Know whether you’re carrying a candle. Save and leave… or flee without a trace.'

#### Teach (what the new keys do)
- **`:wq`**: write (save) and quit
- **`:q!`**: quit without saving (force)
- **`ZZ`** (optional): save and quit shortcut

Why it matters: leaving correctly is part of proficiency—especially after mistakes.

#### Scroll (modal)
```text
  __||__     The Final Gate
 [__  __]    exits are choices
    ||
```
To leave a room, you must know whether you’re carrying a candle.
Save and exit politely—or flee dramatically.

#### Lesson Arena (buffer)
```text
# THE FINAL GATE
#
# Allowed Keys:
#   previous + :wq :q! (optional ZZ)
#
# QUEST:
#   - Perform a “polite exit” using :wq after making a small edit.
#   - Re-enter and perform a “dramatic exit” using :q! after making an unwanted edit.
#   - (Optional) Use ZZ once as a royal shortcut.
#
# Your UI can simulate re-entry by re-opening the lesson buffer.

Polite Exit Checklist:
- Add a period to the end of this sentence:
  I exit with grace

Dramatic Exit Checklist:
- Intentionally change a word in this sentence (a mistake on purpose):
  I will not save this mistake
- Then :q! to abandon it

```

#### Gems (1–3)
- **1 gem:** successfully use :wq and :q! appropriately
- **2 gems:** correct outcomes (saved vs discarded) in one lesson flow
- **3 gems:** also demonstrate ZZ (if included) + minimal actions

#### Award (modal)
The gate swings open. The hinges whisper: “Well done.”

---

### 26) Castle of VI — The Royal Proclamation
**Chapter:** Castle of Exit  
**Map label:** CASTLE  
**Unlocks:** none (mastery test)  
**Prerequisite:** 25

#### Story (why you're here)
At last, the castle. The Royal Proclamation is damaged—smudged, mis-capitalized, sprinkled with tiny errors. Restore it using everything you’ve learned—calmly, cleverly, cozily.

#### Teach (what the new keys do)
- Mastery: no new keys.
You’re expected to combine:
- search + next (`/`, `n`)
- repeat last change (`.`)
- operators + motions (`dw`, `c$`, etc.)
- text objects (`ci"`, `da)`, `yi]`)
- counts (`5j`, `3w`)
- then finish with `:wq`.

#### Scroll (modal)
```text
   |>>>
  /___\\       Castle of VI
  |[][]|
```
At last, the castle. Restore the proclamation.
The Cozy Crown is counting on your keystrokes.

#### Lesson Arena (buffer)
```text
# CASTLE OF VI — FINAL EXAM
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
#   - Use at least:
#       * one text object edit (ci", da), yi], etc.)
#       * one counted motion (e.g., 5j, 3w)
#       * dot-repeat for a repeated fix
#   - Keep edits efficient (few redundant movements)

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
Keeper of the Lantern, Friend of Cats

```

#### Gems (1–3)
- **1 gem:** proclamation matches target + `:wq`
- **2 gems:** also demonstrate `/` and `.` and an operator+motion combo
- **3 gems:** also demonstrate text objects + counts + dot repeat, efficiently

#### Award (modal)
The throne room glows. The cats of Home Row parade in tiny capes.
You are hereby titled: **Royal Editor of VI**. 💎💎💎

---

