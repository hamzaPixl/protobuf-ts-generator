import * as vscode from 'vscode';
import { InformationProperty } from '../lib/properties';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';
import { Getters, Setters } from '.';

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
    )}Proto } from '@qover-private/protos/qover/dojo/service/v1/${className}';
    import { ${pascalCase(className)}Mapper } from './${pascalCase(
      className,
    )}Mapper';
    import { ${pascalCase(className)}Props, ${pascalCase(
      className,
    )} } from '@libs/shared/domain';
    import fixtures from '../../test/fixtures';

    describe('${pascalCase(className)}Mapper', () => {
      const ${pascalCase(className)}Props: ${pascalCase(
      className,
    )}Props = fixtures.${pascalCase(className)}.props();
      const ${pascalCase(className)}Proto: ${pascalCase(
      className,
    )}Proto = { ...${pascalCase(className)}Props };

      it('should be defined', () => {
        expect(${pascalCase(className)}Mapper).toBeDefined();
      });

      describe('fromProto', () => {
        it('should return an ${pascalCase(className)}Props object', () => {
          const ${pascalCase(className)}PropsFromProto: ${pascalCase(
      className,
    )}Props = ${pascalCase(className)}Mapper.fromProto(${pascalCase(
      className,
    )}Proto);

          expect(${pascalCase(className)}PropsFromProto).toEqual(${pascalCase(
      className,
    )}Props);
        });
      });

      describe('toProto', () => {
        it('should return a ${pascalCase(className)}Proto from a ${pascalCase(
      className,
    )} VO', () => {
          const ${pascalCase(className)} = new ${pascalCase(
      className,
    )}(${pascalCase(className)}Props);

          const ${pascalCase(className)}ProtoFromRefs: ${pascalCase(
      className,
    )}Proto = ${pascalCase(className)}Mapper.toProto(${pascalCase(className)});

          expect(${pascalCase(className)}ProtoFromRefs).toEqual(${pascalCase(
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
