import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';
import {
  Equals,
  Getters,
  Setters,
  Constructor,
  Update,
  Properties,
  Props,
  InterfaceExt,
} from './';

export class ClassFromProto implements Extension {
  constructorGenerator = new Constructor();
  equalsGenerator = new Equals();
  gettersGenerator = new Getters();
  settersGenerator = new Setters();
  propsGenerator = new Props();
  interfaceGenerator = new InterfaceExt();
  propertiesGenerator = new Properties();
  updateGenerator = new Update();

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
    const constructor = this.constructorGenerator.write(
      informations,
      className,
    );
    const equals = this.equalsGenerator.write(informations, className);
    const update = this.updateGenerator.write(informations, className);
    const props = this.propsGenerator.write(informations, className);
    const inter = this.interfaceGenerator.write(informations, className);
    const properties = this.propertiesGenerator.write(informations, className);
    const getters = this.gettersGenerator.write(informations, className);
    const setters = this.settersGenerator.write(informations, className);

    return `
      ${props}

      ${inter}

      export class ${pascalCase(className)} {
        ${properties}

        ${constructor}

        ${getters}

        ${setters}

        ${equals}

        ${update}
      }
      `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
