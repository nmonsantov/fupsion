/*jslint node: true */
/*jshint esversion: 6 */
/*jslint browser: true */
/*global window */
"use strict";
var http = require('http');
var port = process.env.PORT || 3000;
const Errores=require('./models/errores.js');
const dbErr = new Errores();
//Devices
global.mobile ="smartphone";
global.tablet ="tablet";
global.pc ="desktop";

//Definir el area,controller action y parametro por defecto
var area_default={
    area:"app",
    controller:"home",
    action:"index",
    params:{topico:0}
};
if(process.platform!=="win32"){
    port =8000;
}
//
const DeviceDetector = require('node-device-detector');
const detector = new DeviceDetector();
//
http.createServer(function (req, res) {
    //si es un archivo regreso
    if(req.url.indexOf(".")>-1){
        //Myme types
        //Extraer prefijo .ico .doc .xlm etc
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        //res.end();
        console.log('favicon requested');
        return;
    }
    //Verificar el dispositivo del cliente
    let device=viewstart(req.headers["user-agent"]);
    //Verificar el area. si no tiene poner app por defecto
    let objurl=converturl(req);
    //Si viene con error
    if(objurl.dbErr.error_number!==0){
        res.writeHead(objurl.dbErr.error_number, { 'Content-Type': 'text/plain' });
        res.end(objurl.dbErr.error_message+'\n'+device);
        return;
    }
    //verificar el area,controller,action y params
    //area
    var area ="./areas/"+objurl.area;
    checkFolder(area,function(b){
 
    if(!b){
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Recurso no encontrado"+'\n'+area);
        return;
    }
    //check controller
    var controller = area+"/controllers/"+objurl.controller+".js";
    //
    checkFile(controller,function(b){
        if(!b){
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end("Recurso no encontrado"+'\n'+controller);
            return;
        }
        //------------------------------------------
        //--llama el layout correspondiente del area
        var _layout =area+"/views/shared/layout.html";
        if(device===global.mobile){
            _layout =area+"/views/shared/layout_mobil.html";
        }
        if(device===global.tablet){
            _layout =area+"/views/shared/layout_tablet.html";
        }
        var layout = getFile(_layout,function(r){
            if(r.error_number===0){
                r.html = r.html.replace("{title}","Fupsion")
                               .replace("{favicon}",area+"/favicon.ico");
                res.writeHead(200,{ 'Content-Type': 'text/html' });
                res.end(r.html);
            }
            else{
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(r.error_message);
            }
        });
    });
});
}).listen(port);

const viewstart=function(u){
    const result = detector.detect(u);
    let type = result.device.type.toLowerCase();
    switch(type){
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
//--------------------------------
//converturl
//Convertir URL en objeto
const converturl=function(req){
    let u = req.url;
    let o = new Object({
        area:"",
        controller:"",
        action:"",
        params:{},
        dbErr:{error_number:0,error_message:"",error_code:""}
    });
    //--
    let posx = u.indexOf("?");
    let posy = u.indexOf("/");
    let cadx = posx!==-1 ? u.substr(0,posx) : u;
    let cady = posx!==-1 ? u.substr(posx) : "";
    //--
    cadx = posy!==-1 ? cadx = cadx.substr(posy+1) : "";
    let cadx1 = cadx.split('/');
    if(cadx1.length > 0&&cadx1[0]===""){
        cadx1.splice(0,1);
    }
    //--Si tiene mas de 3 hay un error solo debe estar area controller y action
    if(cadx1.length > 3){
        o.dbErr.error_number=404;
        o.dbErr.error_message="Recurso no encontrado";
        o.dbErr.error_code="$M1";
    }
    else{
        //Si no esta indentificada el area ponemos por defecto app
        if(cadx1.length===0){
                o.area=area_default.area;
                o.controller=area_default.controller;
                o.action=area_default.action;
                o.params=area_default.params;
        }
        else{
            if(cadx1.length===1){
                o.area=cadx1[0];
                o.controller="";
                o.action="";
                o.params={};
            }              
            if(cadx1.length===2){
                o.area="";
                o.controller="";
                o.action="";
                o.params={};
                o.dbErr.error_number=400;
                o.dbErr.error_message="Recurso no encontrado";
                o.dbErr.error_code="$M2";
            }  
            if(cadx1.length===3){
                o.area=cadx1[0];
                o.controller=cadx1[1];
                o.action=cadx1[2];
                o.params={};
            }



        }
    }
    return o;
};
/*
    function    : folderexist
    objetivo    : verificar si el folder existe
*/
const checkFolder=function(folder,callback){
    var fs = require("fs"),b=false;
    fs.access(folder, fs.F_OK, (err) => {
        b = err===null;        
        callback(b);
    });
};
const checkFile=function(file,callback){
    var fs = require("fs"),b=false;
    fs.access(file, fs.F_OK, (err) => {
        b = err===null;        
        callback(b);
    });
};
const getFile=function(filePath,callback){
    var fs = require("fs");
    
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            dbErr.html = data;
        } else {
            dbErr.error_number = 400;
            dbErr.error_message = err.message;
        }
        callback(dbErr);
    });
};