import React, {Component} from 'react'

// HOC: the MyContainer is a HOC
const MyContainer = (WrappedComponent) =>
    class extends Component {
        static displayName = `HOC(${getDisplayName(WrappedComponent)})`
        constructor (props) {
            super(props)
            this.state = {
                text: ''
            }
            this.onTextChange = this.onTextChange.bind(this)
        }
        proc (instance) {
            instance && console.log(instance.method());
        }
        onTextChange (event) {
            this.setState({
                text: event.target.value
            })
        }
        render () {
            // 新增的props
            const newProps = {
                text: this.state.text,
                input: {
                    value: this.state.value,
                    onChange: this.onTextChange
                },
                ref: this.proc.bind(this)
            }
            return <WrappedComponent {...this.props} {...newProps}/>
        }
    }

@MyContainer
class MyComponent extends Component {
    method () {
        return "my component method: " + this.props.text
    }
    render () {
        console.log(WrappedComponent);
        return (
            <div>
                <p>Wrapped Component has text: {this.props.text}</p>
                <input {...this.props.input}/>
            </div>
        )
    }
}

export default MyComponent

/** 未使用decorator时，应用高阶组件。直接以函数的形式调用
 * export default MyContainer(MyComponent)
 */

// 用来获取displayName
function getDisplayName (WrappedComponent) {
    return WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'
}


// 高阶组件传参
function HOCFactoryFactory(params) {
    return function HOCFactory(WrappedComponent) {
        return class HOC extends Component {
            render () {
                return <WrappedComponent params={params}/>
            }
        }
    }
}

@HOCFactoryFactory("params: component")
class WrappedComponent extends Component {
    render () {
        return <div>{this.props.params}</div>
    }
}
