# @puppuccino/markdown

Terminal markdown rendering with styled output.

## Installation

```bash
npm install @puppuccino/markdown
```

Or install from GitHub:

```bash
npm install github:averagejoeslab/markdown
```

## Features

- **Full Markdown Support** - Headings, lists, code blocks, tables, and more
- **Multiple Themes** - Dark, light, ASCII, and no-color themes
- **Customizable Styles** - Override any element's appearance
- **Text Wrapping** - Automatic wrapping to terminal width
- **ANSI Utilities** - Strip codes, measure visible width

## Usage

### Basic Rendering

```typescript
import { render } from '@puppuccino/markdown';

const markdown = `
# Hello World

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`javascript
const x = 42;
\`\`\`
`;

console.log(render(markdown));
```

### Themes

```typescript
import {
  render,
  renderDark,
  renderLight,
  renderAscii,
  renderPlain,
  DarkTheme,
  LightTheme,
} from '@puppuccino/markdown';

// Use specific themes
console.log(renderDark(markdown));   // Dark theme (default)
console.log(renderLight(markdown));  // Light theme
console.log(renderAscii(markdown));  // ASCII-only (no unicode)
console.log(renderPlain(markdown));  // No colors

// Or specify theme in options
console.log(render(markdown, { theme: LightTheme }));
```

### Custom Themes

```typescript
import { render, DarkTheme, mergeThemes, SGR } from '@puppuccino/markdown';

// Extend existing theme
const myTheme = mergeThemes(DarkTheme, {
  h1: { color: SGR.fgMagenta, bold: true },
  code: { color: SGR.fgGreen },
  bullet: '→',
});

console.log(render(markdown, { theme: myTheme }));

// Create theme from scratch
const customTheme = {
  h1: { color: SGR.fgBrightCyan, bold: true, prefix: '# ' },
  h2: { color: SGR.fgBrightGreen, bold: true, prefix: '## ' },
  strong: { bold: true },
  emphasis: { italic: true },
  code: { color: SGR.fgYellow },
  link: { color: SGR.fgBlue, underline: true },
  bullet: '•',
  hrChar: '─',
};
```

### Options

```typescript
import { render } from '@puppuccino/markdown';

const result = render(markdown, {
  theme: DarkTheme,     // Theme to use
  width: 80,            // Terminal width for wrapping (0 = no wrap)
  showUrls: true,       // Show URLs after link text
  softWrap: true,       // Enable soft wrapping
});
```

### Create a Renderer

```typescript
import { createRenderer, DarkTheme } from '@puppuccino/markdown';

// Create a pre-configured renderer
const render = createRenderer({
  theme: DarkTheme,
  width: 100,
  showUrls: true,
});

// Use it
console.log(render('# Title'));
console.log(render('Some **text**'));
```

## Supported Elements

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

### Inline Styles

```markdown
**bold text**
*italic text*
`inline code`
~~strikethrough~~
[link text](url)
![image alt](url)
```

### Code Blocks

````markdown
```javascript
function hello() {
  console.log('Hello!');
}
```
````

### Blockquotes

```markdown
> This is a quote
> It can span multiple lines
>> Nested quotes work too
```

### Lists

```markdown
- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Second item
3. Third item

- [x] Task completed
- [ ] Task pending
```

### Tables

```markdown
| Column A | Column B | Column C |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Value 4  | Value 5  | Value 6  |
```

### Horizontal Rules

```markdown
---
```

## ANSI Utilities

```typescript
import { stripAnsi, visibleLength, ansi } from '@puppuccino/markdown';

// Strip ANSI codes from styled text
const styled = ansi.bold('Hello');
console.log(stripAnsi(styled));  // "Hello"

// Get visible length (excluding ANSI codes)
console.log(visibleLength(styled));  // 5

// Use ANSI utilities directly
console.log(ansi.bold('Bold'));
console.log(ansi.italic('Italic'));
console.log(ansi.underline('Underlined'));
console.log(ansi.fg256('256 color', 196));
console.log(ansi.fgRGB('RGB color', 255, 128, 0));
```

## Theme Reference

### Element Styles

Each element can have these style properties:

```typescript
interface ElementStyle {
  color?: number | [number, number, number];      // Foreground color
  backgroundColor?: number | [number, number, number];  // Background
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  dim?: boolean;
  inverse?: boolean;
  prefix?: string;    // Text before content
  suffix?: string;    // Text after content
  indent?: number;    // Indentation level
  margin?: number;    // Empty lines around block
  padding?: number;   // Spaces inside block
}
```

### Theme Properties

```typescript
interface Theme {
  // Block elements
  document?: ElementStyle;
  paragraph?: ElementStyle;
  heading?: ElementStyle;
  h1?: ElementStyle;
  h2?: ElementStyle;
  h3?: ElementStyle;
  h4?: ElementStyle;
  h5?: ElementStyle;
  h6?: ElementStyle;
  blockquote?: ElementStyle;
  codeBlock?: ElementStyle;
  list?: ElementStyle;
  listItem?: ElementStyle;
  table?: ElementStyle;
  tableHeader?: ElementStyle;
  tableCell?: ElementStyle;
  horizontalRule?: ElementStyle;

  // Inline elements
  text?: ElementStyle;
  strong?: ElementStyle;
  emphasis?: ElementStyle;
  code?: ElementStyle;
  link?: ElementStyle;
  image?: ElementStyle;
  strikethrough?: ElementStyle;

  // Special
  bullet?: string;         // List bullet character
  bulletColor?: number;    // Bullet color
  checkbox?: { checked: string; unchecked: string };
  hrChar?: string;         // Horizontal rule character
}
```

## API Reference

### Render Functions

- `render(markdown, options?)` - Render markdown
- `renderDark(markdown, options?)` - Render with dark theme
- `renderLight(markdown, options?)` - Render with light theme
- `renderAscii(markdown, options?)` - Render with ASCII theme
- `renderPlain(markdown, options?)` - Render without colors
- `renderWithTheme(markdown, theme, options?)` - Render with specific theme
- `createRenderer(options?)` - Create pre-configured renderer

### Themes

- `DarkTheme` - Dark terminal theme
- `LightTheme` - Light terminal theme
- `AsciiTheme` - ASCII-only theme
- `NoColorTheme` - Plain text theme
- `mergeThemes(base, overrides)` - Combine themes

### ANSI Utilities

- `SGR` - SGR code constants
- `stripAnsi(text)` - Remove ANSI codes
- `visibleLength(text)` - Get visible length
- `ansi.bold(text)` - Bold text
- `ansi.italic(text)` - Italic text
- `ansi.underline(text)` - Underlined text
- `ansi.fg256(text, color)` - 256-color foreground
- `ansi.fgRGB(text, r, g, b)` - RGB foreground

## License

MIT
