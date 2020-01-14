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
//Estructura
global.objurl =null;
//
var path = require("path");
global.pathroot = path.dirname(require.main.filename || process.mainModule.filename);
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
        cacheFile(req,res);
        return;
    }
    //Verificar el dispositivo del cliente
    let device=viewstart(req.headers["user-agent"]);
    //Verificar el area. si no tiene poner app por defecto
    global.objurl=converturl(req);
    //Si viene con error
    if(global.objurl.dbErr.error_number!==0){
        res.writeHead(global.objurl.dbErr.error_number, { 'Content-Type': 'text/plain' });
        res.end(global.objurl.dbErr.error_message+'\n'+device+'\nMoval');
        return;
    }
    //verificar el area,controller,action y params
    if(global.objurl.area!==""&&
       global.objurl.controller!==""&&
       global.objurl.action!==""){
        callController(req,
                       res,
                       global.objurl.area,
                       global.objurl.controller,
                       global.objurl.action,
                       global.objurl.params);
                       return;

    }
    //area
    var area ="./areas/"+global.objurl.area;
    checkFolder(area,function(b){
 
    if(!b){
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Recurso no encontrado"+'\n'+area);
        return;
    }
    //check controller
    const webconfig = require(area+"/web.js");
    const web = new webconfig();
    var controller = area+"/controllers/"+web.config.controller+".js";
    //
    if(global.objurl.controller!==""){
        controller = area+"/controllers/"+global.objurl.controller+".js"; 
    }

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
                r.html = r.html.replace("{title}","Plataforma Fupsion")
                               .replace("{favicon}","./favicon.ico");
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
//-------------------------------------
//function cache file Myme type
const cacheFile=function(req,res){
    var fs = require("fs"),
        path = require("path"),
        fileStream=null;
        var fPath = path.join(global.pathroot, '', req.url);
//--CSS        
        if(req.url.match("\.css$")){
            fileStream = fs.createReadStream(fPath, "UTF-8");
            res.writeHead(200, {"Content-Type": "text/css"});
            fileStream.pipe(res);
        }
//---ICO
        if(req.url.match("\.ico$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'image/x-icon'} );
            fileStream.pipe(res);
        }
//---JS
        if(req.url.match("\.js$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'aplication/javascript'} );
            fileStream.pipe(res);
        }
//---PNG 
        if(req.url.match("\.png$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'image/png'} );
            fileStream.pipe(res);
        }
//---JPG
        if(req.url.match("\.jpg$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'image/jpeg'} );
            fileStream.pipe(res);
        }
//---woff
        if(req.url.match("\.woff$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'aplication/font-woff'} );
            fileStream.pipe(res);
        }
//---ttf
        if(req.url.match("\.ttf$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'aplication/font-ttf'} );
            fileStream.pipe(res);
        }
//---EOT
        if(req.url.match("\.eot$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'aplication/vnd.ms-fontobject'} );
            fileStream.pipe(res);
        }
//---SVG
        if(req.url.match("\.svg$")){
            fileStream = fs.createReadStream(fPath);
            res.writeHead(200, {'Content-Type': 'application/image/svg+xml'} );
            fileStream.pipe(res);
        }
};
//---------------------
//
const callController=function(request,response,area,controller,action,params){
    var fs = require("fs"),
    path = require("path"),
    a    = area!=="" ? "areas/" : "";
    var fPath = path.join(global.pathroot, '', a+area+"/controllers/"+controller+".js");
    //Crear el controllador maestro
    const pathc = path.join(global.pathroot, '', 'public/controllers/main.js');
    const main = require(pathc);
    global.MainController = new main();
    //Antes de ejecutar el controlador verificamos
    global.MainController.Executing(function(result){
        const Controller = require(fPath);
        const c = new Controller(request,response,action,params,function(result){
                global.MainController.Executed(function(result){
                    global.MainController.Disponse(function(result){
                            //remove global.MainController
                            delete global.request;
                            delete global.response;
                            delete global.MainController;

                    });

                });
        });
    });
 };
 