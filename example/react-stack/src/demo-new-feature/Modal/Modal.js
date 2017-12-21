import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ModalPortal from './ModalPortal'

export default class Modal extends Component {
  constructor () {
    super()
    this.el = document.createElement('div')
    document.body.appendChild(this.el)
  }
  componentWillUnmount () {
    this.el && document.body.removeChild(this.el)
  }
  render () {
    return ReactDOM.createPortal(
      <ModalPortal {...this.props}/>,
      this.el
    )
  }
}
