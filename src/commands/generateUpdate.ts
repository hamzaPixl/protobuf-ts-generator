import { Update } from '../extensions';
import { handleCommand } from '../lib/command';

const update = new Update();

export const generateUpdate = {
  command: {
    name: 'extension.generateUpdate',
    handle: () => {
      handleCommand(update);
    },
  },
  commandES6: {
    name: 'extension.generateUpdateES6',
    handle: () => {
      handleCommand(update, true);
    },
  },
};
