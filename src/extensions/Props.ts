import * as vscode from 'vscode';
import {
  extractInformationFromLine,
  getProperties,
  getWords,
  InformationProperty,
} from '../lib/properties';
import { getWordsEs6 } from '../lib/propertiesEs6';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';

export class Props implements Extension {
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
    return `${information.attribute}${information.isOptional ? '?' : ''}: ${
      information.type
    };`;
  }

  writeLineEs6(information: InformationProperty, className?: string): string {
    return this.writeLine(information, className);
  }

  write(informations: InformationProperty[], className: string): string {
    return `
  export type ${pascalCase(className)}Props = {
    ${informations.map((i) => this.writeLine(i, className)).join('\n')}
  };
  `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
