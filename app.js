/*jslint node: true */
/*jshint esversion: 6 */
/*jslint browser: true */
/*global window */
"use strict";
var http = require('http');
var port = process.env.PORT || 3000;
const DeviceDetector = require('node-device-detector');
//----------------------------------------------
//Para versiones anteriores de Node
if (!Object.entries)
   Object.entries = function( obj ){
      var ownProps = Object.keys( obj ),
         i = ownProps.length,
         resArray = new Array(i); // preallocate the Array

      while (i--)
         resArray[i] = [ownProps[i], obj[ownProps[i]]];
      return resArray;
   };
//---------------------------------------------   
const detector = new DeviceDetector();
//
http.createServer(function (req, res) {
    //Verificar el dispositivo del cliente
    let device=viewstart(req.headers["user-agent"]);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n'+device);
}).listen(port);

const viewstart=function(u){
    const result = detector.detect(u);
    let type = result.device.type.toLowerCase();
    switch(result.device.type.toLowerCase()){
        case "smartphone":
            break;
        case "desktop":
            break;
        case "tablet":
            break;
        default:
            break;
    }
    return(type);
};