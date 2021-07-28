import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';
import { Getters, Setters } from './';

export class TestForClass implements Extension {
  gettersGenerator = new Getters();
  settersGenerator = new Setters();

  execute(textProperties: string, es6 = false): string {
    const rows = getRows(textProperties);
    let className = ``;
    const informations = [];

    for (let r in rows) {
      const property = toProtoProperty(rows[r]);

      if (!property) {
        vscode.window.showErrorMessage('Something went wrong !');
        break;
      }

      if (property.class) {
        className = property.class;
      } else {
        informations.push(property);
      }
    }

    return es6
      ? this.writeEs6(informations, className)
      : this.write(informations, className);
  }

  write(informations: InformationProperty[], className: string): string {
    return `
    import * as faker from 'faker';
    import { ${pascalCase(className)} } from './${pascalCase(className)}';

    describe('${pascalCase(className)}Model', () => {
      ${informations
        .map((i) => {
          return `
            ${this.gettersGenerator.writeTestLine(i, className)}\n
            ${this.settersGenerator.writeTestLine(i, className)}\n
          `;
        })
        .join('\n')}
    });
    `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
