$(function () {
    //cb(moment().subtract(10,'minutes'), moment()); //default setting 2 hours age
    //$('#reportrange span').html(moment().subtract(10,'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
    //cb(moment().startOf('day'), moment()); //
    //$('#reportrange span').html(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

    var st =  getCookie("starttime");
    var et =  getCookie("endtime");
    console.log("cookie starttime=" + st);
    console.log("cookie endtime=" + et);
    if (st != "" && et != "") {
        setDatePicker(st, et);
        datePickerUpdateData(st, et);
    } else {
        cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
        $('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
    }
});


function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=homeCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
}



//angularjs
var homeApp = angular.module('homeApp',['chieffancypants.loadingBar']);
homeApp.controller('homeCtrl', function ($scope, $http, $timeout) {
    $scope.selectedTimeRange = null;
    $scope.selectedStartTime = null;
    $scope.selectedEndTime = null;
    $scope.records =  null;


    //更新方法
    $scope.replaceModel = function (start,end) {
        loadingBarReset();
        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;

        //var queryUrl = "http://10.63.212.141:1337/10.63.212.143:28080/applicationDashBoard.pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        var queryUrl = "../mockjson/home.json";
        console.log("queryUrl = "+queryUrl);
        $http.get(queryUrl)
            .success(function (response) {
                loadingBarFade();

                //update table and summary
                $scope.apps = response.applications;
                $scope.dbs = response.databases;
                $scope.servers = response.servers;
            }).error(function (data) {
                console.log("errorData = " + data);
                loadingBarFadeOut();
            });
    }


    $scope.isHealth =  function(v){
        if(v>=1){
            return false;
        }else{
            return true;
        }
    };

    $scope.isHealthColor =  function(v){
        if(v == 'false'){
            return 'red';
        }else{
            return '#79DD1B';
        }
    };

    $scope.percentCritical =  function (c,w,n){
        var result = Math.round(c*100/(c+w+n));
        //console.log("percentCritical ======== "+result+"%");
        return result+"%";
    };
    $scope.percentWarning =  function (c,w,n){
        var result = Math.round(w*100/(c+w+n));
        //console.log("percentWarning ======== "+result+"%");
        return result+"%";
    };
    $scope.percentNormal =  function (c,w,n){
        var result = Math.round(n*100/(c+w+n));
        //console.log("percentNorma ======== "+result+"%");
        return result+"%";
    };
});


homeApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});




