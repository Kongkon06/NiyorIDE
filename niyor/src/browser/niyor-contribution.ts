import { injectable, inject } from '@theia/core/shared/inversify';

import { FrontendApplicationContribution } from '@theia/core/lib/browser';

import {
    CommandContribution,
    CommandRegistry
} from '@theia/core/lib/common/command';

import {
    MenuContribution,
    MenuModelRegistry
} from '@theia/core/lib/common/menu';

import { CommonMenus } from '@theia/core/lib/browser/common-frontend-contribution';
import { EditorManager } from '@theia/editor/lib/browser';

import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import { AssameseService, AssamesePath } from '../common/luitPad-engine-protocol';
import { AxmService, AxmPath } from '../common/axm-protocol';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { TerminalWidget } from '@theia/terminal/lib/browser/base/terminal-widget';

export const RunAxmCommand = {
    id: 'axm.run',
    label: 'Run AXM File'
};

@injectable()
export class AssameseCompletionContribution implements
    FrontendApplicationContribution,
    CommandContribution,
    MenuContribution {

    private assameseService: AssameseService;
    private axmService: AxmService;
    private terminal: TerminalWidget | undefined;

    constructor(
        @inject(WebSocketConnectionProvider)
        protected readonly connectionProvider: WebSocketConnectionProvider,

        @inject(EditorManager)
        protected readonly editorManager: EditorManager,

        @inject(TerminalService)
        protected readonly terminalService: TerminalService
    ) { }

    async onStart(): Promise<void> {

        this.assameseService = await this.connectionProvider.createProxy<AssameseService>(AssamesePath);
        console.log("AXM contribution started");

        monaco.languages.register({
            id: 'axm',
            extensions: ['.axm'],
            aliases: ['Assamese']
        });

        monaco.languages.setMonarchTokensProvider("axm", {
            defaultToken: '',
            tokenPostfix: '.axm',
            declarations: [
                "চলক"
            ],
            functions: ["ফলন", "প্ৰকাশ"],
            class: [""],
            control: ["যদি", "নহয়", "নহ'লে"],
            literals: ["সঁচা", "মিছা"],
            keywords: [
                "নহ'লে", "বাবে", "যেতিয়ালৈকে", "কাৰ্য্য", "ঘূৰাই পঠিয়াওক",
                "ছপা কৰক", "দিয়ক", "স্থিৰ", "শ্ৰেণী", "বিষয়"
            ],
            tokenizer: {
                root: [
                    [/(\/\/.*$)/, 'comment'],
                    [/"/, { token: 'string.quote', next: '@string' }],
                    [/\b\d+(\.\d+)?\b/, 'number'],

                    // 2. UPDATE your tokenizer to check these groups in order.
                    // We map them to new token types like 'keyword.declaration', 'keyword.function', etc.
                    [/[^\s]+/, {
                        cases: {
                            '@declarations': 'keyword.declaration',
                            '@functions': 'keyword.function',
                            '@control': 'keyword.control',
                            '@literals': 'keyword.literal',
                            '@default': 'identifier'
                        }
                    }]
                ],
                string: [
                    // (Your string tokenizer was perfect, no changes needed)
                    [/[^\\"]+/, 'string'],
                    [/\\./, 'string.escape'],
                    [/"/, { token: 'string.quote', next: '@pop' }]
                ],
            }
        });
        monaco.languages.registerCompletionItemProvider('axm', {

            provideCompletionItems: async (model, position) => {

                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };

                const suggestions = await this.assameseService.suggest(word.word);
                console.log("Suggestions:", suggestions);
                return {
                    suggestions: suggestions.map(assm => ({
                        label: assm.trim(),
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        detail: `(English: ${word.word})`,
                        documentation: `Inserts the Assamese keyword for '${word.word}'`,
                        insertText: assm.trim(),
                        range,
                        filterText: word.word,
                        sortText: assm.trim()
                    }))
                };
            }
        });
    };

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(RunAxmCommand, {
            execute: () => {
                this.runCurrentFile();

            }
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT, {  // or FILE
            commandId: RunAxmCommand.id,
            label: 'Run AXM File'
        });
    }

    private async getTerminal(): Promise<TerminalWidget> {
        if (!this.terminal || this.terminal.isDisposed) {
            this.terminal = await this.terminalService.newTerminal({
                title: 'AXM Output',
                 shellPath: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe'
            });

            this.terminal.start();
            this.terminalService.open(this.terminal, { mode: 'reveal' });

            // Optional: clear reference when user closes it
            this.terminal.onDidDispose(() => {
                this.terminal = undefined;
            });
        }

        return this.terminal;
    }

    async runCurrentFile(): Promise<void> {
        const editorWidget = this.editorManager.currentEditor;

        if (!editorWidget) {
            console.error("No active editor");
            return;
        }

        if (!this.axmService) {
            try {
                this.axmService = await this.connectionProvider.createProxy<AxmService>(AxmPath);
            } catch (e) {
                console.error('Failed to create AxmService proxy', e);
                return;
            }
        }

        const uri = editorWidget.editor.uri;
        let filePath = '';

        if (uri) {
            const p: any = uri.path;
            filePath = (p && typeof p.fsPath === 'function') ? p.fsPath() : uri.toString();
        }

        const terminal = await this.getTerminal();

        try {
            const output = await this.axmService.run(filePath);

            console.log("AXM Output:", output);
            try {
                terminal.write(`\r\n▶ Running: ${filePath}\r\n`);
                terminal.write(output + '\r\n');
            } catch (e) {
                console.error('Error processing AXM output', e);
            }

        } catch (err) {
            terminal.write(`\r\n❌ Error: ${err}\r\n`);
        }
    }
}
