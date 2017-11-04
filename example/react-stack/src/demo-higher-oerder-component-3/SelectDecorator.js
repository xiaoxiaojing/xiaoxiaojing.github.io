import React, {Component} from 'react'

const SelectDecorator = (WrappedComponent) =>
    class extends Component {
        constructor (props) {
            super(props)
            this.state = {
                isOpen: false,
                selectItem: ""
            }
        }

        onSelect = (value) => {
            this.setState({
                isOpen: false,
                selectItem: value
            })
        }

        onClick = () => {
            this.setState({
                isOpen: true
            })
        }

        render () {
            const newProps = {
                onSelect: this.onSelect,
                onClick: this.onClick,
                isOpen: this.state.isOpen,
                selectItem: this.state.selectItem
            }
            return (
                <WrappedComponent {...this.props} {...newProps}/>
            )
        }
    }

export default SelectDecorator
