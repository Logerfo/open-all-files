// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.openAllFiles', openAllFiles));
}

function getRootPath(basePath?) {
    const { workspaceFolders } = vscode.workspace;

    if (!workspaceFolders)
        return;

    const firstRootPath = workspaceFolders[0].uri.fsPath;

    if (!basePath)
        return firstRootPath;

    const rootPaths = workspaceFolders.map(folder => folder.uri.fsPath);
    const sortedRootPaths = rootPaths.sort(path => path.length).reverse();
    return sortedRootPaths.find(rootPath => basePath.startsWith(rootPath));
}

async function openAllFiles(args) {
    if (args == null)
        args = { _fsPath: vscode.workspace.rootPath };

    let incomingPath: string = args._fsPath;
    const rootPath = getRootPath(incomingPath);
    const relPath = incomingPath.substring(rootPath.length + 1);
    const glob = path.join(relPath, '*');
    const findFiles = await vscode.workspace.findFiles(glob, (vscode.workspace.getConfiguration().get('files') as any).exclude);
    const filesPaths = findFiles.map(file => file.fsPath);
    const filesPathsSorted = filesPaths.sort();
    filesPathsSorted.forEach(await openFile);
}

async function openFile(path) {
    const uri = vscode.Uri.file(path);
    //vscode.commands.executeCommand('vscode.open', uri);
    vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc, { preview: false }), _err => { });
}

// this method is called when your extension is deactivated
export function deactivate() {
}
