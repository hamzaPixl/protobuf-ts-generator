import { Equals } from '../extensions';
import { handleCommand } from '../lib/command';

const equals = new Equals();

export const generateEquals = {
  command: {
    name: 'extension.generateEquals',
    handle: () => {
      handleCommand(equals);
    },
  },
  commandES6: {
    name: 'extension.generateEqualsES6',
    handle: () => {
      handleCommand(equals, true);
    },
  },
};
