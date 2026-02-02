/**
 * ANSI escape codes for terminal styling
 */

export const CSI = '\x1b[';

/**
 * SGR (Select Graphic Rendition) codes
 */
export const SGR = {
  // Reset
  reset: 0,

  // Text styles
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  inverse: 7,
  hidden: 8,
  strikethrough: 9,

  // Reset individual styles
  resetBold: 22,
  resetDim: 22,
  resetItalic: 23,
  resetUnderline: 24,
  resetBlink: 25,
  resetInverse: 27,
  resetHidden: 28,
  resetStrikethrough: 29,

  // Foreground colors
  fgBlack: 30,
  fgRed: 31,
  fgGreen: 32,
  fgYellow: 33,
  fgBlue: 34,
  fgMagenta: 35,
  fgCyan: 36,
  fgWhite: 37,
  fgDefault: 39,

  // Background colors
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  bgDefault: 49,

  // Bright foreground colors
  fgBrightBlack: 90,
  fgBrightRed: 91,
  fgBrightGreen: 92,
  fgBrightYellow: 93,
  fgBrightBlue: 94,
  fgBrightMagenta: 95,
  fgBrightCyan: 96,
  fgBrightWhite: 97,

  // Bright background colors
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107,
} as const;

/**
 * Create an SGR sequence
 */
export function sgr(...codes: number[]): string {
  return `${CSI}${codes.join(';')}m`;
}

/**
 * Reset all styles
 */
export const reset = sgr(SGR.reset);

/**
 * Style a string with SGR codes
 */
export function style(text: string, ...codes: number[]): string {
  if (codes.length === 0) return text;
  return sgr(...codes) + text + reset;
}

/**
 * Bold text
 */
export function bold(text: string): string {
  return style(text, SGR.bold);
}

/**
 * Dim text
 */
export function dim(text: string): string {
  return style(text, SGR.dim);
}

/**
 * Italic text
 */
export function italic(text: string): string {
  return style(text, SGR.italic);
}

/**
 * Underline text
 */
export function underline(text: string): string {
  return style(text, SGR.underline);
}

/**
 * Strikethrough text
 */
export function strikethrough(text: string): string {
  return style(text, SGR.strikethrough);
}

/**
 * Inverse (swap foreground/background)
 */
export function inverse(text: string): string {
  return style(text, SGR.inverse);
}

/**
 * Color text with foreground color
 */
export function fg(text: string, color: number): string {
  return style(text, color);
}

/**
 * Color text with background color
 */
export function bg(text: string, color: number): string {
  return style(text, color);
}

/**
 * 256-color foreground
 */
export function fg256(text: string, color: number): string {
  return `${CSI}38;5;${color}m${text}${reset}`;
}

/**
 * 256-color background
 */
export function bg256(text: string, color: number): string {
  return `${CSI}48;5;${color}m${text}${reset}`;
}

/**
 * RGB foreground color
 */
export function fgRGB(text: string, r: number, g: number, b: number): string {
  return `${CSI}38;2;${r};${g};${b}m${text}${reset}`;
}

/**
 * RGB background color
 */
export function bgRGB(text: string, r: number, g: number, b: number): string {
  return `${CSI}48;2;${r};${g};${b}m${text}${reset}`;
}

/**
 * Strip all ANSI escape codes from a string
 */
export function stripAnsi(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Get visible length of a string (excluding ANSI codes)
 */
export function visibleLength(text: string): number {
  return stripAnsi(text).length;
}
