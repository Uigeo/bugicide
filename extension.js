// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const Detector = require('./detector/empty_catch_detector');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
const diagnostics_log = vscode.languages.createDiagnosticCollection();

function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "weakfinder" is now active!');
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        // The code you place here will be executed every time your command is executed

        
        
        

        let editor = vscode.window.activeTextEditor;
        
        let doc = editor.document;
        let uri = doc.uri;
        vscode.workspace.openTextDocument(uri);
        diagnostics_log.set(uri,undefined);
        if(doc.languageId == 'php'){
            
            
            let det = new Detector( doc.getText(), uri.path );
    
            let diagnostics = det.bugReport().map( (ins)=>{ 
                let startpos = new vscode.Position(ins.SourceLine.start.line-1 , ins.SourceLine.start.column);
                let endpos = new vscode.Position(ins.SourceLine.end.line-1 , ins.SourceLine.end.column);
                let range = new vscode.Range(startpos, endpos);
                let dia = new vscode.Diagnostic(range, ins.info.name, ins.info.rank);
                dia.source = ins.info.category;
                // dia.relatedInformation = [new vscode.DiagnosticRelatedInformation(
                //     new vscode.Location(uri, new vscode.Position(1, 3) ),
                //     "Hello"
                // )];
                dia.code = "CWE :" + ins.info.CWE;
                //dia.tags = [vscode.DiagnosticTag.Unnecessary];
                
                return dia;
            });
            diagnostics_log.set( uri ,diagnostics);

        }else{
            vscode.window.showErrorMessage('This file is not php.');
        }
        
        // Display a message box to the user
        
    });
    
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;