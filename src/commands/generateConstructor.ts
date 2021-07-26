import { Constructor } from '../extensions';
import { handleCommand } from '../lib/command';

const constructor = new Constructor();

export const generateConstructor = {
  command: {
    name: 'extension.generateConstructor',
    handle: () => {
      handleCommand(constructor);
    },
  },
  commandES6: {
    name: 'extension.generateConstructorES6',
    handle: () => {
      handleCommand(constructor, true);
    },
  },
};
