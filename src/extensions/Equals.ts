import * as vscode from 'vscode';
import {
  extractInformationFromLine,
  getProperties,
  getWords,
  InformationProperty,
} from '../lib/properties';
import { getWordsEs6 } from '../lib/propertiesEs6';
import { Extension } from '../types/Extension';

export class Equals implements Extension {
  execute(textProperties: string, es6 = false): string {
    const properties = getProperties(textProperties);
    let className = ``;
    const informations = [];

    for (let p in properties) {
      const words = es6 ? getWordsEs6(properties[p]) : getWords(properties[p]);
      const information = extractInformationFromLine(words);

      if (!information) {
        vscode.window.showErrorMessage('Something went wrong !');
        break;
      }

      if (information.class) {
        className = information.class;
      } else {
        informations.push(information);
      }
    }

    return es6
      ? this.writeEs6(informations, className)
      : this.write(informations, className);
  }

  writeLine(information: InformationProperty, className?: string): string {
    return `this.${information.attribute} === init.${information.attribute}`;
  }

  writeLineEs6(information: InformationProperty, className?: string): string {
    return this.writeLine(information, className);
  }

  write(informations: InformationProperty[], className: string): string {
    return `
  public equals(init: ${className}Props): boolean {
    return ${informations
      .map(
        (info, index) =>
          `${this.writeLine(info, className)}${
            index === informations.length - 1 ? ';' : ' &&'
          }`,
      )
      .join('\n')}
  }
  `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
