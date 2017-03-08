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

var analyticsApp = angular.module('analyticsTopNSQLListApp', []);
analyticsApp.controller('analyticsTopNSQLListCtrl', function ($scope, $http, $location) {
    $scope.currentAppName = "";
    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();
    $scope.currentAppName=QueryString('appid');
    $scope.from=QueryString('from');
    $scope.to=QueryString('to');
    setDatePicker($scope.from, $scope.to);
    $scope.appNames = [];
    $scope.appName = "";
    $scope.topNSQLInfos = [];
    $scope.currentdbName = QueryString("currentdbName");
    $scope.currentdbsql = "";
    $scope.topN = getCommonTopNNum();
    // 排序
    $scope.sortflag = ["unknown","Ascending","Descending"];
    $scope.sortByAvgTimePercallflag =  $scope.sortflag[0];
    $scope.sortbycallsflag =  $scope.sortflag[0];


    $scope.tableTopName = "Top " + $scope.topN + " slowest Database Calls";
    $scope.type =  QueryString("type");
    if($scope.type === "calls"){
        $scope.tableTopName = "Top " + $scope.topN + " Database Calls";
    }
    $scope.showMoreOrTopN = "显示更多";
    // 切换模拟数据
    $scope.isMockFlag = isMock();
    // $scope.isMockFlag = true;
    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.replaceModel = function (start,end) {
        // loadingBarReset();
        if($scope.currentdbName !== ""){
            $scope.selectedStartTime = start;
            selectedStartTime = start;
            $scope.selectedEndTime = end;
            selectedEndTime = end;
            console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );
            $scope.appUrl= dataSourceURL()+"/dbRiskEvents.pinpoint?appName="+$scope.currentAppName
                +"&dbName=" + $scope.currentdbName
                +"&from=" +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;

            console.log("appUrl = "+$scope.appUrl);
            console.log("$scope.topN = "+$scope.topN);
            $http.get($scope.appUrl)
                .success(function (response) {
                    console.log($scope.topNSQLInfos);
                    $scope.topNSQLInfos = response.eventList;
                    if($scope.type === "calls"){
                        $scope.sortByCalls();
                    } {
                        $scope.sortByAvgTimePercall();
                    }

                }).error(function (data) {
                console.log("ajaxError:\n" + data.error + "\n" + data.message);
                loadingBarFadeOut();
            });
        }
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

    $scope.selectOneSQL = function (sql) {
        $scope.currentdbsql = sql;
    }
    $scope.sortByAvgTimePercall = function () {
        console.log("sortByAvgTimePercall");
        $scope.sortbycallsflag = $scope.sortflag[0];
        document.getElementById("sortByCalls").setAttribute("src","../img/sort_16px_init.png");
        if($scope.sortByAvgTimePercallflag == $scope.sortflag[0]) {
            $scope.sortByAvgTimePercallflag = $scope.sortflag[2];
            document.getElementById("sortByAvgTimePercall").setAttribute("src","../img/sort_16px_x.png");
            $scope.sortByType();
        }
    }
    // 根据calls进行排序;
    $scope.sortByCalls = function(){
        console.log("sortByCalls");
        $scope.sortByAvgTimePercallflag = $scope.sortflag[0];
        document.getElementById("sortByAvgTimePercall").setAttribute("src","../img/sort_16px_init.png");
        if($scope.sortbycallsflag == $scope.sortflag[0]) {
            $scope.sortbycallsflag = $scope.sortflag[2];
            document.getElementById("sortByCalls").setAttribute("src","../img/sort_16px_x.png");
            $scope.sortByType();
        }
    }
    // 根据类型进行排序;
    $scope.sortByType = function(){
        if($scope.sortbycallsflag != $scope.sortflag[0]) {
            if($scope.sortbycallsflag == $scope.sortflag[2]) {
                $scope.topNSQLInfos.sort($scope.acomparecalls);
            }
        } else if($scope.sortByAvgTimePercallflag != $scope.sortflag[0]) {
            if($scope.sortByAvgTimePercallflag == $scope.sortflag[2]) {
                $scope.topNSQLInfos.sort($scope.acompareavgResponseTime);
            }
        }
    }
    $scope.acomparecalls = function(value1, value2) {
        if (value1.calls < value2.calls) {
            return 1;
        } else if (value1.calls  > value2.calls ) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcomparecalls = function(value1, value2) {
        if (value1.calls < value2.calls) {
            return -1;
        } else if (value1.calls  > value2.calls ) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.acompareavgResponseTime = function(value1, value2) {
        if (value1.avgResponseTime < value2.avgResponseTime) {
            return 1;
        } else if (value1.avgResponseTime  > value2.avgResponseTime ) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcompareavgResponseTime = function(value1, value2) {
        if (value1.calls < value2.calls) {
            return -1;
        } else if (value1.avgResponseTime  > value2.avgResponseTime ) {
            return 1;
        } else {
            return 0;
        }
    }
    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }
});





