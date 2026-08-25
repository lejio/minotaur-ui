# @terra-ui/ui

Light-only React components for restrained, dense product interfaces.

## Setup

Terra UI requires React 19 and Tailwind CSS v4. Install the package, import Tailwind
and Terra UI's tokens in your global stylesheet, and source the package distribution
so Tailwind generates the utilities used by the components:

```css
@import "tailwindcss";
@import "@terra-ui/ui/styles.css";

@source "../node_modules/@terra-ui/ui/dist";
```

Adjust the `@source` path relative to your stylesheet. The Terra UI stylesheet contains
tokens and base styles; importing it without scanning the package does not generate all
component utility CSS.

```tsx
import { Button } from "@terra-ui/ui";

export function SaveAction() {
  return <Button>Save</Button>;
}
```

## License

MIT
