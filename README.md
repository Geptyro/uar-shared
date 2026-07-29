# uar-shared

UAR's palette and its own Svelte components, shared by
[uar.cedricdessalles.dev](https://uar.cedricdessalles.dev) and its companion
apps ([uar-companion](https://github.com/Geptyro/uar-companion)). One source of
truth — no duplicated palettes or components between the website and the apps.

Built on [`sveltekit-commons`](https://github.com/Geptyro/sveltekit-commons),
which holds the design-token contract and the generic primitives. What is left
here is only what is UAR's: the skin, and the components that know what a MOS
or a ready-check is.

## Usage

```bash
npm i github:Geptyro/uar-shared
```

```js
// styles, in this order
import 'sveltekit-commons/tokens.css'; // the contract: scale, shape, type
import 'uar-shared/palette.css';       // the UAR skin: every colour
import 'sveltekit-commons/base.css';   // reset + element styles (optional)

// generic primitives now come from commons
import { Button, Card, Chip, Tag, Toggle, SectionHeading, HoverPop } from 'sveltekit-commons';

// UAR's own
import {
	AccountChip, BnetButton, PresenceChip, PresenceChips,
	PresenceGroups, ReadyChip, ReadyPlayers
} from 'uar-shared';

// helpers
import { minutesLeft, readyLevel, activeReady } from 'uar-shared/ready';
import { groupPresence, splitPresence } from 'uar-shared/presence';
```

`palette.css` carries the domain hues too — `--mos`, `--hostile`, `--item`,
`--gold`, `--lobby`, `--game`, the twelve game modes and thirteen modifiers —
because those are UAR facts, not design-system ones. Shell metrics
(`--chrome-h`, `--rail-w`, `--card-pad-*`, the z-scale) are **not** here: they
describe the website's own chrome, which the companion does not have.

### Narrow top bars

`PresenceChips`, `PresenceChip` and `ReadyChip` take `compact` — icon, count
and countdown only, no prose — so a top bar full of chips still fits on one
line. The wording stays in the `title` and in the hover pop's heading.

`AccountChip` takes it too: portrait and cog end-caps only, with the battletag
moved into the tooltip. The name is a full line of mono text, so it is usually
the widest thing left in a narrow bar.

`HoverPop` (now in commons) opens on hover/focus with a mouse and on tap with a
finger, and places its card with `placeFloating()`, which flips to whichever
side fits and clamps the card inside the viewport. Anything that floats next to
an anchor should go through that function rather than CSS anchoring, or it ends
up half off-screen on a phone.

Components ship as source (`.svelte`, plain JS) and are compiled by the
consumer's Svelte tooling — both consumers use Vite + `vite-plugin-svelte`, and
both must list `uar-shared` and `sveltekit-commons` in `ssr.noExternal`.

Fonts are the consumer's job (the palette names them):
`@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`.

## Scope

- **In**: the UAR palette, and components carrying UAR domain knowledge
  (planned: the SC2 replay MPQ reader both the website and uar-companion
  currently keep copies of).
- **Out**: anything generic — that goes to `sveltekit-commons`, so STALZONE and
  the Guild Wars sites get it too.
- **Also out**: page-level app screens and wiki tables; those belong to their
  app.
