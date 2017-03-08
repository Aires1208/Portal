// $(function () {
//     cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
//     $('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
//
// });

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=analyticsServiceInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
}

var analyticsApp = angular.module('analyticsServiceInfoApp', []);
analyticsApp.controller('analyticsServiceInfoCtrl', function ($scope, $http, $location) {
    // $scope.currentAppName = "";
    $scope.appNames = [""];
    $scope.appName = "";

    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();

    $scope.currentAppName=QueryString('currentAppName');

    var _tempcurrentAppName = getCookie("currentAppName");
    if(null != _tempcurrentAppName &&_tempcurrentAppName != "" && $scope.currentAppName != _tempcurrentAppName){
        $scope.currentAppName = _tempcurrentAppName;
    }

    $scope.from=QueryString('from');
    $scope.to=QueryString('to');

    setDatePicker($scope.from, $scope.to);
    $scope.appSInfos = [""];
    // 切换模拟数据
    $scope.isMockFlag = false;

    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.replaceModel = function (start,end) {
        // loadingBarReset();
        $scope.selectedStartTime = start;
        selectedStartTime = start;
        $scope.selectedEndTime = end;
        selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        // http://10.62.100.77:28080/analystics.pinpoint?appName=EMS&topN=5&from=111111111&to=22222222222
        $scope.appUrl= dataSourceURL()+"/serviceHealthEvents.pinpoint?appName="+ $scope.currentAppName+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analyticsServiceHealthEvents_"+$scope.currentAppName + ".json";
        }
        console.log("appUrl = "+$scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log(response);
                if($scope.currentAppName === ""){
                    $scope.currentAppName = response.appName;
                }
                $scope.changeApp($scope.currentAppName);
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });



    }
    $scope.replaceModel($scope.from,$scope.to);
    $scope.changeApp = function (currentAppName) {
        $scope.currentAppName = currentAppName;
        var _tempcurrentAppName = getCookie("currentAppName");
        if($scope.currentAppName != ""){
            setCookie("currentAppName",$scope.currentAppName,1);
        }
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        $scope.appUrl= dataSourceURL()+"/serviceHealthEvents.pinpoint?appName="+ $scope.currentAppName+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analyticsServiceHealthEvents_"+$scope.currentAppName + ".json";
        }
        console.log("appUrl = " + $scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                $scope.loadAppData(response);
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }

    $scope.loadAppData = function (response) {
        loadingBarFade();
        $scope.appNames = response.appNames;
        $scope.currentAppName = response.appName;
        $scope.appSInfos = response.serviceInfoList;
    }
    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }
});







