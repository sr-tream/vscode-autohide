"use strict";
import * as vscode from "vscode";
import { TextEditorSelectionChangeKind } from "vscode"

interface CloseSidebarActions {
    left: string;
    right: string;
}

export function activate(context: vscode.ExtensionContext) {

    function GetSidebarCloseActions(): CloseSidebarActions {
        let config = vscode.workspace.getConfiguration("workbench");
        if (config.sideBar !== undefined && config.sideBar.location !== undefined && config.sideBar.location == "right")
            return { left: "workbench.action.closeAuxiliaryBar", right: "workbench.action.closeSidebar" };
        return { left: "workbench.action.closeSidebar", right: "workbench.action.closeAuxiliaryBar" };
    };

    function DoCloseSideBarsAndPanel() {
        let config = vscode.workspace.getConfiguration("autoHide");
        let actions = GetSidebarCloseActions();

        if (config.autoHidePanel) {
            vscode.commands.executeCommand("workbench.action.closePanel");
        }

        if (config.autoHideRightSideBar) {
            vscode.commands.executeCommand(actions.right);
        }

        if (config.autoHideLeftSideBar) {
            vscode.commands.executeCommand(actions.left);
        }
    }

    if (vscode.workspace.getConfiguration("autoHide").hideOnOpen) {
        DoCloseSideBarsAndPanel();
    };

    vscode.window.onDidChangeTextEditorSelection(selection => {
        let config = vscode.workspace.getConfiguration("autoHide");
        let path = vscode.window.activeTextEditor.document.fileName;
        let pathIsFile = path.includes(".") || path.includes("\\") || path.includes("/");
        let scheme = selection.textEditor.document.uri.scheme
        let activeDebug = !!vscode.debug.activeDebugSession

        if (selection.kind != TextEditorSelectionChangeKind.Mouse // selection was not from a click
            || selection.selections.length != 1                   // no selections or multiselections
            || selection.selections.find(a => a.isEmpty) == null  // multiselections
            || !pathIsFile                                        // The debug window editor
            || scheme == "output"                                 // The output window
            || (activeDebug && !config.hideOnDebug)) {            // The debug mode
            return;
        } else {
            if (config.autoHideReferences) {
                vscode.commands.executeCommand("closeReferenceSearch");
            }

            DoCloseSideBarsAndPanel();
        };
    });

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanel", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHidePanel", !config.autoHidePanel, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideRightSideBar", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideRightSideBar", !config.autoHideRightSideBar, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideLeftSideBar", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideLeftSideBar", !config.autoHideLeftSideBar, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideOnDebug", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("hideOnDebug", !config.hideOnDebug, vscode.ConfigurationTarget.Workspace);
        }));
}

export function deactivate() { }
