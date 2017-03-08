$(function () {
    var start =  getCookie("starttime");
    var end =  getCookie("endtime");
    if (start !== "" && end !== "") {
        console.log("cookie: start time = " + start);
        console.log("cookie: end time = " + end);

        setDatePicker(start, end);
        datePickerUpdateData(start, end);
    } else {
        start = moment().subtract(10, 'minutes');
        end = moment();

        setDatePicker(start, end);
        cb(start, end);
    }

    $("#addMonitorSelectedId").val('mysql');


});

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=dbCtrl]');
    var $scope = angular.element(appElement).scope();

    $scope.from = start;
    $scope.to = end;

    $scope.replaceModel();
}

function hideDialog(){
    $('#addMonitor').modal('hide');
}

function showDialog(){
    $('#addMonitor').modal('show');
}

function toastFail ()
{
    var priority = 'danger';
    var title    = 'Tip';
    var message  = 'Post Request Failed!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSuccess()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Add DB Monitor Success!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSend ()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Sending Data ...';

    $.toaster({ priority : priority, title : title, message : message });
}

function sleep(milliseconds) {
     setTimeout(function(){
         var start = new Date().getTime();
         while ((new Date().getTime() - start) < milliseconds){
             // Do nothing
         }
     },0);
}

function dbURL(hostname) {
    if (hostname === 'localhost') {
        var debugIp = "10.62.100.137";
        return "http://" + debugIp + ":8081";
    } else {
        return "http://" + hostname + ":8081";
    }
}

var dbApp = angular.module('dbApp', []);
dbApp.controller('dbCtrl', function ($scope, $http,$location) {
    $scope.monitorParam = {dbName: "aerospike_",url: "127.0.0.1", dbType:"MYSQL",dbUsername:"root",dbPassword:"root123",dbPort:"3000",dbSID:"",connectType:"SSH",hostPort:"22",hostUsername:"root",hostPassword:"root123"};

    $scope.isHealthColor =  function(v){
        if(v == true ){
            return '#79DD1B';
        }else{
            return 'red';
        }
    };

    $scope.host = dbURL($location.host());
    $scope.addMonitor = function () {
        var resUrl = "/mysql_monitor/monitorAdded";
        $scope.monitorAddedUrl = $scope.host + resUrl;
        console.log("monitorAddedUrl = " + $scope.monitorAddedUrl);
        $http.post($scope.monitorAddedUrl, $scope.monitorParam)
            .success(function (data) {
                if (data.Result.toUpperCase() == 'OK') {
                    toastSend();
                    hideDialog();
                    $scope.replaceModel($scope.from, $scope.to);
                } else if(data.Result.toUpperCase() == 'ERROR'){
                    //toastFail();
                    alert(data.ErrorMsg);
                }
            }).error(function (data) {
                toastFail();
                console.log("http error: " + "cannot send data to " + $scope.host + resUrl);
            });
    };

    //更新方法
    $scope.replaceModel = function () {
        loadingBarReset();

        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        var resUrl = "/mysql_monitor/dbs";
        $scope.dbsUrl = $scope.host + resUrl + "?from=" + $scope.from + "&to=" + $scope.to;
        console.log("dbsUrl = " + $scope.dbsUrl);
        $http.get($scope.dbsUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.records = response.dbs;
            }).error(function (data) {
                loadingBarFadeOut();
                console.log("http error: " + "cannot get data from " + $scope.host + resUrl);
            });
    }
});


dbApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});




