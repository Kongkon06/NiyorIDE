import { Utilities } from '../utils/Utilities';
import { WordUnicode } from '../core/Constants';

export class Romanization {

  static UnicodeToRomanOverrideMap: Map<string, string> = new Map();
  static UnicodeToRomanOverrideList: Map<string, string[]> = new Map();

  static UnicodeToRomanMap: Map<string, string> = new Map();
  static UnicodeToRomanMapInit: Map<string, string> = new Map();
  static UnicodeToDlinkRomanMap: Map<string, string> = new Map();

  static ForwardAlterSound: Map<string, Map<string, string>> = new Map();
  static BackwardAlterSound: Map<string, Map<string, string>> = new Map();
  static vowels: string[] = [
    "0x0985",
    "0x0986",
    "0x0987",
    "0x0988",
    "0x0989",
    "0x098a",
    "0x098b",
    "0x098f",
    "0x0990",
    "0x0993",
    "0x0994"
  ];

  static vMod: string[] = [
    "0x09be",
    "0x09bf",
    "0x09c0",
    "0x09c1",
    "0x09c2",
    "0x09c3",
    "0x09c7",
    "0x09c8",
    "0x09cb",
    "0x09cc",
    "0x0981"
  ];


  static initializeUnicodeToRomanOverrideMaps(fileContent: string): void {
    if (fileContent == '' || fileContent == null) {
      console.error(`Error: File is empty`);
      return;
    }

    const data = fileContent; 
    const lines = data.split(/\r?\n/);

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith("//")) {
        continue;
      }

      const parts = line.split("\t");
      if (parts.length < 2) {
        continue;
      }

      const roman = parts[0].trim().toLowerCase();
      const unicodeString = Utilities.getUnicodeString(parts[1]);

      if (roman.length > 0) {
        Romanization.UnicodeToRomanOverrideMap.set(unicodeString, roman);

        if (!Romanization.UnicodeToRomanOverrideList.has(unicodeString)) {
          Romanization.UnicodeToRomanOverrideList.set(unicodeString, []);
        }

        Romanization.UnicodeToRomanOverrideList
          .get(unicodeString)!
          .push(roman);
      }
    }
  }

   static InitializeMaps(): void {
    // ---- UnicodeToRomanMap ----
    this.UnicodeToRomanMap.set("0x0985", "o");
    this.UnicodeToRomanMap.set("0x0986", "a");
    this.UnicodeToRomanMap.set("0x0987", "i");
    this.UnicodeToRomanMap.set("0x0988", "i");
    this.UnicodeToRomanMap.set("0x0989", "u");
    this.UnicodeToRomanMap.set("0x098a", "u");
    this.UnicodeToRomanMap.set("0x098b", "ri");
    this.UnicodeToRomanMap.set("0x098f", "e");
    this.UnicodeToRomanMap.set("0x0990", "oi");
    this.UnicodeToRomanMap.set("0x0993", "u");
    this.UnicodeToRomanMap.set("0x0994", "ou");
    this.UnicodeToRomanMap.set("0x0995", "ko");
    this.UnicodeToRomanMap.set("0x0996", "kho");
    this.UnicodeToRomanMap.set("0x0997", "go");
    this.UnicodeToRomanMap.set("0x0998", "gho");
    this.UnicodeToRomanMap.set("0x0999", "ngo");
    this.UnicodeToRomanMap.set("0x099a", "co");
    this.UnicodeToRomanMap.set("0x099b", "co"); // cho
    this.UnicodeToRomanMap.set("0x099c", "jo");
    this.UnicodeToRomanMap.set("0x099d", "jho");
    this.UnicodeToRomanMap.set("0x099e", "yo"); // nyo -> yo
    this.UnicodeToRomanMap.set("0x099f", "to");
    this.UnicodeToRomanMap.set("0x09a0", "tho");
    this.UnicodeToRomanMap.set("0x09a1", "do");
    this.UnicodeToRomanMap.set("0x09a2", "dho");
    this.UnicodeToRomanMap.set("0x09a3", "no");
    this.UnicodeToRomanMap.set("0x09a4", "to");
    this.UnicodeToRomanMap.set("0x09a5", "tho");
    this.UnicodeToRomanMap.set("0x09a6", "do");
    this.UnicodeToRomanMap.set("0x09a7", "dho");
    this.UnicodeToRomanMap.set("0x09a8", "no");
    this.UnicodeToRomanMap.set("0x09aa", "po");
    this.UnicodeToRomanMap.set("0x09ab", "fo");
    this.UnicodeToRomanMap.set("0x09ac", "bo");
    this.UnicodeToRomanMap.set("0x09ad", "vo");
    this.UnicodeToRomanMap.set("0x09ae", "mo");
    this.UnicodeToRomanMap.set("0x09af", "jo");
    this.UnicodeToRomanMap.set("0x09f0", "ro");
    this.UnicodeToRomanMap.set("0x09b2", "lo");
    this.UnicodeToRomanMap.set("0x09f1", "wo");
    this.UnicodeToRomanMap.set("0x09b6", "kho");
    this.UnicodeToRomanMap.set("0x09b7", "sho");
    this.UnicodeToRomanMap.set("0x09b8", "kho");
    this.UnicodeToRomanMap.set("0x09b9", "ho");
    this.UnicodeToRomanMap.set("0x09df", "yo");
    this.UnicodeToRomanMap.set("0x09dc", "ro");
    this.UnicodeToRomanMap.set("0x09dd", "ro");
    this.UnicodeToRomanMap.set("0x09ce", "t");
    this.UnicodeToRomanMap.set("0x0982", "ng");
    this.UnicodeToRomanMap.set("0x09be", "a");
    this.UnicodeToRomanMap.set("0x09bf", "i");
    this.UnicodeToRomanMap.set("0x09c0", "i");
    this.UnicodeToRomanMap.set("0x09c1", "u");
    this.UnicodeToRomanMap.set("0x09c2", "u");
    this.UnicodeToRomanMap.set("0x09c3", "rhi");
    this.UnicodeToRomanMap.set("0x09c7", "e");
    this.UnicodeToRomanMap.set("0x09c8", "oi");
    this.UnicodeToRomanMap.set("0x09cb", "u");
    this.UnicodeToRomanMap.set("0x09cc", "ou");
    this.UnicodeToRomanMap.set("0x0981", "o");
    this.UnicodeToRomanMap.set("0x0aaa", "khya");

    // ---- UnicodeToRomanMapInit ----
    this.UnicodeToRomanMapInit.set("0x09b6", "ho");
    this.UnicodeToRomanMapInit.set("0x09b8", "ho");

    // ---- UnicodeToDlinkRomanMap ----
    this.UnicodeToDlinkRomanMap.set("0x0985", "o");
    this.UnicodeToDlinkRomanMap.set("0x0986", "a");
    this.UnicodeToDlinkRomanMap.set("0x0987", "i");
    this.UnicodeToDlinkRomanMap.set("0x0988", "i");
    this.UnicodeToDlinkRomanMap.set("0x0989", "u");
    this.UnicodeToDlinkRomanMap.set("0x098a", "u");
    this.UnicodeToDlinkRomanMap.set("0x098b", "ri");
    this.UnicodeToDlinkRomanMap.set("0x098f", "e");
    this.UnicodeToDlinkRomanMap.set("0x0990", "oi");
    this.UnicodeToDlinkRomanMap.set("0x0993", "u");
    this.UnicodeToDlinkRomanMap.set("0x0994", "ou");
    this.UnicodeToDlinkRomanMap.set("0x0995", "ko");
    this.UnicodeToDlinkRomanMap.set("0x0996", "kho");
    this.UnicodeToDlinkRomanMap.set("0x0997", "go");
    this.UnicodeToDlinkRomanMap.set("0x0998", "gho");
    this.UnicodeToDlinkRomanMap.set("0x0999", "ngo");
    this.UnicodeToDlinkRomanMap.set("0x099a", "co");
    this.UnicodeToDlinkRomanMap.set("0x099b", "cho");
    this.UnicodeToDlinkRomanMap.set("0x099c", "jo");
    this.UnicodeToDlinkRomanMap.set("0x099d", "jho");
    this.UnicodeToDlinkRomanMap.set("0x099e", "yo"); // nyo -> yo
    this.UnicodeToDlinkRomanMap.set("0x099f", "to");
    this.UnicodeToDlinkRomanMap.set("0x09a0", "tho");
    this.UnicodeToDlinkRomanMap.set("0x09a1", "do");
    this.UnicodeToDlinkRomanMap.set("0x09a2", "dho");
    this.UnicodeToDlinkRomanMap.set("0x09a3", "no");
    this.UnicodeToDlinkRomanMap.set("0x09a4", "to");
    this.UnicodeToDlinkRomanMap.set("0x09a5", "tho");
    this.UnicodeToDlinkRomanMap.set("0x09a6", "do");
    this.UnicodeToDlinkRomanMap.set("0x09a7", "dho");
    this.UnicodeToDlinkRomanMap.set("0x09a8", "no");
    this.UnicodeToDlinkRomanMap.set("0x09aa", "po");
    this.UnicodeToDlinkRomanMap.set("0x09ab", "fo");
    this.UnicodeToDlinkRomanMap.set("0x09ac", "bo");
    this.UnicodeToDlinkRomanMap.set("0x09ad", "vo");
    this.UnicodeToDlinkRomanMap.set("0x09ae", "mo");
    this.UnicodeToDlinkRomanMap.set("0x09af", "yo");
    this.UnicodeToDlinkRomanMap.set("0x09f0", "ro");
    this.UnicodeToDlinkRomanMap.set("0x09b2", "lo");
    this.UnicodeToDlinkRomanMap.set("0x09f1", "wo");
    this.UnicodeToDlinkRomanMap.set("0x09b6", "ho");
    this.UnicodeToDlinkRomanMap.set("0x09b7", "sho");
    this.UnicodeToDlinkRomanMap.set("0x09b8", "ho");
    this.UnicodeToDlinkRomanMap.set("0x09b9", "ho");
    this.UnicodeToDlinkRomanMap.set("0x09df", "yo");
    this.UnicodeToDlinkRomanMap.set("0x09dc", "ro");
    this.UnicodeToDlinkRomanMap.set("0x09dd", "ro");
    this.UnicodeToDlinkRomanMap.set("0x09ce", "t");
    this.UnicodeToDlinkRomanMap.set("0x0982", "ng");
    this.UnicodeToDlinkRomanMap.set("0x09be", "a");
    this.UnicodeToDlinkRomanMap.set("0x09bf", "i");
    this.UnicodeToDlinkRomanMap.set("0x09c0", "i");
    this.UnicodeToDlinkRomanMap.set("0x09c1", "u");
    this.UnicodeToDlinkRomanMap.set("0x09c2", "u");
    this.UnicodeToDlinkRomanMap.set("0x09c3", "rhi");
    this.UnicodeToDlinkRomanMap.set("0x09c7", "e");
    this.UnicodeToDlinkRomanMap.set("0x09c8", "oi");
    this.UnicodeToDlinkRomanMap.set("0x09cb", "u");
    this.UnicodeToDlinkRomanMap.set("0x09cc", "ou");
    this.UnicodeToDlinkRomanMap.set("0x0981", "o");

    // ---- ForwardAlterSound ----
    const makeNested = (): Map<string, string> => new Map<string, string>();

    let a = makeNested();
    this.ForwardAlterSound.set("0x09b8", a);
    a.set("0x09ae", "so");
    a.set("0x09ac", "so");
    a.set("0x0995", "so");
    a.set("0x09a4", "so");
    a.set("0x099f", "so");
    a.set("0x09a5", "so");
    a.set("0x09b2", "so");
    a.set("0x09f0", "so");
    a.set("0x09aa", "so");

    a = makeNested();
    this.ForwardAlterSound.set("0x09b6", a);
    a.set("0x09f0", "so");
    a.set("0x09ac", "so");
    a.set("0x09b2", "so");
    a.set("0x099a", "so");

    a = makeNested();
    this.ForwardAlterSound.set("0x09b7", a);
    a.set("0x099f", "so");
    a.set("0x09a0", "so");
    a.set("0x099e", "so");

    a = makeNested();
    this.ForwardAlterSound.set("0x099e", a);
    a.set("0x099a", "no");
    a.set("0x099b", "no");

    a = makeNested();
    this.ForwardAlterSound.set("0x099c", a);
    a.set("0x099e", "g");

    // ---- BackwardAlterSound ----
    a = makeNested();
    this.BackwardAlterSound.set("0x09ac", a);
    a.set("0x09b8", "wo");
    a.set("0x09a8", "wo");
    a.set("0x09b6", "wo");
    a.set("0x09a4", "wo");
    a.set("0x099f", "wo");
  }

  compareUnicode(a:WordUnicode, b:WordUnicode): boolean {

  if (a.unicode < b.unicode)
    return true;
  else
    return false;
  }

  Romanize(inputContent: string, roman2UnicodeMap: Map<string, string[]>): void {
    const lines = inputContent.split("\n");

    const alreadySeen = new Set<string>();
    const webPrintableWords: WordUnicode[] = [];

    let i = 0;

    for (const line of lines) {
      const parts = line.split("\t");
      if (parts.length < 2) continue;

      const str = parts[1].trim();

      if (alreadySeen.has(str)) continue;
      alreadySeen.add(str);

      let roman = "";
      if (!Romanization.UnicodeToRomanOverrideMap.has(str)) {
        roman = Romanization.convert2Roman(str);
      } else {
        roman = Romanization.UnicodeToRomanOverrideMap.get(str) ?? "";
      }

      i++;
      if (str.length > 0 && roman.length > 0) {
        if (!roman2UnicodeMap.has(roman)) {
          roman2UnicodeMap.set(roman, []);
        }
        roman2UnicodeMap.get(roman)!.push(str);

        const k: WordUnicode = {
          word: roman,
          unicode: Utilities.getUnicodeForWebPage(str, "0x"),
        };
        webPrintableWords.push(k);
      }
    }

    // Process override list
    for (const [str, romans] of Romanization.UnicodeToRomanOverrideList.entries()) {
      for (const roman of romans) {
        if (roman.length > 0) {
          if (!roman2UnicodeMap.has(roman)) {
            roman2UnicodeMap.set(roman, []);
          }
          roman2UnicodeMap.get(roman)!.push(str);

          const k: WordUnicode = {
            word: roman,
            unicode: Utilities.getUnicodeForWebPage(str, "0x"),
          };
          webPrintableWords.push(k);
        }
      }
    }

    // Optionally sort (like qSort in C++)
    webPrintableWords.sort((a, b) => a.unicode.localeCompare(b.unicode));
  }

  static isEndWithVowel(token:string): boolean {

  let flag:boolean = false;
  for (let i = 0; i < Romanization.vowels.length; i++) {
    if (token.endsWith(Romanization.vowels[i])) {
      flag = true;
    }
  }
  return flag;
  }
  static isVowelModifier(ch: string): boolean {
   let flag:boolean = false;
    for (let i = 0; i < Romanization.vMod.length;i++) {
    if (ch == Romanization.vMod[i]) {
      flag = true;
    }
    }
    return flag;
  }
  static isConjunctChar(ch: string): boolean {
  let flag:boolean = false;
  if (ch == "0x09cd") {
    flag = true;
  }
  return flag;
  }

 static convert2Roman(strC: string): string {
    let roman = "";
    const re = /o$/; // equivalent of QRegExp("o$")
    let prevtoken = "";
    let token = "";

    // Fix substitution
    let str = strC.replace(/0x9950x9cd0x9b7/g, "0x0aaa");

    // Split into tokens
    const tokens = Utilities.getStringListFromHexString(str, "0x");
    const numTokens = tokens.length;

    for (let i = 0; i < numTokens; i++) {
      const tok = tokens[i];

      if (("0x" + tok).length < 6) {
        token = "0x0" + tok;
      } else {
        token = "0x" + tok;
      }

      if (this.isVowelModifier(token) || this.isConjunctChar(token)) {
        // remove trailing "o"
        roman = roman.replace(re, "");
        if (this.UnicodeToDlinkRomanMap.has(token)) {
          roman += this.UnicodeToDlinkRomanMap.get(token);
        }
      } else {
        if (prevtoken.length > 1 && this.isConjunctChar(prevtoken)) {
          if (this.UnicodeToDlinkRomanMap.has(token)) {
            roman += this.UnicodeToDlinkRomanMap.get(token);
          }
        } else if (
          numTokens - i > 2 &&
          this.ForwardAlterSound.has(token) &&
          this.isConjunctChar("0x0" + tokens[i + 1]) &&
          this.ForwardAlterSound.get(token)!.has("0x0" + tokens[i + 2])
        ) {
          roman += this.ForwardAlterSound.get(token)!.get("0x0" + tokens[i + 2]);
        } else if (
          i > 1 &&
          this.BackwardAlterSound.has(token) &&
          this.isConjunctChar("0x0" + tokens[i - 1]) &&
          this.BackwardAlterSound.get(token)!.has("0x0" + tokens[i - 2])
        ) {
          roman += this.BackwardAlterSound.get(token)!.get("0x0" + tokens[i - 2]);
        } else {
          if (this.UnicodeToRomanMap.has(token)) {
            if (i === 0 && this.UnicodeToRomanMapInit.has(token)) {
              roman += this.UnicodeToRomanMapInit.get(token);
            } else {
              roman += this.UnicodeToRomanMap.get(token);
            }
          }
        }
      }
      prevtoken = token;
    }

    // Final cleanup
    if (tokens.length > 1) {
      roman = roman.replace(re, "");
    }

    if (tokens.length > 2) {
      if (this.isConjunctChar(tokens[tokens.length - 2])) {
        roman += "o";
      }
    }

    return roman;
  }


}

