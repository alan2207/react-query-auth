import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './src/App';
import { worker } from './src/mocks/api-server';


const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

worker.start().then(() => {
	createRoot(root).render(
	  <React.StrictMode>
		<App />
	  </React.StrictMode>,
	);
  });