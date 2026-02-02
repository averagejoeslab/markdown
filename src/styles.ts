/**
 * Style definitions for markdown rendering
 */

import { SGR } from './ansi';

/**
 * Element style configuration
 */
export interface ElementStyle {
  /** Text color (SGR code or 256 color) */
  color?: number | [number, number, number];
  /** Background color */
  backgroundColor?: number | [number, number, number];
  /** Bold text */
  bold?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Underline text */
  underline?: boolean;
  /** Strikethrough text */
  strikethrough?: boolean;
  /** Dim text */
  dim?: boolean;
  /** Inverse colors */
  inverse?: boolean;
  /** Prefix text */
  prefix?: string;
  /** Suffix text */
  suffix?: string;
  /** Indent level */
  indent?: number;
  /** Block margin (lines above/below) */
  margin?: number;
  /** Block padding (spaces inside) */
  padding?: number;
  /** Border character */
  border?: string;
  /** Border color */
  borderColor?: number | [number, number, number];
}

/**
 * Theme configuration for all markdown elements
 */
export interface Theme {
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
  bullet?: string;
  bulletColor?: number;
  checkbox?: { checked: string; unchecked: string };
  hrChar?: string;
}

/**
 * Dark theme (default)
 */
export const DarkTheme: Theme = {
  document: {},
  paragraph: { margin: 1 },

  heading: { bold: true, margin: 1 },
  h1: { color: SGR.fgBrightCyan, bold: true, prefix: '# ' },
  h2: { color: SGR.fgBrightGreen, bold: true, prefix: '## ' },
  h3: { color: SGR.fgBrightYellow, bold: true, prefix: '### ' },
  h4: { color: SGR.fgBrightMagenta, bold: true, prefix: '#### ' },
  h5: { color: SGR.fgBrightBlue, bold: true, prefix: '##### ' },
  h6: { color: SGR.fgBrightWhite, bold: true, prefix: '###### ' },

  blockquote: {
    color: SGR.fgBrightBlack,
    italic: true,
    prefix: '│ ',
    indent: 2,
    margin: 1,
  },

  codeBlock: {
    color: SGR.fgBrightWhite,
    backgroundColor: SGR.bgBrightBlack,
    padding: 1,
    margin: 1,
  },

  list: { margin: 1 },
  listItem: { indent: 2 },

  table: { margin: 1 },
  tableHeader: { bold: true, color: SGR.fgBrightCyan },
  tableCell: {},

  horizontalRule: { color: SGR.fgBrightBlack, margin: 1 },

  text: {},
  strong: { bold: true, color: SGR.fgBrightWhite },
  emphasis: { italic: true },
  code: { color: SGR.fgBrightYellow, backgroundColor: SGR.bgBrightBlack },
  link: { color: SGR.fgBrightBlue, underline: true },
  image: { color: SGR.fgBrightMagenta, prefix: '🖼 ' },
  strikethrough: { strikethrough: true, dim: true },

  bullet: '•',
  bulletColor: SGR.fgBrightCyan,
  checkbox: { checked: '✓', unchecked: '○' },
  hrChar: '─',
};

/**
 * Light theme
 */
export const LightTheme: Theme = {
  document: {},
  paragraph: { margin: 1 },

  heading: { bold: true, margin: 1 },
  h1: { color: SGR.fgBlue, bold: true, prefix: '# ' },
  h2: { color: SGR.fgGreen, bold: true, prefix: '## ' },
  h3: { color: SGR.fgYellow, bold: true, prefix: '### ' },
  h4: { color: SGR.fgMagenta, bold: true, prefix: '#### ' },
  h5: { color: SGR.fgCyan, bold: true, prefix: '##### ' },
  h6: { color: SGR.fgBlack, bold: true, prefix: '###### ' },

  blockquote: {
    color: SGR.fgBrightBlack,
    italic: true,
    prefix: '│ ',
    indent: 2,
    margin: 1,
  },

  codeBlock: {
    color: SGR.fgBlack,
    backgroundColor: SGR.bgWhite,
    padding: 1,
    margin: 1,
  },

  list: { margin: 1 },
  listItem: { indent: 2 },

  table: { margin: 1 },
  tableHeader: { bold: true, color: SGR.fgBlue },
  tableCell: {},

  horizontalRule: { color: SGR.fgBrightBlack, margin: 1 },

  text: {},
  strong: { bold: true },
  emphasis: { italic: true },
  code: { color: SGR.fgRed, backgroundColor: SGR.bgWhite },
  link: { color: SGR.fgBlue, underline: true },
  image: { color: SGR.fgMagenta, prefix: '🖼 ' },
  strikethrough: { strikethrough: true, dim: true },

  bullet: '•',
  bulletColor: SGR.fgBlue,
  checkbox: { checked: '✓', unchecked: '○' },
  hrChar: '─',
};

/**
 * ASCII-only theme (no unicode)
 */
export const AsciiTheme: Theme = {
  document: {},
  paragraph: { margin: 1 },

  heading: { bold: true, margin: 1 },
  h1: { color: SGR.fgBrightCyan, bold: true, prefix: '# ' },
  h2: { color: SGR.fgBrightGreen, bold: true, prefix: '## ' },
  h3: { color: SGR.fgBrightYellow, bold: true, prefix: '### ' },
  h4: { color: SGR.fgBrightMagenta, bold: true, prefix: '#### ' },
  h5: { color: SGR.fgBrightBlue, bold: true, prefix: '##### ' },
  h6: { color: SGR.fgBrightWhite, bold: true, prefix: '###### ' },

  blockquote: {
    color: SGR.fgBrightBlack,
    italic: true,
    prefix: '| ',
    indent: 2,
    margin: 1,
  },

  codeBlock: {
    color: SGR.fgBrightWhite,
    padding: 1,
    margin: 1,
  },

  list: { margin: 1 },
  listItem: { indent: 2 },

  table: { margin: 1 },
  tableHeader: { bold: true },
  tableCell: {},

  horizontalRule: { color: SGR.fgBrightBlack, margin: 1 },

  text: {},
  strong: { bold: true },
  emphasis: { italic: true },
  code: { color: SGR.fgBrightYellow },
  link: { color: SGR.fgBrightBlue, underline: true },
  image: { color: SGR.fgBrightMagenta, prefix: '[IMG] ' },
  strikethrough: { strikethrough: true, dim: true },

  bullet: '*',
  bulletColor: SGR.fgBrightCyan,
  checkbox: { checked: '[x]', unchecked: '[ ]' },
  hrChar: '-',
};

/**
 * No-color theme (plain text)
 */
export const NoColorTheme: Theme = {
  document: {},
  paragraph: { margin: 1 },

  heading: { margin: 1 },
  h1: { prefix: '# ' },
  h2: { prefix: '## ' },
  h3: { prefix: '### ' },
  h4: { prefix: '#### ' },
  h5: { prefix: '##### ' },
  h6: { prefix: '###### ' },

  blockquote: { prefix: '> ', indent: 2, margin: 1 },
  codeBlock: { padding: 1, margin: 1 },
  list: { margin: 1 },
  listItem: { indent: 2 },

  table: { margin: 1 },
  tableHeader: {},
  tableCell: {},

  horizontalRule: { margin: 1 },

  text: {},
  strong: {},
  emphasis: {},
  code: {},
  link: {},
  image: { prefix: '[IMG] ' },
  strikethrough: {},

  bullet: '-',
  checkbox: { checked: '[x]', unchecked: '[ ]' },
  hrChar: '-',
};

/**
 * Merge two themes
 */
export function mergeThemes(base: Theme, override: Partial<Theme>): Theme {
  const result: Theme = { ...base };

  for (const key of Object.keys(override) as (keyof Theme)[]) {
    const value = override[key];
    if (value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        // Merge element styles
        (result as Record<string, unknown>)[key] = {
          ...(base[key] as object || {}),
          ...value,
        };
      } else {
        // Simple value
        (result as Record<string, unknown>)[key] = value;
      }
    }
  }

  return result;
}
