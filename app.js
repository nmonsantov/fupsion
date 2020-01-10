var post = angular.module('PostApp', []);
post.controller('PostController', function() {
       var pc = this;
       pc.post_list = ['Hello World', 'Testing'];  //Class variable
       pc.addPost = function(){
              pc.post_list.push(pc.post_text)
              pc.post_text = ""
       };
});
