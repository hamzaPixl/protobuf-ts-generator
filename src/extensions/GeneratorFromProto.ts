import * as vscode from 'vscode';
import { ClassFromProto } from './ClassFromProto';
import { TestForClass } from './TestForClass';
import { Mapper } from './Mapper';
import { TestForMapper } from './TestForMapper';
import { pascalCase } from '../lib/trad';
import { Extension } from '../types/Extension';
import { getRows, toProtoProperty } from '../lib/propertiesProto';
import { Fixture } from './Fixture';

export class GeneratorFromProto implements Extension {
  classCreatedGenerator = new ClassFromProto();
  testForClassGenerator = new TestForClass();
  mapperForClassGenerator = new Mapper();
  testForMapperGenerator = new TestForMapper();
  fixtureGenerator = new Fixture();

  execute(textProperties: string, es6 = false): void {
    const rows = getRows(textProperties);
    let className = ``;
    for (let r in rows) {
      const property = toProtoProperty(rows[r]);

      if (!property) {
        vscode.window.showErrorMessage('Something went wrong !');
        break;
      }

      if (property.class) {
        className = pascalCase(property.class);
      }
    }

    const classCreated = this.classCreatedGenerator.execute(
      textProperties,
      es6,
    );
    this.createFile(`domain/${className}.ts`, classCreated);

    const testForClass = this.testForClassGenerator.execute(
      textProperties,
      es6,
    );
    this.createFile(`domain/${className}.spec.ts`, testForClass);

    const mapperForClass = this.mapperForClassGenerator.execute(
      textProperties,
      es6,
    );
    this.createFile(`mappers/${className}Mapper.ts`, mapperForClass);

    const testForMapper = this.testForMapperGenerator.execute(
      textProperties,
      es6,
    );
    this.createFile(`mappers/${className}Mapper.spec.ts`, testForMapper);

    const fixture = this.fixtureGenerator.execute(textProperties, es6);
    this.createFile(`fixtures/${className}.ts`, fixture);
  }

  createFile(name: string, content: string) {
    const wsedit = new vscode.WorkspaceEdit();
    // @ts-ignore
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + '/generated/' + name);
    vscode.window.showInformationMessage(filePath.toString());
    wsedit.createFile(filePath, { ignoreIfExists: true });
    wsedit.set(filePath, [
      {
        newText: content,
        range: new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(0, 0),
        ),
      },
    ]);
    vscode.workspace.applyEdit(wsedit);
    vscode.window.showInformationMessage('Created a new file:' + filePath);
  }
}
