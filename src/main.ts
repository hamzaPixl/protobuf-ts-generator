'use strict';
import * as vscode from 'vscode';
import {
  generateEquals,
  generateConstructor,
  generateUpdate,
  generateGetters,
  generateSetters,
  generateProps,
  generateMapper,
  generateFixture,
  generateClass,
  generateTestClass,
  generateTestMapper,
  generateInterface,
  generateAllFromProto,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "protobuf-ts-generator" is now active!',
  );

  const commands = [
    generateEquals,
    generateConstructor,
    generateUpdate,
    generateGetters,
    generateSetters,
    generateProps,
    generateClass,
    generateTestClass,
    generateMapper,
    generateTestMapper,
    generateFixture,
    generateInterface,
    generateAllFromProto,
  ];

  commands.forEach((c) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(c.command.name, c.command.handle),
    );

    if (c.commandES6) {
      context.subscriptions.push(
        vscode.commands.registerCommand(c.commandES6.name, c.commandES6.handle),
      );
    }
  });
}

export function deactivate() {}
