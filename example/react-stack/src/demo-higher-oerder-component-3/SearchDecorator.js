import React, {Component} from 'react'

const SearchDecorator = (WrappedComponent) =>
    class extends Component {
        constructor (props) {
            super(props)
            this.state = {
                value: ""
            }
        }

        onChange = (e) => {
            this.setState({
                value: e.target.value
            })
        }

        render () {
            const value = this.state.value
            const newProps = {
                value,
                onChange: this.onChange,
                items: this.props.items.filter((item)=>{
                    return item.match(value)
                })
            }

            return (
                <WrappedComponent {...this.props} {...newProps}/>
            )
        }
    }

export default SearchDecorator
