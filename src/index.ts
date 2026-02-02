/**
 * @puppuccino/markdown - Terminal markdown rendering
 *
 * Renders markdown to terminal-styled output with ANSI escape codes.
 * Supports themes, text wrapping, and customizable styling.
 */

// Core renderer
export { render, renderWithTheme } from './renderer';
export type { RenderOptions } from './renderer';

// Styles and themes
export {
  DarkTheme,
  LightTheme,
  AsciiTheme,
  NoColorTheme,
  mergeThemes,
} from './styles';
export type { Theme, ElementStyle } from './styles';

// ANSI utilities
export * as ansi from './ansi';
export { SGR, stripAnsi, visibleLength } from './ansi';

// Convenience functions

import { render, RenderOptions } from './renderer';
import { DarkTheme, LightTheme, AsciiTheme, NoColorTheme, Theme } from './styles';

/**
 * Render markdown with dark theme (default)
 */
export function renderDark(markdown: string, options?: Omit<RenderOptions, 'theme'>): string {
  return render(markdown, { ...options, theme: DarkTheme });
}

/**
 * Render markdown with light theme
 */
export function renderLight(markdown: string, options?: Omit<RenderOptions, 'theme'>): string {
  return render(markdown, { ...options, theme: LightTheme });
}

/**
 * Render markdown with ASCII-only theme
 */
export function renderAscii(markdown: string, options?: Omit<RenderOptions, 'theme'>): string {
  return render(markdown, { ...options, theme: AsciiTheme });
}

/**
 * Render markdown with no colors
 */
export function renderPlain(markdown: string, options?: Omit<RenderOptions, 'theme'>): string {
  return render(markdown, { ...options, theme: NoColorTheme });
}

/**
 * Create a renderer function with pre-configured options
 */
export function createRenderer(defaultOptions: RenderOptions = {}): (markdown: string, options?: RenderOptions) => string {
  return (markdown: string, options?: RenderOptions) => {
    return render(markdown, { ...defaultOptions, ...options });
  };
}

/**
 * Markdown namespace for convenient access
 */
export const Markdown = {
  render,
  renderDark,
  renderLight,
  renderAscii,
  renderPlain,
  createRenderer,
  themes: {
    dark: DarkTheme,
    light: LightTheme,
    ascii: AsciiTheme,
    noColor: NoColorTheme,
  },
};
