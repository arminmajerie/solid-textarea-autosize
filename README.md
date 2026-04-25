# @arminmajerie/solid-textarea-autosize

[![npm version](https://img.shields.io/npm/v/@arminmajerie/solid-textarea-autosize.svg)](https://www.npmjs.com/package/@arminmajerie/solid-textarea-autosize)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Autosizing `<textarea>` component for Solid. The textarea grows and shrinks with its content while keeping the normal textarea API, including `value`, `placeholder`, `disabled`, `ref`, `onInput`, and styling props.

This is a maintained fork of the MIT-licensed [`solid-textarea-autosize`](https://github.com/bigmistqke/solid-textarea-autosize), which was originally ported from [`react-textarea-autosize`](https://github.com/Andarist/react-textarea-autosize). The original copyright and MIT license are preserved in this repository.

## Install

```sh
npm install @arminmajerie/solid-textarea-autosize
```

Use the scoped package name in new code:

```tsx
import TextareaAutosize from "@arminmajerie/solid-textarea-autosize";
```

If you are migrating an app that already imports `solid-textarea-autosize`, npm aliases can keep that import path:

```sh
npm install solid-textarea-autosize@npm:@arminmajerie/solid-textarea-autosize
```

```tsx
import TextareaAutosize from "solid-textarea-autosize";
```

## Usage

```tsx
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import TextareaAutosize from "@arminmajerie/solid-textarea-autosize";

function App() {
  const [value, setValue] = createSignal("");

  return (
    <TextareaAutosize
      minRows={2}
      maxRows={8}
      value={value()}
      placeholder="Write something..."
      onInput={(event) => setValue(event.currentTarget.value)}
    />
  );
}

render(() => <App />, document.getElementById("root")!);
```

## Props

`TextareaAutosize` accepts normal Solid textarea attributes plus these autosize-specific props.

| Prop | Type | Description |
| --- | --- | --- |
| `minRows` | `number` | Minimum visible row count. |
| `maxRows` | `number` | Maximum visible row count before the textarea scrolls. |
| `onHeightChange` | `(height: number, meta: { rowHeight: number }) => void` | Called when the measured textarea height changes. |
| `cacheMeasurements` | `boolean` | Reuse sizing measurements between height calculations. Defaults to `false`. |

The component controls `height`, `min-height`, and `max-height` internally so it can resize correctly.

## Refs

The component forwards its ref to the underlying `HTMLTextAreaElement`.

```tsx
let textarea!: HTMLTextAreaElement;

<TextareaAutosize ref={(element) => (textarea = element)} />;

textarea.focus();
```

## Compatibility Notes

This fork keeps compatibility with older call sites that pass `label` or `inputProps`, while also exposing proper package exports and TypeScript declaration resolution for modern TypeScript and bundlers.

The package publishes:

- ESM: `./dist/esm/index.js`
- CommonJS: `./dist/cjs/index.js`
- Solid source condition: `./dist/source/index.jsx`
- Type declarations: `./dist/types/index.d.ts`

## Development

```sh
npm install
npm run typecheck
npm run build
npm run pack:check
```

`npm run pack:check` shows exactly which files will be included in the npm package.

## License

MIT. This fork preserves the upstream MIT license and attribution.
