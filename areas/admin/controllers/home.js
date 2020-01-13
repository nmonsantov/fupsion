/*jshint esversion: 6 */
/*
    Programa    :
    Autor       :
    Derechos    :
    Version     :
    Analisis    :
*/
const fs        = require("fs");
const path      = require("path");

function HomeController(request,response,action,param,callback){
    global.request = request;
    global.response= response;

        if(action===null||action===""){action ="index";}
        switch(action){
            case "index":
                this.index(param,callback);
                break;
            default:
                break;

        }
}

HomeController.prototype.index=function(param,callback){
    //si param es nulo o undefined
    if(param===null || param === undefined || param.topico === undefined){
        param = {
            topico:0
        };
    }
    //
    var patview=global.pathroot+"/areas/admin/views";
    var vista ="";
    switch(param.topico){
        case 0:
            vista = patview+"/home/index.html";
            break;
        default:
            break;
    }
    //
    global.MainController.get(vista,function(result){
        //Si tiene error
        //si no tiene error
        global.response.setHeader('Content-Type', 'text/html');
        global.response.end(result.html);
        if(typeof(callback)==="function"){
            callback(global.MainController.Errores);
        }
    });
    //------
};

module.exports=HomeController;