# @minotaur-ui/ui

Light-only React components for restrained, dense product interfaces.

## Setup

Minotaur UI requires React 19 and Tailwind CSS v4. Install the package, import Tailwind
and Minotaur UI's tokens in your global stylesheet, and source the package distribution
so Tailwind generates the utilities used by the components:

```css
@import "tailwindcss";
@import "@minotaur-ui/ui/styles.css";

@source "../node_modules/@minotaur-ui/ui/dist";
```

Adjust the `@source` path relative to your stylesheet. The Minotaur UI stylesheet contains
tokens and base styles; importing it without scanning the package does not generate all
component utility CSS.

```tsx
import { Button } from "@minotaur-ui/ui";

export function SaveAction() {
  return <Button>Save</Button>;
}
```

## License

MIT
