// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('open-all-files.openAllFiles', openAllFiles));
}

async function openAllFiles(args: { fsPath: any; }) {
    let uri: vscode.Uri, incomingPath: string;
    if (!args) {
        uri = vscode.workspace.workspaceFolders[0].uri;
        incomingPath = uri.fsPath;
    }
    else {
        incomingPath = args.fsPath;
        uri = vscode.Uri.file(incomingPath);
    }
    const configuration = vscode.workspace.getConfiguration("open-all-files", uri);
    let glob = '*';
    const recurisve = configuration.get('recursive', false);
    if (recurisve) {
        glob += '*';
    }
    const findFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(incomingPath, glob), (vscode.workspace.getConfiguration(undefined, uri).get('files') as any).exclude);
    const filesPaths = findFiles.map(file => file.fsPath);
    if (filesPaths.length == 0) {
        vscode.window.showInformationMessage("No files found in folder.");
        return;
    }
    const maxFilesWithoutConfirmation = configuration.get('maxFilesWithoutConfirmation', 10);
    if (maxFilesWithoutConfirmation >= 0 && filesPaths.length >= maxFilesWithoutConfirmation) {
        await vscode.window.showWarningMessage(`Are you sure you want to open ${filesPaths.length} files at once?`, "Yes", "No")
                           .then(async answer => {
                                if (answer == "Yes") {
                                   await openAll();
                                }
                            });
    }
    else {
        await openAll();
    }

    async function openAll() {
        const filesPathsSorted = filesPaths.sort();
        filesPathsSorted.forEach(await openFile);
    }
}

async function openFile(path: string) {
    const uri = vscode.Uri.file(path);
    //vscode.commands.executeCommand('vscode.open', uri);
    await vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc, { preview: false }), _err => { });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
