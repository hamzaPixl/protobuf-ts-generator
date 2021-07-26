import { InformationProperty } from '../lib/properties';

export interface Extension {
  execute(textPropertie: string, es6: boolean): string;

  writeTestLine?(information: InformationProperty, className?: string): string;
  writeTestLineEs6?(
    information: InformationProperty,
    className?: string,
  ): string;

  writeLine?(information: InformationProperty, className?: string): string;
  writeLineEs6?(information: InformationProperty, className?: string): string;

  write(informations: InformationProperty[], className?: string): string;
  writeEs6(informations: InformationProperty[], className?: string): string;
}
