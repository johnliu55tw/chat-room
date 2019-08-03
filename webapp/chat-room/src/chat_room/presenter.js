import React, { Component } from 'react';
import { Box, Grommet, grommet } from 'grommet';

import { AppBar, MessagePanel, SendMessageBar, NewMessageNotification, LoginWindow } from './view.js';
import { SessionManager } from './model.js';

export class TestApp extends Component {
  constructor (props) {
    super(props);

    this.sessionManager = new SessionManager();

    this.state = {
      userSession: null,
      messages: [
        // Test
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
    let userSession = this.sessionManager.getCurrentSession();
    console.log('Stored user session:')
    console.log(userSession);
    this.setState({userSession: userSession});
    // Test message receiving
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
    // Test
    this.onNewMessageReceived(
      {user_name: this.state.userSession.name, timestamp: new Date(), message: text}
    )
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
              this.state.userSession !== null ? this.state.userSession.name : ''
            }
            onLogOut={ () => this.onLogOut() }
          />
          <MessagePanelPresenter
            messages={ this.state.messages }
          />
          <SendMessageBar onSend={ (text) => {this.onSendMessage(text)} }/>
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
    this.setState({checking: true})
    // Test
    setTimeout(() => this.onResultReceived({
      ok: true,
      reason: {name: 'Nah'},
      sessionData: {name: evt.value.name, id: 'some-id'}
    }), 1000);
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
