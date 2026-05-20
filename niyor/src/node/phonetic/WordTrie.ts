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

}
