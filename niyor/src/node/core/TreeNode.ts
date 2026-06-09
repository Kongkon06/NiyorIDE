export class TreeNode {
    public links: Map<string, TreeNode> = new Map();
    public unicode: string;
    public fullWord: boolean;
    public used: boolean;
    public children: number;
    public roman2UnicodeList:string[]=[];


    constructor(code: string = "", fullWord: boolean = false) {
        this.unicode = code;        // like QString
        this.fullWord = fullWord;   // boolean
        this.used = false;          // initially false
        this.children = 0;          // keeping your field
    }

    // Equivalent of printData(TreeNode *asciiTree)
    static printData(asciiTree: TreeNode | null): void {
        if (!asciiTree) return;
        const partword: string[] = [];
        TreeNode.printTree(asciiTree, partword);
    }

    // Equivalent of printTree(TreeNode *root, QStack<QString> &partword)
    static printTree(root: TreeNode | null, partword: string[]): void {
        if (!root) {
            return;
        }

        for (const [key, node] of root.links.entries()) {
            partword.push(key);

            TreeNode.printTree(node, partword);

            if (node.fullWord === true) {
                // Instead of QStack iterator, just loop the array
                for (const word of partword) {
                    console.log(word);
                }
                console.log(node.unicode, "//");
            }

            partword.pop();
        }
    }

    // Equivalent of delete_Tree(TreeNode *tree)
    static delete_Tree(tree: TreeNode | null): void {
        if (!tree) return;

        for (const [_, node] of tree.links.entries()) {
            TreeNode.delete_Tree(node);
        }

        tree.links.clear(); // clears references (GC will clean up)
    }
}
