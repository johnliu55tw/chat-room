import React, { Component } from 'react';
import { Box, Button, Heading, Menu, Text, TextArea, Keyboard, Grommet, grommet} from 'grommet';
import { Notification } from 'grommet-icons';


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
    <Menu/>
    <Heading level='2' margin='none'>Chat Room!</Heading>
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
      if (this.props.onSend !== undefined) {
        this.props.onSend(text);
      }
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
              placeholder='Say someting...'
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

export const MessageList = (props) => (
  <Box flex overflow='auto' direction='column'>
    { props.messages.map((message) =>
      <Message
        userName={ message.user_name }
        date={ message.timestamp }
        message={ message.message }
        {...props}
      />
    )}
  </Box>
);

export const Message = (props) => (
  <Box
    flex={ false }
    direction='column'
    background='light-4'
    pad={{ left: 'small', right: 'small', vertical: 'small' }}
    elevation='none'
    {...props}
  >
    <Box direction='row' justify='between' align='start'>
      <Text weight='bold' textAlign='start'>{ props.userName }</Text>
      <Text weight='normal' size='small' textAlign='end'>{ props.date.toString() }</Text>
    </Box>
    <Text weight='normal' size='medium'>{ props.message }</Text>
  </Box>
);

export const TestApp = (props) => (
  <Grommet theme={ grommet } full>
    <Box direction='column' fill>
      <AppBar/>
      <MessageList
        messages={
          [
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Johnny', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Joe', timestamp: new Date(), message: 'Hello!'},
            {user_name: 'Andy', timestamp: new Date(), message: 'Hello!'},
          ]
        }
      />
      <SendMessageBar/>
    </Box>
  </Grommet>
);
