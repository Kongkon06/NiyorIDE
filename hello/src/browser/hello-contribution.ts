import { injectable, inject } from '@theia/core/shared/inversify';
import { HelloConsoleWidget } from './hello-widget';
import { FrontendApplicationContribution, AbstractViewContribution } from '@theia/core/lib/browser';

import {
    CommandContribution,
    CommandRegistry
} from '@theia/core/lib/common/command';

import {
    MenuContribution,
    MenuModelRegistry,
    MAIN_MENU_BAR
} from '@theia/core/lib/common/menu';

import { EditorManager } from '@theia/editor/lib/browser';
import { ApplicationShell } from '@theia/core/lib/browser';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import { AssameseService, AssamesePath } from '../common/luitPad-engine-protocol';
import { AxmService, AxmPath } from '../common/axm-protocol';
import { TerminalService } from '@theia/terminal/lib/browser/base/terminal-service';
import { TerminalWidget } from '@theia/terminal/lib/browser/base/terminal-widget';

export const RunAxmConsole = {
    id: 'axm.console',
    label: 'Run AXM File'
};
export const RunAxmTerminal = {
    id: 'axm.terminal',
    label: 'Run AXM in Terminal'
};

export const RUN_MENU = [...MAIN_MENU_BAR, '6_debug'];

@injectable()
export class HelloConsoleContribution extends AbstractViewContribution<HelloConsoleWidget> {

    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     * 
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor() {
        super({
            widgetId: HelloConsoleWidget.ID,
            widgetName: HelloConsoleWidget.LABEL,
            defaultWidgetOptions: { area: 'main', mode: 'split-right' },
        });
    }
    /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}

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
        protected readonly terminalService: TerminalService,

        @inject(HelloConsoleContribution)
        protected readonly outputView: HelloConsoleContribution,

        @inject(ApplicationShell)
        protected readonly shell: ApplicationShell,
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
            class: ["বিভাগ"],
            control: ["যদি", "নহয়", "নহ'লে"],
            literals: ["সঁচা", "মিছা"],
            keywords: [
                "নহ'লে", "বাবে", "যেতিয়ালৈকে", "কাৰ্য্য", "ঘূৰাই পঠিয়াওক",
                "দিয়ক", "স্থিৰ", "শ্ৰেণী", "বিভাগ", "চলক", "ফলন", "প্ৰকাশ", "যদি", "নহয়", "সঁচা", "মিছা"
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
        commands.registerCommand(RunAxmTerminal, {
            execute: () => {
                this.runCurrentFile("terminal");

            }
        });
        commands.registerCommand(RunAxmConsole, {
            execute: () => {
                this.runCurrentFile("console");

            }
        });
    }


    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(RUN_MENU, {
            commandId: RunAxmTerminal.id,
            label: 'Run AXM in Terminal'
        });
        menus.registerMenuAction(RUN_MENU, {
            commandId: RunAxmConsole.id,
            label: 'Run AXM File'
        });
    }

    private async getTerminal(): Promise<TerminalWidget> {
        if (!this.terminal || this.terminal.isDisposed) {
            this.terminal = await this.terminalService.newTerminal({
                title: 'AXM Output',
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

    async runCurrentFile(mode: string): Promise<void> {
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

    let widget: HelloConsoleWidget | undefined;
    let terminal: TerminalWidget | undefined;

    if (mode === "console") {
        widget = await this.outputView.openView({ reveal: true, activate: true });
        if (widget.parent !== editorWidget.parent) {
            this.shell.addWidget(widget, {
                area: 'main',
                mode: 'split-right',
                ref: editorWidget
            });
            this.shell.activateWidget(widget.id);
        }
    } else {
        terminal = await this.getTerminal();
    }

    try {
        const output = await this.axmService.run(filePath);
        console.log("AXM Output:", output);

        if (mode === "terminal" && terminal) {
            terminal.write(`\r\n▶ Running: ${filePath}\r\n`);
            terminal.write(output + '\r\n');
        } else if (mode === "console" && widget) {
            widget.info(`▶ Running: ${filePath}`);
            widget.append(output);
        }
    } catch (err) {
        if (mode === "terminal" && terminal) {
            terminal.write(`\r\n❌ Error: ${err}\r\n`);
        } else if (mode === "console" && widget) {
            widget.error(`❌ Error: ${err}`);
        }
    }
}
}