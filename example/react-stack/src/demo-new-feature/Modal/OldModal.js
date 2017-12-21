import React, {Component} from 'react'

import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom'
import ModalPortal from './ModalPortal'

export default class OldModal extends Component {
  componentDidMount () {
    this.el = document.createElement('div')
    document.body.appendChild(this.el)
    this.renderPortal(this.props)
  }
  componentDidUpdate () {
    this.renderPortal(this.props)
  }
  componentWillUnmount () {
    unmountComponentAtNode(this.el)
    document.body.removeChild(this.el)
  }
  renderPortal (props) {
    unstable_renderSubtreeIntoContainer(
      this,
      <ModalPortal {...props} />,
      this.el
    )
  }
  render () {
    return null
  }
}
