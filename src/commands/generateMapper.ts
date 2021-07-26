import { Mapper } from '../extensions';
import { handleCommand } from '../lib/command';

const mapper = new Mapper();

export const generateMapper = {
  command: {
    name: 'extension.generateMapper',
    handle: () => {
      handleCommand(mapper);
    },
  },
  commandES6: {
    name: 'extension.generateMapperES6',
    handle: () => {
      handleCommand(mapper, true);
    },
  },
};
