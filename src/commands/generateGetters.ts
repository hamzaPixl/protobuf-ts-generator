import { Getters } from '../extensions';
import { handleCommand } from '../lib/command';

const getters = new Getters();

export const generateGetters = {
  command: {
    name: 'extension.generateGetters',
    handle: () => {
      handleCommand(getters);
    },
  },
  commandES6: {
    name: 'extension.generateGettersES6',
    handle: () => {
      handleCommand(getters, true);
    },
  },
};
