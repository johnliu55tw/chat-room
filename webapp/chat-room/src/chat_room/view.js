import React, { Component, useState } from 'react';
import { Box, Button, Menu, Text, Paragraph, TextArea, Keyboard, Layer, Form, FormField } from 'grommet';
import { Notification, Chat, User } from 'grommet-icons';


export const AppBar = (props) => (
  <Box
    flex={ false }
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    elevation='medium'
    style={{ zIndex: '1' }}
    pad={{ left: 'small', right: 'small', vertical: 'xsmall' }}
    {...props}
  >
    <Menu
      label={
        <Box direction='row'>
          <User/>
          <Text margin={{ left: 'small' }} weight='bold'>
            { props.userName }
          </Text>
        </Box> }
      items={[
      {label: 'Log out', onClick: props.logOut},
    ]}/>
    <Button icon={<Notification/>} />
  </Box>
);

export class SendMessageBar extends Component {
  constructor (props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  handleEnter (event) {
    if (!event.shiftKey) {
      let text = event.target.value;
      console.log('Enter: ' + text);
      this.props.sendMessage(text);
      this.setState({text: ''});
    }
  }

  handleChange (event) {
    let text = event.target.value
    if (text.indexOf('\n') === 0 && text.length === 1) {
      text = text.substr(1);
    }
    this.setState({text: text});
  }

  render () {
    return (
      <Box
        flex={ false }
        direction='row'
        align='center'
        justify='between'
        background='brand'
        elevation='medium'
        style={{ zIndex: '1' }}
        pad={{ left: 'small', right: 'small', vertical: 'small' }}
        {...this.props}
      >
        <Keyboard onEnter={ (event) => this.handleEnter(event) }>
          <Box fill={ true }>
            <TextArea
              placeholder='Say something...'
              onChange={ (event) => this.handleChange(event) }
              value={ this.state.text }
              resize={ false }
            />
          </Box>
        </Keyboard>
      </Box>
    );
  }
}

export class MessagePanel extends Component {
  constructor (props) {
    super(props);
    this.state = {
      atBottom: true
    }
    this.messageEndNode = null;
    this.panelNode = null;
  }

  isAtBottom () {
    let total = this.panelNode.scrollHeight - this.panelNode.clientHeight;
    let diff = Math.abs(total - this.panelNode.scrollTop);
    // The tolerance is 2 pixel
    return (diff < 2);
  }

  scrollToBottom () {
    this.messageEndNode.scrollIntoView();
  }

  onPanelScroll () {
    let isAtBottom = this.isAtBottom();
    if (this.state.atBottom !== isAtBottom) {
      console.log('Set at bottom to ' + isAtBottom.toString());
      this.setState({atBottom: isAtBottom});
      if (isAtBottom && this.props.scrollToBottom !== undefined) {
        this.props.scrollToBottom();
      }
    }
  }

  componentDidMount () {
    console.log('did mount');
    this.scrollToBottom();
  }

  componentDidUpdate () {
    console.log('did update');
    if (this.state.atBottom) {
      console.log('scroll to bottom');
      this.scrollToBottom();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.atBottom !== nextState.atBottom) {
      return false;
    } else {
      return true;
    }
  }

  render () {
    return (
      <Box
        overflow='auto'
        direction='column'
        style={{ position: 'relative' }}
        ref={ (elem) => { this.panelNode = elem; }}
        onScroll={ () => { this.onPanelScroll(); }}
      >
        { this.props.messages.map((message) =>
          <Message
            userName={ message.user_name }
            date={ message.timestamp }
            message={ message.message }
            key={ message.id }
            {...this.props}
          />
        )}
        <div
          style={{ float: 'left', clear: 'both'}}
          ref={ (elem) => { this.messageEndNode = elem; }}>
        </div>
      </Box>
  )};
}

export const NewMessageNotification = (props) => (
  <Layer
    plain={ true }
    position='bottom'
    modal={ false }
    margin={{ bottom: '5em' }}
  >
    <Button
      color={ 'status-ok' }
      icon={ <Chat/> }
      label={ 'New Message!' }
      onClick={ () => {props.onClick()} }/>
  </Layer>
)

export const Message = (props) => {
  const [hover, setHover] = useState(false);

  return (
    <Box
      flex={ false }
      direction='column'
      background={ hover ? 'light-4' : 'light-3' }
      pad={{ left: 'small', right: 'small', vertical: 'small' }}
      elevation='none'
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
      {...props}
    >
      <Box direction='row' justify='between' align='start'>
        <Text weight='bold' textAlign='start'>{ props.userName }</Text>
        { hover && (
          <Text weight='normal' size='small' textAlign='end'>
            { props.date.toString() }
          </Text>
        )}
      </Box>
      <MessageBody message={ props.message }/>
    </Box>
  );
}

export const MessageBody = (props) => (
  props.message.split('\n').map((msg, index) => (
    <Paragraph key={ index } margin={ {top: '0', bottom: '0'} }>
      { msg }
    </Paragraph>
  ))
)

export class LoginWindow extends Component {
  onSubmit (evt) {
    if (this.props.onSubmit !== undefined) {
      this.props.onSubmit(evt)
    }
  }

  renderButton () {
    if (this.props.checking) {
      return (<Button type="submit" disabled primary label="Checking..." />)
    } else {
      return (<Button type="submit" primary label="Go!" />)
    }
  }

  render () {
    return (
      <Layer animation='fadeIn'>
        <Box pad='medium'>
          <Form onSubmit={ (evt) => {this.onSubmit(evt)} }>
            <FormField
              required={ true }
              name='username'
              disabled={ this.props.checking }
              label='Username'
              error={ this.props.failedReason && ' ' }
              />
            <FormField
              type='password'
              required={ true }
              name='password'
              disabled={ this.props.checking }
              label='Password'
              error={ this.props.failedReason }
              />
            { this.renderButton() }
          </Form>
        </Box>
      </Layer>
    )
  }
}
