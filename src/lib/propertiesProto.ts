import { InformationProperty } from './properties';
import { types as typesProto } from './proto';
import { pascalCase, snakeToCamelCase, toCamelCase } from './trad';

export type Properties = Array<string>;
export type Rows = Array<string>;

export function toProtoProperty(r: string): InformationProperty {
  const row = r.split(' ').reverse();
  const [property, type, ...rules] = row;

  if (type === 'message') {
    return {
      class: pascalCase(property),
    };
  }

  return {
    attribute: snakeToCamelCase(property),
    camelCaseAttribute: toCamelCase(snakeToCamelCase(property)),
    isOptional: rules.includes('optional'),
    isArray: rules.includes('repeated'),
    scope: 'private',
    type: `${
      Object.keys(typesProto).includes(type)
        ? typesProto[type as keyof typeof typesProto]
        : type.split('.').pop()
    }${rules.includes('repeated') ? '[]' : ''}`,
  };
}

export function getRows(textProperties: string): Rows {
  return textProperties
    .split('\n')
    .map((x) =>
      x
        .replace(/ \=.*$/, '')
        .replace(/[{}]/, '')
        .trim(),
    )
    .filter((x) => x)
    .sort((a, b) =>
      a.split(' ').reverse()[0] < b.split(' ').reverse()[0] ? -1 : 1,
    );
}
