import { injectable } from '@theia/core/shared/inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import * as monaco from '@theia/monaco-editor-core';

@injectable()
export class AssameseCompletionContribution implements FrontendApplicationContribution {

 onStart(): void {

    console.log("AXM contribution started");

    monaco.languages.register({
        id: 'axm',
        extensions: ['.axm'],
        aliases: ['Assamese']
    });
    monaco.languages.registerCompletionItemProvider('axm', {

    triggerCharacters: ['.'], // temporary test trigger

    provideCompletionItems: (model, position) => {

        console.log("AXM completion triggered");
        console.log("Language ID:", model.getLanguageId());

        const range = new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
        );

        return {
            suggestions: [
                {
                    label: 'অসম',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'অসম',
                    range: range,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                }
            ]
        };
    }
    });
   }   
}
