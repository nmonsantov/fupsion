/*jslint node: true */
/*jshint esversion: 6 */
/*jslint browser: true */
/*global window */
"use strict";
var http = require('http');
var port = process.env.PORT || 3000;
//var routes = require('/routes/index.js');
//
if(process.platform!=="win32"){
    port =8080;
}
//
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector();
//
http.createServer(function (req, res) {
    //Verificar el dispositivo del cliente
   let device=viewstart(req.headers["user-agent"]);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Fupsion\nNelson Monsanto\n'+device);
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
