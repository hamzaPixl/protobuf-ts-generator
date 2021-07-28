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
import { Fixture } from './Fixture';

export class Getters implements Extension {
  fixtureGenerator = new Fixture();
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

  writeTestLine(information: InformationProperty, className?: string): string {
    return `
    it('Get ${information.attribute}', () => {
      const entityProps = {
        ${this.fixtureGenerator.writeLine(information)},
      };

      const entity = new ${pascalCase(className)}(entityProps);
      expect(entity.${
        information.type === 'Boolean' || information.type === 'boolean'
          ? 'is'
          : 'get'
      }${information.camelCaseAttribute}()).toEqual(entityProps.${
      information.attribute
    });
    });
  `;
  }

  writeTestLineEs6(
    information: InformationProperty,
    className?: string,
  ): string {
    return this.writeTestLine(information, className);
  }

  writeLine(information: InformationProperty, className?: string): string {
    return `
  public ${
    information.type === 'Boolean' || information.type === 'boolean'
      ? 'is'
      : 'get'
  }${information.camelCaseAttribute}(): ${information.type}${
      information.isOptional ? ' | undefined' : ''
    } {
    return this.${information.attribute};
  }
  `;
  }

  writeLineEs6(information: InformationProperty, className?: string): string {
    return `
    public get ${information.attribute?.replace('_', '')}(): ${
      information.type
    } {
      return this.${information.attribute};
  }
  `;
  }

  write(informations: InformationProperty[], className?: string): string {
    return informations
      .map((info) => this.writeLine(info, className))
      .join('\n');
  }

  writeEs6(informations: InformationProperty[], className?: string): string {
    return informations
      .map((info) => this.writeLineEs6(info, className))
      .join('\n');
  }
}
