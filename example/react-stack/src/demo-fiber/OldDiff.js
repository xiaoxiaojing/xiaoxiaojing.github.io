import React, {Component, ReactDOMFiber} from 'react'
import ReactDOM from 'react-dom'
const NUMBER_OF_BLOCK = 100000

export default class OldDiff extends Component {
  constructor () {
    super()
    this.state = { timesOfButtonClicked: 0 }
  }

  _addTimesOfButtonClicked () {
    const {timesOfButtonClicked} = this.state
    console.log(timesOfButtonClicked);
    ReactDOM.unstable_deferredUpdates(() =>
      this.setState(state =>
        {timesOfButtonClicked: timesOfButtonClicked + 1})
    )
    // this.setState({timesOfButtonClicked: timesOfButtonClicked + 1})
  }

  render () {
    const {timesOfButtonClicked} = this.state
    return (
      <div >
        <input type='text' />
        <button onClick={this._addTimesOfButtonClicked.bind(this)}>
            Click Me
        </button>
        <BlockList
          displayNumber={timesOfButtonClicked}
          numberOfBlock={NUMBER_OF_BLOCK} />
      </div>
    )
  }
}

function BlockList ({displayNumber, numberOfBlock}) {
  let dom = []
  for (var i = 0; i < numberOfBlock; i++) {
    dom.push(<li key={i}>{displayNumber}</li>)
  }
  return dom
}
