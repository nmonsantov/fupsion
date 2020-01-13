function Web(){
    this.config = {
       controller:"home",
        action:"index",
        params:{
            topico:0
        }
    };
}
var estado={ a:0,b:1,r:89};
Web.prototype.init=function(){};
Web.prototype.get=function(){
    return this.config;
};
module.exports=Web;