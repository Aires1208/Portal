$(function () {
    var st = getCookie("starttime");
    var et = getCookie("endtime");
    console.log("cookie starttime=" + st);
    console.log("cookie endtime=" + et);
    if (st !== "" && et !== "") {
        setDatePicker(st, et);
        datePickerUpdateData(st, et);
    } else {
        cb(moment().subtract(10, 'minutes'), moment());
        $('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
    }
});

function datePickerUpdateData(start, end) {
    var appElement = document.querySelector('[ng-controller=healthRuleViolationsListCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start, end);
}
var transactionApp = angular.module('healthRuleViolationsListApp', []);
transactionApp.controller('healthRuleViolationsListCtrl', function ($scope, $http, $location) {

    //$scope.appName=QueryString('service');;
    $scope.appId = QueryString('appid');
    appId = $scope.appId;
    $scope.serviceId = QueryString('serviceid');
    serviceId = $scope.serviceId;
    $scope.instanceId = QueryString('instanceid');
    instanceId = $scope.instanceId;
    $scope.type = QueryString('type');
    $scope.from = QueryString('from');
    $scope.to = QueryString('to');
    $scope.to = checkToStr($scope.to);

    var rg =  getCookie("ranges");
    setDatePicker($scope.from,$scope.to,rg);

    $scope.level = QueryString('level');
    $scope.fromStr = new Date(parseInt($scope.from)).format('yyyy-MM-dd hh:mm:ss');
    $scope.toStr = new Date(parseInt($scope.to)).format('yyyy-MM-dd hh:mm:ss');
    $scope.topN = getCommonTopNNum();

    // 排序
    $scope.sortflag = ["unknown", "Ascending", "Descending"];
    $scope.sortbycallsflag = $scope.sortflag[0];
    $scope.sortbyerrorsflag = $scope.sortflag[0];
    $scope.sortbyresponseTimeflag = $scope.sortflag[0];

    $scope.sortbyTypeInitSrc = "../img/sort_16px_init.png";
    $scope.sortbyTypeSSrc = "../img/sort_16px_s.png";
    $scope.sortbyTypeXSrc = "../img/sort_16px_x.png";

    $scope.sortbycallsSrc = "../img/sort_16px_init.png";
    $scope.sortbyerrorsSrc = "../img/sort_16px_init.png";
    $scope.sortbyresponseTimeSrc = "../img/sort_16px_init.png";
    $scope.appList = [""];
    $scope.showLastIterms = [""];
    $scope.showMoreOrTopN = "显示更多";

    $scope.showFullLocation = false;
    $scope.hideService = false;
    $scope.hideInstance = false;
    $scope.lastItem = "";
    loadingBarReset();
    console.time('ajaxData');

    $scope.records = [];
    $scope.isrecordsLoading = false;

    $scope.changeUrl = function () {
        if ($scope.serviceId == null && $scope.instanceId == null) {
            //events/applications/EMS
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + $scope.appId + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
            $scope.lastItem = $scope.appId;
            $scope.hideService = true;
            $scope.hideInstance = true;
            console.log("$scope.serviceId == null && $scope.instanceId ==null");
        } else if ($scope.serviceId != null && $scope.instanceId == null) {
            //http://10.63.212.143:28080/events/applications/EMS/services/EMS_uca
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + $scope.appId + "/services/" + $scope.serviceId + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
            $scope.lastItem = $scope.serviceId;
            $scope.hideService = false;
            $scope.hideInstance = true;
            console.log("$scope.serviceId != null && $scope.instanceId ==null");
        } else {
            //http://10.63.212.143:28080/events/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + $scope.appId + "/services/" + $scope.serviceId + "/instances/" + $scope.instanceId + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
            $scope.lastItem = $scope.instanceId;
            $scope.hideService = false;
            $scope.hideInstance = false;
            console.log("$scope.serviceId != null && $scope.instanceId !=null");
        }
    }
    $scope.changeUrl();
    $scope.loadData = function () {
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.order = "calls";
        $scope.records = [];
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                console.log(response);
                $scope.records = response.tables;
                console.log($scope.records);
                $scope.apps = response.apps;
                if ($scope.serviceId == null && $scope.instanceId == null) {
                    $scope.showLastIterms = $scope.getCurrentApps();
                } else if ($scope.serviceId != null && $scope.instanceId == null) {
                    $scope.showLastIterms = $scope.getCurrentServices($scope.appId);
                } else {
                    $scope.showLastIterms = $scope.getCurrentInstances($scope.appId, $scope.serviceId);
                }
                console.log("get showLastIterms");
                console.log($scope.showLastIterms);
                // 链接过来有type,则根据type类型进行排序；
                if ($scope.type === "calls") {
                    $scope.sortByCalls();
                } else if ($scope.type === "errors") {
                    $scope.sortByErrors();
                } else if ($scope.type === "reponsetime") {
                    $scope.sortByResponseTime();
                }
                $scope.isrecordsLoading = false;
            }).error(function (data) {
            $scope.isrecordsLoading = false;
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
        });
    }
    $scope.loadData();


    // 获取apps
    $scope.getCurrentApps = function () {
        return $scope.apps;

    }
    $scope.replaceModel = function (start, end) {
        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;
        $scope.from =  $scope.selectedStartTime;
        $scope.to =  $scope.selectedEndTime;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime);
        $scope.changeUrl();
        $scope.loadData();
    }
    // 根据appid获取services
    $scope.getCurrentServices = function (appid) {
        for (var i = 0; i < $scope.apps.length; i++) {
            if ($scope.apps[i].name === appid) {
                console.log("services:");
                console.log($scope.apps[i].services);
                return $scope.apps[i].services;
            }
        }
    }
    // 根据appid和serviceid获取instances
    $scope.getCurrentInstances = function (appid, serviceId) {
        for (var i = 0; i < $scope.apps.length; i++) {
            if ($scope.apps[i].name === appid) {
                for (var j = 0; j < $scope.apps[i].services.length; j++) {
                    if ($scope.apps[i].services[j].name === serviceId) {
                        console.log("instances:");
                        console.log($scope.apps[i].services[j].instances);
                        return $scope.apps[i].services[j].instances;
                    }
                }
            }
        }
    }
    $scope.ClickShowFullLocation = function () {
        $scope.showFullLocation = true;
    }
    $scope.ClickHideFullLocation = function () {
        $scope.showFullLocation = false;
        console.log("showFullLocation:" + $scope.showFullLocation);
    }
    $scope.changeLastIterm = function (showLastIterm) {
        // $scope.appId = showLastIterm.name;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime);

        if (showLastIterm.level === "application") {
            //events/applications/EMS
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + showLastIterm.name + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        } else if (showLastIterm.level === "service") {
            //http://10.63.212.143:28080/events/applications/EMS/services/EMS_uca
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + showLastIterm.appName + "/services/" + showLastIterm.name + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        } else {
            //http://10.63.212.143:28080/events/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
            $scope.tableUrl = dataSourceURL() + "/events/applications/" + showLastIterm.appName + "/services/" + showLastIterm.serviceName + "/instances/" + showLastIterm.name + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        $scope.lastItem = showLastIterm.name;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.records = [];
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                $scope.records = response.tables;
                $scope.apps = response.apps;
                // 链接过来有type,则根据type类型进行排序；
                if ($scope.type === "calls") {
                    $scope.sortByCalls();
                } else if ($scope.type === "errors") {
                    $scope.sortByErrors();
                } else if ($scope.type === "reponsetime") {
                    $scope.sortByResponseTime();
                }
                $scope.isrecordsLoading = false;
            }).error(function (data) {
            $scope.isrecordsLoading = false;
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
        });
    }
    $scope.ClickShowCurrentApp = function (appId) {
        if ($scope.hideService === true && $scope.hideInstance === true) {
            $scope.showFullLocation = false;
            console.log("showFullLocation:" + $scope.showFullLocation);
            return;
        }
        $scope.lastItem = appId;
        $scope.showFullLocation = false;
        $scope.hideService = true;
        $scope.hideInstance = true;
        $scope.tableUrl = dataSourceURL() + "/events/applications/" + appId + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.records = [];
        $scope.showLastIterms = [];
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                $scope.records = response.tables;
                console.log($scope.records);
                $scope.apps = response.apps;
                $scope.showLastIterms = $scope.getCurrentApps();
                console.log("ClickShowCurrentApp:");
                console.log("$scope.showLastIterms:");
                console.log($scope.showLastIterms);
                // 链接过来有type,则根据type类型进行排序；
                if ($scope.type === "calls") {
                    $scope.sortByCalls();
                } else if ($scope.type === "errors") {
                    $scope.sortByErrors();
                } else if ($scope.type === "reponsetime") {
                    $scope.sortByResponseTime();
                }
                console.timeEnd('ajaxData');
                $scope.isrecordsLoading = false;
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isrecordsLoading = false;
        });
    }
    $scope.ClickShowCurrentService = function (appId, serviceId) {
        if ($scope.hideService === false && $scope.hideInstance === true) {
            $scope.showFullLocation = false;
            console.log("showFullLocation:" + $scope.showFullLocation);
            return;
        }
        $scope.lastItem = serviceId;
        $scope.showFullLocation = false;
        $scope.hideService = false;
        $scope.hideInstance = true;
        $scope.tableUrl = dataSourceURL() + "/events/applications/" + appId + "/services/" + serviceId + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.showLastIterms = [];
        $scope.records = [];
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                console.log(response);
                $scope.records = response.tables;
                console.log($scope.records);
                $scope.apps = response.apps;
                console.log($scope.apps);
                $scope.showLastIterms = $scope.getCurrentServices(appId);
                console.log("ClickShowCurrentService:");
                console.log($scope.showLastIterms);
                // 链接过来有type,则根据type类型进行排序；
                if ($scope.type === "calls") {
                    $scope.sortByCalls();
                } else if ($scope.type === "errors") {
                    $scope.sortByErrors();
                } else if ($scope.type === "reponsetime") {
                    $scope.sortByResponseTime();
                }
                $scope.isrecordsLoading = false;
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isrecordsLoading = false;
        });
    }

    function QueryString(item) {
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }

    function checkToStr(str) {
        try {
            var loc = str.indexOf('#');
        } catch (err) {
            return '';
        }

        if (loc == -1) {
            return str;
        } else {
            return str.substring(0, loc);
        }
    }

    $scope.myFilter = function (item, type) {
        //return item.path == '/favicon.ico';
        return item.path == type;
        //return true;
    };
});


