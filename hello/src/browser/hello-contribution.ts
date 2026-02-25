import { injectable,inject } from '@theia/core/shared/inversify';
import { ConnectionHandler, RpcConnectionHandler } from '@theia/core';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import * as monaco from '@theia/monaco-editor-core';
import { AssameseService, AssamesePath } from '../common/luitPad-engine-protocol';

@injectable()
export class AssameseCompletionContribution implements FrontendApplicationContribution {

    private assameseService: AssameseService;

    constructor(
        @inject(WebSocketConnectionProvider)
        protected readonly connectionProvider: WebSocketConnectionProvider
    ) {}

 async onStart(): Promise<void> {

    this.assameseService = await this.connectionProvider.createProxy<AssameseService>(AssamesePath);
    console.log("AXM contribution started");

    monaco.languages.register({
        id: 'axm',
        extensions: ['.axm'],
        aliases: ['Assamese']
    });
    monaco.languages.registerCompletionItemProvider('axm', {

   provideCompletionItems: async (model, position) => {
     
                const word = model.getWordUntilPosition(position);
                const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn};

                const suggestions = await this.assameseService.suggest(word.word);
                console.log("Suggestions:",suggestions);
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
            }    });
   }   
}
