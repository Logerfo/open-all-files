// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('open-all-files.openAllFiles', openAllFiles));
}

function getRootPath(basePath?: string) {
    const { workspaceFolders } = vscode.workspace;

    if (!workspaceFolders) {
        return;
    }

    const firstRootPath = workspaceFolders[0].uri.fsPath;

    if (!basePath) {
        return firstRootPath;
    }

    const rootPaths = workspaceFolders.map(folder => folder.uri.fsPath);
    const sortedRootPaths = rootPaths.sort(path => path.length).reverse();
    return sortedRootPaths.find(rootPath => basePath.startsWith(rootPath));
}

async function openAllFiles(args: { _fsPath: any; }) {
    if (!args) {
        args = { _fsPath: vscode.workspace.rootPath };
    }

    let incomingPath: string = args._fsPath;
    const configuration = vscode.workspace.getConfiguration("open-all-files", args._fsPath);
    const rootPath = getRootPath(incomingPath);
    const relPath = incomingPath.substring(rootPath.length + 1);
    let glob = relPath + '/*';
    const recurisve = configuration.get('recursive', false);
    if(recurisve) {
        glob += '*';
    }

    const findFiles = await vscode.workspace.findFiles(glob, (vscode.workspace.getConfiguration(undefined, args._fsPath).get('files') as any).exclude);
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
