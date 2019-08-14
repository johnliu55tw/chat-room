export class SessionManager {
  setCurrentSession (sessionData) {
    localStorage.setItem('userSession', JSON.stringify(sessionData));
  }

  getCurrentSession (sessionData) {
    return JSON.parse(localStorage.getItem('userSession'));
  }

  clearCurrentSession () {
    localStorage.removeItem('userSession');
  }
}

export class MessageManager {
  constructor () {
    var ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
    var ws_path = ws_scheme + '://' + window.location.host + '/ws/';
    console.log("Connecting to " + ws_path);
    var socket = new WebSocket(ws_path);
    this.socket = socket;
    this.socket.onmessage = (wsMsg) => { this.onReceive(wsMsg) };

    this.onReceiveCallback = null;
  }

  send (userName, text) {
    let msgObj = {
      'user_name': userName,
      'content': text,
    };

    this.socket.send(JSON.stringify(msgObj));
  }

  onReceive (wsMsg) {
    console.log('WS received:');
    console.log(wsMsg);
    let data = JSON.parse(wsMsg.data);
    this.onReceiveCallback(
      data['user_name'],
      data['content'],
      data['id'],
      new Date(data['timestamp'] * 1000)
    );
  }
}
