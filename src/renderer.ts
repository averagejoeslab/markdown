/**
 * Markdown to terminal renderer
 */

import { Lexer, Token, Tokens } from 'marked';
import * as ansi from './ansi';
import { Theme, ElementStyle, DarkTheme } from './styles';

/**
 * Renderer options
 */
export interface RenderOptions {
  /** Theme to use */
  theme?: Theme;
  /** Terminal width (0 = no wrapping) */
  width?: number;
  /** Whether to show link URLs */
  showUrls?: boolean;
  /** Whether to use soft wrapping */
  softWrap?: boolean;
}

/**
 * Render context for tracking state
 */
interface RenderContext {
  theme: Theme;
  width: number;
  showUrls: boolean;
  softWrap: boolean;
  indent: number;
  listDepth: number;
  listItemIndex: number[];
  inBlockquote: boolean;
}

/**
 * Apply element style to text
 */
function applyStyle(text: string, style: ElementStyle | undefined): string {
  if (!style) return text;

  const codes: number[] = [];

  // Add style attributes
  if (style.bold) codes.push(ansi.SGR.bold);
  if (style.dim) codes.push(ansi.SGR.dim);
  if (style.italic) codes.push(ansi.SGR.italic);
  if (style.underline) codes.push(ansi.SGR.underline);
  if (style.strikethrough) codes.push(ansi.SGR.strikethrough);
  if (style.inverse) codes.push(ansi.SGR.inverse);

  // Add foreground color
  if (style.color !== undefined) {
    if (typeof style.color === 'number') {
      codes.push(style.color);
    } else {
      // RGB color - apply separately
      text = ansi.fgRGB(text, style.color[0], style.color[1], style.color[2]);
    }
  }

  // Add background color
  if (style.backgroundColor !== undefined) {
    if (typeof style.backgroundColor === 'number') {
      codes.push(style.backgroundColor);
    } else {
      text = ansi.bgRGB(text, style.backgroundColor[0], style.backgroundColor[1], style.backgroundColor[2]);
    }
  }

  // Apply prefix/suffix
  if (style.prefix) text = style.prefix + text;
  if (style.suffix) text = text + style.suffix;

  // Apply SGR codes if any
  if (codes.length > 0) {
    text = ansi.style(text, ...codes);
  }

  return text;
}

/**
 * Wrap text to width
 */
function wrapText(text: string, width: number, indent: number = 0): string {
  if (width <= 0 || width <= indent) return text;

  const effectiveWidth = width - indent;
  const indentStr = ' '.repeat(indent);
  const lines: string[] = [];
  const words = text.split(/\s+/);
  let currentLine = '';

  for (const word of words) {
    const wordLen = ansi.visibleLength(word);
    const lineLen = ansi.visibleLength(currentLine);

    if (lineLen + wordLen + 1 <= effectiveWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(indentStr + currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(indentStr + currentLine);
  }

  return lines.join('\n');
}

/**
 * Add margin (empty lines) around text
 */
function addMargin(text: string, margin: number | undefined): string {
  if (!margin || margin <= 0) return text;
  const padding = '\n'.repeat(margin);
  return padding + text + padding;
}

/**
 * Render inline tokens
 */
function renderInline(tokens: Token[], ctx: RenderContext): string {
  let result = '';

  for (const token of tokens) {
    switch (token.type) {
      case 'text':
        result += (token as Tokens.Text).text;
        break;

      case 'strong':
        result += applyStyle(
          renderInline((token as Tokens.Strong).tokens, ctx),
          ctx.theme.strong
        );
        break;

      case 'em':
        result += applyStyle(
          renderInline((token as Tokens.Em).tokens, ctx),
          ctx.theme.emphasis
        );
        break;

      case 'codespan':
        result += applyStyle(
          (token as Tokens.Codespan).text,
          ctx.theme.code
        );
        break;

      case 'del':
        result += applyStyle(
          renderInline((token as Tokens.Del).tokens, ctx),
          ctx.theme.strikethrough
        );
        break;

      case 'link': {
        const link = token as Tokens.Link;
        let linkText = renderInline(link.tokens, ctx);
        if (ctx.showUrls && link.href) {
          linkText += ` (${link.href})`;
        }
        result += applyStyle(linkText, ctx.theme.link);
        break;
      }

      case 'image': {
        const img = token as Tokens.Image;
        result += applyStyle(img.text || img.href, ctx.theme.image);
        break;
      }

      case 'br':
        result += '\n';
        break;

      case 'escape':
        result += (token as Tokens.Escape).text;
        break;

      default:
        if ('text' in token) {
          result += (token as { text: string }).text;
        }
    }
  }

  return result;
}

/**
 * Render a single token
 */
function renderToken(token: Token, ctx: RenderContext): string {
  switch (token.type) {
    case 'heading': {
      const heading = token as Tokens.Heading;
      const level = heading.depth as 1 | 2 | 3 | 4 | 5 | 6;
      const style = ctx.theme[`h${level}`] ?? ctx.theme.heading;
      const text = renderInline(heading.tokens, ctx);
      return addMargin(applyStyle(text, style), style?.margin);
    }

    case 'paragraph': {
      const para = token as Tokens.Paragraph;
      let text = renderInline(para.tokens, ctx);
      if (ctx.width > 0) {
        text = wrapText(text, ctx.width, ctx.indent);
      }
      return addMargin(applyStyle(text, ctx.theme.paragraph), ctx.theme.paragraph?.margin);
    }

    case 'blockquote': {
      const quote = token as Tokens.Blockquote;
      const prevInBlockquote = ctx.inBlockquote;
      ctx.inBlockquote = true;
      ctx.indent += ctx.theme.blockquote?.indent ?? 0;

      const content = quote.tokens.map(t => renderToken(t, ctx)).join('\n');
      const lines = content.split('\n').map(line => {
        const prefix = ctx.theme.blockquote?.prefix ?? '│ ';
        return prefix + line;
      });

      ctx.inBlockquote = prevInBlockquote;
      ctx.indent -= ctx.theme.blockquote?.indent ?? 0;

      return addMargin(
        applyStyle(lines.join('\n'), ctx.theme.blockquote),
        ctx.theme.blockquote?.margin
      );
    }

    case 'code': {
      const code = token as Tokens.Code;
      const style = ctx.theme.codeBlock;
      const padding = style?.padding ?? 0;
      const paddingStr = ' '.repeat(padding);

      const lines = code.text.split('\n').map(line => paddingStr + line + paddingStr);
      let content = lines.join('\n');

      if (code.lang) {
        const langLabel = applyStyle(code.lang, { dim: true });
        content = langLabel + '\n' + content;
      }

      return addMargin(applyStyle(content, style), style?.margin);
    }

    case 'list': {
      const list = token as Tokens.List;
      ctx.listDepth++;
      ctx.listItemIndex.push(0);

      const items = list.items.map((item, idx) => {
        ctx.listItemIndex[ctx.listDepth - 1] = idx + 1;
        return renderListItem(item, list.ordered ?? false, ctx);
      });

      ctx.listItemIndex.pop();
      ctx.listDepth--;

      return addMargin(items.join('\n'), ctx.theme.list?.margin);
    }

    case 'hr': {
      const style = ctx.theme.horizontalRule;
      const char = ctx.theme.hrChar ?? '─';
      const width = ctx.width > 0 ? ctx.width : 40;
      const line = char.repeat(width);
      return addMargin(applyStyle(line, style), style?.margin);
    }

    case 'table': {
      const table = token as Tokens.Table;
      return renderTable(table, ctx);
    }

    case 'html':
      // Strip HTML tags for terminal
      return (token as Tokens.HTML).text.replace(/<[^>]*>/g, '');

    case 'space':
      return '';

    default:
      if ('tokens' in token && Array.isArray((token as { tokens: Token[] }).tokens)) {
        return (token as { tokens: Token[] }).tokens.map(t => renderToken(t, ctx)).join('\n');
      }
      return '';
  }
}

/**
 * Render a list item
 */
function renderListItem(item: Tokens.ListItem, ordered: boolean, ctx: RenderContext): string {
  const indent = ' '.repeat((ctx.listDepth - 1) * (ctx.theme.listItem?.indent ?? 2));
  let marker: string;

  if (item.task) {
    const checkbox = item.checked
      ? (ctx.theme.checkbox?.checked ?? '✓')
      : (ctx.theme.checkbox?.unchecked ?? '○');
    marker = checkbox + ' ';
  } else if (ordered) {
    marker = `${ctx.listItemIndex[ctx.listDepth - 1]}. `;
  } else {
    const bullet = ctx.theme.bullet ?? '•';
    marker = ctx.theme.bulletColor
      ? ansi.style(bullet, ctx.theme.bulletColor) + ' '
      : bullet + ' ';
  }

  const content = item.tokens.map(t => {
    if (t.type === 'text' && (t as Tokens.Text).tokens) {
      return renderInline((t as Tokens.Text).tokens!, ctx);
    }
    return renderToken(t, ctx);
  }).join('');

  return indent + marker + content;
}

/**
 * Render a table
 */
function renderTable(table: Tokens.Table, ctx: RenderContext): string {
  // Calculate column widths
  const colWidths: number[] = [];
  for (let i = 0; i < table.header.length; i++) {
    let maxWidth = ansi.visibleLength(renderInline(table.header[i].tokens, ctx));
    for (const row of table.rows) {
      const cellWidth = ansi.visibleLength(renderInline(row[i].tokens, ctx));
      maxWidth = Math.max(maxWidth, cellWidth);
    }
    colWidths.push(maxWidth);
  }

  // Render header
  const headerCells = table.header.map((cell, i) => {
    const text = renderInline(cell.tokens, ctx);
    return applyStyle(text.padEnd(colWidths[i]), ctx.theme.tableHeader);
  });
  const headerRow = '│ ' + headerCells.join(' │ ') + ' │';

  // Render separator
  const separator = '├' + colWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤';

  // Render top border
  const topBorder = '┌' + colWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐';

  // Render bottom border
  const bottomBorder = '└' + colWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘';

  // Render rows
  const rows = table.rows.map(row => {
    const cells = row.map((cell, i) => {
      const text = renderInline(cell.tokens, ctx);
      return applyStyle(text.padEnd(colWidths[i]), ctx.theme.tableCell);
    });
    return '│ ' + cells.join(' │ ') + ' │';
  });

  const result = [topBorder, headerRow, separator, ...rows, bottomBorder].join('\n');
  return addMargin(result, ctx.theme.table?.margin);
}

/**
 * Render markdown to terminal-styled string
 */
export function render(markdown: string, options: RenderOptions = {}): string {
  const theme = options.theme ?? DarkTheme;
  const ctx: RenderContext = {
    theme,
    width: options.width ?? 0,
    showUrls: options.showUrls ?? false,
    softWrap: options.softWrap ?? true,
    indent: 0,
    listDepth: 0,
    listItemIndex: [],
    inBlockquote: false,
  };

  // Parse markdown
  const tokens = Lexer.lex(markdown);

  // Render tokens
  const rendered = tokens.map(token => renderToken(token, ctx)).join('\n');

  // Clean up multiple blank lines
  return rendered.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Render markdown with specific theme
 */
export function renderWithTheme(markdown: string, theme: Theme, options?: Omit<RenderOptions, 'theme'>): string {
  return render(markdown, { ...options, theme });
}
