/**
 * A very basic Coldfusion symbols search (only Methods)
 * @author dalucema
 */
'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    var selector = {scheme: 'file', language: "cfml"};

    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        selector , new CfmlDocumentSymbolProvider()
    ));
}

class CfmlDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document1: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve, reject) => {
            var symbols = [];
            const patternFunctions = new RegExp(/(<cffunction)(\s*?name=)\"(.*?)\"/g);
            const patternFunctionsName = new RegExp(/\"(.*?)\"/);

            for (var i = 0; i < document1.lineCount; i++) {
                var line = document1.lineAt(i);
                var resultMatch = line.text.match(patternFunctions);
                if(resultMatch !== null){
                    var functionName = resultMatch[0].match(patternFunctionsName);
                    if(functionName !== null){
                        symbols.push(
                           new vscode.SymbolInformation(functionName[1], vscode.SymbolKind.Method, line.range)
                        );
                    }
                }
            }
            resolve(symbols);
        });
    }
}