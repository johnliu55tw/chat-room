import React, { Component } from 'react';
import { Box, Grommet, grommet } from 'grommet';
import axios from 'axios';

import { AppBar, MessagePanel, SendMessageBar, NewMessageNotification, LoginWindow } from './view.js';
import { SessionManager, MessageManager } from './model.js';

// Use context object to manage session ID
const SessionContext = React.createContext(null);


export class TestApp extends Component {

  constructor (props) {
    super(props);
    this.state = {
      sessionData: null
    }
    this.sessionManager = null;
  }

  componentDidMount () {
    this.sessionManager = new SessionManager();
    let newSessionData = this.sessionManager.getCurrentSession();
    if (newSessionData !== null) {
      this.setState({
        sessionData: newSessionData
      });
    }
  }

  onSessionUpdate (newSessionData) {
    console.log('onSessionUpdate');
    console.log(newSessionData);
    if (newSessionData === null) {
      this.sessionManager.clearCurrentSession();
    } else {
      this.sessionManager.setCurrentSession(newSessionData);
    }
    this.setState({
      sessionData: newSessionData
    });
  }

  render () {
    return (
      <Grommet theme={ grommet } full>
        <SessionContext.Provider value={ this.state.sessionData }>
          <Box fill>
            <AppBarPresenter
              sessionUpdateHandler={ (sData) => {this.onSessionUpdate(sData)} }
            />
            <MessagePanelPresenter/>
            <SendMessagePresenter />
            <LoginPresenter
              sessionUpdateHandler={ (sData) => {this.onSessionUpdate(sData)} }
            />
          </Box>
        </SessionContext.Provider>
      </Grommet>
    )
  }
}

class AppBarPresenter extends Component {

  getUserName () {
    let session = this.context;
    return session !== null ? session.userName : '';
  }

  onLogOut () {
    this.props.sessionUpdateHandler(null);
    console.log('logout clicked!');
  }

  render () {
    return (
      <AppBar
        userName={ this.getUserName() }
        logOut={ () => {this.onLogOut()} }
      />
    )
  }
}
AppBarPresenter.contextType = SessionContext;

class MessagePanelPresenter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      messages: []
    };

    this.messagePanel = null;
    this.messageManager = null;
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    let session = this.context;
    if (this.messageManager === null && session !== null) {
      // User logged in
      console.log('Session Data updated, create message manager.');
      this.messageManager = new MessageManager(
        session.token,
        this.onNewMessageReceived.bind(this),
      );
    } else if (this.messageManager !== null && session === null) {
      console.log('Log out!!!');
      this.messageManager.close();
      this.messageManager = null;
    }
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

  render () {
    return (
      <Box flex>
        <MessagePanel
          messages={ this.props.sessionData === null ? [] : this.state.messages }
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
MessagePanelPresenter.contextType = SessionContext;

class SendMessagePresenter extends Component {

  handleSendMessage (text) {
    let session = this.context;
    axios.post('api/user_messages',
      {sender: session.userName, content: text},
      {headers: {'Authorization': 'Token ' + session.token}}
    ).catch((error) => {
      console.log('Unable to setn message:');
      console.log(error);
    })
  }

  render () {
    return (
      <SendMessageBar
        sendMessage={ (text) => this.handleSendMessage(text) }
      />
    );
  }
}
SendMessagePresenter.contextType = SessionContext;

class LoginPresenter extends Component {
  constructor (props) {
    super(props);
    this.state = {
      checking: null,
      failedReason: null
    }
  }

  onSubmit (evt) {
    console.log('Submit!');
    this.setState({checking: true});
    axios.post('api/auth', {
      username: evt.value.username, password: evt.value.password
    })
    .then((resp) => {
      let result = {
        ok: true,
        sessionData: {
          userName: evt.value.username,
          token: resp.data.token
        }
      }
      this.onResultReceived(result)
    })
    .catch((error) => {
      let result = {
        ok: false,
        reason: error.response.data.non_field_errors
      }
      this.onResultReceived(result)
    })
  }

  onResultReceived (result) {
    if (result.ok) {
      this.setState({
        checking: false,
        failedReason: null,
      });
      this.props.sessionUpdateHandler(result.sessionData);
    } else {
      this.setState({
        checking: false,
        failedReason: result.reason
      })
      this.props.sessionUpdateHandler(null);
    }
  }

  render () {
    let session = this.context;
    return (session === null &&
      <LoginWindow
        checking={ this.state.checking }
        onSubmit={ (evt) => this.onSubmit(evt) }
        failedReason={ this.state.failedReason }
      />
    );
  }
}
LoginPresenter.contextType = SessionContext;
