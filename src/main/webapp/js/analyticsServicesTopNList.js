// $(function () {
//     cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
//     $('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
//
// });

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=analyticsCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
}

var analyticsApp = angular.module('analyticsServicesTopNListApp', []);
analyticsApp.controller('analyticsServicesTopNListCtrl', function ($scope, $http, $location) {
    $scope.currentAppName = "";
    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();
    $scope.currentAppName=QueryString('appid');
    var _tempcurrentAppName = getCookie("currentAppName");
    if(null != _tempcurrentAppName &&_tempcurrentAppName != "" && $scope.currentAppName != _tempcurrentAppName){
        $scope.currentAppName = _tempcurrentAppName;
    }

    $scope.from=QueryString('from');
    $scope.to=QueryString('to');

    var rg =  getCookie("ranges");
    setDatePicker($scope.from,$scope.to,rg);
    $scope.appNames = [""];
    $scope.appName = "";
    $scope.topNSQLInfos = [""];
    $scope.currentdbName = "";

    $scope.topN = getCommonTopNNum();
    $scope.showMoreOrTopN = "显示更多";
    // 切换模拟数据
    $scope.isMockFlag = isMock();
    // $scope.isMockFlag = true;
    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.replaceModel = function (start,end) {
        // loadingBarReset();
        $scope.selectedStartTime = start;
        selectedStartTime = start;
        $scope.selectedEndTime = end;
        selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        // http://10.62.100.77:8080/serviceCallsEvents.pinpoint?appName=IaasOps&from=1473127425461&to=1473128025461
        $scope.appUrl= dataSourceURL()+"/serviceCallsEvents.pinpoint?appName="+$scope.currentAppName+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analyticsServiceCallsEvents_EMS.json";
        }
        console.log("appUrl = "+$scope.appUrl);
        console.log("$scope.topN = "+$scope.topN);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log("replaceModel");
                console.log(response);
                if($scope.currentAppName === ""){
                    $scope.currentAppName = response.appName;
                }
                $scope.loadAppData(response);
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });

    }
    if($scope.from != undefined &&  $scope.to != undefined) {
        $scope.replaceModel($scope.from,$scope.to);
    }
    $scope.loadMoreOrShowTopNDate = function(){
        if($scope.showMoreOrTopN !== "显示更多"){
            $scope.showMoreOrTopN = "显示更多";
            $scope.topN = getCommonTopNNum();

        } else {
            $scope.topN = $scope.topNSQLInfos.length;
            $scope.showMoreOrTopN = "显示TopN";
        }
    }
    $scope.changeApp = function (currentAppName) {
        $scope.currentAppName = currentAppName;
        var _tempcurrentAppName = getCookie("currentAppName");
        if($scope.currentAppName != ""){
            setCookie("currentAppName",$scope.currentAppName,1);
        }
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
        $scope.appUrl= dataSourceURL()+"/serviceCallsEvents.pinpoint?appName="+$scope.currentAppName+"&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        if($scope.isMockFlag){
            $scope.appUrl = "../mockjson/analyticsServiceCallsEvents_EMS.json";
        }
        console.log("appUrl = " + $scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log("changeApp");
                console.log(response);
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
        // 加载事务健康度数据
        $scope.topNSQLInfos = response.serviceInfoList;
        console.log($scope.topNSQLInfos);
    }
    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }
});





