import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TickTock from './demo-mixin-2/react-mixin'
import MyComponent from './demo-higher-oerder-component-1/props_proxy'
import MyComponent1 from './demo-higher-oerder-component-2/inheritance_inversion'
import Select from './demo-higher-oerder-component-3/Select'
import Search from './demo-higher-oerder-component-3/Search'
import SearchSelect from './demo-higher-oerder-component-3/SearchSelect'
import SetStateDemo from './demo-setState'
import ReactChildrenTest from './demo-children'
import TestCreateElement from './demo-reactElement/createElement'
import Feature from './demo-new-feature'
const items = ["text", "text1", "text2", "text3", "new", "new1", "pro", "pro1"]

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>demo list</h1>
        </header>
        <ul className="demo-content">
          <li><span>mixins demo:</span><TickTock/></li>
          <li>
            <span>higher order component demo:</span>
            <MyComponent/>
            <MyComponent1 loggedIn={false}/>
            <Select items={items}/>
            <Search items={items}/>
            <SearchSelect items={items}/>
          </li>
          <li><span>setState demo:</span><SetStateDemo/></li>
          <li><span>children demo:<ReactChildrenTest/></span></li>
          <li><span>reactElement demo:<TestCreateElement/></span></li>
          <li><span>React v16.0 new feature demo:<Feature/></span></li>
        </ul>
      </div>
    );
  }
}

export default App;
