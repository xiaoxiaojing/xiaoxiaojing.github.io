import React from 'react'

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = this.props.color;
    const children = this.props.messages.map((message) =>
      <Message key={message.text} text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}

export default MessageList
