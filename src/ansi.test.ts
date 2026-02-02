import { describe, it, expect } from 'vitest';
import {
  CSI,
  SGR,
  sgr,
  reset,
  style,
  bold,
  dim,
  italic,
  underline,
  strikethrough,
  inverse,
  fg,
  bg,
  fg256,
  bg256,
  fgRGB,
  bgRGB,
  stripAnsi,
  visibleLength,
} from './ansi';

describe('ANSI utilities', () => {
  describe('CSI', () => {
    it('should be the escape sequence introducer', () => {
      expect(CSI).toBe('\x1b[');
    });
  });

  describe('SGR codes', () => {
    it('should have standard codes', () => {
      expect(SGR.reset).toBe(0);
      expect(SGR.bold).toBe(1);
      expect(SGR.dim).toBe(2);
      expect(SGR.italic).toBe(3);
      expect(SGR.underline).toBe(4);
      expect(SGR.strikethrough).toBe(9);
    });

    it('should have foreground colors', () => {
      expect(SGR.fgRed).toBe(31);
      expect(SGR.fgGreen).toBe(32);
      expect(SGR.fgBlue).toBe(34);
    });

    it('should have background colors', () => {
      expect(SGR.bgRed).toBe(41);
      expect(SGR.bgGreen).toBe(42);
      expect(SGR.bgBlue).toBe(44);
    });

    it('should have bright colors', () => {
      expect(SGR.fgBrightRed).toBe(91);
      expect(SGR.bgBrightRed).toBe(101);
    });
  });

  describe('sgr', () => {
    it('should create SGR sequence', () => {
      expect(sgr(1)).toBe('\x1b[1m');
      expect(sgr(1, 31)).toBe('\x1b[1;31m');
    });
  });

  describe('reset', () => {
    it('should be reset sequence', () => {
      expect(reset).toBe('\x1b[0m');
    });
  });

  describe('style', () => {
    it('should wrap text with style codes', () => {
      const result = style('hello', SGR.bold);
      expect(result).toBe('\x1b[1mhello\x1b[0m');
    });

    it('should handle multiple codes', () => {
      const result = style('hello', SGR.bold, SGR.fgRed);
      expect(result).toBe('\x1b[1;31mhello\x1b[0m');
    });

    it('should return text unchanged if no codes', () => {
      expect(style('hello')).toBe('hello');
    });
  });

  describe('text styles', () => {
    it('should apply bold', () => {
      expect(bold('text')).toContain('\x1b[1m');
    });

    it('should apply dim', () => {
      expect(dim('text')).toContain('\x1b[2m');
    });

    it('should apply italic', () => {
      expect(italic('text')).toContain('\x1b[3m');
    });

    it('should apply underline', () => {
      expect(underline('text')).toContain('\x1b[4m');
    });

    it('should apply strikethrough', () => {
      expect(strikethrough('text')).toContain('\x1b[9m');
    });

    it('should apply inverse', () => {
      expect(inverse('text')).toContain('\x1b[7m');
    });
  });

  describe('fg/bg', () => {
    it('should apply foreground color', () => {
      expect(fg('text', SGR.fgRed)).toContain('\x1b[31m');
    });

    it('should apply background color', () => {
      expect(bg('text', SGR.bgBlue)).toContain('\x1b[44m');
    });
  });

  describe('256 colors', () => {
    it('should apply 256-color foreground', () => {
      const result = fg256('text', 196);
      expect(result).toContain('\x1b[38;5;196m');
    });

    it('should apply 256-color background', () => {
      const result = bg256('text', 226);
      expect(result).toContain('\x1b[48;5;226m');
    });
  });

  describe('RGB colors', () => {
    it('should apply RGB foreground', () => {
      const result = fgRGB('text', 255, 128, 0);
      expect(result).toContain('\x1b[38;2;255;128;0m');
    });

    it('should apply RGB background', () => {
      const result = bgRGB('text', 0, 128, 255);
      expect(result).toContain('\x1b[48;2;0;128;255m');
    });
  });

  describe('stripAnsi', () => {
    it('should remove ANSI codes', () => {
      const styled = bold('hello');
      expect(stripAnsi(styled)).toBe('hello');
    });

    it('should handle multiple codes', () => {
      const styled = style('hello', SGR.bold, SGR.fgRed);
      expect(stripAnsi(styled)).toBe('hello');
    });

    it('should handle text without codes', () => {
      expect(stripAnsi('plain text')).toBe('plain text');
    });

    it('should handle complex nested styles', () => {
      const text = bold('a') + italic('b') + 'c';
      expect(stripAnsi(text)).toBe('abc');
    });
  });

  describe('visibleLength', () => {
    it('should return length without ANSI codes', () => {
      const styled = bold('hello');
      expect(visibleLength(styled)).toBe(5);
    });

    it('should handle plain text', () => {
      expect(visibleLength('hello')).toBe(5);
    });

    it('should handle complex styled text', () => {
      const text = bold('a') + fg256('bc', 196) + 'def';
      expect(visibleLength(text)).toBe(6);
    });
  });
});
