$(function () {
    //cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
    //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

    var st =  getCookie("starttime");
    var et =  getCookie("endtime");
    var rg =  getCookie("ranges");

    console.log("cookie: ranges = " + rg);
    console.log("cookie starttime=" + st);
    console.log("cookie endtime=" + et);
    if (st != "" && et != "") {
        setDatePicker(st, et,rg);
        datePickerUpdateData(st, et);
    } else {
        cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
        //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        $('#reportrange span').html('10 Minutes');
        document.cookie = "ranges=" + '10 Minutes';
    }


    $("#mytable tr").find("td:eq(6)").width(100);
    $("#mytable tr").find("td:eq(7)").width(100);
    $("#mytable tr").find("td:eq(8)").width(100);
    $("#mytable tr").find("td:eq(9)").width(100);


});

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=serversCtrl]');
    var $scope = angular.element(appElement).scope();

    showAllCol();

    $scope.replaceModel(start,end);
}

function showAllCol(){
    //console.log($("#cpu").is(':checked'));
    //
    //$("#cpu").attr("checked",'true');
    ////$("#cpu").attr("checked","checked");
    $("td:eq(4)",$("tr")).show();
    $("th:eq(4)",$("tr")).show();

    $("td:eq(5)",$("tr")).show();
    $("th:eq(5)",$("tr")).show();

    $("td:eq(6)",$("tr")).show();
    $("th:eq(6)",$("tr")).show();

    $("td:eq(7)",$("tr")).show();
    $("th:eq(7)",$("tr")).show();
}

function resetCheckbox(){
    $('#checkboxList').empty();

    var h = '<li role="presentation"> &nbsp;&nbsp;<input type="checkbox" id="cpu" checked="checked" name="box"> CPU(%) </li> ' +
            '<li role="presentation"> &nbsp;&nbsp;<input type="checkbox" id="mem" checked="checked" name="box"> Memory(%) </li> '+
            '<li role="presentation"> &nbsp;&nbsp;<input type="checkbox" id="disk" checked="checked" name="box"> Disk I/O(%) </li> '+
            '<li role="presentation"> &nbsp;&nbsp;<input type="checkbox" id="net" checked="checked" name="box"> Network I/O(%) </li> ';
    $('#checkboxList').append(h);

    $("#cpu").click(function(){
        $("td:eq(4)",$("tr")).toggle(0);
        $("th:eq(4)",$("tr")).toggle(0);
    });
    $("#mem").click(function(){
        $("td:eq(5)",$("tr")).toggle(0);
        $("th:eq(5)",$("tr")).toggle(0);
    });
    $("#disk").click(function(){
        $("td:eq(6)",$("tr")).toggle(0);
        $("th:eq(6)",$("tr")).toggle(0);
    });
    $("#net").click(function(){
        $("td:eq(7)",$("tr")).toggle(0);
        $("th:eq(7)",$("tr")).toggle(0);
    });



    /*if($("#cpu").is(':checked') == false){
        $("td:eq(4)",$("tr")).toggle(0);
        $("th:eq(4)",$("tr")).toggle(0);


        $("input[name='box']").attr("checked","checked");
    }

    if($("#mem").is(':checked') == false){
        $("td:eq(5)",$("tr")).toggle(0);
        $("th:eq(5)",$("tr")).toggle(0);
    }

    if($("#disk").is(':checked') == false){
        $("td:eq(6)",$("tr")).toggle(0);
        $("th:eq(6)",$("tr")).toggle(0);
    }

    if($("#net").is(':checked') == false){
        $("td:eq(7)",$("tr")).toggle(0);
        $("th:eq(7)",$("tr")).toggle(0);
    }*/
}

var serversApp = angular.module('serversApp', []);
serversApp.controller('serversCtrl', function ($scope, $http, $location) {
    //$scope.appName=QueryString('name');;
    //$scope.from = QueryString('from');;
    //$scope.to = QueryString('to');

    $scope.isrecordsLoading = false;

    $scope.records = null;
    //更新方法
    $scope.replaceModel = function (start,end) {
        $scope.from = start;
        $scope.to = end;

        loadingBarReset();
        //$scope.tableUrl = "../mockjson/servers.json";
        //serverstats?from=1468905125513&to=1468912325514
        $scope.tableUrl = dataSourceURL() + "/serverstats.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("serversUrl = " + $scope.tableUrl);
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.records = response.servers;
                console.table($scope.records);

                resetCheckbox();
                $scope.isrecordsLoading = false;
            }).error(function (data) {
                console.log("http error ===== " + data);
                loadingBarFadeOut();
            });


    }

    $scope.isHealthColor = function (v) {
        if (v === 'true') {
            return '#79DD1B';
        } else {
            return 'red';
        }
    };

    $scope.getSimpleOSStr = function (v) {
        var s = v.substring(0, 5);
        return s;
    };

    $scope.getTypeStr = function (v) {
        if(v){
            return 'Docker';
        }else{
            return 'Server';
        }
    };

    $scope.calWidth = function(str){
        var s = str.substring(0,str.length-1);
        var i = Number(s);
        var r = i+'px';
        //console.log("r  = "+r);
        return r;
    };


    $scope.getHealthBgColor =  function(v){
        var color = '#79DD1B';//green;
        switch (v.toUpperCase()) {
            case 'CRITICAL':
                color = '#EA041B';//red;
                break;
            case 'WARNING':
                color = "orange";
                break;
            case 'NORMAL':
                color = '#79DD1B';//green;
                break;
            default:
                color = '#79DD1B';//green;
        }
        return color;
    };


    function QueryString(item) {
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"))
        return sValue ? sValue[1] : sValue
    }

    function checkToStr(str) {
        var loc = str.indexOf('#');
        if (loc == -1) {
            return str;
        } else {
            return str.substring(0, loc);
        }
    }

});

serversApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});
