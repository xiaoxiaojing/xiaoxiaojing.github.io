import React, {Component} from 'react'

const MyContainer = (WrappedComponent) => {
    class HOC extends WrappedComponent {
        constructor (props) {
            super(props)
        }
        componentDidMount () {
            this.setState({
                msg: "msg be changed", //修改
                copyMsg: this.state.msg, //读取
                newMsg: 'new msg' //增加
            })
        }
        render () {
            // this.handerState()
            console.log(this.state);
            if (this.props.loggedIn) {
                return super.render()
            } else {
                const oldRenderTree = super.render()
                const newRenderTree = React.cloneElement(
                    oldRenderTree,
                    {...oldRenderTree.props, text: 'not login'},
                    `${oldRenderTree.props.children}:not login`
                )
                return newRenderTree
            }
        }
    }

    // 给组件添加名字
    HOC.displayName = `HOC(${getDisplayName(WrappedComponent)})`
    return HOC
}

@MyContainer
class MyComponent extends Component {
    constructor (props) {
        super(props)
        this.state = {
            msg: 'msg'
        }
    }
    render () {
        return (
            <div>Wrapped Component</div>
        )
    }
}

export default MyComponent

// 用来获取displayName
function getDisplayName (WrappedComponent) {
    return WrappedComponent.displayName ||
        WrappedComponent.name ||
        'Component'
}
