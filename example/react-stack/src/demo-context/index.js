import React from 'react'
import NotContext from './NotContext'
import HasContext from './HasContext'
import HasContextPureComponent from './HasContextPureComponnet'
import HasContextPureComponent2 from './HasContextPureComponent2'
const messages = [{text: 'name'}, {text: 'age'}]

export default class ContextDemo extends React.Component {
  constructor () {
    super ()
    this.state = {
      color: 'yellow'
    }
  }

  changeColor = () => {
    this.setState({
      color: 'black'
    })
  }

  render () {
    return (
      <div>
        not use context：
        <NotContext messages={[{text: 'name'}, {text: 'age'}]} color="blue"/>
        <br/>
        use context：
        <HasContext messages={[{text: 'name'}, {text: 'age'}]} color="green"/>
        <br/>
        context with PureComponent：
        <HasContextPureComponent messages={messages} color={this.state.color}/>
        <br/>
        context with PureComponent and injection system：
        <HasContextPureComponent2 messages={messages} color={this.state.color}/>
        <br/>
        <button onClick={this.changeColor}>color</button>
        <p>the color is: {this.state.color}</p>
      </div>
    )

  }
}
