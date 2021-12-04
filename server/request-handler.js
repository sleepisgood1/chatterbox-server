/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

var messages = [];

var requestHandler = function (request, response) {
  var headers = defaultCorsHeaders;
  var statusCode = 200;
  headers['Content-Type'] = 'application/json';
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  //console.log(messages);
  //We are the server, in 'get' we are sending(posting)
  if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(statusCode, headers);
    //debugger;
    response.end(JSON.stringify(messages));
  }
  //in 'post', we are receiving(getting)
  if (request.method === 'POST' && request.url === '/classes/messages') {
    let body = '';
    //we are receiving chunks
    request.on('data', (chunk) => {
      body += chunk.toString();
      //console.log('request body:' , body);
    });
    request.on('end', () => {
      if (body) {
        const message = JSON.parse(body);
        //after all chunks received, we add to our storage
        messages.push(message);
        response.writeHead(201, headers);
        response.end(JSON.stringify(messages));
      } else {
        //error message if no input
        response.writeHead(400, headers);
        response.end('no message was received');
      }
    });

  }
  //invalid destination
  if (request.url !== '/classes/messages') {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('Error 404');
  }
  // what else can be done
  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end('Options');
  }
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  // var statusCode = 200;
  // console.log(statusCode);
  // See the note below about CORS headers.


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;