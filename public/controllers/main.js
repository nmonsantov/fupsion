/*
    Programa    : main.js
    Tipo        : controller
    Objetivo    : Funciones generales para todos los demas controladores
                  de la aplicacion

*/
var errores = require(global.pathroot+"/models/errores.js");
function MainController(request,response){
    this.request = request;
    this.response = response;
    this.Errores = new errores();
}

MainController.prototype.Executed=function(callback){
    if(typeof(callback)=="function"){
        callback(this.Errores);
    }
};
MainController.prototype.Executing=function(callback){
    //si user en global es undefined  debe ir a login en services
    //iniciar base de datos
    //si se produce un error llamar onError
    if(typeof(callback)=="function"){
        callback(this.Errores);
    }
};
MainController.prototype.Disponse=function(callback){

    if(typeof(callback)=="function"){
        callback(this.Errores);
    }
};
MainController.prototype.onError=function(callback){
    if(typeof(callback)=="function"){
        callback(this.Errores);
    }
};
MainController.prototype.get=function(view,callback){
    var fs = require("fs");
    var dbErr = this.Errores;

    fs.readFile(view, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            dbErr.html = data;
        } else {
            dbErr.error_number = 400;
            dbErr.error_message = err.message;
        }
        callback(dbErr);
    });

};
module.exports = MainController;