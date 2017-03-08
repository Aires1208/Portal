$(function () {

});

var rulesApp = angular.module('rulesApp', []);
rulesApp.controller('rulesCtrl', function ($scope, $http, $location) {
    $scope.currentAppName = "test";
    $scope.selectedObj = "test";
    $scope.appNames = [{name:"ems",value:"app-ems"},{name:"omm",value:"app-omm"}];
    $scope.appName = "";


    // 切换模拟数据
    $scope.isMockFlag = isMock();

    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.replaceModel = function (start,end) {
        // loadingBarReset();
        $scope.selectedStartTime = start;
        selectedStartTime = start;
        $scope.selectedEndTime = end;
        selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        // http://10.62.100.77:28080/analystics.pinpoint?appName=EMS&topN=5&from=111111111&to=22222222222
        $scope.appUrl= dataSourceURL()+"/analystics.pinpoint?topN="+$scope.topN+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analytics.json";
        }
        console.log("appUrl = "+$scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log(response);
               if($scope.currentAppName === ""){
                   $scope.currentAppName = response.appName;
               }
                $scope.changeApp($scope.currentAppName);
                // 加载DB风险数据;
                if($scope.currentdbName === ""){
                    $scope.dbNames = response["riskInfo"]["dbRisk"]["dbNames"];
                    if($scope.dbNames.length > 0) {
                        $scope.currentdbName = $scope.dbNames[0];
                    }
                }
                console.log("replaceModel"+12345);
                console.log($scope.currentdbName);
                $scope.changeDB($scope.currentdbName);
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });

    }
    if($scope.from != undefined &&  $scope.to != undefined) {
        $scope.replaceModel($scope.from,$scope.to);
    }

    $scope.changeApp = function (currentAppName) {
        $scope.currentAppName = currentAppName.value;

        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        $scope.appUrl= dataSourceURL()+"/analystics.pinpoint?appName="+ $scope.currentAppName+"&topN="+$scope.topN+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analytics_"+ $scope.currentAppName + ".json";
        }
        console.log("appUrl = " + $scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log(response);
                $scope.loadAppData(response);
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }



});






