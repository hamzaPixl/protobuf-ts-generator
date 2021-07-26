import { startCase } from 'lodash';

export function snakeToCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/([_][a-z])/g, (group) => group.toUpperCase().replace('_', ''));
}

export function toCamelCase(str?: string): string {
  if (!str) {
    return '';
  }
  if (str.includes('_')) {
    str = snakeToCamelCase(str);
  }
  return str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1));
}

export function pascalCase(str?: string): string {
  if (!str) {
    return '';
  }
  return startCase(toCamelCase(str)).replace(/ /g, '');
}
