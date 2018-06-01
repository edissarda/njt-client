import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import registerServiceWorker from './registerServiceWorker';

const app = (
    <App />
);

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
