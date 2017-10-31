import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TickTock from './demo-mixin-2/react-mixin'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <div>
        <App />
        <TickTock/>
    </div>, document.getElementById('root'));
registerServiceWorker();
