/**
 * Utility function to spell numbers in Latin/Spanish style
 * Used for clock displays that show numbers as words
 */

const spellNumber = (num: number): string => {
  const ones = [
    '',
    'UNUS',
    'DUO',
    'TRES',
    'QUATTUOR',
    'QUINQUE',
    'SEX',
    'SEPTEM',
    'OCTO',
    'NOVEM',
  ];
  const teens = [
    'DECEM',
    'UNDECIM',
    'DUODECIM',
    'TREDECIM',
    'QUATTUORDECIM',
    'QUINDECIM',
    'SEDECIM',
    'SEPTEDECIM',
    'DUODEVIGINTI',
    'UNDEVIGINTI',
  ];
  const tens = [
    '',
    '',
    'VIGINTI',
    'TRIGINTA',
    'QUADRAGINTA',
    'QUINQUAGINTA',
    'SEXAGINTA',
    'SEPTUAGINTA',
    'OCTOGINTA',
    'NONAGINTA',
  ];

  if (num === 0) return 'NULLUS';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return tens[ten] + (one > 0 ? ' ' + ones[one] : '');
  }
  return num.toString();
};

export const spellTwoDigitNumber = (twoDigitStr: string): string => {
  const num = parseInt(twoDigitStr, 10);
  if (twoDigitStr.startsWith('0') && num !== 0) {
    return 'NULLA ' + spellNumber(num);
  }
  return spellNumber(num);
};
