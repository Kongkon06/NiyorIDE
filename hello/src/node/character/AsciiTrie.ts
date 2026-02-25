// AsciiTrie.ts
import { TreeNode } from "../core/TreeNode";

export class AsciiTrie {
    private asciiTree: TreeNode;
    
    // static singletons (like C++ static members)
    private static wordMapTree: AsciiTrie | null = null;
    private static unicodeTree: AsciiTrie | null = null;

    constructor() {
        this.asciiTree = new TreeNode();
    }

    static getAsciiTrie(): AsciiTrie {
        if (!AsciiTrie.wordMapTree) {
            AsciiTrie.wordMapTree = new AsciiTrie();
        }
        return AsciiTrie.wordMapTree;
    }

    static getUnicodeTrie(): AsciiTrie {
        if (!AsciiTrie.unicodeTree) {
            AsciiTrie.unicodeTree = new AsciiTrie();
        }
        return AsciiTrie.unicodeTree;
    }

    insertWord(curNode: TreeNode, charList: string[], unicodeChar: string): boolean {
        let newChar = charList[0];

        if (!curNode.links.has(newChar)) {
            curNode.links.set(newChar, new TreeNode("", false));
        }

        charList.shift(); // removeFirst

        if (charList.length > 0) {
            curNode.children++;
            this.insertWord(curNode.links.get(newChar)!, charList, unicodeChar);
        } else {
            let node = curNode.links.get(newChar)!;
            node.unicode = unicodeChar;
            node.fullWord = true;
        }
        return true;
    }

    get_choices_from_subtree(root: TreeNode | null, choices: string[], max_choices: number): void {
        if (!root) return;

        if (root.fullWord) {
            choices.push(root.unicode);
        }

        for (let [key, node] of root.links) {
            this.get_choices_from_subtree(node, choices, max_choices);
        }
    }

    get_choice(prefix: string, choicesize: number, autoselect: boolean, choices: string[]): void {
        choices.length = 0;
        if (prefix.length === 0) return;

        let prefixList = [...prefix];
        this.get_choice_words(this.asciiTree, choices, prefixList, choicesize, autoselect);
    }

    get_choice_words(root: TreeNode, choices: string[], words: string[], choicesize: number, autoselect: boolean): void {
        if (words.length === 0) {
            this.get_choices_from_subtree(root, choices, choicesize);
        } else {
            let key = words[0];
            words.shift();

            if (root.links.has(key)) {
                this.get_choice_words(root.links.get(key)!, choices, words, choicesize, autoselect);
            } else if (autoselect) {
                words.length = 0;
                if (root.fullWord) {
                    choices.push(root.unicode);
                }
            }
        }
    }

    findPrefix(chars: string[]): string {
        let result = "";
        let pos = this._findPrefix(this.asciiTree, [...chars]);

        for (let i = 0; i <= pos; i++) {
            result += "0x" + chars[i];
        }
        for (let i = 0; i <= pos; i++) {
            chars.shift();
        }

        return result;
    }

    _findPrefix(root: TreeNode, chars: string[]): number {
        let i = -1;
        let stack: TreeNode[] = [];

        while (root && chars.length > 0 && root.links.has(chars[0])) {
            let key = chars[0];
            let next = root.links.get(key)!;
            i++;
            stack.push(next);
            root = next;
            chars.shift();
        }

        while (stack.length > 0) {
            root = stack.pop()!;
            if (root.fullWord) return i;
            i--;
        }

        return i;
    }

    printTree(root: TreeNode | null, partword: string[] = []): void {
        if (!root) return;

        for (let [key, node] of root.links) {
            partword.push(key);

            this.printTree(node, partword);
            if (node.fullWord) {
                console.log(partword.join(" "));
            }

            partword.pop();
        }
    }

    printData(): void {
        this.printTree(this.asciiTree, []);
    }

    delete_Tree(tree: TreeNode | null): void {
        if (!tree) return;
        for (let [, node] of tree.links) {
            this.delete_Tree(node);
        }
        tree.links.clear();
    }

    
    addWords(charMap: Map<string, string>): void {
      if (!this.asciiTree) {
        this.asciiTree = new TreeNode();
      }

      for (let [key, value] of charMap.entries()) {
        const parts = key
            .split("0x")
            .filter(str => str.trim().length > 0);
        this.insertWord(this.asciiTree, parts, value);
        }
    }
}
