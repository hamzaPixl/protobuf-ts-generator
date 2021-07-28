import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';

export class Mapper implements Extension {
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
    import { ${pascalCase(className)} as ${pascalCase(
      className,
    )}Proto } from '../../${className}.proto';
    import { ${pascalCase(className)}, ${pascalCase(
      className,
    )}Props } from '../domain/${pascalCase(className)}';

    export class ${pascalCase(className)}Mapper {
      private constructor() {}

      public static fromProto(entity: ${pascalCase(
        className,
      )}Proto): ${pascalCase(className)}Props {
        return {
          ${informations
            .map((info) => `${info.attribute}: entity.${info.attribute}`)
            .join(',\n')}
        };
      }

      public static toProto(entity: ${pascalCase(className)}): ${pascalCase(
      className,
    )}Proto {
        return {
          ${informations
            .map(
              (info) =>
                `${info.attribute}: entity.${
                  info.type === 'Boolean' || info.type === 'boolean'
                    ? 'is'
                    : 'get'
                }${info.camelCaseAttribute}()`,
            )
            .join(',\n')}
        };
      }
    }
    `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
