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
