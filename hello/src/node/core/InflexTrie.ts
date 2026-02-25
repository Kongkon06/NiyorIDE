
import { TreeNode } from './TreeNode';
import { Utilities } from '../utils/Utilities';


export class InflexTrie{
  static inflexMapTree: InflexTrie | null = null;
  inflexTreeNode: TreeNode ;
 
  constructor(){
    this.inflexTreeNode = new TreeNode("",false);
  }
 
  static getInflexTrie(): InflexTrie {
  if (this.inflexMapTree == null) {
    this.inflexMapTree = new InflexTrie();
  }

  return this.inflexMapTree;
  }

  insertWord (curNode:TreeNode,charList: string[],unicodeChar: string) : boolean {
  //   TreeNode *curNode = charTreeRoot;
  const newChar = charList[0];

  if (!curNode.links.has(newChar)) {
    curNode.links.set(newChar, new TreeNode("",false));
  }

  charList.shift();

  if (charList.length> 0) {
    curNode.children++;

    this.insertWord(curNode.links.get(newChar)!, charList, unicodeChar);
  } else {
  const node = curNode.links.get(newChar);
  if(node != undefined){
  node.fullWord = true;
  node.unicode = unicodeChar;
      }
  }
  return true;

  }
  
  hasInflection (word:string) : string{

   let chars :string[] = [];

  chars = Utilities.split(Utilities.reverseX(word), "");
  return this._hasInflection(this.inflexTreeNode, chars);
  
  }

  private _hasInflection(root: TreeNode | null, chars: string[]): string {
    let key: string;
    let fullWord = false;
    let inflection = "";

    while (root && chars.length > 0 && root.links.has(chars[0])) {
      key = chars[0];
      const node = root.links.get(key)!;
      fullWord = node.fullWord;
      inflection = node.unicode;
      root = node;
      chars.shift(); // remove first
    }

    return fullWord ? inflection : "";
  }

  deleteWord(word: string): boolean {
    const chars: string[] = Utilities.getStringListFromHexString(word, "0x");
    this._deleteWord(this.inflexTreeNode, chars);
    return true;
  }
private _deleteWord(root: TreeNode, chars: string[]): boolean {
    if (chars.length === 0) return false;

    let key = chars[0];
    chars.shift();

    while (root.links.has(key)) {
      root = root.links.get(key)!;

      if (chars.length === 0) {
        root.fullWord = false;
        break;
      }

      key = chars[0];
      chars.shift();
    }

    return chars.length === 0;
  }

   public printData() {
    const partword: string[] = [];
    this.printTree(this.inflexTreeNode, partword);
  }

   printTree(root: TreeNode | null, partword: string[]) {
    if (!root) return;

    for (const [key, node] of root.links.entries()) {
      partword.push(key);

      this.printTree(node, partword);

      if (node.fullWord) {
        // Print the accumulated characters (the word path)
        const word = partword.join("");
        console.log("Word:", word, "Unicode:", node.unicode);
      }

      partword.pop();
    }
  }
  deleteTree(tree: TreeNode | null) {
    if (!tree) return;

    // Recursively delete children
    for (const child of tree.links.values()) {
      this.deleteTree(child);
    }

    // Clear the links map
    tree.links.clear();
  }

  // Add words from a map of "hex string" => "unicode string"
  addWords(charMap: Map<string, string>) {
    if (!this.inflexTreeNode) {
      this.inflexTreeNode = new TreeNode;
    }

    for (const [key, value] of charMap.entries()) {
      const charList: string[] = [];
      const list = key.split("0x");

      for (const str of list) {
        if (str.trim().length !== 0) {
          charList.push(str);
        }
      }

      this.insertWord(this.inflexTreeNode, charList, value);
    }
  }

 LoadInflections(charMap: Map<string, string> | null) {

    if(charMap == null) return;
    if (this.inflexTreeNode) {
      this.deleteTree(this.inflexTreeNode);
    }

    this.inflexTreeNode = new TreeNode("", false);
    // Optional: clear again to mimic your C++ call
    this.deleteTree(this.inflexTreeNode);

    for (const [key] of charMap.entries()) {
      const charList: string[] = [];

      // reverse the string into characters
      for (const kChar of key.split("").reverse()) {
        charList.push(kChar);
      }

      this.insertWord(this.inflexTreeNode, charList, key);
    }
  }

}
