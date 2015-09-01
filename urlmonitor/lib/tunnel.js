const {Cc, Ci} = require('chrome');
let socketTransportService = Cc["@mozilla.org/network/socket-transport-service;1"].getService(Ci.nsISocketTransportService);
/* SocketTransportService constants */
const TIMEOUT_CONNECT = 0;
const TIMEOUT_READ_WRITE = 1;

const asyncStreamCopier = Cc["@mozilla.org/network/async-stream-copier;1"]
/* nsIAsyncStreamCopier constants */
const OPEN_BLOCKING = 1 << 0;
const OPEN_UNBUFFERED = 1 << 1;

/* nsITransport's settings */
const SEGMENT_SIZE = 0x8000;
const SEGMENT_COUNT = 1024;

function Listener(remoteHost, remotePort) {
  this.remoteHost = remoteHost;
  this.remotePort = remotePort;
  this.transports = [];
  this.clientTransports = [];
}

Listener.prototype = {
  /**
   * @param serverSocket nsIServerSocket
   * @param transport nsISocketTransport
   */
  onSocketAccepted: function(serverSocket, transport) {
    this.transports.push(transport);
    let serverHost = transport.host;
    let serverPort = transport.port;

    let clientTransport = socketTransportService.createTransport(["ssl"], ["ssl"].length, this.remoteHost, this.remotePort, null);
    this.clientTransports.push(clientTransport);
    clientTransport.setTimeout(TIMEOUT_CONNECT, 10);
    clientTransport.setTimeout(TIMEOUT_READ_WRITE, 180);
    let clientHost = clientTransport.host;
    let clientPort = clientTransport.port;
    let clientInputStream = clientTransport.openInputStream(0, SEGMENT_SIZE, SEGMENT_COUNT).QueryInterface(Ci.nsIAsyncInputStream);
    let clientOutputStream = clientTransport.openOutputStream(OPEN_UNBUFFERED, 0, 0).QueryInterface(Ci.nsIAsyncOutputStream);
    let serverInputStream = transport.openInputStream(0, SEGMENT_SIZE, SEGMENT_COUNT).QueryInterface(Ci.nsIAsyncInputStream);
    let serverOutputStream = transport.openOutputStream(OPEN_UNBUFFERED, 0, 0).QueryInterface(Ci.nsIAsyncOutputStream);
    let listener = this;

    function createObserver(name) {
      let observer = {
        onStartRequest: function(request, context) {
        },

        onStopRequest: function(request, context, statusCode) {
          try {
            // close both transports
            listener.closeServerTransport(transport, statusCode);
            listener.closeClientTransport(clientTransport, statusCode);
          } catch (e) {
          }
        }
      };
      return observer;
    }
    let observer = createObserver("SI->CO");

    let copier = asyncStreamCopier.createInstance(Ci.nsIAsyncStreamCopier);
    copier.init(serverInputStream, clientOutputStream, null, true, false, 0, true, true);
    copier.asyncCopy(observer, null);

    observer = createObserver("CI->SO");
    let copier2 = asyncStreamCopier.createInstance(Ci.nsIAsyncStreamCopier);
    copier2.init(clientInputStream, serverOutputStream, null, true, false, 0, true, true);
    copier2.asyncCopy(observer, null);
  },

  closeServerTransport: function(transport, statusCode) {
    transport.close(statusCode);
    let index = this.transports.indexOf(transport);
    if (index >= 0) {
      this.transports.splice(index, 1);
    }
  },

  closeClientTransport: function(clientTransport, statusCode) {
    clientTransport.close(statusCode);
    let index = this.clientTransports.indexOf(clientTransport);
    if (index >= 0) {
      this.clientTransports.splice(index, 1);
    }
  },

  /**
   * @param serverSocket nsIServerSocket
   * @param status nsresult
   */
  onStopListening: function(serverSocket, result) {
    this.close();
  },

  close: function() {
    for (let transport of this.transports) {
      try {
        this.closeServerTransport(transport, 0);
      } catch (e) {
      }
    }

    for (let transport of this.clientTransports) {
      try {
        this.closeClientTransport(transport, 0);
      } catch (e) {
      }
    }
  }
};

function Server(remoteHost, remotePort) {
  this.serverSocket = null;
  this.listener = new Listener(remoteHost, remotePort);
}

Server.prototype = {
  /*
   * Starts the tunnel listening on the specified local port.
   *
   * @param localport Number the listening port
   * @param loopbackOnly Boolean listen on loopback interface only (defaults to true).
   * @param backlog Number listen backlog to use. Use system defaults if not specified.
   */
  listen: function(localPort, loopbackOnly, backlog) {
    loopbackOnly = (typeof loopbackOnly == 'undefined' ? true : loopbackOnly);
    backlog = (typeof backlog == 'undefined' ? -1 : backlog);

    this.serverSocket = Cc['@mozilla.org/network/server-socket;1'].createInstance(Ci.nsIServerSocket);
    this.serverSocket.init(localPort, loopbackOnly, backlog);
    this.serverSocket.asyncListen(this.listener);
    return this;
  },

  close: function() {
    if (this.serverSocket) {
      this.serverSocket.close();
      this.listener.close();
    } else {
    }
  }
}

let createServer = exports.createServer = function createServer(remoteHost, remotePort) {
  return new Server(remoteHost, remotePort);
}
