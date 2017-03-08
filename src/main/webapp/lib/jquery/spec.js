/**
 * Created by liujiong on 2016/1/12.
 */
function changeHeaderBg(obj) {
    var headerItem = document.getElementsByClassName("header-selected");
    headerItem[0].classList.remove("header-selected");
    obj.classList.add("header-selected");
}

function changeSidebarBg(obj) {
    var sidebarItem = document.getElementsByClassName("sidebar-selected");
    sidebarItem[0].classList.remove("sidebar-selected");
    obj.classList.add("sidebar-selected");
}

function changeArrow(obj) {
    var arrowSpan = obj.getElementsByTagName("span");

    if (arrowSpan.length > 0) {
        if($(arrowSpan[0]).hasClass("glyphicon-chevron-right")){
            arrowSpan[0].classList.remove("glyphicon-chevron-right");
            arrowSpan[0].classList.add("glyphicon-chevron-down");
        } else {
            arrowSpan[0].classList.remove("glyphicon-chevron-down");
            arrowSpan[0].classList.add("glyphicon-chevron-right");
        }
    }

}

function changeUrl(obj) {
    var iFrame = document.getElementById("iframe");
    var url = obj.getAttribute("about");
    iFrame.setAttribute("src", url);
    /*    var id = url.split("#")[1];
     var height = getWidthOfH2(id);
     iFrame.setAttribute("height", height + "px");*/
}



$(function() {
   $("div.asset-1").bind("click", function(){
      $("ul.asset-1").slideToggle(200, function(){
      })
   });
    $("div.asset-2").bind("click", function(){
        $("ul.asset-2").slideToggle(200, function(){
        })
    });
    $("div.asset-3").bind("click", function(){
        $("ul.asset-3").slideToggle(200, function(){
        })
    });
    $("div.asset-4").bind("click", function(){
        $("ul.asset-4").slideToggle(200, function(){
        })
    });
    $("div.asset-5").bind("click", function(){
        $("ul.asset-5").slideToggle(200, function(){
        })
    });
});
