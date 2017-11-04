import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TickTock from './demo-mixin-2/react-mixin'
import MyComponent from './demo-higher-oerder-component-1/props_proxy'
import MyComponent1 from './demo-higher-oerder-component-2/inheritance_inversion'
import registerServiceWorker from './registerServiceWorker';
import Select from './demo-higher-oerder-component-3/Select'
import Search from './demo-higher-oerder-component-3/Search'
import SearchSelect from './demo-higher-oerder-component-3/SearchSelect'

console.log(MyComponent.displayName);
console.log(MyComponent1.displayName);
const items = ["text", "text1", "text2", "text3", "new", "new1", "pro", "pro1"]

ReactDOM.render(
    <div>
        <App />
        <TickTock/>
        <MyComponent/>
        <MyComponent1 loggedIn={false}/>
        <Select items={items}/>
        <Search items={items}/>
        <SearchSelect items={items}/>
    </div>, document.getElementById('root'));
registerServiceWorker();
