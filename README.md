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
```

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
