# Kingdom of VI

Kingdom of VI is a cozy, keyboard-only fantasy adventure for learning **vi/vim-style movement and editing**.

You explore an ASCII world map, enter lesson locations, read parchment-style story scrolls, and complete editor challenges inside a simulated vi-like interface.

## What this project includes

- A **26-lesson campaign** with progression across multiple chapters
- An explorable **ASCII world map**
- A lightweight **vi-like editor engine** for lessons
- **Gem ratings** for lesson performance
- **Local save data** in the browser
- A React + TypeScript frontend built with Vite

## Tech stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Vitest** for tests
- **ESLint** for linting

## Requirements

Recommended:

- **Node.js 22+**
- **npm**

## How to run it

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Then open the local URL Vite prints in your terminal, usually:

```text
http://localhost:5173
```

## Other useful commands

### Run tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Run the linter

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Basic gameplay flow

1. Start a new game
2. Move around the kingdom map
3. Enter a lesson location
4. Read the story/teaching scroll
5. Complete the lesson challenge
6. Earn gems and unlock new keys
7. Return to the map and continue onward

## Controls

### Menus / map

- `j` / `k` or arrow keys: move selection / move on map
- `h` / `l`: move left / right on map
- `Enter`: confirm / enter location
- `Esc`: go back

### Lessons

- Only the currently unlocked keys are allowed
- `F1`: open the lesson reference scroll
- `:q` then `Enter`: quit a lesson

As the campaign progresses, more vi-style motions and editing commands are unlocked.

## Save data

Progress is saved in the browser using `localStorage`.

Current save key:

```text
kingdomofvi_save
```

If you want to fully reset progress, you can:

- choose **New Game** from the title screen, or
- manually clear that localStorage entry in your browser

## Project structure

```text
src/
  components/   UI building blocks
  engine/       vi-like editor engine
  game/         lessons, progression, map data, scoring
  hooks/        React hooks for input and game state
  screens/      top-level game screens
  styles/       terminal/parchment styling

docs/
  prd.md        project/design notes
  lessons.md    lesson content reference
```

## Notes

This project is focused on a **gameified vi learning experience**, not a full vim implementation.

The goal is to teach core editing ideas through structured lessons, progression, repetition, and playful presentation.
