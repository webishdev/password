const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const special = '!$%&#?';

/**
 * Generates a cryptographically secure random integer between min (inclusive) and max (exclusive)
 */
const random = (min: number, max: number): number => {
  const range = max - min;
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return Math.floor((randomBuffer[0] / (0xffffffff + 1)) * range) + min;
};

const genPassword = (
  length: number = 32,
  useLowercase: boolean = true,
  useUppercase: boolean = false,
  useDigits: boolean = false,
  useSpecial: boolean = false,
  excludeAmbiguous: boolean = false
): string => {
  // Define ambiguous characters to exclude
  // 0O (zero/O), 1lI (one/l/I), 5S (five/S), 8B (eight/B), 2Z (two/Z), 6b (six/b), 9q (nine/q)
  const ambiguousChars = '0O1lIo5S8B2Z6b9q';

  // Filter character sets if excludeAmbiguous is enabled
  const filterAmbiguous = (chars: string): string => {
    if (!excludeAmbiguous) return chars;
    return chars
      .split('')
      .filter((char) => !ambiguousChars.includes(char))
      .join('');
  };

  const charSets: string[] = [];
  let charPool = '';

  if (useLowercase) {
    const filteredLowercase = filterAmbiguous(lowercase);
    if (filteredLowercase.length > 0) {
      charSets.push(filteredLowercase);
      charPool += filteredLowercase;
    }
  }

  if (useUppercase) {
    const filteredUppercase = filterAmbiguous(uppercase);
    if (filteredUppercase.length > 0) {
      charSets.push(filteredUppercase);
      charPool += filteredUppercase;
    }
  }

  if (useDigits) {
    const filteredDigits = filterAmbiguous(digits);
    if (filteredDigits.length > 0) {
      charSets.push(filteredDigits);
      charPool += filteredDigits;
    }
  }

  if (useSpecial) {
    const filteredSpecial = filterAmbiguous(special);
    if (filteredSpecial.length > 0) {
      charSets.push(filteredSpecial);
      charPool += filteredSpecial;
    }
  }

  if (charPool.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  if (length < charSets.length) {
    throw new Error(
      `Password length must be at least ${charSets.length} to include all selected character types`
    );
  }

  const result: string[] = [];

  // Step 1: Guarantee at least one character from each selected set
  for (const set of charSets) {
    const randomIndex = random(0, set.length);
    result.push(set[randomIndex]);
  }

  // Step 2: Fill remaining positions with random characters from the full pool
  for (let i = charSets.length; i < length; i++) {
    const randomIndex = random(0, charPool.length);
    result.push(charPool[randomIndex]);
  }

  // Step 3: Shuffle to avoid predictable patterns (e.g., always lowercase first)
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
};

export default genPassword;
