export type Properties = Array<string>;
export type Words = Array<string>;

export function getWordsEs6(property: string): Words {
  let words: Array<string> = [];

  let rows = property.split(' ').map((x) => x.replace('\r\n', ''));
  for (let row of rows) {
    if (row.trim() !== '') {
      words.push(row);
    }
  }
  return words;
}
