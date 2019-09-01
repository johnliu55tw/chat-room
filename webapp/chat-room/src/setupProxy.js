const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/ws', {target: 'ws://localhost:8000', ws: true}));
  app.use(proxy('/api', {target: 'http://localhost:8000'}));
};
