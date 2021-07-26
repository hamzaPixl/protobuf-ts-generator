import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';

export class Fixture implements Extension {
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

  writeLine(information: InformationProperty): string {
    if (information.type?.includes('boolean')) {
      return `${information.attribute}: ${
        information.isArray ? '[' : ''
      } faker.datatype.boolean() ${information.isArray ? ']' : ''}`;
    }

    if (information.type?.includes('string')) {
      return `${information.attribute}: ${
        information.isArray ? '[' : ''
      } faker.random.word() ${information.isArray ? ']' : ''}`;
    }

    if (information.type?.includes('number')) {
      return `${information.attribute}: ${information.isArray ? '[' : ''} 2 ${
        information.isArray ? ']' : ''
      }`;
    }
    return `${information.attribute}: {}`;
  }

  write(informations: InformationProperty[], className: string): string {
    return `
    import * as faker from 'faker';
    import { ${pascalCase(className)}Props } from '@libs/shared/domain';
    import { ${pascalCase(
      className,
    )} } from '@qover-private/protos/qover/dojo/service/v1/${className}';
    import { ${pascalCase(
      className,
    )}Schema } from '@module/business/test/helpers/mongoSchemas';

    const props = (): ${pascalCase(className)}Props => {
      return {
        ${informations.map((info) => this.writeLine(info)).join(',\n')}
      };
    };

    const schema = (): ${pascalCase(className)}Schema => {
      return {
        ${informations.map((info) => this.writeLine(info)).join(',\n')}
      };
    };

    const proto = (): ${pascalCase(className)} => {
      return {
        ${informations.map((info) => this.writeLine(info)).join(',\n')}
      };
    };

    export default {
      props,
      schema,
      proto,
    };
    `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
