import { Utilities } from '../utils/Utilities';
import { TreeNode } from '../core/TreeNode';
import { KeyFloat } from '../core/Constants';

export class WordsTrie{
  
  static wordMapTree:WordsTrie | null = null;
  static profileWordMapTree:WordsTrie | null = null;
  static distances: Map<string,Map<string, number> | null>| null = null;
  static dictionaryFile:string = ":/files/composite_dictionary.txt";
  charTree:TreeNode;

  constructor() {
  this.charTree = new TreeNode();
  this.initializeDistances();
  }

  initializeDistances(){

  if (WordsTrie.distances != null) return;

  WordsTrie.distances = new Map<string,Map<string, number>>();

  // hosro ee kar and dirgho ee kars
  WordsTrie.distances.set("0x9bf", null);
  WordsTrie.distances.set("0x9bf", new Map<string,number>());
  WordsTrie.distances.set("0x9c0", null);
  WordsTrie.distances.set("0x9c0", new Map<string,number>());

  //@ts-ignore

  // hosro ee and dirgho ee kars equivalence
  WordsTrie.distances.get("0x9bf").set("0x9c0", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9c0").set("0x9bf", 0.2);

  // prothom cho and dutiya cho
  WordsTrie.distances.set("0x99a", null);
  WordsTrie.distances.set("0x99a", new Map<string,number>());
  WordsTrie.distances.set("0x99b", null);
  WordsTrie.distances.set("0x99b", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x99a").set("0x99b", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x99b").set("0x99a", 0.2);

  // ho and dontiya ho
  WordsTrie.distances.set("0x9b8", null);
  WordsTrie.distances.set("0x9b8", new Map<string,number>());
  WordsTrie.distances.set("0x9b9", null);
  WordsTrie.distances.set("0x9b9", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9b8").set("0x9b9", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9b9").set("0x9b8", 0.2);

  // hosro u, dirgho u and u
  WordsTrie.distances.set("0x9c1", null);
  WordsTrie.distances.set("0x9c1", new Map<string,number>());
  WordsTrie.distances.set("0x9c2", null);
  WordsTrie.distances.set("0x9c2", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9c1").set("0x9c2", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9c2").set("0x9c1", 0.2);

  // borgiya go and ontosto jo
  WordsTrie.distances.set("0x99c", null);
  WordsTrie.distances.set("0x99c", new Map<string,number>());
  WordsTrie.distances.set("0x9af", null);
  WordsTrie.distances.set("0x9af", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x99c").set("0x9af", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9af").set("0x99c", 0.2);

  // dontiya to and murdhyaniya to
  WordsTrie.distances.set("0x99f", null);
  WordsTrie.distances.set("0x99f", new Map<string,number>());
  WordsTrie.distances.set("0x9a4", null);
  WordsTrie.distances.set("0x9a4", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x99f").set("0x9a4", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9a4").set("0x99f", 0.2);

  // dontiya tho and murdhyaniya tho
  WordsTrie.distances.set("0x9a0", null);
  WordsTrie.distances.set("0x9a0", new Map<string,number>());
  WordsTrie.distances.set("0x9a5", null);
  WordsTrie.distances.set("0x9a5", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9a0").set("0x9a5", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9a5").set("0x9a0", 0.2);

  // dontiya do and murdhyaniya do
  WordsTrie.distances.set("0x9a1", null);
  WordsTrie.distances.set("0x9a1", new Map<string,number>());
  WordsTrie.distances.set("0x9a6", null);
  WordsTrie.distances.set("0x9a6", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9a1").set("0x9a6", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9a6").set("0x9a1", 0.2);

  // dontiya dho and murdhyaniya dho
  WordsTrie.distances.set("0x9a2", null);
  WordsTrie.distances.set("0x9a2", new Map<string,number>());
  WordsTrie.distances.set("0x9a7", null);
  WordsTrie.distances.set("0x9a7", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9a2").set("0x9a7", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9a7").set("0x9a2", 0.2);

  // dontiya no and murdhyaniya no
  WordsTrie.distances.set("0x9a8", null);
  WordsTrie.distances.set("0x9a8", new Map<string,number>());
  WordsTrie.distances.set("0x9a3", null);
  WordsTrie.distances.set("0x9a3", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9a8").set("0x9a3", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9a3").set("0x9a8", 0.2);

  // talubiya kho and murdhanya kho
  WordsTrie.distances.set("0x9b6", null);
  WordsTrie.distances.set("0x9b6", new Map<string,number>());
  WordsTrie.distances.set("0x9b7", null);
  WordsTrie.distances.set("0x9b7", new Map<string,number>());
    //@ts-ignore
  WordsTrie.distances.get("0x9b6").set("0x9b7", 0.2);
    //@ts-ignore
  WordsTrie.distances.get("0x9b7").set("0x9b6", 0.2);
  }

 static getProfileWordsTrie():WordsTrie {
  if (WordsTrie.profileWordMapTree == null) {
    WordsTrie.profileWordMapTree = new WordsTrie();
  }
  return WordsTrie.profileWordMapTree;
  }

 static getWordsTrie():WordsTrie {
  if (WordsTrie.wordMapTree == null) {
    WordsTrie.wordMapTree = new WordsTrie();
  }
  return WordsTrie.wordMapTree;
  }

  insertWord(curNode:TreeNode, charList:string[],unicodeChar:string): boolean {

   const newChar = charList[0];

  // If the link for this character does not exist, create it
  if (!curNode.links.has(newChar)) {
    curNode.links.set(newChar, new TreeNode("", false));
  }

  // Remove the first character (like removeFirst() in Qt)
  charList.shift();

  if (charList.length > 0) {
    curNode.children++;
    // Recursive insert
    this.insertWord(curNode.links.get(newChar)!, charList, unicodeChar);
  } else {
    const node = curNode.links.get(newChar)!;
    node.unicode = unicodeChar;
    node.fullWord = true;
  }
  return true;
  }

  getChoicesFromSubtree(root: TreeNode | null,choices: string[],wordstack: string[],
    maxChoices: number): void {
  if (!root) return;

  if (root.fullWord) {
    choices.push(root.unicode);

    // stop early if we’ve collected enough
    if (choices.length >= maxChoices) return;
  }

  for (const [key, child] of root.links.entries()) {
    this.getChoicesFromSubtree(child, choices, wordstack, maxChoices);

    if (choices.length >= maxChoices) return; // stop recursion once maxChoices reached
  }
  }


  getChoice(
  prefix: string[],        // QStringList → string[]
  choiceSize: number,
  autoSelect: boolean,
  choices: string[]
  ): void {
  choices.length = 0;       // clear

  const prefixList: string[] = [...prefix];

  if (prefix.length === 0) {
    // choices.push("");  // if you want empty choice fallback
    return;
  }

  this.getChoiceWords(this.charTree, choices, prefixList, choiceSize, autoSelect);
  }

  getChoiceWords(
  root: TreeNode | null,
  choices: string[],
  words: string[],
  choiceSize: number,
  autoSelect: boolean
  ): void {
  if (!root) return;

  if (words.length === 0) {
    const wordstack: string[] = [];
    this.getChoicesFromSubtree(root, choices, wordstack, choiceSize);
  } else {
    const key = words[0];
    words.shift(); // removeFirst()

    if (root.links.has(key)) {
      this.getChoiceWords(root.links.get(key)!, choices, words, choiceSize, autoSelect);
    } else if (autoSelect) {
      words.length = 0; // clear
      if (root.fullWord) {
        choices.push(root.unicode);
        }
      }
    }
  }

  hasWord(word: string): boolean {
  const chars: string[] = Utilities.getStringListFromUnicodeString(word);
  return this._hasWord(this.charTree, chars);
  }

  _hasWord(root: TreeNode | null, chars: string[]): boolean {
  let fullWord = false;

  while (root !== null && chars.length > 0 && root.links.has(chars[0])) {
    const key = chars[0];
    fullWord = root.links.get(key)!.fullWord;

    root = root.links.get(key)!;
    chars.shift(); // removeFirst()
    // console.debug("key", key);
  }

  if (chars.length === 0) {
    // console.debug("Quitting true");
    return fullWord;
  }
  return false;
  }

deleteWord(word: string): boolean {
  const chars: string[] = Utilities.getStringListFromHexString(word, "0x");
  // console.debug("Deleting word", word, chars);
  this._deleteWord(this.charTree, chars);
  return true;
}

_deleteWord(root: TreeNode | null, chars: string[]): boolean {
  if (!root || chars.length === 0) return false;

  let key = chars[0];
  chars.shift();
  // console.debug("Deleting key", key);

  while (root.links.has(key)) {
    root = root.links.get(key)!;

    if (chars.length === 0) {
      // console.debug("Deleting the key", key);
      root.fullWord = false;
      break;
    }

    key = chars[0];
    chars.shift();
  }

  return chars.length === 0;
}

getWordList(wordList: string[]): void {
  const partword: string[] = [];
  this.getWordsFromTree(this.charTree, partword, wordList);

  Utilities.sortStringList(wordList, true);
}

getWordsFromTree(
  root: TreeNode | null,
  partword: string[],
  wordList: string[]
): void {
  if (!root) {
    // console.debug("Empty");
    return;
  }

  for (const [key, node] of root.links.entries()) {
    partword.push(key);

    this.getWordsFromTree(node, partword, wordList);

    if (node.fullWord === true) {
      // build the hex-string word from the stack
      let word = "";
      for (const part of partword) {
        word += "0x" + part;
      }
      wordList.push(word);
    }

    partword.pop();
  }
}
getPossibleWords(word: string, possibleList: KeyFloat[], numMax: number): void {
    const leftStack: string[] = [];
    const rightStack: string[] = [];
    const partWord: string[] = [];
    const candidateList: string[] = [];

    // Push reversed characters into leftStack
    for (const c of Utilities.reverseX(word)) {
      leftStack.push(Utilities.getUnicodeStringX(c));
    }

    if(WordsTrie.wordMapTree == null ) return;
    this.getPossibleCandidates(
      WordsTrie.wordMapTree.charTree,
      word,
      leftStack,
      rightStack,
      partWord,
      candidateList
    );

    const candidateRankList: KeyFloat[] = [];
    for (const candidate of candidateList) {
      const wr: KeyFloat = {
        key: Utilities.getUnicode(candidate, "0x"),
        value: WordsTrie.wordDistance(
          Utilities.getUnicode(candidate, "0x"),
          word
        ),
      };
      candidateRankList.push(wr);
    }

    Utilities.sortKeyFloatList(candidateRankList, true);

    for (let i = 0; i < numMax && i < candidateRankList.length; i++) {
      possibleList.push(candidateRankList[i]);
    }
  }

  private getPossibleCandidates(
    root: TreeNode | null,
    uniWord: string,
    leftStack: string[],
    rightStack: string[],
    partWord: string[],
    candidateList: string[]
  ): void {
    if (!root || leftStack.length === 0) {
      return;
    }

    let stackOper = false;
    let c: string | undefined;

    // Pop from left stack -> push to right stack
    if (leftStack.length > 0) {
      c = leftStack.pop();
      if (c !== undefined) {
        rightStack.push(c);
        stackOper = true;
      }
    }

    // Build searchWord from rightStack
    let searchWord = "";
    for (const s of rightStack) {
      searchWord += "0x" + s;
    }
    searchWord = Utilities.getUnicode(searchWord, "0x");

    for (const [key, node] of root.links.entries()) {
      partWord.push(key);

      let targetWord = "";
      for (const s of partWord) {
        targetWord += "0x" + s;
      }
      targetWord = Utilities.getUnicode(targetWord, "0x");

      if (
        targetWord.length < searchWord.length + 3 &&
        WordsTrie.wordDistance(targetWord, searchWord) < 4
      ) {
        this.getPossibleCandidates(
          node,
          uniWord,
          leftStack,
          rightStack,
          partWord,
          candidateList
        );

        if (
          node.fullWord &&
          WordsTrie.wordDistance(targetWord, uniWord) < 4 &&
          node.unicode.length > 3 &&
          targetWord.length + 3 > uniWord.length
        ) {
          candidateList.push(node.unicode);
        }
      }

      partWord.pop();
    }

    if (stackOper) {
      const r = rightStack.pop();
      if (r !== undefined) {
        leftStack.push(r);
      }
    }
  }

// Assume distances is a Map<string, Map<string, number>> just like in C++
static wordDistance(s: string, t: string, distances?: Map<string, Map<string, number>>): number {
  const n = s.length; // length of s
  const m = t.length; // length of t

  if (n === 0) return m;
  if (m === 0) return n;

  let p: number[] = new Array(n + 1); // previous row
  let d: number[] = new Array(n + 1); // current row

  // initialize the previous row
  for (let i = 0; i <= n; i++) {
    p[i] = i;
  }

  // main DP loop
  for (let j = 1; j <= m; j++) {
    const t_j = t[j - 1];
    d[0] = j;

    for (let i = 1; i <= n; i++) {
      let cost: number;

      if (s[i - 1] === t_j) {
        cost = 0;
      } else if (distances?.has(s[i - 1]) && distances.get(s[i - 1])?.has(t_j)) {
        cost = distances.get(s[i - 1])!.get(t_j)!;
      } else {
        cost = 1;
      }

      d[i] = Math.min(
        d[i - 1] + 1,      // insertion
        p[i] + 1,          // deletion
        p[i - 1] + cost    // substitution
      );
    }

    // swap references
    const temp = p;
    p = d;
    d = temp;
  }

  return p[n];
}
 static loadDictionary(fileContent: string, charMap: Map<string, string>): void {
    try {
      const content = fileContent;
      const lines = content.split(/\r?\n/);

      let i = 0;
      for (const line of lines) {
        const list = line.split("\t");
        const unicodeString = (list[0] || "").trim();

        if (unicodeString.includes("0x2d")) continue;

        if (list.length >= 1 && unicodeString.length > 0) {
          charMap.set(unicodeString, unicodeString);
        }
        i++;
      }
    } catch (err: any) {
      console.error("Error reading file:", err.message);
    }
  }

  static loadDictionaryAsm(fileContent: string, charMap: Map<string, string>): void {
    try {
      const content = fileContent;
      const lines = content.split(/\r?\n/);

      let i = 0;
      for (const line of lines) {
        if (i === 0) { // skip header line
          i++;
          continue;
        }

        const list = line.split("\t");

        if (list.length >= 2) {
          let unicodeString = (list[1] || "").trim();

          if (unicodeString.includes("0x2d")) continue;

          if (unicodeString.length > 0) {
            charMap.set(unicodeString, unicodeString);
          }
        }
        i++;
      }
    } catch (err: any) {
      console.error("Error reading file:", err.message);
    }
  }
  LoadDictionaryWords(fileContent: string): void {
    const charMap = new Map<string, string>();

    // load the map from file
    WordsTrie.loadDictionaryAsm(fileContent, charMap);

    for (const [key, value] of charMap.entries()) {
      const list = key.split("0x");
      const char_list: string[] = [];

      for (const part of list) {
        if (part.trim().length !== 0) {
          char_list.push(part);
        }
      }

      this.insertWord(this.charTree!, char_list, value);
    }

    console.log("Loaded dictionary of size", charMap.size);
  }

  delete_Tree(tree: TreeNode | null): void {
    if (!tree) return;

    for (const child of tree.links.values()) {
      this.delete_Tree(child);
    }

    // in TS/JS, explicit delete isn’t needed (GC cleans it)
    tree.links.clear();
  }

  addWords(charMap: Map<string, string>): void {
    if (this.charTree === null) {
      this.charTree = new TreeNode();
    }

    for (const [key, value] of charMap.entries()) {
      const list = key.split("0x");
      const char_list: string[] = [];

      for (const str of list) {
        if (str.trim().length !== 0) {
          char_list.push(str);
        }
      }

      this.insertWord(this.charTree, char_list, value);
    }
  }

  LoadProfileDictionaryWords(charMap: Map<string, string>): void {
    if (this.charTree !== null) {
      this.delete_Tree(this.charTree);
    }
    this.charTree = new TreeNode();

    for (const [key, value] of charMap.entries()) {
      const list = key.split("0x");
      const char_list: string[] = [];

      for (const part of list) {
        if (part.trim().length !== 0) {
          char_list.push(part);
        }
      }

      this.insertWord(this.charTree, char_list, value);
    }
  }

}
