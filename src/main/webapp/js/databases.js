$(function () {
    var start =  getCookie("starttime");
    var end =  getCookie("endtime");
    var rg =  getCookie("ranges");

    if (start !== "" && end !== "") {
        console.log("cookie: start time = " + start);
        console.log("cookie: end time = " + end);
        console.log("cookie: ranges = " + rg);

        setDatePicker(start, end,rg);
        datePickerUpdateData(start, end);
    } else {
        cb(moment().subtract(10, 'minutes'), moment());
        //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        $('#reportrange span').html('10 Minutes');
        document.cookie = "ranges=" + '10 Minutes';
    }

    $("#addMonitorSelectedId").val('mysql');
    $("#dbsTable tr").find("td:eq(1)").width(10);
});

function datePickerUpdateData(start, end) {
    var appElement = document.querySelector('[ng-controller=dbCtrl]');
    var $scope = angular.element(appElement).scope();

    //write cookie
    document.cookie = "starttime=" + start;
    document.cookie = "endtime=" + end;

    $scope.from = start;
    $scope.to = end;

    $scope.replaceModel();
}

function hideDialog(dialog_id){
    $('#' + dialog_id).modal('hide');
}

function toast(priority_str, message_str){
    //priority: success, info, warning, danger
    $.toaster({ priority : priority_str, title : 'Tip', message : message_str });
}

function dbURL(hostname) {
    if (hostname === 'localhost') {
        var debugIp = "10.62.100.137";
        return "http://" + debugIp + ":8081";
    } else {
        return "http://" + hostname + ":8081";
    }
}

var dbApp = angular.module('dbApp', []).config(['$httpProvider', function($httpProvider) {
         $httpProvider.defaults.timeout = 2000;}]);
dbApp.controller('dbCtrl', function ($scope, $http,$location) {
    $scope.monitorParam = {dbName: "mysql",url: "127.0.0.1", dbType:"MySql",dbUsername:"root",dbPassword:"root123",dbPort:"3306",dbSID:"",connectType:"SSH",hostPort:"22",hostUsername:"root",hostPassword:"root123"};
    $scope.host = dbURL($location.host());

    $scope.isHealthColor =  function(v){
        if(v == true ){
            return '#79DD1B';
        }else{
            return 'red';
        }
    };

    $scope.isOnBgColor =  function(v){
        if(v.toUpperCase() == 'ON' ){
            return '#07B0D3';
        }else{
            return 'lightgray';
        }
    };

    $scope.replaceModel = function () {
        loadingBarReset();
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        var resUrl = "/mysql_monitor/dbs";
        $scope.dbsUrl = $scope.host + resUrl + "?from=" + $scope.from + "&to=" + $scope.to;
        console.log("dbsUrl = " + $scope.dbsUrl);
        $http.get($scope.dbsUrl)
            .success(function (data) {
                if (data.result.toUpperCase() == 'OK') {
                    loadingBarFade();
                    $scope.records = data.msg.dbs;
                } else if(data.result.toUpperCase() == 'ERROR'){
                    toast('danger', data.msg);
                    console.log(data.msg);
                }
            }).error(function (data, status) {
                loadingBarFadeOut();
                ErrorMsg = "http get request failed: " + status + " " + data;
                //toast('danger', ErrorMsg);
                console.log(ErrorMsg);
            });
    }

    $scope.addMonitor = function () {
        var resUrl = "/mysql_monitor/addMonitor";
        $scope.addMonitorUrl = $scope.host + resUrl;
        console.log("addMonitorUrl = " + $scope.addMonitorUrl);

        $http.post($scope.addMonitorUrl, $scope.monitorParam)
            .success(function (data) {
                if (data.result.toUpperCase() == 'OK') {
                    toast('info', data.msg);
                    hideDialog('addMonitor');
                    $scope.replaceModel($scope.from, $scope.to);
                } else if(data.result.toUpperCase() == 'ERROR'){
                    toast('danger', data.msg);
                    console.log(data.msg);
                }
            }).error(function (data, status) {
                ErrorMsg = "http post request failed: " + status + " " + data;
                toast('danger', ErrorMsg);
                console.log(ErrorMsg);
            });
    };

    $scope.selectMonitor = function (neId) {
        $scope.delMonitorNeId = neId;
    }
    $scope.delMonitor = function () {
        var resUrl = "/mysql_monitor/delMonitor";
        $scope.delMonitorUrl = $scope.host + resUrl + "?neId=" + $scope.delMonitorNeId;
        console.log("delMonitorUrl = " + $scope.delMonitorUrl);

        $http.delete($scope.delMonitorUrl)
            .success(function(data) {
                if (data.result.toUpperCase() == 'OK') {
                    toast('info', data.msg);
                    hideDialog('delMonitor');
                    $scope.replaceModel($scope.from, $scope.to);
                } else if(data.result.toUpperCase() == 'ERROR'){
                    toast('danger', data.msg);
                    console.log(data.msg);
                }
            }).error(function(data, status) {
                ErrorMsg = "http delete request failed: " + status + " " + data;
                toast('danger', ErrorMsg);
                console.log(ErrorMsg);
            });
    }
});

dbApp.filter("reverse",function(){
    return function(input){
        var out = "" + input;
        return out;
    }
});
