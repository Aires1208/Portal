/**
 * Created by cloud on 2016/6/21.
 */
function loadingBarReset(){
    //$("#testLoading").html("<img src='../img/loading2.gif' />");
    $("#testLoading").css("width", "5px").css("height", "2px").animate({
        width:'85%'
    },"slow");
    $("#testLoading").css("z-index", "300");
}

function loadingBarFade(){
    var tbar = Math.random()*(80-10)+10;
//$("#testLoading").empty();
    $("#testLoading").animate({
        width: '100%'
    }, "slow");
    $("#testLoading").css("width", "100%").animate({
        height: '0px'
    }, "slow").animate({
        width: tbar+'%'
    }, "slow");;
    $("#testLoading").css("z-index", "-10");
}

function loadingBarFadeOut(){
    var tbar = Math.random()*(80-10)+10;
//$("#testLoading").empty();

    $("#testLoading").css("width", "100%").animate({
        height: '0px'
    }, "slow").animate({
        width: tbar+'%'
    }, "slow");;
    $("#testLoading").css("z-index", "-10");
}
