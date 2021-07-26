import { Setters } from '../extensions';
import { handleCommand } from '../lib/command';

const setters = new Setters();

export const generateSetters = {
  command: {
    name: 'extension.generateSetters',
    handle: () => {
      handleCommand(setters);
    },
  },
  commandES6: {
    name: 'extension.generateSettersES6',
    handle: () => {
      handleCommand(setters, true);
    },
  },
};
