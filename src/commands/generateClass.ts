import { ClassFromProto } from '../extensions';
import { handleCommand } from '../lib/command';

const classFromProto = new ClassFromProto();

export const generateClass = {
  command: {
    name: 'extension.generateClass',
    handle: () => {
      handleCommand(classFromProto);
    },
  },
  commandES6: {
    name: 'extension.generateClassES6',
    handle: () => {
      handleCommand(classFromProto, true);
    },
  },
};
