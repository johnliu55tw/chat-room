import React, { Component } from 'react';
import { Box, Grommet, grommet } from 'grommet';

import { AppBar, MessagePanel, SendMessageBar, NewMessageNotification } from './view.js';

export class TestApp extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: [
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
      ]
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.onNewMessageReceived(
        {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'}
      )},
      3000);
  }

  onNewMessageReceived (message) {
    console.log('Message received');
    console.log(message);
    this.setState( prevState => (
      {messages: [...prevState.messages, message]}
    ));
  }

  onSendMessage (text) {
    this.onNewMessageReceived(
      {user_name: 'You', timestamp: new Date(), message: text}
    )
  }

  render () {
    return (
      <Grommet theme={ grommet } full>
        <Box fill>
          <AppBar/>
          <MessagePanelPresenter
            messages={ this.state.messages }
          />
          <SendMessageBar onSend={ (text) => {this.onSendMessage(text)} }/>
        </Box>
      </Grommet>
    );
  }
}

class MessagePanelPresenter extends Component {
  constructor (props) {
    super(props);
    this.messagePanel = null;
  }

  onNewMessageClick () {
    this.messagePanel.scrollToBottom();
    // Calling forceUpdate to "remove" the new message button
    this.forceUpdate();
  }

  render () {
    return (
      <Box flex>
        <MessagePanel
          messages={ this.props.messages }
          ref={ (elem) => {this.messagePanel = elem;} }
        />
        { this.messagePanel !== null && !this.messagePanel.isAtBottom() && (
          <NewMessageNotification
            onClick={ () => this.onNewMessageClick() }
          />
        )}
      </Box>
    )
  }
}
