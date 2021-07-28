import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';
import { Getters, Setters } from '.';
import { camelCase } from 'lodash';

export class TestForMapper implements Extension {
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
    import { ${pascalCase(className)} as ${pascalCase(
      className,
    )}Proto } from '../../${className}.proto';
    import { ${pascalCase(className)}Mapper } from './${pascalCase(
      className,
    )}Mapper';
    import { ${pascalCase(className)}, ${pascalCase(
      className,
    )}Props } from '../domain/${pascalCase(className)}';
    import fixtures from '../fixtures/${pascalCase(className)}';

    describe('${pascalCase(className)}Mapper', () => {
      const ${camelCase(className)}Props: ${pascalCase(
      className,
    )}Props = fixtures.props();
      const ${camelCase(className)}Proto: ${pascalCase(
      className,
    )}Proto = { ...${camelCase(className)}Props };

      describe('fromProto', () => {
        it('should return an ${pascalCase(className)}Props object', () => {
          const ${camelCase(className)}PropsFromProto: ${pascalCase(
      className,
    )}Props = ${pascalCase(className)}Mapper.fromProto(${camelCase(
      className,
    )}Proto);

          expect(${camelCase(className)}PropsFromProto).toEqual(${camelCase(
      className,
    )}Props);
        });
      });

      describe('toProto', () => {
        it('should return a ${pascalCase(className)}Proto from a ${pascalCase(
      className,
    )} ', () => {
          const ${camelCase(className)} = new ${pascalCase(
      className,
    )}(${camelCase(className)}Props);

          const ${camelCase(className)}ProtoFromRefs: ${pascalCase(
      className,
    )}Proto = ${pascalCase(className)}Mapper.toProto(${camelCase(className)});

          expect(${camelCase(className)}ProtoFromRefs).toEqual(${camelCase(
      className,
    )}Proto);
        });
      });
    });
    `;
  }

  writeEs6(informations: InformationProperty[], className: string): string {
    return this.write(informations, className);
  }
}
