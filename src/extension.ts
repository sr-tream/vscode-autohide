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

    function DoCloseSideBars() {
        let config = vscode.workspace.getConfiguration("autoHide");
        let actions = GetSidebarCloseActions();

        if (config.autoHideRightSideBar) {
            vscode.commands.executeCommand(actions.right);
        }

        if (config.autoHideLeftSideBar) {
            vscode.commands.executeCommand(actions.left);
        }
    }

    function DoClosePanel() {
        let config = vscode.workspace.getConfiguration("autoHide");

        if (config.autoHidePanel) {
            vscode.commands.executeCommand("workbench.action.closePanel");
        }
    }

    let config = vscode.workspace.getConfiguration("autoHide");
    if (config.hideOnDebug !== undefined && config.hideOnDebug !== null) {
        config.update("hideSideBarsOnDebug", config.hideOnDebug);
        config.update("hidePanelOnDebug", config.hideOnDebug);
        config.update("hideOnDebug", undefined);
    }
    if (config.hideOnOpen) {
        DoCloseSideBars();
        DoClosePanel();
    };

    vscode.window.onDidChangeTextEditorSelection(selection => {
        let config = vscode.workspace.getConfiguration("autoHide");
        let path = vscode.window.activeTextEditor.document.fileName;
        let pathIsFile = path.includes(".") || path.includes("\\") || path.includes("/");
        let scheme = selection.textEditor.document.uri.scheme;

        if (selection.kind != TextEditorSelectionChangeKind.Mouse // selection was not from a click
            || selection.selections.length != 1                   // no selections or multiselections
            || selection.selections.find(a => a.isEmpty) == null  // multiselections
            || !pathIsFile                                        // The debug window editor
            || scheme == "output") {                              // The output window
            return;
        } else {
            let activeDebug = !!vscode.debug.activeDebugSession;
            if (!activeDebug || config.hideSideBarsOnDebug) {
                if (config.autoHideReferences) {
                    vscode.commands.executeCommand("closeReferenceSearch");
                }
                DoCloseSideBars();
            }

            if (!activeDebug || config.hidePanelOnDebug) DoClosePanel();
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
        vscode.commands.registerCommand("autoHide.toggleHideSideBarsOnDebug", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("hideSideBarsOnDebug", !config.hideSideBarsOnDebug, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanelOnDebug", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("hidePanelOnDebug", !config.hidePanelOnDebug, vscode.ConfigurationTarget.Workspace);
        }));
}

export function deactivate() { }
