// Based on https://www.npmjs.com/package/soap#received-soap-headers
var express = require('express');
var soap = require('soap');

// the splitter function, used by the service
function splitter_function(args) {
    console.log('splitter_function');
    var splitter = args.splitter;
    var splitted_msg = args.message.split(splitter);
    var result = [];
    for(var i=0; i<splitted_msg.length; i++){
      result.push(splitted_msg[i]);
    }
    return {
        result: result
        }
}

// the count function, used by the service
function count_function(args) {
    console.log('count_function');
    var splitter = args.splitter;
    var splitted_msg = args.message.split(splitter);
    var result = [];
    for(var i=0; i<splitted_msg.length; i++){
      result.push(splitted_msg[i]);
    }
    return {
        Counts: result
        }
}

// the service
var serviceObject = {
  MessageSplitterService: {
        MessageSplitterServiceSoapPort: {
          MessageSplitter: splitter_function,
          MessageCounter: count_function
        }
    }
};

  var xml = require('fs').readFileSync('serviceV2.wsdl', 'utf8');

  //express server example
  var app = express();
  //body parser middleware are supported (optional)
  //app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
  app.listen(8001, function(){
      //Note: /wsdl route will be handled by soap module
      //and all other routes & middleware will continue to work

      soapServer = soap.listen(app, '/wsdl', serviceObject, xml, function(){
        console.log('server initialized on 8001');
      });

      soapServer.authenticate = function(security) {
        //console.log(security);
        return true;
        var created, nonce, password, user, token;
        token = security.UsernameToken, user = token.Username,
                password = token.Password, nonce = token.Nonce, created = token.Created;
        return user === 'user' && password === soap.passwordDigest(nonce, created, 'password');
      };

  });
