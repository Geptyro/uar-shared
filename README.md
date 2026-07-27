# uar-shared

Shared design tokens, Svelte primitives and modules for
[uar.cedricdessalles.dev](https://uar.cedricdessalles.dev) and its companion
apps ([uar-companion](https://github.com/Geptyro/uar-companion)). One source of truth —
no duplicated palettes or components between the website and the apps.

## Usage

```bash
npm i github:Geptyro/uar-shared
```

```js
// styles (import once, in order)
import 'uar-shared/tokens.css'; // palette/type/shape, light + dark
import 'uar-shared/base.css';   // base styles + primitive classes

// Svelte 5 primitives (thin wrappers over the base.css classes)
import { Card, Button, Tag, Chip, Toggle, SectionHeading } from 'uar-shared';

// helpers
import { placeFloating } from 'uar-shared/place'; // viewport-clamped card placement
```

### Narrow top bars

`PresenceChips`, `PresenceChip` and `ReadyChip` take `compact` — icon, count
and countdown only, no prose — so a top bar full of chips still fits on one
line. The wording stays in the `title` and in the hover pop's heading.

`HoverPop` opens on hover/focus with a mouse and on tap with a finger, and
places its card with `placeFloating()`, which flips to whichever side fits
and clamps the card inside the viewport. Anything that floats next to an
anchor should go through that function rather than CSS anchoring, or it ends
up half off-screen on a phone.

Components ship as source (`.svelte`, plain JS) and are compiled by the
consumer's Svelte tooling — both consumers use Vite + `vite-plugin-svelte`.
The classes in `base.css` work standalone too; the components exist so apps
don't hand-copy markup.

Fonts are the consumer's job (the tokens reference them):
`@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`.

## Scope

- **In**: design tokens, base styles, UI primitives used by more than one
  app, and shared modules (planned: the SC2 replay MPQ reader both the
  website and uar-companion currently keep copies of).
- **Out**: domain components (unit tables, wiki pages, app screens) — those
  belong to their app.
