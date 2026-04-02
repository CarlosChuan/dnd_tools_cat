# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A D&D 5e statblock generator web app, localized in Catalan/Spanish. It's a pure vanilla JS single-page application with no build step — edit files and open `index.html` directly in a browser.

## Development

No build system, no package manager. To develop:

1. Open `index.html` directly in a browser, or serve with any static server:
   ```bash
   python3 -m http.server 8000
   ```
2. Edit files and reload the browser.

There are no tests, no linting config, no CI pipeline.

## Architecture

### Stack
- Vanilla JS (ES6+) + jQuery 3.4.1
- Bootstrap 4 (CSS only for layout)
- `dom-to-image.js` for PNG export
- `FileSaver.js` for file downloads

### Central State
All monster data lives in a single global object `mon` (defined at the top of `js/statblock-script.js`). It contains all statblock fields: name, size, type, ability scores, skills, actions, legendary actions, etc.

### Key Files
- `index.html` — full UI form; all inputs have IDs that map directly to `mon` properties
- `js/statblock-script.js` — ~2040 lines, all application logic
- `js/JSON/statblockdata.json` — static lookup data (skills, damage types, ability scores)
- `css/statblock-style.css` — D&D statblock visual styling
- `css/dnd-style.css` — general page styling

### Function Module Organization (all in `statblock-script.js`)
| Module | Responsibility |
|---|---|
| `SavedData` | localStorage + file save/load (.monster format) |
| `FormFunctions` | Show/hide form sections based on state |
| `InputFunctions` | Populate form from `mon` object |
| `GetVariablesFunctions` | Read form inputs back into `mon` |
| `StringFunctions` | HTML generation for the statblock display |
| `MathFunctions` | D&D mechanical calculations (modifiers, AC, HP) |
| `CrFunctions` | Challenge Rating calculation logic |
| `ArrayFunctions` | Helpers for skill/action/immunity arrays |

### Render Flow
1. User edits a form field → event fires → `GetVariablesFunctions` reads all inputs into `mon`
2. `UpdateStatblock()` is called → delegates to `StringFunctions` to build HTML → injects into DOM
3. Export paths: **Print** (opens new window), **PNG** (dom-to-image), **Markdown** (`BuildMarkdown()` for Homebrewery V3/Legacy)

### Tag System (`ReplaceTags()`)
Actions/descriptions support inline tags that auto-calculate D&D values:
- `[mon]` / `[mons]` — monster name / possessive
- `[stat atk STR]` — attack roll with proficiency bonus
- `[stat save DEX]` — save DC
- `[stat 2d6+STR]` — damage expression with ability modifier

### Language
UI labels are in Catalan. Some terminology was recently switched to Spanish (see recent commits). Keep new UI text in Catalan unless changing something already in Spanish.
