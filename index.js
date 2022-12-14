// Based on https://www.npmjs.com/package/soap#received-soap-headers
var express = require('express');
//const req = require('express/lib/request');
var soap = require('soap');

// the splitter function, used by the service
function splitter_function(args) {
    console.log("\n ==> splitter_function invoked ...");
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
    console.log("\ncount_function invoked ...");
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
  
 // var http = require('http');
  app.listen(8001);

  app.post('/wsdl', (req, res, next) => {
    console.log("\n==> Auth in HTTP headers : " + req.headers.authorization);
    next();
  });

  soapServer = soap.listen(app, '/wsdl', serviceObject, xml, function(){
    console.log('server initialized on 8001');
  });
  
  soapServer.on('request', function(request, methodName) {
    // It is possible to change the value of the headers
    // before they are handed to the service method.
    // It is also possible to throw a SOAP Fault
    console.log("\n==> SoapAction : " + methodName);
    console.log("\n==> SOAP request :");
    console.log(request);
  });