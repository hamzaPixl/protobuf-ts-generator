import { InterfaceExt } from '../extensions';
import { handleCommand } from '../lib/command';

const interfaceCreate = new InterfaceExt();

export const generateInterface = {
  command: {
    name: 'extension.generateInterface',
    handle: () => {
      handleCommand(interfaceCreate);
    },
  },
  commandES6: {
    name: 'extension.generateInterfaceES6',
    handle: () => {
      handleCommand(interfaceCreate, true);
    },
  },
};
