import { describe, it, expect } from 'vitest';
import {
  DarkTheme,
  LightTheme,
  AsciiTheme,
  NoColorTheme,
  mergeThemes,
} from './styles';
import { SGR } from './ansi';

describe('Themes', () => {
  describe('DarkTheme', () => {
    it('should have heading styles', () => {
      expect(DarkTheme.h1).toBeDefined();
      expect(DarkTheme.h1?.bold).toBe(true);
      expect(DarkTheme.h1?.color).toBe(SGR.fgBrightCyan);
    });

    it('should have code styles', () => {
      expect(DarkTheme.code).toBeDefined();
      expect(DarkTheme.codeBlock).toBeDefined();
    });

    it('should have bullet character', () => {
      expect(DarkTheme.bullet).toBe('•');
    });
  });

  describe('LightTheme', () => {
    it('should have heading styles', () => {
      expect(LightTheme.h1).toBeDefined();
      expect(LightTheme.h1?.bold).toBe(true);
    });

    it('should differ from dark theme', () => {
      expect(LightTheme.h1?.color).not.toBe(DarkTheme.h1?.color);
    });
  });

  describe('AsciiTheme', () => {
    it('should use ASCII bullet', () => {
      expect(AsciiTheme.bullet).toBe('*');
    });

    it('should use ASCII checkboxes', () => {
      expect(AsciiTheme.checkbox?.checked).toBe('[x]');
      expect(AsciiTheme.checkbox?.unchecked).toBe('[ ]');
    });

    it('should use ASCII horizontal rule', () => {
      expect(AsciiTheme.hrChar).toBe('-');
    });
  });

  describe('NoColorTheme', () => {
    it('should not have color codes', () => {
      expect(NoColorTheme.h1?.color).toBeUndefined();
      expect(NoColorTheme.strong?.color).toBeUndefined();
      expect(NoColorTheme.code?.color).toBeUndefined();
    });

    it('should use simple markers', () => {
      expect(NoColorTheme.bullet).toBe('-');
    });
  });

  describe('mergeThemes', () => {
    it('should merge simple values', () => {
      const merged = mergeThemes(DarkTheme, { bullet: '*' });
      expect(merged.bullet).toBe('*');
      expect(merged.h1).toBe(DarkTheme.h1);
    });

    it('should merge element styles', () => {
      const merged = mergeThemes(DarkTheme, {
        h1: { color: SGR.fgRed },
      });
      expect(merged.h1?.color).toBe(SGR.fgRed);
      expect(merged.h1?.bold).toBe(true); // Preserved from base
    });

    it('should override element styles completely', () => {
      const merged = mergeThemes(DarkTheme, {
        h1: { color: SGR.fgRed, bold: false },
      });
      expect(merged.h1?.bold).toBe(false);
    });

    it('should preserve unmodified values', () => {
      const merged = mergeThemes(DarkTheme, { bullet: 'x' });
      expect(merged.h2).toBe(DarkTheme.h2);
      expect(merged.h3).toBe(DarkTheme.h3);
      expect(merged.code).toBe(DarkTheme.code);
    });
  });
});
