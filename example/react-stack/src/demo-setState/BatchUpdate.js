import React, {Component} from 'react'

export default class BatchUpdate extends Component {
  constructor (props) {
    super(props)
    this.state = {
      msg: 'init'
    }
  }
  handleClick = () => {
    this.setState({
      msg: 'change one'
    })
    this.setState({
      msg: 'change two'
    })
    console.log(this.state.msg);
  }
  render () {
    return (
      <div>
        <span>msg is : {this.state.msg}</span>
        <button onClick={this.handleClick}>change</button>
      </div>
    )
  }
}
