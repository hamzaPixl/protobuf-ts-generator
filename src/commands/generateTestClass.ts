import { TestForClass } from '../extensions';
import { handleCommand } from '../lib/command';

const testForClass = new TestForClass();

export const generateTestClass = {
  command: {
    name: 'extension.generateTestClass',
    handle: () => {
      handleCommand(testForClass);
    },
  },
  commandES6: {
    name: 'extension.generateTestClassES6',
    handle: () => {
      handleCommand(testForClass, true);
    },
  },
};
