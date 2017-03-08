$(function () {

});

function hideDialog(){
    $('#addMonitor').modal('hide');
}

function showDialog(){
    $('#addMonitor').modal('show');
}

function toastFail (v)
{
    var priority = 'danger';
    var title    = 'Tip';
    if(v == undefined){
        var message  = 'Add Cluster Failed! ';
    }else{
        var message  = 'Add Cluster Failed! <br>'+v;
    }


    $.toaster({ priority : priority, title : title, message : message });
}

function toastSuccess()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Add DB Monitor Success!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastGetFail ()
{
    var priority = 'danger';
    var title    = 'Tip';
    var message  = 'Server response error!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSend ()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Sending Data ...';

    $.toaster({ priority : priority, title : title, message : message });
}

function dataSourceURL() {
    if (document.location.hostname == 'localhost') {
        var realIp = "10.62.100.241";
        //return "http://10.62.100.141:1337/" + realIp + ":8084";
        return "http://" + realIp + ":8089";
    } else {
        //return "http://10.62.100.141:1337/" + document.location.hostname + ":8084";
        return "http://" + document.location.hostname + ":8089";
    }
}

var kafkaApp = angular.module('kafkaApp', ['chieffancypants.loadingBar']);
kafkaApp.controller('kafkaCtrl', function ($scope, $http, $location) {
    $scope.addClusterParam = {name: "kafka_",zookeeper: "0.0.0.0:2181", version: "0.9.0.1",isJMXOn:false,jmxPort:9995};

    $scope.isHealthColor =  function(v){
        if(v == true ){
            return '#79DD1B';
        }else{
            return 'red';
        }
    };


    $scope.isOnBgColor =  function(v){
        if(v){
            return '#07B0D3';
        }else{
            return 'lightgray';
        }
    };

    $scope.getJMXPort =  function(flag,port){
        if(flag){
            return port;
        }else{
            return 'OFF';
        }
    };

    $scope.isInclude127 =  function(v){
        if(v !=null && v.indexOf('127.0.0.1') != -1 ){
            return true;
        }else{
            return false;
        }
    };

    $scope.addCluster = function () {
        $scope.addClusterUrl = dataSourceURL() + "/kafkamonitor/addCluster";
        console.log("addClusterUrl = " + $scope.addClusterUrl);
        $http.post($scope.addClusterUrl, $scope.addClusterParam)
            .success(function (data) {
                if (data.status.toUpperCase() == 'OK') {
                    $scope.replaceModel();
                } else if(data.status.toUpperCase() == 'FAIL'){
                    toastFail(data.resMsg);
                    console.log("add cluster error: " + data.resMsg);
                }
            }).error(function (data,status,hedaers,config) {
                toastFail();
                console.log("add cluster error: " + data);
            });
    };

    //getClusterList
    $scope.replaceModel = function () {
        loadingBarReset();

        //$scope.kafkaUrl = "../mockjson/kafka.json";
        $scope.kafkaUrl = dataSourceURL()+"/kafkamonitor/kafkaClusters";
        console.log("kafkaUrl = " + $scope.kafkaUrl);
        $http.get($scope.kafkaUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.records = response.kafkaClusters;
            }).error(function (data,status,headers,config) {
                loadingBarFadeOut();
                toastGetFail();
                console.log("http error: " + config);
            });
    }
    $scope.replaceModel();
});


kafkaApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});




