import { describe, it, expect, vi } from 'vitest';
import genPassword from './genPassword';

describe('genPassword', () => {
  describe('Basic Functionality', () => {
    it('should generate password with correct length', () => {
      const password = genPassword(16);
      expect(password).toHaveLength(16);
    });

    it('should generate password with only lowercase by default', () => {
      const password = genPassword(32);
      expect(password).toMatch(/^[a-z]+$/);
      expect(password).toHaveLength(32);
    });

    it('should generate password with uppercase when enabled', () => {
      const password = genPassword(50, true, true, false, false);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toHaveLength(50);
    });

    it('should generate password with digits when enabled', () => {
      const password = genPassword(30, true, false, true, false);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toHaveLength(30);
    });

    it('should generate password with special characters when enabled', () => {
      const password = genPassword(20, true, false, false, true);
      expect(password).toMatch(/[!$%&#?]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toHaveLength(20);
    });

    it('should generate password with all character types enabled', () => {
      const password = genPassword(25, true, true, true, true);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!$%&#?]/);
      expect(password).toHaveLength(25);
    });
  });

  describe('Character Set Guarantee', () => {
    it('should guarantee at least one character from each enabled type (length=4, all types)', () => {
      // Run 50 times to ensure consistency
      for (let i = 0; i < 50; i++) {
        const password = genPassword(4, true, true, true, true);
        expect(password).toMatch(/[a-z]/);
        expect(password).toMatch(/[A-Z]/);
        expect(password).toMatch(/[0-9]/);
        expect(password).toMatch(/[!$%&#?]/);
        expect(password).toHaveLength(4);
      }
    });

    it('should guarantee both lowercase and digits when both enabled', () => {
      // Run 50 times with length=10
      for (let i = 0; i < 50; i++) {
        const password = genPassword(10, true, false, true, false);
        expect(password).toMatch(/[a-z]/);
        expect(password).toMatch(/[0-9]/);
        expect(password).toHaveLength(10);
      }
    });

    it('should guarantee uppercase and special when both enabled', () => {
      for (let i = 0; i < 50; i++) {
        const password = genPassword(8, false, true, false, true);
        expect(password).toMatch(/[A-Z]/);
        expect(password).toMatch(/[!$%&#?]/);
        expect(password).toHaveLength(8);
      }
    });

    it('should work correctly with minimum length equal to number of types', () => {
      // 3 types enabled, length=3
      const password = genPassword(3, true, true, true, false);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toHaveLength(3);
    });
  });

  describe('Ambiguous Character Filtering', () => {
    it('should exclude ambiguous characters when excludeAmbiguous is true', () => {
      const ambiguousChars = '0O1lI5S8B2Z6b9q';

      // Generate many passwords to ensure no ambiguous chars appear
      for (let i = 0; i < 100; i++) {
        const password = genPassword(20, true, true, true, true, true);

        for (const char of ambiguousChars) {
          expect(password).not.toContain(char);
        }
      }
    });

    it('should exclude ambiguous lowercase letters (l, o, q, b)', () => {
      for (let i = 0; i < 50; i++) {
        const password = genPassword(30, true, false, false, false, true);
        expect(password).not.toMatch(/[loqb]/);
        expect(password).toMatch(/[a-z]/); // Still has some lowercase
      }
    });

    it('should exclude ambiguous uppercase letters (O, I, S, B, Z)', () => {
      for (let i = 0; i < 50; i++) {
        const password = genPassword(30, false, true, false, false, true);
        expect(password).not.toMatch(/[OISBZ]/);
        expect(password).toMatch(/[A-Z]/); // Still has some uppercase
      }
    });

    it('should exclude ambiguous digits (0, 1, 2, 5, 6, 8, 9) leaving only 3, 4, 7', () => {
      for (let i = 0; i < 50; i++) {
        const password = genPassword(20, false, false, true, false, true);
        expect(password).not.toMatch(/[012569]/);
        expect(password).toMatch(/^[347]+$/); // Only 3, 4, 7
      }
    });

    it('should not affect special characters', () => {
      const password = genPassword(20, false, false, false, true, true);
      expect(password).toMatch(/^[!$%&#?]+$/);
    });

    it('should generate valid password with all types and excludeAmbiguous enabled', () => {
      const password = genPassword(15, true, true, true, true, true);
      expect(password).toHaveLength(15);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[347]/); // Only non-ambiguous digits
      expect(password).toMatch(/[!$%&#?]/);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no character types are selected', () => {
      expect(() => genPassword(10, false, false, false, false)).toThrow(
        'At least one character type must be selected'
      );
    });

    it('should throw error when length is less than number of enabled types', () => {
      expect(() => genPassword(3, true, true, true, true)).toThrow(
        'Password length must be at least 4 to include all selected character types'
      );
    });

    it('should throw error when length is 1 but 2 types are enabled', () => {
      expect(() => genPassword(1, true, true, false, false)).toThrow(
        'Password length must be at least 2 to include all selected character types'
      );
    });
  });

  describe('Randomness', () => {
    it('should generate unique passwords on multiple calls', () => {
      const passwords = new Set<string>();

      for (let i = 0; i < 100; i++) {
        passwords.add(genPassword(16, true, true, true, true));
      }

      // With 16-char passwords from ~68 chars, all 100 should be unique
      expect(passwords.size).toBe(100);
    });

    it('should not have predictable patterns (no single character dominates)', () => {
      const password = genPassword(100, true, true, true, false);
      const charCounts = new Map<string, number>();

      for (const char of password) {
        charCounts.set(char, (charCounts.get(char) || 0) + 1);
      }

      // No single character should appear more than 15% of the time
      for (const count of charCounts.values()) {
        expect(count).toBeLessThan(15);
      }
    });

    it('should use crypto.getRandomValues (not Math.random)', () => {
      const cryptoSpy = vi.spyOn(crypto, 'getRandomValues');

      genPassword(16, true, true, true, true);

      expect(cryptoSpy).toHaveBeenCalled();
      cryptoSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum length (4) with all types enabled', () => {
      const password = genPassword(4, true, true, true, true);
      expect(password).toHaveLength(4);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[!$%&#?]/);
    });

    it('should handle maximum length (64)', () => {
      const password = genPassword(64, true, true, true, true);
      expect(password).toHaveLength(64);
    });

    it('should handle single character type with various lengths', () => {
      const password4 = genPassword(4, true, false, false, false);
      expect(password4).toHaveLength(4);
      expect(password4).toMatch(/^[a-z]+$/);

      const password32 = genPassword(32, false, true, false, false);
      expect(password32).toHaveLength(32);
      expect(password32).toMatch(/^[A-Z]+$/);
    });

    it('should handle excludeAmbiguous with all types and minimum length', () => {
      // With excludeAmbiguous, we still have enough chars in each set
      const password = genPassword(4, true, true, true, true, true);
      expect(password).toHaveLength(4);

      const ambiguousChars = '0O1lI5S8B2Z6b9q';
      for (const char of ambiguousChars) {
        expect(password).not.toContain(char);
      }
    });

    it('should generate password with only digits and excludeAmbiguous', () => {
      // Only 3, 4, 7 available
      const password = genPassword(10, false, false, true, false, true);
      expect(password).toHaveLength(10);
      expect(password).toMatch(/^[347]+$/);
    });
  });
});
