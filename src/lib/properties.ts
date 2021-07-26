import { toCamelCase } from './trad';

export type Properties = Array<string>;
export type Words = Array<string>;
export type InformationProperty = {
  type?: string;
  attribute?: string;
  camelCaseAttribute?: string;
  isOptional?: boolean;
  class?: string;
  scope?: string;
  isArray?: boolean;
};

export function getProperties(textProperties: string): Properties {
  let rows = textProperties.split('\n').map((x) => x.replace(/[{}]/g, ''));
  let properties: Array<string> = [];

  for (let row of rows) {
    if (row.trim() !== '') {
      properties.push(cleanProperty(row.trim()));
    }
  }

  return properties;
}

export function getWords(property: string): Words {
  let words: Array<string> = [];

  const regex = /^(public|private|protected)?\s?(readonly)?\s(.+)\:(.+)=?.*;/g;
  const parts = regex.exec(property);

  if (!parts) {
    return words;
  }

  for (let row of parts) {
    if (typeof row === 'string' && row.trim() !== '') {
      words.push(row.trim());
    }
  }

  words.shift();

  return words;
}

export function cleanProperty(property: string): string {
  while (property.startsWith(' ')) {
    property = property.substr(1);
  }
  while (property.startsWith('\t')) {
    property = property.substr(1);
  }

  return property;
}

export function extractInformationFromLine(words: Words): InformationProperty {
  if (words.includes('class')) {
    return { class: words[words.indexOf('class') + 1] };
  }

  const property: InformationProperty = {};

  property.scope = words.shift();
  property.type = words.pop();
  const attr = words.pop();
  property.attribute =
    attr?.endsWith('?') || attr?.endsWith('!') ? attr?.slice(0, -1) : attr;
  property.isOptional = attr?.endsWith('?') || false;
  property.isArray = property.type?.includes('[]') || false;
  property.camelCaseAttribute = toCamelCase(property.attribute);

  return property;
}
