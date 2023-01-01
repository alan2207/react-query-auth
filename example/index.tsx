import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import { worker } from './mock/api-server';

worker.start();

ReactDOM.render(<App />, document.getElementById('root'));
