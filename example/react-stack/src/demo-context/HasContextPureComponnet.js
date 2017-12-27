import React from 'react'
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
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
    const children = this.props.messages.map((message) =>
      <Message key={message.text} text={message.text} />
    );
    return <div>{children}</div>;
  }
}

class MessageBox extends React.Component {
  getChildContext() {
    return {color: this.props.color};
  }
  render () {
    return <MessageList messages={this.props.messages}/>
  }
}

MessageBox.childContextTypes = {
  color: PropTypes.string
};

export default MessageBox
