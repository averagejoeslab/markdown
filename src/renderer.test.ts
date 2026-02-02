import { describe, it, expect } from 'vitest';
import { render, renderWithTheme } from './renderer';
import { DarkTheme, LightTheme, NoColorTheme, AsciiTheme } from './styles';
import { stripAnsi } from './ansi';

describe('Markdown Renderer', () => {
  describe('render', () => {
    describe('headings', () => {
      it('should render h1', () => {
        const result = render('# Hello');
        expect(stripAnsi(result)).toContain('# Hello');
      });

      it('should render h2', () => {
        const result = render('## World');
        expect(stripAnsi(result)).toContain('## World');
      });

      it('should render all heading levels', () => {
        const md = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
        const result = render(md);
        expect(stripAnsi(result)).toContain('# H1');
        expect(stripAnsi(result)).toContain('## H2');
        expect(stripAnsi(result)).toContain('###### H6');
      });
    });

    describe('paragraphs', () => {
      it('should render simple paragraph', () => {
        const result = render('Hello world');
        expect(stripAnsi(result)).toContain('Hello world');
      });

      it('should render multiple paragraphs', () => {
        const md = 'First paragraph.\n\nSecond paragraph.';
        const result = render(md);
        expect(stripAnsi(result)).toContain('First paragraph');
        expect(stripAnsi(result)).toContain('Second paragraph');
      });
    });

    describe('inline styles', () => {
      it('should render bold text', () => {
        const result = render('**bold**');
        expect(stripAnsi(result)).toContain('bold');
        expect(result).toContain('\x1b['); // Should have ANSI codes
      });

      it('should render italic text', () => {
        const result = render('*italic*');
        expect(stripAnsi(result)).toContain('italic');
      });

      it('should render inline code', () => {
        const result = render('`code`');
        expect(stripAnsi(result)).toContain('code');
      });

      it('should render strikethrough', () => {
        const result = render('~~deleted~~');
        expect(stripAnsi(result)).toContain('deleted');
      });

      it('should render nested styles', () => {
        const result = render('***bold and italic***');
        expect(stripAnsi(result)).toContain('bold and italic');
      });
    });

    describe('links', () => {
      it('should render link text', () => {
        const result = render('[Click here](https://example.com)');
        expect(stripAnsi(result)).toContain('Click here');
      });

      it('should show URL when showUrls is true', () => {
        const result = render('[Click](https://example.com)', { showUrls: true });
        expect(stripAnsi(result)).toContain('https://example.com');
      });
    });

    describe('images', () => {
      it('should render image alt text', () => {
        const result = render('![Alt text](image.png)');
        expect(stripAnsi(result)).toContain('Alt text');
      });
    });

    describe('code blocks', () => {
      it('should render code block', () => {
        const md = '```\nconst x = 1;\n```';
        const result = render(md);
        expect(stripAnsi(result)).toContain('const x = 1;');
      });

      it('should show language label', () => {
        const md = '```javascript\nconst x = 1;\n```';
        const result = render(md);
        expect(stripAnsi(result)).toContain('javascript');
        expect(stripAnsi(result)).toContain('const x = 1;');
      });
    });

    describe('blockquotes', () => {
      it('should render blockquote', () => {
        const result = render('> Quote text');
        expect(stripAnsi(result)).toContain('Quote text');
        expect(stripAnsi(result)).toContain('│');
      });

      it('should render nested blockquotes', () => {
        const md = '> Level 1\n>> Level 2';
        const result = render(md);
        expect(stripAnsi(result)).toContain('Level 1');
        expect(stripAnsi(result)).toContain('Level 2');
      });
    });

    describe('lists', () => {
      it('should render unordered list', () => {
        const md = '- Item 1\n- Item 2\n- Item 3';
        const result = render(md);
        expect(stripAnsi(result)).toContain('Item 1');
        expect(stripAnsi(result)).toContain('Item 2');
        expect(stripAnsi(result)).toContain('Item 3');
      });

      it('should render ordered list', () => {
        const md = '1. First\n2. Second\n3. Third';
        const result = render(md);
        expect(stripAnsi(result)).toContain('1.');
        expect(stripAnsi(result)).toContain('2.');
        expect(stripAnsi(result)).toContain('3.');
      });

      it('should render task list', () => {
        const md = '- [x] Done\n- [ ] Todo';
        const result = render(md);
        expect(stripAnsi(result)).toContain('Done');
        expect(stripAnsi(result)).toContain('Todo');
      });
    });

    describe('horizontal rule', () => {
      it('should render horizontal rule', () => {
        const result = render('---');
        expect(stripAnsi(result)).toContain('─');
      });
    });

    describe('tables', () => {
      it('should render table', () => {
        const md = '| A | B |\n|---|---|\n| 1 | 2 |';
        const result = render(md);
        expect(stripAnsi(result)).toContain('A');
        expect(stripAnsi(result)).toContain('B');
        expect(stripAnsi(result)).toContain('1');
        expect(stripAnsi(result)).toContain('2');
      });

      it('should render table borders', () => {
        const md = '| A |\n|---|\n| 1 |';
        const result = render(md);
        expect(stripAnsi(result)).toContain('┌');
        expect(stripAnsi(result)).toContain('└');
        expect(stripAnsi(result)).toContain('│');
      });
    });
  });

  describe('renderWithTheme', () => {
    it('should use specified theme', () => {
      const dark = renderWithTheme('# Hello', DarkTheme);
      const light = renderWithTheme('# Hello', LightTheme);
      // Both should have the text but different styling
      expect(stripAnsi(dark)).toBe(stripAnsi(light));
      expect(dark).not.toBe(light); // ANSI codes differ
    });
  });

  describe('themes', () => {
    it('should render with NoColorTheme', () => {
      const result = render('# Hello **world**', { theme: NoColorTheme });
      // Should have no ANSI codes
      expect(result).not.toContain('\x1b[');
      expect(result).toContain('Hello');
      expect(result).toContain('world');
    });

    it('should render with AsciiTheme', () => {
      const md = '- Item 1\n- Item 2';
      const result = render(md, { theme: AsciiTheme });
      expect(stripAnsi(result)).toContain('*'); // ASCII bullet
    });
  });

  describe('options', () => {
    it('should respect width option for wrapping', () => {
      const longText = 'This is a very long paragraph that should be wrapped when rendered with a narrow width setting.';
      const result = render(longText, { width: 30 });
      const lines = stripAnsi(result).split('\n');
      // Should have multiple lines due to wrapping
      expect(lines.length).toBeGreaterThan(1);
    });

    it('should not wrap when width is 0', () => {
      const text = 'Short text.';
      const result = render(text, { width: 0 });
      expect(stripAnsi(result).trim()).toBe('Short text.');
    });
  });

  describe('complex documents', () => {
    it('should render complex markdown', () => {
      const md = `
# Main Title

This is a paragraph with **bold** and *italic* text.

## Section

- List item 1
- List item 2

\`\`\`js
const x = 1;
\`\`\`

> A blockquote

---

| Col A | Col B |
|-------|-------|
| 1     | 2     |
`;

      const result = render(md);
      const plain = stripAnsi(result);

      expect(plain).toContain('Main Title');
      expect(plain).toContain('bold');
      expect(plain).toContain('italic');
      expect(plain).toContain('Section');
      expect(plain).toContain('List item 1');
      expect(plain).toContain('const x = 1');
      expect(plain).toContain('A blockquote');
      expect(plain).toContain('Col A');
    });
  });
});
