import React from 'react'
import PropTypes from 'prop-types';

class Theme {
  constructor(color) {
    this.color = color
    this.subscriptions = []
  }

  setColor(color) {
    this.color = color
    this.subscriptions.forEach(f => f())
  }

  subscribe(f) {
    this.subscriptions.push(f)
  }
}

class Button extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      color: context.theme.color
    }
  }
  componentDidMount () {
    // this.context.theme.subscribe(() => this.forceUpdate())
    this.context.theme.subscribe(()=>{
      this.setState({
        color: this.context.theme.color
      })
    })
  }

  render() {
    console.log("test render");
    return (
      <button style={{background: this.state.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  theme: PropTypes.object
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.PureComponent {
  render() {
    console.log("test render");
    const children = this.props.messages.map((message) =>
      <Message key={message.text} text={message.text} />
    );
    return <div>{children}</div>;
  }
}

class MessageBox extends React.Component {
  constructor (props, context) {
    super (props, context)
    this.theme = new Theme(this.props.color)
  }

  componentWillReceiveProps(next) {
    this.theme.setColor(next.color)
  }

  getChildContext() {
    return {theme: this.theme};
  }
  render () {
    console.log("test render");
    return <MessageList messages={this.props.messages}/>
  }
}

MessageBox.childContextTypes = {
  theme: PropTypes.object
};

export default MessageBox
