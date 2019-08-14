import React, { Component } from 'react';
import { Box, Grommet, grommet } from 'grommet';

import { AppBar, MessagePanel, SendMessageBar, NewMessageNotification, LoginWindow } from './view.js';
import { SessionManager, MessageManager } from './model.js';

export class TestApp extends Component {
  constructor (props) {
    super(props);

    this.sessionManager = new SessionManager();
    this.messageManager = new MessageManager();
    this.messageManager.onReceiveCallback = (userName, msg, msgId, ts) => {
      this.onNewMessageReceived(userName, msg, msgId, ts)
    }

    this.state = {
      userSession: null,
      messages: [
        // Test
        {id: '1', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '2', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '3', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '4', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '5', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '6', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '7', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
        {id: '8', user_name: 'WUUUUUUT', timestamp: new Date(), message: 'Hello!'},
      ]
    }
  }

  componentDidMount () {
    let userSession = this.sessionManager.getCurrentSession();
    console.log('Stored user session:')
    console.log(userSession);
    this.setState({userSession: userSession});
  }

  onNewMessageReceived (userName, message, messageId, timestamp) {
    console.log('Message received');
    console.log('From: ' + userName);
    console.log('Msg: ' + message);
    console.log('Msg ID: ' + messageId);
    console.log('TS: ' + timestamp);

    let msgObj = {
      'id': messageId,
      'user_name': userName,
      'timestamp': timestamp,
      'message': message
    };

    this.setState( prevState => (
      {messages: [...prevState.messages, msgObj]}
    ));
  }

  onSendMessage (text) {
    this.messageManager.send(this.state.userSession.username, text);
  }

  onLoggedIn (sessionData) {
    console.log('User logged in!');
    console.log(sessionData);
    this.sessionManager.setCurrentSession(sessionData);
    this.setState({userSession: sessionData});
  }

  onLogOut () {
    this.sessionManager.clearCurrentSession();
    this.setState({userSession: null});
  }

  render () {
    return (
      <Grommet theme={ grommet } full>
        <Box fill>
          <AppBar
            userName={
              this.state.userSession !== null ? this.state.userSession.username : ''
            }
            logOut={ () => this.onLogOut() }
          />
          <MessagePanelPresenter
            messages={ this.state.messages }
          />
          <SendMessageBar sendMessage={ (text) => {this.onSendMessage(text)} }/>
          { this.state.userSession === null &&
            <LoginWindowPresenter
              onLoggedIn={ (sessionData) => {this.onLoggedIn(sessionData)} }
            />
          }
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

  onScrollToBottom () {
    console.log('Scrolled to bottom!');
    this.forceUpdate();
  }

  render () {
    return (
      <Box flex>
        <MessagePanel
          messages={ this.props.messages }
          scrollToBottom={ () => this.onScrollToBottom() }
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

class LoginWindowPresenter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      logged_in: false,
      checking: false,
      checkResult: null
    };
  }

  onSubmit (evt) {
    console.log('Submit!');
    console.log(evt.value);
    this.setState({checking: true});
    this.onResultReceived({
      ok: true,
      sessionData: {
        username: evt.value.username
      }
    });
  }

  onResultReceived (result) {
    if (result.ok) {
      this.setState({logged_in: true, checking: false});
      this.props.onLoggedIn(result.sessionData);
    } else {
      this.setState({
        logged_in: false,
        checking: false,
        checkResult: result.reason
      })
    }
  }

  render () {
    return (!this.state.logged_in &&
      <LoginWindow
        checking={ this.state.checking }
        onSubmit={ (evt) => this.onSubmit(evt) }
        checkResult={ this.state.checkResult }
      />
    );
  }
}
