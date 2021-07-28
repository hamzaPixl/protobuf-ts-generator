import { GeneratorFromProto } from '../extensions';
import { handleCommand } from '../lib/command';

const generateAll = new GeneratorFromProto();

export const generateAllFromProto = {
  command: {
    name: 'extension.generateAllFromProto',
    handle: () => {
      handleCommand(generateAll);
    },
  },
  commandES6: {
    name: 'extension.generateAllFromProtoES6',
    handle: () => {
      handleCommand(generateAll, true);
    },
  },
};
