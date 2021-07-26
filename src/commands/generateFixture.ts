import { Fixture } from '../extensions';
import { handleCommand } from '../lib/command';

const fixture = new Fixture();

export const generateFixture = {
  command: {
    name: 'extension.generateFixture',
    handle: () => {
      handleCommand(fixture);
    },
  },
  commandES6: {
    name: 'extension.generateFixtureES6',
    handle: () => {
      handleCommand(fixture, true);
    },
  },
};
