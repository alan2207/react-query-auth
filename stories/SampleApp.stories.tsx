import React from 'react';
import { Meta, Story } from '@storybook/react';
import SampleApp from '../sample-app';
import { handlers } from '../sample-app/mock/handlers';

const meta: Meta = {
  title: 'SampleApp',
  component: SampleApp,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = () => <SampleApp />;

export const Default = Template.bind({});
Default.story = {
  parameters: {
    msw: handlers,
  },
};
