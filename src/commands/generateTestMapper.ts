import { TestForMapper } from '../extensions';
import { handleCommand } from '../lib/command';

const testForMapper = new TestForMapper();

export const generateTestMapper = {
  command: {
    name: 'extension.generateTestMapper',
    handle: () => {
      handleCommand(testForMapper);
    },
  },
  commandES6: {
    name: 'extension.generateTestMapperES6',
    handle: () => {
      handleCommand(testForMapper, true);
    },
  },
};
