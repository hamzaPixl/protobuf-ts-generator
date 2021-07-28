import * as vscode from 'vscode';
import { Extension } from '../types/Extension';

export function handleCommand(command: Extension, es6 = false): void {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  let selection = handleSelection(editor);

  if (!selection || selection.text.length < 1) {
    vscode.window.showErrorMessage('No selected properties.');
    return;
  }

  try {
    var executedCommand = command.execute(selection.text, es6);
    editor.edit((e) =>
      e.insert(
        selection.selections[selection.selections.length - 1].end,
        executedCommand!,
      ),
    );
  } catch (error) {
    console.log(error);
    vscode.window.showErrorMessage(
      'Something went wrong! Try that the properties are in this format: "private String name;"',
    );
  }
}

export type ComandInformations = {
  text: string;
  selections: vscode.Selection[];
};

export function handleSelection(editor: any): ComandInformations {
  let code = ``;
  let reverse: boolean = false;

  for (let selection of editor.selections) {
    reverse = selection.isReversed;
  }

  let selections: vscode.Selection[];
  if (reverse) {
    selections = editor.selections.reverse();
  } else {
    selections = editor.selections;
  }

  for (let selection of selections) {
    code += editor.document.getText(selection);
    code += `\n`;
  }

  return {
    text: code,
    selections,
  };
}
