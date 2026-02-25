import { KeyValue, WordRank, WordUnicode, KeyDistance } from '../core/Constants';
import { TreeNode } from '../core/TreeNode';
import { Romanization } from './Romanization';
import { Utilities } from '../utils/Utilities';

export class Phonetic {
  static inflexCombinations: string[] | null = null;
  static charPhoneticMap: Map<string, string> | null = null;
  static inflexTypes: Map<string, KeyValue[]> | null = null;
  static allInflexions: Map<string, string> | null = null;
  static singleInflexions: Map<string, string> | null = null;
  static singleInflexionsReverse: Map<string, string> | null = null;

  static allWords: Map<string, string> | null = null;
  static roman2UnicodeTreeProfile: TreeNode | null = null;

  static roman2UnicodeTreeDefault: TreeNode;
  static treeNodeList: TreeNode[] = [];
  static treeNodeListProfile: TreeNode[] = [];
  static count = 0;

  static phoneticMap: Map<string, string> | null = null;
  static deleteCharMap: Map<string, string> | null = null;

  static userwords_phonetic_unicodexstr: Map<string, string> | null = null;
  static userwords_unicodexstr_phonetic: Map<string, string> | null = null;

  static distances: Map<string, Map<string, number>> | null = null;

  constructor() { }

  static initUserWordHashes() {
    if (Phonetic.userwords_phonetic_unicodexstr == null) {
      Phonetic.userwords_phonetic_unicodexstr = new Map();
      Phonetic.userwords_unicodexstr_phonetic = new Map();
    }
    return;
  }

  static insertWordFromOutside(unicodeWord: string): boolean {
    const charList: string[] = [];

    const roman = Romanization.convert2Roman(Utilities.getUnicodeString(unicodeWord));
    for (const c of roman) {
      charList.push(Phonetic.phoneticEquivString(c));
    }
    Phonetic.insertWord(Phonetic.roman2UnicodeTreeDefault, charList, Utilities.getUnicodeString(unicodeWord));
    return true;
  }

  static addUserWord(roman: string, unicode: string) {
    if (Phonetic.userwords_phonetic_unicodexstr == null) {
      Phonetic.userwords_phonetic_unicodexstr = new Map();
      Phonetic.userwords_unicodexstr_phonetic = new Map();
    }
    Phonetic.userwords_phonetic_unicodexstr.set(roman, unicode);
    if (Phonetic.userwords_unicodexstr_phonetic != null)
      Phonetic.userwords_unicodexstr_phonetic.set(unicode, roman);

  }

  static insertWord(curNode: TreeNode, charList: string[], unicodeWord: string): void {
    // ✅ Base case: no more chars left → mark this node
    if (charList.length === 0) {
      if (!curNode.roman2UnicodeList.includes(unicodeWord)) {
        curNode.roman2UnicodeList.push(unicodeWord);
      }
      curNode.fullWord = true;
      return;
    }

    // Take and remove the first character
    const newChar = charList.shift()!;

    // Ensure the link exists
    if (!curNode.links.has(newChar)) {
      curNode.links.set(newChar, new TreeNode("", false));
    }

    // ✅ Recurse on the next node with the remaining characters
    const nextNode = curNode.links.get(newChar)!;
    Phonetic.insertWord(nextNode, charList, unicodeWord);
  }


  static createPhoneticTreeProfile(wordList: string) {
    const roman2UnicodeMap: Map<string, string[]> = new Map();

    for (const word of wordList) {
      const roman = Romanization.convert2Roman(word);
      if (!roman2UnicodeMap.has(roman)) {
        roman2UnicodeMap.set(roman, [word]);
      } else {
        roman2UnicodeMap.get(roman)!.push(word);
      }
    }

    // Reset the tree
    Phonetic.roman2UnicodeTreeProfile = new TreeNode();

    for (const [roman, unicodeWords] of roman2UnicodeMap.entries()) {
      for (const unicodeWord of unicodeWords) {
        const charList: string[] = [];
        for (const c of roman) {
          charList.push(Phonetic.phoneticEquivString(c.toLowerCase()));
        }
        // Insert into the phonetic tree
        Phonetic.insertWord(Phonetic.roman2UnicodeTreeProfile, charList, unicodeWord);
      }
    }

    if (wordList.length === 0) {
      return;
    }

  }

  static createPhoneticTree(fileContent: string): void {

    const rom = new Romanization();
    const roman2UnicodeMap: Map<string, string[]> = new Map();
    rom.Romanize(fileContent, roman2UnicodeMap);

    Phonetic.roman2UnicodeTreeDefault = new TreeNode();

    for (const [key, unicodeWords] of roman2UnicodeMap.entries()) {
      for (const unicodeWord of unicodeWords) {
        const charList: string[] = [];

        for (const c of key) {
          charList.push(Phonetic.phoneticEquivString(c.toLowerCase()));
        }

        Phonetic.insertWord(Phonetic.roman2UnicodeTreeDefault, charList, unicodeWord);
      }
    }

    // let partword: string[] = [];
    // printTree(Phonetic.roman2UnicodeTree, partword);
  }

  static processPhoneticInput(orig: string): string {

    if (Phonetic.deleteCharMap != null) {
      for (const [key, value] of Phonetic.deleteCharMap.entries()) {
        const rx = new RegExp(key, "g"); // "g" → replace all
        if (rx.test(orig)) {
          orig = orig.replace(rx, value);
        }
      }
      return orig;
    }
    return "";
  }

  static toAscending(s1: WordRank, s2: WordRank): number {
    if (s1.rank < s2.rank) {
      return -1;
    } else if (s1.rank > s2.rank) {
      return 1;
    } else {
      // ranks are equal → compare length
      if (s1.len < s2.len) return -1;
      if (s1.len > s2.len) return 1;
      return 0;
    }
  }

  static toAscendingInflex(a: KeyDistance, b: KeyDistance): number {
    return a.dist - b.dist;
  }


  static rankWords(words: WordUnicode[], word: string, max: number): void {
    const wordRanks: WordRank[] = [];
    const n = word.length;

    // Build rank list
    for (const wd of words) {
      const wr: WordRank = {
        word: wd.word,
        unicode: wd.unicode,
        len: wd.word.length,
        rank: Phonetic.wordDistance(wd.word.substring(0, n), word)
      };
      wordRanks.push(wr);
    }

    // Sort ascending by rank
    wordRanks.sort((a, b) => Phonetic.toAscending(a, b));

    // Clear original list
    words.length = 0;

    let i = 0;
    for (const w of wordRanks) {
      const ratio = w.rank / word.length;

      if (ratio < 0.5) {
        const wu: WordUnicode = { word: w.word, unicode: w.unicode };
        words.push(wu);

        if (i++ > max) break;
      }
    }
  }

  static childrenOfTree(root: TreeNode | null, partword: string[], words: WordUnicode[],
    preWord: string, depth: number): void {
    if (root === null) {
      // console.log("Empty");
      return;
    }

    for (const [key, childNode] of root.links.entries()) {
      partword.push(key);

      if (!(preWord.length < 2 && depth < 2)) {
        Phonetic.childrenOfTree(childNode, partword, words, preWord, depth + 1);
      }

      if (childNode.fullWord === true) {
        let printRoman = "";
        for (const p of partword) {
          printRoman += p;
        }

        for (const wUnicode of childNode.roman2UnicodeList) {
          words.push({
            word: preWord + printRoman,
            unicode: wUnicode,
          });
        }
      }

      partword.pop();
    }
  }

  static searchRoman2UnicodeTree(curNode: TreeNode, seen: string[], notSeen: string[],
    word: string[], words: WordUnicode[], depth: number, traversalDepth: number): void {
    const partword: string[] = [];

    if (traversalDepth === depth) {
      let preWord = "";
      for (const w of word) {
        preWord += w;
      }
      Phonetic.childrenOfTree(curNode, partword, words, preWord, depth);
    }

    if (notSeen.length === 0) {
      return;
    }

    const c = notSeen.pop()!;
    seen.push(c);

    for (const [key, childNode] of curNode.links.entries()) {
      if (childNode.used === true) {
        console.log("Going into key", key);
        word.push(key);
        Phonetic.searchRoman2UnicodeTree(
          childNode,
          seen,
          notSeen,
          word,
          words,
          depth,
          traversalDepth + 1
        );
        word.pop();
      }
    }

    const lastSeen = seen.pop()!;
    notSeen.push(lastSeen);
  }

  static arrangeWordChoices(words: WordUnicode[], wordList: string[], newWord: string) {
    Phonetic.rankWords(words, newWord, 2);

    let maxLenWord = 0;
    for (const word of words) {
      if (Utilities.getUnicode(word.unicode, "0x").length > maxLenWord)
        maxLenWord = Utilities.getUnicode(word.unicode, "0x").length;
    }

    for (const word of words) {
      wordList.push(Utilities.padWithSpaces(
        Utilities.getUnicode(word.unicode, "0x"), maxLenWord));
    }

    if (newWord.length < 2) {
      wordList = [];
      return;
    }

  }

  static clearForNewWord(
    newWord: string,
    visitedNodeList: TreeNode[],
    roman2UnicodeTreeGeneric: TreeNode
  ): void {
    // Ensure newWord is a single character
    if (newWord.length !== 1) {
      throw new Error("newWord must be a single character");
    }

    // Reset previous nodes
    for (const node of visitedNodeList) {
      node.used = false;
    }
    visitedNodeList.length = 0;

    roman2UnicodeTreeGeneric.used = true;

    // Iterate over map entries
    for (const [key, node] of roman2UnicodeTreeGeneric.links.entries()) {
      const first = Phonetic.phoneticEquivString(newWord[0]);
      const second = Phonetic.phoneticEquivString(key[0]);

      // If phonetic equivalents match, mark node as used
      if (first === second) {
        node.used = true;
        visitedNodeList.push(node);
      }
    }
  }

  static markUsedWord(
    curNode: TreeNode, charList: string[], used: boolean, depth: number): boolean {
    const newChar = charList[0];
    charList.shift();

    if (charList.length > 0 && depth > 0) {
      const nextNode = curNode.links.get(newChar);
      if (nextNode) {
        Phonetic.markUsedWord(nextNode, charList, used, depth - 1);
      }
    } else {
      const targetNode = curNode.links.get(newChar);
      if (targetNode) {
        targetNode.used = used;
      }
    }

    return used;
  }

  static phoneticWordChoices(rawNewWord: string, words: WordUnicode[], profileTree: boolean): WordUnicode[] | undefined {

    const seen: string[] = [];
    const notSeen: string[] = [];
    const word: string[] = [];
    let roman2UnicodeTree: TreeNode | null;
    let nodeList: TreeNode[];

    if (profileTree === true) {
      roman2UnicodeTree = Phonetic.roman2UnicodeTreeProfile;
      nodeList = Phonetic.treeNodeListProfile;
    } else {
      roman2UnicodeTree = Phonetic.roman2UnicodeTreeDefault;
      nodeList = Phonetic.treeNodeList;
    }

    // get the phonetic string for searching in the tree
    const newWord: string = Phonetic.phoneticEquivString(rawNewWord);
    Phonetic.processPhoneticInput(newWord);

    // store the full roman word for sequentially searching in the tree
    for (const s of newWord) {
      notSeen.unshift(s.toLowerCase()); // prepend like QStack::prepend
    }

    if (!roman2UnicodeTree || roman2UnicodeTree.links.size === 0) {
      return;
    }

    // optimization: clear subtree if only 1 char
    if (newWord.length === 1) {
      Phonetic.clearForNewWord(newWord, nodeList, roman2UnicodeTree);
    }

    const localWords: WordUnicode[] = [];
    if (notSeen.length > 0) {
      Phonetic.searchRoman2UnicodeTree(
        roman2UnicodeTree,
        seen,
        notSeen,
        word,
        localWords,
        newWord.length,
        newWord.length // subtree rooted at first char already marked
      );
    }

    Phonetic.rankWords(localWords, newWord, 2);

    let i = 0;
    for (const w of localWords) {
      i++;
      const charList: string[] = [];
      for (const c of w.word) {
        charList.push(Phonetic.phoneticEquivString(c.toLowerCase()));
      }
      Phonetic.markUsedWord(roman2UnicodeTree, charList, true, newWord.length);
    }

    for (const w of localWords) {
      words.push(w);
    }

    return words;
  }

  static profileWordChoices(newWord: string, wordList: WordUnicode[]): void {
    if (Phonetic.userwords_phonetic_unicodexstr == null) {
      Phonetic.userwords_phonetic_unicodexstr = new Map<string, string>();
      Phonetic.userwords_unicodexstr_phonetic = new Map<string, string>();
    }
    for (const [key, value] of Phonetic.userwords_phonetic_unicodexstr) {
      if (key.substring(0, newWord.length) == newWord) {
        wordList.push(new WordUnicode(key, value));
      }
    }
  }

  static phoneticInflexChoices(newWord: string, wordList: string[]): void {
    const inflexList: KeyDistance[] = [];

    if (!Phonetic.singleInflexions) return;

    for (const [key, value] of Phonetic.singleInflexions?.entries()) {
      const k: KeyDistance = {
        word: key,
        dist: Phonetic.wordDistance(newWord, key),
      };

      if (k.dist < 10) {
        inflexList.push(k);
      }
    }

    // Sort ascending by distance
    inflexList.sort(Phonetic.toAscendingInflex);

    for (const k of inflexList) {
      const val = Phonetic.singleInflexions?.get(k.word) ?? "";
      wordList.push(val + "\t" + k.word);
    }

    console.log("Number of inflex choices", inflexList.length);
  }

  static printTree(root: TreeNode | null, partword: string[]): void {
    if (!root) {
      return;
    }

    for (const [key, child] of root.links.entries()) {
      // add character to current stack
      partword.push(key);

      // recurse into child
      Phonetic.printTree(child, partword);

      if (child.fullWord) {
        // rebuild word from stack
        let printRoman = partword.join("");

        // append Unicode mappings
        for (const uni of child.roman2UnicodeList) {
          printRoman += "\t" + uni;
          Phonetic.count++;
        }

        // log progress
        if (Phonetic.count % 1000 === 0) {
          console.log("Words processed:", Phonetic.count);
        }

        // here you could collect `printRoman` into an array if needed
        console.log(printRoman);
      }

      // backtrack
      partword.pop();
    }
  }

  static setInflexTypes(fileContent: string): void {
    if (Phonetic.inflexTypes !== null) {
      return;
    }

    Phonetic.inflexTypes = new Map<string, KeyValue[]>();

    let category = "";
    const lines = fileContent.split(/\r?\n/);

    for (const lineRaw of lines) {
      const line = lineRaw.trim();

      if (line.startsWith("#") || line.length < 1) {
        continue;
      }

      if (line.startsWith("//")) {
        category = line.replace("//", "").trim();
        continue;
      }

      const list = line.split("\t");
      if (list.length < 2) continue;

      if (!Phonetic.inflexTypes.has(category)) {
        Phonetic.inflexTypes.set(category, []);
      }

      const kv: KeyValue = {
        key: list[0].trim(),
        value: list[1].trim(),
      };

      Phonetic.inflexTypes.get(category)!.push(kv);
    }
  }

  /**
   * Build single inflexion mappings from categories
   */
  static createSingleInflections(): void {
    if (!Phonetic.inflexTypes) return;

    Phonetic.singleInflexions = new Map<string, string>();

    const categories = [
      "plurals",
      "case",
      "pleo",
      "definitive",
      "extra",
      "action",
    ];

    for (const cat of categories) {
      const items = Phonetic.inflexTypes.get(cat) ?? [];
      for (const kv of items) {
        Phonetic.singleInflexions.set(kv.key, kv.value);
      }
    }
  }

  /**
   * Build all combinations of inflexions across categories
   */
  static createInflexCombinations(): void {
    if (!Phonetic.inflexTypes) return;

    Phonetic.allInflexions = new Map<string, string>();

    const addCombinations = (cat1: string, cat2: string) => {
      const list1 = Phonetic.inflexTypes!.get(cat1) ?? [];
      const list2 = Phonetic.inflexTypes!.get(cat2) ?? [];

      for (const kv1 of list1) {
        for (const kv2 of list2) {
          const key = kv1.key + kv2.key;
          const value = kv1.value + kv2.value;
          Phonetic.allInflexions!.set(key, value);
        }
      }
    };

    addCombinations("plurals", "case");
    addCombinations("plurals", "pleo");
    addCombinations("definitive", "case");
    addCombinations("definitive", "pleo");
    addCombinations("case", "pleo");
  }

  static phoneticEquivString(orig: string): string {
    let modified = "";

    if (!Phonetic.charPhoneticMap) {
      return orig; // if map not initialized, just return original
    }

    for (const c of orig) {
      if (Phonetic.charPhoneticMap.has(c)) {
        modified += Phonetic.charPhoneticMap.get(c);
      } else {
        modified += c;
      }
    }

    // console.log("modified:", modified);
    return modified;
  }

  static loadAllWords(fileContent: string): void {
    if (Phonetic.allWords !== null) return;

    Phonetic.allWords = new Map<string, string>();

    if (fileContent == '' || fileContent == null) {
      console.error(`File not empty`);
      return;
    }

    const lines = fileContent.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length === 0) continue;

      const list = trimmed.split("\t");
      if (list.length === 1) {
        Phonetic.allWords.set(
          list[0].trim(),
          Romanization.convert2Roman(list[0].trim())
        );
      }
    }
  }

  static initializeCharPhoneticMap(): void {
    if (Phonetic.charPhoneticMap !== null) return;

    Phonetic.charPhoneticMap = new Map<string, string>();

    Phonetic.charPhoneticMap.set("x", "s");
    Phonetic.charPhoneticMap.set("s", "s");
    Phonetic.charPhoneticMap.set("c", "s");
    // Phonetic.charPhoneticMap.set("h", "s");

    Phonetic.charPhoneticMap.set("e", "e");
    Phonetic.charPhoneticMap.set("i", "e");

    Phonetic.charPhoneticMap.set("w", "b");
    Phonetic.charPhoneticMap.set("b", "b");
    // Phonetic.charPhoneticMap.set("v", "b");

    Phonetic.charPhoneticMap.set("j", "j");
    Phonetic.charPhoneticMap.set("z", "j");
  }

  static replaceChars(a: string): string {
    if (!Phonetic.charPhoneticMap) {
      throw new Error("charPhoneticMap not initialized. Call initializeCharPhoneticMap() first.");
    }

    let temp = a;
    for (const [key, value] of Phonetic.charPhoneticMap.entries()) {
      // replace globally, like QRegExp
      const regex = new RegExp(key, "g");
      temp = temp.replace(regex, value);
    }
    return temp;
  }

  static initializeDeleteCharMap(): void {
    if (Phonetic.deleteCharMap != null)
      return;

    Phonetic.deleteCharMap = new Map<string, string>();
    Phonetic.deleteCharMap.set("sh", "s");
    Phonetic.deleteCharMap.set("ph", "f");
    Phonetic.deleteCharMap.set("bh", "v");
  }


  static initializeDistances(): void {
    if (Phonetic.distances != null) return;

    Phonetic.distances = new Map<string, Map<string, number>>();

    // Unicode chars
    const hosroEe = String.fromCharCode(0x09bf); // ি
    const dirghoEe = String.fromCharCode(0x09c0); // ী

    // Initialize maps
    Phonetic.distances.set(hosroEe, new Map<string, number>());
    Phonetic.distances.set(dirghoEe, new Map<string, number>());

    // Set equivalence values
    Phonetic.distances.get(hosroEe)!.set(dirghoEe, 0.2);
    Phonetic.distances.get(dirghoEe)!.set(hosroEe, 0.2);
  }


  static wordDistance(s: string, t: string): number {
    const n = s.length;
    const m = t.length;

    if (n === 0) return m;
    if (m === 0) return n;

    let p: number[] = new Array(n + 1);
    let d: number[] = new Array(n + 1);

    for (let i = 0; i <= n; i++) {
      p[i] = i;
    }

    if (Phonetic.distances == null) { Phonetic.distances = new Map(); };
    for (let j = 1; j <= m; j++) {
      const t_j = t[j - 1];
      d[0] = j;

      for (let i = 1; i <= n; i++) {
        let cost: number;

        if (
          Phonetic.distances.has(s[i - 1]) &&
          Phonetic.distances.get(s[i - 1])!.has(t_j)
        ) {
          cost = Phonetic.distances.get(s[i - 1])!.get(t_j)!;
        } else {
          cost = s[i - 1] === t_j ? 0 : 1;
        }

        d[i] = Math.min(
          Math.min(d[i - 1] + 1, p[i] + 1),
          p[i - 1] + cost
        );
      }

      // swap arrays
      [p, d] = [d, p];
    }

    return p[n];
  }
}

