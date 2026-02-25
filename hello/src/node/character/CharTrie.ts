// CharTrie.ts
import { TreeNode } from "../core/TreeNode";

interface ChoiceResult {
    key: string;
    value: string;
}

export class CharTrie {
    private charTree: TreeNode;
    
    // static singleton
    private static charMapTree: CharTrie | null = null;

    constructor() {
        this.charTree = new TreeNode();
    }

    static getCharTrie(): CharTrie {
        if (!CharTrie.charMapTree) {
            CharTrie.charMapTree = new CharTrie();
            // load map from file if you want → left as manual hook
            // CharTrie.charMapTree.loadCharTreeMap("user_keymap.txt");
        }
        return CharTrie.charMapTree;
    }

    insertWord(curNode: TreeNode, charList: string[], unicodeChar: string): boolean {
        let newChar = charList[0];

        if (!curNode.links.has(newChar)) {
            curNode.links.set(newChar, new TreeNode("", false));
        }

        charList.shift();

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

    whatPrefixMatch(prefix: string): string {
        if (!prefix || prefix.length === 0) return "";

        let prefixList = [...prefix];
        let whatMatch = "";

        this._whatPrefixMatch(this.charTree, prefixList, whatMatch);
        return whatMatch;
    }

    _whatPrefixMatch(root: TreeNode, prefixCharsList: string[], whatMatchRef: string): void {
        if (root.fullWord) return;
        if (prefixCharsList.length === 0) return;

        let key = prefixCharsList[0];
        prefixCharsList.shift();

        if (root.links.has(key)) {
            whatMatchRef += key;
            this._whatPrefixMatch(root.links.get(key)!, prefixCharsList, whatMatchRef);
        }
    }

    getPrefixMatch(prefix: string): string {
        if (!prefix || prefix.length === 0) return "";
        let prefixList = [...prefix];
        return this._getPrefixMatch(this.charTree, prefixList);
    }

    _getPrefixMatch(root: TreeNode, prefixCharsList: string[]): string {
        let result = "";

        if (root.fullWord) return root.unicode;
        if (prefixCharsList.length === 0) return result;

        let key = prefixCharsList[0];
        prefixCharsList.shift();

        if (root.links.has(key)) {
            result = this._getPrefixMatch(root.links.get(key)!, prefixCharsList);
        }
        return result;
    }

    doesPrefixMatch(prefix: string): boolean {
        if (!prefix || prefix.length === 0) return false;
        let prefixList = [...prefix];
        return this._foundPrefixMatch(this.charTree, prefixList);
    }

    _foundPrefixMatch(root: TreeNode, prefixCharsList: string[]): boolean {
        if (root.fullWord) return true;
        if (prefixCharsList.length === 0) return false;

        let key = prefixCharsList[0];
        prefixCharsList.shift();

        if (root.links.has(key)) {
            return this._foundPrefixMatch(root.links.get(key)!, prefixCharsList);
        }
        return false;
    }

    get_choice(prefix: string, choicesize: number, autoselect: boolean): ChoiceResult[] {
        let choices: ChoiceResult[] = [];
        if (!prefix || prefix.length === 0) return choices;

        let prefixList = [...prefix];
        let wordstack: string[] = [];
        this._get_choice_words(this.charTree, choices, prefixList, wordstack, choicesize, autoselect);
        return choices;
    }

    _get_choice_words(
        root: TreeNode, 
        choices: ChoiceResult[], 
        words: string[], 
        wordstack: string[], 
        choicesize: number, 
        autoselect: boolean
    ): void {
        if (words.length === 0) {
            this._get_choices_from_subtree(root, choices, wordstack, choicesize);
        } else {
            let key = words[0];
            words.shift();
            wordstack.push(key);

            if (root.links.has(key)) {
                this._get_choice_words(root.links.get(key)!, choices, words, wordstack, choicesize, autoselect);
            } else if (autoselect) {
                words.length = 0;
                if (root.fullWord) {
                    choices.push({ key: wordstack.join(""), value: root.unicode });
                }
            }
            wordstack.pop();
        }
    }

    _get_choices_from_subtree(
        root: TreeNode | null, 
        choices: ChoiceResult[], 
        wordstack: string[], 
        maxChoices: number
    ): void {
        if (!root) return;

        if (root.fullWord) {
            choices.push({ key: wordstack.join(""), value: root.unicode });
        }

        for (let [key, node] of root.links) {
            wordstack.push(key);
            this._get_choices_from_subtree(node, choices, wordstack, maxChoices);
            wordstack.pop();
        }
    }

    printTree(root: TreeNode = this.charTree, partword: string[] = []): void {
        if (!root) return;
        for (let [key, node] of root.links) {
            partword.push(key);
            this.printTree(node, partword);
            if (node.fullWord) {
                console.log(partword.join(""), "=>", node.unicode);
            }
            partword.pop();
        }
    }

    loadCharTreeFromProfile(charMap: Record<string, string>): void {
        this.charTree = new TreeNode();
        for (let [unicodeChar, seq] of Object.entries(charMap)) {
            let charList = [...seq as string];
            this.insertWord(this.charTree, charList, unicodeChar);
        }
    }

    loadCharTreeMap(mapObj: Record<string, string>): void {
        this.charTree = new TreeNode();
        for (let [key, value] of Object.entries(mapObj)) {
            let charList = [...key];
            this.insertWord(this.charTree, charList, value as string);
        }
        this.printTree();
    }
}
