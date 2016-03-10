$.urlParam = function(name){
var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
if (results==null){
return null;
}else{
return results[1] || 0;
}	
}
$( document ).ready(function() {
    $("#web").attr("src",decodeURIComponent($.urlParam("web")));
});
