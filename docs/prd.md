# Kingdom of VI — Campaign Plan (26 Locations)

This document defines **what the game is** and **how it should work** at the level of gameplay, story, lessons, rewards, and content structure. It intentionally avoids implementation design details.

---

## High Concept

**Kingdom of VI** is a cozy fantasy adventure that teaches **vi/vim keybindings** through a Sierra-inspired, keyboard-only experience.

- The game world is displayed *inside a virtual vi editor*.
- The **kingdom map is a “file/buffer”** rendered as ASCII art that types itself into existence.
- Each destination on the map is a **lesson location**.
- Lessons unlock keybindings as “abilities.”
- Players earn **1–3 gems** per lesson (Angry Birds style), with 3 gems rewarding clever and efficient use of unlocked abilities.

---

## Tech Stack (for later implementation planning)

- Vite / React / TypeScript / Tailwind
- Backend: **Convex** 

(This plan document remains implementation-agnostic beyond naming the stack.)

---

## Core Loop

1. **Title Screen**
   - ASCII castle + “Kingdom of VI”
   - Keyboard-only menu: Start / Continue / Options / Credits

2. **Name Entry**
   - Player chooses a name (e.g., “Max”)
   - Name appears in narrator copy and some lesson text

3. **Map Buffer**
   - An initially empty editor buffer fills itself with ASCII map tiles, accelerating.
   - Player avatar is `@` on the first road tile.
   - Early hint teaches arrows (training wheels), but lessons quickly disable them.

4. **Travel + Lesson Gate**
   - Player moves along connected roads.
   - Can revisit old lessons, but **cannot pass an unfinished lesson**.

5. **Location Scroll (Modal)**
   - Parchment scroll with:
     - Location name + vignette art
     - Short story beat
     - Newly unlocked keys
     - Goals + 3-gem challenge

6. **Lesson Arena (New Buffer)**
   - Cute, themed text content (letters, spellbooks, recipes, maps, etc.)
   - Clear “QUEST” header lines and target outcomes.

7. **Award Scroll**
   - 1–3 gems + cozy congratulation
   - Short coaching hint for improvement
   - Return to map buffer

---

## Game Feel & Tone

**Vibe:** Cozy fantasy + gentle humor + Sierra/King’s Quest nostalgia  
**Voice:** Friendly narrator + in-world characters (“gatekeeper”, “scribe”, “time mage”)  
**Aesthetic:** ASCII frames + small pixel-ish/ASCII vignettes + parchment modals  
**Music (optional):** light chiptune / lute loop (ambient, unobtrusive)

### Key design principles
- **No mouse in lessons.** Ever.
- **Learning through doing** (goals are measurable).
- **Unlocks are meaningful**: no keybinding is available until taught.
- **Replays are celebrated**: encourage improving gem rating later.

---

## What “Major Keybindings” Means Here

This campaign targets proficiency in a “vim-ish” editor while keeping core skills broadly compatible with classic vi:

### Motion & navigation
- `h j k l`, `0 ^ $`, `gg G`
- word motions: `w b e`, and WORD motions: `W B E`
- counts: `3w`, `10j`, etc.

### Operators & edits
- `x`, `r`, `d`, `c`, `y`, `p/P`
- insert family: `i a I A o O`, `Esc`
- search: `/`, `n N`
- find: `f F t T`, repeat `; ,`
- repeat: `.`
- undo/redo: `u`, `Ctrl-r`

### Selection & text objects
- `v`, `V`
- text objects: `iw aw i" a" i) a) i] a]` (used via `d/c/y`)

### Files / buffers / windows
- `:w`, `:e` (light intro)
- splits: `:split`, `:vsplit`, window move `Ctrl-w` + direction (or `hjkl`)
- buffers: `:ls`, `:bnext`, `:bprev`, `:bd`

### Exit / save-quit
- `:wq`, `:q!`, and optionally `ZZ`

---

## Progression Rules

- **Linear gate**: lesson N+1 requires lesson N complete.
- **Revisit**: player can replay completed lessons any time to improve gems.
- **Arrows**:
  - Allowed on map early as training wheels.
  - Disabled in almost all lesson arenas.

---

## Gems & Ratings

Each lesson awards **1–3 gems**:

- **1 gem (Complete):** Meets minimum goal.
- **2 gems (Competent):** Demonstrates new binding plus one “efficiency behavior.”
- **3 gems (Clever):** Uses an intended pro technique (counts, operator+motion combos, `.`, search jumps, text objects) and/or stays within a gentle keystroke budget.

**Framing:** Budgets are “Royal Rating: Swift Steps!” not punishment.

---

## Chapters & Locations

1. Roads of Motion (1–4)
2. Wordsmith’s Trail (5–7)
3. Blade & Quill (8–11)
4. Mirror Woods (12–14)
5. Artisan’s Forge (15–17)
6. Time Mage’s Archives (18–19)
7. Forms & Shapes (20–22)
8. Halls of Workflow + Castle of Exit (23–26)

See `lessons.md` for the full content pack.

---

## Recommended Map Shape (for your eventual map buffer)

A simple 1-road-in/1-road-out chain with a few cozy revisit loops:

- Main road: 1 → 26
- Optional revisit spurs:
  - After 7 (counts) a loop back to 5–6.
  - After 14 (repeat) a loop back to 9–13 for gem “skill polishing.”
  - After 22 (text objects) a loop back to 10–11 (operators) for “combo mastery.”

---

## “Scroll Modal” Standard Fields

Every location scroll should include:

- Location Name
- Vignette Art (ASCII/pixel-ish)
- Story Beat (2–4 lines)
- New Power (keys unlocked)
- Quest
  - 1-gem minimum
  - 2-gem criteria
  - 3-gem criteria
- Continue (Enter), Back (Esc)

---

## Lesson Arena Standard Layout

Each lesson buffer begins with a cute framed header:

- Title, location, and a short in-world note
- Allowed Keys list (player-facing)
- Quest list
- A themed text artifact to navigate/edit

The arenas should be **large, cozy, and interesting**: doodles, letters, spellbooks, recipes, map legends, silly flyers, etc.

---

## Save / Continue Expectations (Player-Facing)

- Progress is stored as “Royal Ledger” (local state).
- Continue returns to map buffer with:
  - current location highlighted
  - gem totals visible somewhere in-world (e.g., top status line)

---

## Design Intent (Implementation-Agnostic Constraints)

- Lessons are keyboard-only.
- Validate intent over perfection (counts, command usage, and outcome checks).
- Avoid “gotchas”: never require keys not yet unlocked.
- Be generous with feedback and allow retries.

