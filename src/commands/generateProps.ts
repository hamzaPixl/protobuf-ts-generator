import { Props } from '../extensions';
import { handleCommand } from '../lib/command';

const props = new Props();

export const generateProps = {
  command: {
    name: 'extension.generateProps',
    handle: () => {
      handleCommand(props);
    },
  },
  commandES6: {
    name: 'extension.generatePropsES6',
    handle: () => {
      handleCommand(props, true);
    },
  },
};
