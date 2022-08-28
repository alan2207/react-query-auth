import { addDecorator } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();
addDecorator(mswDecorator);

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};
