/*
    Programa    : app.js
    tema        : default
    objetivo    : estructura de la aplicacion web
*/
if(window.app ===undefined){window.app={};}
app.cacheDom = function(){
    this.cframe = $("#main");
    this.hframe = $("#header");
};
app.create = function(){
    //
    var action = app.location()+"/home/index",
    params ={topico:1};
    app.addcenter(action,params,function(){
        app.cacheDom();   
        //inicia los elementos
        app.init();
        //operaciones del navegador
        app.load();
        //
        app.complete();
        //resize
        app.resize();

    },1);
};
app.init = function(){
    //crear el header y sus elementos
    this.control.header.init();

};
app.load = function(){


};
app.unload = function(){


};
app.complete=function(){
    $(window).off("resize",app.resize);
    $(window).on("resize",app.resize);
    app.hframe.show();
    app.cframe.show();
    //Loader
    window.setTimeout(function(){
        $('body').addClass("loaded");
    },200);
};
app.resize = function(){
    if(app.cframe===undefined||app.cframe.length ===0){
        return;
    }
    var w1 = $(window).width(),
        h1 = $(window).height(),
        h2 = app.hframe.height();

    app.cframe.css("width",w1+"px")
              .css("height",(h1-h2)+"px");
     
};
//Controles del tema
app.control={
    header:{
        init:function(){
            app.hframe.addClass("page-topbar");
            //Prepara el logo
            this.template.header =this.template.header.replace("{elementos}",this.template.logo);
            this.template.header =this.template.header.replace("{elementos}",this.template.image.web+this.template.image.mobil+this.template.image.tablet);
            this.template.header =this.template.header.replace("{textlabel}","FUPSION Network");
             //crear la lista
             var li="",lista=this.template.li;
             for(var x=0;x<lista.length;x++){
                    li+=lista[x].x;
             }
             this.template.ul=this.template.ul.replace("{elementos}",li);
             this.template.header =this.template.header.replace("{ulmenu}",this.template.ul);
            //crear el navegador en el header
            app.hframe.html(this.template.header );
            //crea logo
        },
        template:{
            header:"<div class='navbar-fixed'><nav class='nav-grad'><div class='nav-wrapper'>{elementos}</div></nav></div",
            logo:"<h1 class='logo-wrapper'><a href='#' class='brand-logo darken-1 headermenu'>{elementos}</a><span class='logo-text'>{textlabel}</span></h1>{ulmenu}",
            image:{
                web:"<img src='./public/images/default/logo-white-350x175.png' alt='fupsion logo' class='hide-on-med-and-down' style='width: 45%;top:-10px;position: relative;'>",
                mobil:"<img src='./public/images/default/logo-white-350x175.png' alt='fupsion logo' class='hide-on-med-and-up' style='width: 80%;top:0px;left:-85px;position: relative;'>",
                tablet:"<img src='./public/images/default/logo-white-350x175.png' alt='fupsion logo' class='hide-on-small-only hide-on-large-only' style='width: 50%;top:-5px;position: relative;'>"
            },
            ul:"<ul class='right'>{elementos}</ul>",
            li:[
                {x:"<li class='hide-on-med-and-down'><a class='btn-notasAll modal-trigger waves-effect waves-block waves-light' href='#notasAll-modal'><i class='mdi-action-speaker-notes'></i></a></li>"},
                {x:"<li class='hide'><a data-activates='chat-window' class='waves-effect waves-block waves-light chat-window-collapse' href='#'><i class='mdi-action-announcement'></i></a></li>"},
                {x:"<li><a data-activates='chat-global' class='open-chat-list waves-effect waves-block waves-light chat-collapse' href='#'><i class='mdi-action-question-answer'><small class='notification-badge chat-badge' style='display: none;'>0</small></i><span class='hide-on-med-and-up' style='position:relative; top:-10px;'>{username}</span><span class='hide-on-small-only hide-on-large-only' style='position:relative; top:-40px;'>{username}</span></a></li>"},
                {x:"<li class='hide-on-med-and-down'><a href='javascript:void(0);' class='waves-effect waves-block waves-light toggle-fullscreen'><i class='mdi-action-settings-overscan'></i></a></li>"}


            ]
        },

    },
};
//
$(document).ready(function(){window.app.create();});