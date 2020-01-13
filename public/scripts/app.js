/*
    Programa    : app.js
    objetivo    : estructura con datos generales para las aplicaciones
    Autor       : Nelson Monsanto
    Derechos    : MOVALSoftware
    Licencia    : MIT
*/
window.app={
  page:{
    active:null
  },
   //
  host:function(){
    var path = document.location.protocol + "//" + document.location.host,
    s = path.trim(),
    i = s.substr(s.length - 1, 1);
  //
  return path;

  },
  location:function(){
    var path = document.location.protocol + "//" + document.location.host;
    if (document.location.pathname !== "") {
        if (document.location.pathname !== "/") {
            path += document.location.pathname;
        }
    }

    var s = $.trim(path);
    var i = s.substr(s.length - 1, 1);
    //if (i !== "/") path += "/";
    return path; 
  },   
  //tipovista 0 view 1 partialview
  addcenter:function(action,params,callback,tipovista){
    if(tipovista===undefined){tipovista=0;}
     $.post(action,params,function(r){
         if(r){
           //verifica si tiene una vista activa
           //unload

           var area = tipovista===0 ? $("appview") : $("body");
           area.html("").html(r);
           //load
           //complete
           
         }
     }).always(function(){
       if(typeof(callback)==="function"){
         callback();
       }
     });
  } 
};
