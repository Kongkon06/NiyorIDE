import { KeyFloat } from "../core/Constants";

export class Utilities {

  static vowelMap: Map<string, string> | null = null;
  static inverseVowelMap: Map<string, string> | null = null;
  static alphabetOrder: Map<string, number> | null = null;;
  static consonantMap: Map<string, string> | null = null;
  static zeroLengthChar: Map<string, boolean> | null = null;

  static split(str: string, delim: string): string[] {
    const strList: string[] = [];

    if (delim.length === 0) {
      // Split into individual characters
      for (let i = 0; i < str.length; i++) {
        strList.push(str[i]);
      }
      return strList;
    }

    // Split by delimiter
    const list = str.split(delim);
    for (const item of list) {
      if (item !== "") {
        strList.push(item);
      }
    }

    return strList;
  }

  static initializeVowelMap() {

    if (Utilities.vowelMap != null) return;

    Utilities.vowelMap = new Map<string, string>();
    Utilities.vowelMap.set("0x986", "0x9be");

    Utilities.vowelMap.set("0x987", "0x9bf");
    Utilities.vowelMap.set("0x988", "0x9c0");
    Utilities.vowelMap.set("0x989", "0x9c1");

    Utilities.vowelMap.set("0x98a", "0x9c2");
    Utilities.vowelMap.set("0x98b", "0x9c3");

    Utilities.vowelMap.set("0x98f", "0x9c7");
    Utilities.vowelMap.set("0x990", "0x9c8");

    Utilities.vowelMap.set("0x993", "0x9cb");
    Utilities.vowelMap.set("0x994", "0x9cc");


    Utilities.inverseVowelMap = new Map<string, string>();

    for (const [key, value] of Utilities.vowelMap.entries()) {
      Utilities.inverseVowelMap.set(value, key);
    }
  }

  static initializeZeroLengthChar() {
    if (Utilities.zeroLengthChar != null) return;

  Utilities.zeroLengthChar = new Map<string,boolean>();
  
  Utilities.zeroLengthChar.set("0x9be", true);

  Utilities.zeroLengthChar.set("0x9bf", true);
  Utilities.zeroLengthChar.set("0x9c0", true);
  Utilities.zeroLengthChar.set("0x9c1", true);

  Utilities.zeroLengthChar.set("0x9c2", true);
  Utilities.zeroLengthChar.set("0x9c3", true);

  Utilities.zeroLengthChar.set("0x9c7", true);
  Utilities.zeroLengthChar.set("0x9c8", true);

  Utilities.zeroLengthChar.set("0x9cb", true);
  Utilities.zeroLengthChar.set("0x9cc", true);

  Utilities.zeroLengthChar.set("0x981", true);
  Utilities.zeroLengthChar.set("0x982", true);
  Utilities.zeroLengthChar.set("0x983", true);
  Utilities.zeroLengthChar.set("0x9fa", true);
  Utilities.zeroLengthChar.set("0x9cd", true);

  }

  static reverseX(str: string): string {
    let reverse = "";
    for (let i = str.length - 1; i >= 0; i--) {
      reverse += str[i];
    }
    return reverse;
  }

  static initializeConsonantMap(): void {
    if (Utilities.consonantMap != null) return;

    Utilities.consonantMap = new Map<string, string>();
    Utilities.consonantMap.set("0x995", "0x995");
    Utilities.consonantMap.set("0x996", "0x996");
    Utilities.consonantMap.set("0x997", "0x997");
    Utilities.consonantMap.set("0x998", "0x998");
    Utilities.consonantMap.set("0x999", "0x999");
    Utilities.consonantMap.set("0x99a", "0x99a");
    Utilities.consonantMap.set("0x99b", "0x99b");
    Utilities.consonantMap.set("0x99c", "0x99c");
    Utilities.consonantMap.set("0x99d", "0x99d");
    Utilities.consonantMap.set("0x99e", "0x99e");
    Utilities.consonantMap.set("0x99f", "0x99f");
    Utilities.consonantMap.set("0x9a0", "0x9a0");
    Utilities.consonantMap.set("0x9a1", "0x9a1");
    Utilities.consonantMap.set("0x9a2", "0x9a2");
    Utilities.consonantMap.set("0x9a3", "0x9a3");
    Utilities.consonantMap.set("0x9a4", "0x9a4");
    Utilities.consonantMap.set("0x9a5", "0x9a5");
    Utilities.consonantMap.set("0x9a6", "0x9a6");
    Utilities.consonantMap.set("0x9a7", "0x9a7");
    Utilities.consonantMap.set("0x9a8", "0x9a8");
    Utilities.consonantMap.set("0x9aa", "0x9aa");
    Utilities.consonantMap.set("0x9ab", "0x9ab");
    Utilities.consonantMap.set("0x9ac", "0x9ac");
    Utilities.consonantMap.set("0x9ad", "0x9ad");
    Utilities.consonantMap.set("0x9ae", "0x9ae");
    Utilities.consonantMap.set("0x9af", "0x9af");
    Utilities.consonantMap.set("0x9f0", "0x9f0");
    Utilities.consonantMap.set("0x9b2", "0x9b2");
    Utilities.consonantMap.set("0x9f1", "0x9f1");
    Utilities.consonantMap.set("0x9b6", "0x9b6");
    Utilities.consonantMap.set("0x9b7", "0x9b7");
    Utilities.consonantMap.set("0x9b8", "0x9b8");
    Utilities.consonantMap.set("0x9b9", "0x9b9");
    Utilities.consonantMap.set("0x9df", "0x9df");
    Utilities.consonantMap.set("0x9dc", "0x9dc");
    Utilities.consonantMap.set("0x9dd", "0x9dd");
    Utilities.consonantMap.set("0x9ce", "0x9ce");
    Utilities.consonantMap.set("0x982", "0x982");
    Utilities.consonantMap.set("0x983", "0x983");

  }

  static getStringListFromHexString(word: string, delim: string): string[] {
    const firstList = word.split(delim);
    const resultList: string[] = [];

    for (const code of firstList) {
      const trimmed = code.trim();
      if (trimmed.length > 0) {
        resultList.push(trimmed);
      }
    }

    return resultList;
  }

  static getHTMLStringFromMixedHexString(text: string): string {
    const rx = /0x([0-9a-fA-F]{3})/g; // regex for "0x123"
    let res = "";
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rx.exec(text)) !== null) {
      // Copy the text before the match
      res += text.slice(lastIndex, match.index);

      // Replace with HTML entity
      res += `&#x${match[1]};`;

      // Update lastIndex
      lastIndex = rx.lastIndex;
    }

    // Append any remaining text
    res += text.slice(lastIndex);

    return res;
  }

  static isAssamese(word: string): boolean {
    return Utilities.isValidCompleterPrefix(word);
  }
  static isValidCompleterPrefix(str: string): boolean {
    if (str.length <= 0) {
      return false;
    }

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (
        !(
          (2433 <= code && code <= 2554) || // Assamese / Indic block
          code === 0x2009 || // thin space
          code === 0x27 ||   // apostrophe
          code === 0x19 ||   // (control char in original code)
          code === 0x2010 || // hyphen
          code === 0x2011 || // non-breaking hyphen
          code === 0x2d ||   // dash '-'
          code === 0x200c || // zero width non-joiner
          code === 0x0027    // apostrophe again
        )
      ) {
        return false;
      }
    }
    return true;
  }
  static createStringFromCodeList(list: string[]): string {
    let text = "";
    for (const hex of list) {
      const value = parseInt(hex, 16); // base 16
      if (!isNaN(value)) {
        text += String.fromCharCode(value);
      }
    }
    return text;
  }

  static padWithSpaces(s: string, n: number): string {
    if (n === 0) return "";
    let padded = s;
    while (padded.length < n) {
      padded += " ";
    }
    return padded;
  }

  static getUnicode(str: string, delim: string): string {
    return Utilities.createStringFromCodeList(Utilities.split(str, delim));
  }

  static getUnicodeString(str: string): string {
    let unicodeString = "";

    if (str.length <= 0) {
      return unicodeString;
    }

    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);

      if (
        (2433 <= code && code <= 2554) ||
        code === 0x27 ||
        code === 0x19 ||
        code === 0x2010 ||
        code === 0x2011 ||
        code === 0x2d ||
        code === 0x200c ||
        code === 0x0027
      ) {
        unicodeString +=
          "0x" + Utilities.convertToHexString(code).toLowerCase();
      }
    }

    return unicodeString;
  }

  static convertToHexString(code: number): string {
    return code.toString(16); // hex string without "0x"
  }

  static toUnicodeAscending(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true });
  }

  // Example comparator: descending order by Unicode value
  static toUnicodeDescending(a: string, b: string): number {
    return b.localeCompare(a, undefined, { numeric: true });
  }

  static sortStringList(list: string[], ascending: boolean): string[] {
    if (ascending) {
      return list.sort(Utilities.toUnicodeAscending);
    } else {
      return list.sort(Utilities.toUnicodeDescending);
    }
  }

  static toAscending(a: KeyFloat, b: KeyFloat): number {
    return a.value - b.value;
  }

  // Comparator: descending by value
  static toDescending(a: KeyFloat, b: KeyFloat): number {
    return b.value - a.value;
  }

  static sortKeyFloatList(list: KeyFloat[], ascending: boolean): KeyFloat[] {
    if (ascending) {
      return list.sort(Utilities.toAscending);
    } else {
      return list.sort(Utilities.toDescending);
    }
  }

  static getUnicodeStringX(str: string): string {
    if (str.length <= 0) return "";

    let unicodeString = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i); // like QChar::unicode()
      unicodeString += Utilities.convertToHexString(code).toLowerCase();
    }
    return unicodeString;
  }

  static getUnicodeForWebPage(str: string, delim: string) {

    //  qDebug() << "Getting unicode";
    let wordCodes: string[] = Utilities.getStringListFromHexString(str, delim);
    let output: string = "";

    for (const character of wordCodes) {
      output += `&#x${character};`;
    }
    return output;
  }

  static initializeAlphabetOrder(): void {
    if (this.alphabetOrder !== null) return;

    this.alphabetOrder = new Map<string, number>([
      ["985", 10],
      ["986", 11],
      ["987", 12],
      ["988", 13],
      ["989", 14],
      ["98a", 15],
      ["98b", 16],
      ["98f", 17],
      ["990", 18],
      ["993", 19],
      ["994", 20],
      ["9be", 11],
      ["9bf", 12],
      ["9c0", 12], // 13
      ["9c1", 14],
      ["9c2", 14], // 15
      ["9c3", 16],
      ["9c7", 17],
      ["9c8", 18],
      ["9cb", 14], // 19
      ["9cc", 20],

      ["995", 21],
      ["996", 22],
      ["997", 23],
      ["998", 24],
      ["999", 25],

      ["99a", 26],
      ["99b", 26], // 27
      ["99c", 28],
      ["99d", 29],
      ["99e", 30],

      ["99f", 31],
      ["9a0", 32],
      ["9a1", 33],
      ["9a2", 34],
      ["9a3", 35],

      ["9a4", 31], // 36
      ["9a5", 32], // 37
      ["9a6", 33], // 38
      ["9a7", 34], // 39
      ["9a8", 35], // 40

      ["9aa", 41],
      ["9ab", 42],
      ["9ac", 43],
      ["9ad", 44],
      ["9ae", 45],

      ["9af", 46],
      ["9f0", 47],
      ["9b2", 48],
      ["9f1", 49],

      ["9b6", 50],
      ["9b7", 51],
      ["9b8", 52],
      ["9b9", 52], // 53

      ["9dc", 54],
      ["9dd", 55],
      ["9df", 56],
    ]);
  }

  static getStringListFromUnicodeString(unicodeString: string): string[] {
    const stringList: string[] = [];

    for (const ch of unicodeString) {
      // charCodeAt(0) gives the UTF-16 code unit (similar to QChar::unicode())
      const code = ch.charCodeAt(0);
      stringList.push(Utilities.convertToHexString(code));
    }

    return stringList;
  }
}

