import React, {Component} from 'react'
import ReturnType from './ReturnType'
import ErrorBoundary from './ErrorBoundary'
import Modal, {OldModal} from './Modal'

export default class Feature extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      isOldOpen: false,
      num: 0
    }
  }
  handleClick = () => {
    this.setState({
      num: this.state.num + 1
    })
  }
  handleOpen = () => {
    this.setState({
      isOpen: true
    })
  }
  handleOldOpen = () => {
    this.setState({
      isOldOpen: true
    })
  }
  handleClose = () => {
    this.setState({
      isOpen: false
    })
  }
  handleOldClose = () => {
    this.setState({
      isOldOpen: false
    })
  }
  render () {
    return (
      <div>
        <ul><ReturnType/></ul>
        <ErrorBoundary>no error component</ErrorBoundary>
        <div onClick={this.handleClick}>
          event Bubbling through portals: {this.state.num}
          <button onClick={this.handleOpen}>open</button>
          <button onClick={this.handleOldOpen}>old open</button>
          <Modal
            isOpen={this.state.isOpen}
            onClose={this.handleClose}
          >
            to test use portal create dialog
          </Modal>
          <OldModal
            isOpen={this.state.isOldOpen}
            onClose={this.handleOldClose}
          >
            to test use portal create dialog
          </OldModal>
        </div>
      </div>
    )
  }
}
