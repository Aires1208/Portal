$(function () {
    var st = getCookie("starttime");
    var et = getCookie("endtime");
    var rg =  getCookie("ranges");
    console.log("cookie starttime=" + st);
    console.log("cookie endtime=" + et);
    console.log("cookie ranges=" + rg);
    if (st !== "" && et !== "") {
        //缓存内的时间格式是string类型的，下面的散点图要求日期格式必须的int型的，所以这里进行转化
        setDatePicker(parseInt(st), parseInt(et),rg);
        datePickerUpdateData(parseInt(st), parseInt(et));
    } else {
        cb(moment().subtract(10, 'minutes'), moment());
        //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        $('#reportrange span').html('10 Minutes');
        document.cookie = "ranges=" + '10 Minutes';
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text();
        if (activeTab == 'Transaction Risk') {
            $('#topCallsTransactionBar').prepend($('#topCallsTransactionChart'));
            $("#topCallsTransactionChart").css("visibility", "visible");
            $('#topErrorsTransactionBar').prepend($('#topErrorsTransactionChart'));
            $("#topErrorsTransactionChart").css("visibility", "visible");
            $('#topMaxResTransactionBar').prepend($('#topMaxResTransactionChart'));
            $("#topMaxResTransactionChart").css("visibility", "visible");
        } else if (activeTab == 'Service Risk') {
            $('#topBusyServiceBar').prepend($('#topBusyServiceChart'));
            $("#topBusyServiceChart").css("visibility", "visible");
            $('#topRiskServiceBar').prepend($('#topRiskServiceChart'));
            $("#topRiskServiceChart").css("visibility", "visible");
        } else if (activeTab == 'DB Risk') {
            $('#topSlowSQLBar').prepend($('#topSlowSQLChart'));
            $("#topSlowSQLChart").css("visibility", "visible");
            $('#topFregquerryCallsBar').prepend($('#topFregquerryCallsChart'));
            $("#topFregquerryCallsChart").css("visibility", "visible");
        }
    });
    myTransactionHealthChart.connect([myServiceHealthChart, myAppHealthChart]);
    myServiceHealthChart.connect([myTransactionHealthChart, myAppHealthChart]);
    myAppHealthChart.connect([myTransactionHealthChart, myServiceHealthChart]);
});

function datePickerUpdateData(start, end) {
    var appElement = document.querySelector('[ng-controller=analyticsCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start, end);
}


var analyticsApp = angular.module('analyticsApp', []);


analyticsApp.controller('analyticsCtrl', function ($scope, $http, $location) {

    $scope.selectedStartTime = 0;
    $scope.selectedEndTime = 0;

    $scope.currentAppName = "";
    $scope.appNames = [];
    $scope.appName = "";
    $scope.transactionHealthScore = 0;
    $scope.transactionHealthCritial = 0;
    $scope.transactionHealthWarning = 0;
    $scope.serviceHealthScore = 0;
    $scope.serviceHealthCritial = 0;
    $scope.serviceHealthWarning = 0;
    $scope.appHealthScore = 0;
    $scope.currentdbName = "";
    $scope.dbNames = [];
    $scope.dbData = [];
    $scope.topN = getCommonTopNNum();
    $scope.appHealthDegree = "App Health Degree:";
    $scope.transactionHealthDegree = "Transaction Health Degree:";
    $scope.servicesHealthDegree = "Services Health Degree:";

    $scope.UADatas = [];
    $scope.isUADatasLoading = false;

    $scope.UCADatas = [];
    $scope.isUCADatasLoading = false;

    // 切换模拟数据
    $scope.isMockFlag = isMock();
    $scope.rpc = "";

    $scope.scatterTableValues = [];

    $scope.servicesTopNInfos = [];
    $scope.appSInfos = [];
    $scope.type === "calls";
    $scope.isappSInfosLoading = false;

    $scope.topNSQLInfos = [];
    $scope.istopNSQLInfosLoading = false;

    $scope.records = [];
    $scope.isrecordsLoading = false;

    $scope.servicesTopNInfos = [];
    $scope.isservicesTopNInfosLoading = false;
    $scope.topNtypeTitle = "Top 5 Calls";
    $("#callsID").addClass("tableIDShowRed");
    $("#errorsID").removeClass("tableIDShowRed");
    $("#responseTimeID").removeClass("tableIDShowRed");

    $scope.topNSQLTitle = "Top 5 Frequency Calls";
    $("#avgResponseTimeSQLID").addClass("tableIDShowRed");
    $("#callsSQLID").removeClass("tableIDShowRed");



    var _tempcurrentAppName = getCookie("currentAppName");
    if(null != _tempcurrentAppName &&_tempcurrentAppName != ""){
        $scope.currentAppName = _tempcurrentAppName;
    }

    $scope.queryDBRisk = function () {
        $scope.queryDBRiskUrl = dataSourceURL() + "/dbRiskEvents.pinpoint?appName=" + $scope.currentAppName
            + "&dbName=" + $scope.currentdbName
            + "&from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        console.log("queryDBRiskUrl = " + $scope.queryDBRiskUrl);
        if (undefined != $scope.currentdbName && null != $scope.currentdbName && "" != $scope.currentdbName) {
            console.log("currentdbName = " + $scope.currentdbName);
            $scope.istopNSQLInfosLoading = true;
            $http.get($scope.queryDBRiskUrl)
                .success(function (response) {
                    console.log("---------queryDBRisk--------");
                    console.log(response);
                    console.log("---------queryDBRisk--------");
                    $scope.topNSQLInfos = response.eventList;
                    $scope.istopNSQLInfosLoading = false;
                }).error(function (data) {
                $scope.istopNSQLInfosLoading = false;
                console.log("ajaxError:\n" + data.error + "\n" + data.message);
                loadingBarFadeOut();
            });
        }
        else {
            console.log("has no db service!");
        }
    }
    $scope.acompareavgResponseTime = function (value1, value2) {
        if (value1.avgResponseTime < value2.avgResponseTime) {
            return 1;
        } else if (value1.avgResponseTime > value2.avgResponseTime) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.queryServiceRisk = function () {
        $scope.serviceCallsEventsUrl = dataSourceURL() + "/serviceCallsEvents.pinpoint?appName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        $scope.isservicesTopNInfosLoading = true;
        $http.get($scope.serviceCallsEventsUrl)
            .success(function (response) {
                $scope.servicesTopNInfos = response.serviceInfoList;
                console.log("------ $scope.servicesTopNInfos-------");
                console.log(" $scope.servicesTopNInfos = " + $scope.serviceCallsEventsUrl);
                console.log( $scope.servicesTopNInfos);
                console.log("------ $scope.servicesTopNInfos-------");
                $scope.isservicesTopNInfosLoading = false;
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isservicesTopNInfosLoading = false;
            loadingBarFadeOut();
        });
        $scope.serviceHealthEventsUrl = dataSourceURL() + "/serviceHealthEvents.pinpoint?appName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        $scope.isappSInfosLoading = true;
        $http.get($scope.serviceHealthEventsUrl)
            .success(function (response) {
                console.log("------serviceHealthEventsUrl-------");
                console.log("serviceHealthEventsUrl = " + $scope.serviceHealthEventsUrl);
                console.log(response);
                console.log("------serviceHealthEventsUrl-------");
                $scope.appSInfos = response.serviceInfoList;
                $scope.isappSInfosLoading = false;
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isappSInfosLoading = false;
            loadingBarFadeOut();
        });
    }

    $scope.queryTransactionRisk = function () {
        $scope.tableUrl = dataSourceURL() + "/transactions/applications/" + $scope.currentAppName + ".pinpoint?from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.order = "calls";
        $scope.isrecordsLoading = true;
        $http.get($scope.tableUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.records = response.tables;
                // 链接过来有type,则根据type类型进行排序；
                console.log(response);
                $scope.types = response.typeList;
                $scope.isrecordsLoading = false;
            }).error(function (data) {
            $scope.isrecordsLoading = false;
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }
    $scope.sortSQLByType = function (type) {
        $scope.type = type;
        if ($scope.type === "calls") {
            $scope.topNSQLInfos.sort($scope.acomparecalls);
            $scope.topNSQLTitle = "Top 5 Frequency Calls";
            $("#avgResponseTimeSQLID").removeClass("tableIDShowRed");
            $("#callsSQLID").addClass("tableIDShowRed");
        } else if ($scope.type === "avgResponseTime") {
            $scope.topNSQLInfos.sort($scope.acompareavgResponseTime);
            $scope.topNSQLTitle = "Top 5 Slow SQL";
            $("#avgResponseTimeSQLID").addClass("tableIDShowRed");
            $("#callsSQLID").removeClass("tableIDShowRed");
        }
    }

    $scope.sortByType = function (type) {
        $scope.type = type;
        if ($scope.type === "calls") {
            $scope.records.sort($scope.acomparecalls);
            $("#callsID").addClass("tableIDShowRed");
            $("#errorsID").removeClass("tableIDShowRed");
            $("#responseTimeID").removeClass("tableIDShowRed");
            $scope.topNtypeTitle = "Top 5 Calls";
        } else if ($scope.type === "errors") {
            $scope.records.sort($scope.acompareerrors);
            $("#callsID").removeClass("tableIDShowRed");
            $("#errorsID").addClass("tableIDShowRed");
            $("#responseTimeID").removeClass("tableIDShowRed");
            $scope.topNtypeTitle = "Top 5 Errors";
        } else if ($scope.type === "reponsetime") {
            $scope.records.sort($scope.acompareresponseTime);
            $("#callsID").removeClass("tableIDShowRed");
            $("#errorsID").removeClass("tableIDShowRed");
            $("#responseTimeID").addClass("tableIDShowRed");
            $scope.topNtypeTitle = "Top 5 Response time";
        }
    }

    $scope.goToTransactionHtml = function (_topNtypeTitle) {
        // topCallsTransactionOptions.title.link = "./transaction.html?level=application&appid=" + $scope.currentAppName + "&from="
        //     + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=calls";
        if( _topNtypeTitle == "Top 5 Calls"){
            window.location.href = "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
                + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=calls";
        }
        else if(_topNtypeTitle == "Top 5 Errors"){
            window.location.href =  "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
                + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=errors";
        }
        else if(_topNtypeTitle == "Top 5 Response time"){
            window.location.href =  "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
                + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=reponsetime";
        }
    }

    $scope.goToanalyticsServicesTopNListt5bsHtml = function () {
        window.location.href =  "./analyticsServicesTopNList.html?appid=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
    }

    $scope.goToanalyticsServicesTopNListt5rsHtml = function () {
        window.location.href =  "./analyticsServiceInfo.html?currentAppName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
    }

    $scope.goToanalyticsTopNSQLListHtml = function (_topNSQLTitle) {
        if( _topNSQLTitle == "Top 5 Slow SQL"){
            window.location.href = "./analyticsTopNSQLList.html?appid=" + $scope.currentAppName
                + "&currentdbName=" + $scope.currentdbName +
                "&from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=slow";
        }
        else if(_topNSQLTitle == "Top 5 Frequency Calls"){
            window.location.href = "./analyticsTopNSQLList.html?appid=" + $scope.currentAppName
                + "&currentdbName=" + $scope.currentdbName +
                "&from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=calls";
        }
    }
    $scope.acomparecalls = function (value1, value2) {
        if (value1.calls < value2.calls) {
            return 1;
        } else if (value1.calls > value2.calls) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcomparecalls = function (value1, value2) {
        if (value1.calls < value2.calls) {
            return -1;
        } else if (value1.calls > value2.calls) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.acompareerrors = function (value1, value2) {
        if (value1.errors < value2.errors) {
            return 1;
        } else if (value1.errors > value2.errors) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcompareerrors = function (value1, value2) {
        if (value1.errors < value2.errors) {
            return -1;
        } else if (value1.errors > value2.errors) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.acompareresponseTime = function (value1, value2) {
        if (value1.responseTime < value2.responseTime) {
            return 1;
        } else if (value1.responseTime > value2.responseTime) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcompareresponseTime = function (value1, value2) {
        if (value1.responseTime < value2.responseTime) {
            return -1;
        } else if (value1.responseTime > value2.responseTime) {
            return 1;
        } else {
            return 0;
        }
    }

    $scope.queryAggregation = function () {
        $scope.queryAggregationUrl = dataSourceURL() + "/analystics/OperationReport.pinpoint?appName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        console.log($scope.queryAggregationUrl);
        $scope.isUADatasLoading = true;
        $scope.isUCADatasLoading = true;
        $http.get($scope.queryAggregationUrl)
            .success(function (data) {
                // 查询返回状态码1，则查询成功
                if (data.status === 1) {
                    $scope.UADatas = data.data.uRLAggregation;
                    $scope.UCADatas = data.data.useCaseAggregation;
                    console.log($scope.UADatas);
                    console.log($scope.UCADatas);
                } else {
                    toastPolicyAtionMsg(0, data.resMsg);
                }
                $scope.isUADatasLoading = false;
                $scope.isUCADatasLoading = false;
            }).error(function (data) {
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
            $scope.isUADatasLoading = false;
            $scope.isUCADatasLoading = false;
        });
    }
    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.replaceModel = function (start, end) {
        // loadingBarReset();
        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime);
        // http://10.62.100.77:28080/analystics.pinpoint?appName=EMS&topN=5&from=111111111&to=22222222222
        $scope.appUrl = dataSourceURL() + "/analystics.pinpoint?topN=" + $scope.topN + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        if ($scope.isMockFlag) {
            $scope.appUrl = "../mockjson/analytics.json";
        }
        console.log("appUrl = " + $scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log(response);
                if ($scope.currentAppName === "") {
                    $scope.currentAppName = response.appName;
                }
                $scope.changeApp($scope.currentAppName);
                // 加载DB风险数据;
                if ($scope.currentdbName === "") {
                    $scope.dbNames = response["riskInfo"]["dbRisk"]["dbNames"];
                    if ($scope.dbNames.length > 0) {
                        $scope.currentdbName = $scope.dbNames[0];
                        $scope.queryDBRisk();
                    }
                }
                $scope.queryTransactionRisk();
                $scope.queryServiceRisk();
                console.log($scope.currentdbName);
                $scope.changeDB($scope.currentdbName);

            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
        $scope.queryAggregation();
    }
    if ($scope.from != undefined && $scope.to != undefined) {
        $scope.replaceModel($scope.from, $scope.to);
    }

    $scope.changeApp = function (currentAppName) {
        $scope.currentAppName = currentAppName;
        var _tempcurrentAppName = getCookie("currentAppName");
        if($scope.currentAppName != ""){
            setCookie("currentAppName",$scope.currentAppName,1);
        }
        console.log($scope.currentAppName);
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime);
        $scope.appUrl = dataSourceURL() + "/analystics.pinpoint?appName=" + $scope.currentAppName + "&topN=" + $scope.topN + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        if ($scope.isMockFlag) {
            $scope.appUrl = "../mockjson/analytics_" + $scope.currentAppName + ".json";
        }
        console.log("changeApp appUrl = " + $scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                console.log("-----------loadAppData-----------");
                console.log(response);
                console.log("-----------loadAppData-----------");
                $scope.loadAppData(response);
                $scope.queryTransactionRisk();
                $scope.queryServiceRisk();
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
        $scope.queryAggregation();
    }

    $scope.changeDB = function (currentdbName) {
        $scope.currentdbName = currentdbName;
        $scope.queryDBRisk();
        console.log("changeDB" + currentdbName);
        // 加载DB风险数据
        if ($scope.dbData.length > 0) {
            for (var i = 0; i < $scope.dbData.length; i++) {
                if (currentdbName === $scope.dbData[i].dbName) {
                    console.log("changeDB" + currentdbName);
                    console.log("changeDB" + $scope.dbData[i].dbName);
                    // Slow SQL
                    var topSlowSQLOptions = mySlowSQLRiskChart.getOption();
                    topSlowSQLOptions.series[0].data.length = 0;
                    topSlowSQLOptions.xAxis[0].data.length = 0;
                    if ($scope.dbData.length > 0) {
                        topSlowSQLOptions.series[0].data = $scope.dbData[i]["slowSql"]["data"];
                        topSlowSQLOptions.xAxis[0].data = $scope.dbData[i]["slowSql"]["name"];
                    }
                    mySlowSQLRiskChart.hideLoading();
                    mySlowSQLRiskChart.setOption(topSlowSQLOptions);
                    // Frequency Calls
                    var topFregquerryCallsOptions = myFregquerryCallsRiskChart.getOption();
                    topFregquerryCallsOptions.series[0].data.length = 0;
                    topFregquerryCallsOptions.xAxis[0].data.length = 0;
                    topFregquerryCallsOptions.series[0].data = $scope.dbData[i]["frequeryCalls"]["data"];
                    topFregquerryCallsOptions.xAxis[0].data = $scope.dbData[i]["frequeryCalls"]["name"];
                    myFregquerryCallsRiskChart.hideLoading();
                    myFregquerryCallsRiskChart.setOption(topFregquerryCallsOptions);
                    break;
                }
            }
        }
    }

    $scope.initAppData = function () {
        var transactionHealthOptions = myTransactionHealthChart.getOption();
        transactionHealthOptions.series[0].data = [];
        transactionHealthOptions.xAxis[0].data = [];

        var serviceHealthOptions = myServiceHealthChart.getOption();
        serviceHealthOptions.series[0].data = [];
        serviceHealthOptions.xAxis[0].data = [];

        // appHealthOptions.series[0].data = [];
        // appHealthOptions.xAxis[0].data = [];
    }

    $scope.loadAppmyTransactionHealthChartData = function (response) {
        // 加载事务健康度数据
        $scope.transactionHealthScore = response["healthInfo"]["transactionHealth"]["score"];
        $scope.transactionHealthCritial = response["healthInfo"]["transactionHealth"]["criticals"];
        $scope.transactionHealthWarning = response["healthInfo"]["transactionHealth"]["warnings"];
        var transactionHealthOptions = myTransactionHealthChart.getOption();
        transactionHealthOptions.title.textStyle.fontSize = 20;
        transactionHealthOptions.title.link = "./analyticsTransactionInfo.html?currentAppName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        transactionHealthOptions.title.text = $scope.transactionHealthDegree + $scope.transactionHealthScore;
        transactionHealthOptions.title.subtext = $scope.transactionHealthCritial + " critial,"
            + $scope.transactionHealthWarning + " warning ";

        var dataS = [];
        var dataX = [];
        var i = response["healthInfo"]["transactionHealth"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["healthInfo"]["transactionHealth"]["data"];
            dataX = response["healthInfo"]["transactionHealth"]["time"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["healthInfo"]["transactionHealth"]["data"][i]);
                dataX.push(response["healthInfo"]["transactionHealth"]["time"][i]);
            }
        }
        transactionHealthOptions.series[0].data = dataS;
        transactionHealthOptions.xAxis[0].data = dataX;

        myTransactionHealthChart.hideLoading();
        myTransactionHealthChart.setOption(transactionHealthOptions);
    }
    $scope.loadApmyServiceHealthChartData = function (response) {
        // 加载服务健康度数据
        $scope.serviceHealthScore = response["healthInfo"]["serviceHealth"]["score"];
        $scope.serviceHealthCritial = response["healthInfo"]["serviceHealth"]["criticals"];
        $scope.serviceHealthWarning = response["healthInfo"]["serviceHealth"]["warnings"];
        var serviceHealthOptions = myServiceHealthChart.getOption();
        serviceHealthOptions.title.textStyle.fontSize = 20;
        serviceHealthOptions.title.link = "./analyticsServiceInfo.html?currentAppName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        serviceHealthOptions.title.text = $scope.servicesHealthDegree + $scope.serviceHealthScore;
        serviceHealthOptions.title.subtext = $scope.serviceHealthCritial + " critial,"
            + $scope.serviceHealthWarning + " warning ";

        var dataS = [];
        var dataX = [];
        var i = response["healthInfo"]["serviceHealth"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["healthInfo"]["serviceHealth"]["data"];
            dataX = response["healthInfo"]["serviceHealth"]["time"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["healthInfo"]["serviceHealth"]["data"][i]);
                dataX.push(response["healthInfo"]["serviceHealth"]["time"][i]);
            }
        }
        serviceHealthOptions.series[0].data = dataS;
        serviceHealthOptions.xAxis[0].data = dataX;

        myServiceHealthChart.hideLoading();
        myServiceHealthChart.setOption(serviceHealthOptions);
    }
    $scope.loadAppmyAppHealthChartData = function (response) {
        // 加载应用健康度数据
        $scope.appHealthScore = response["healthInfo"]["appHealth"]["score"];
        var appHealthOptions = myAppHealthChart.getOption();
        appHealthOptions.title.text = $scope.appHealthDegree + $scope.appHealthScore;

        var dataS = [];
        var dataX = [];
        var i = response["healthInfo"]["appHealth"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["healthInfo"]["appHealth"]["data"];
            dataX = response["healthInfo"]["appHealth"]["time"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["healthInfo"]["appHealth"]["data"][i]);
                dataX.push(response["healthInfo"]["appHealth"]["time"][i]);
            }
        }
        appHealthOptions.series[0].data = dataS;
        appHealthOptions.xAxis[0].data = dataX;

        myAppHealthChart.hideLoading();
        myAppHealthChart.setOption(appHealthOptions);
    }
    $scope.loadAppmyCallsRiskChartData = function (response) {
        // 加载事务风险Calls数据
        var topCallsTransactionOptions = myCallsRiskChart.getOption();
        topCallsTransactionOptions.title.text = "Top " + $scope.topN + " Calls";
        topCallsTransactionOptions.title.link = "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=calls";
        topCallsTransactionOptions.yAxis[0].name = "calls";
        var dataS = [];
        var dataX = [];
        console.log("transactionRisk");
        console.log(response["riskInfo"]["transactionRisk"]["calls"]["data"]);
        console.log("transactionRisk");
        var i = response["riskInfo"]["transactionRisk"]["calls"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["riskInfo"]["transactionRisk"]["calls"]["data"];
            dataX = response["riskInfo"]["transactionRisk"]["calls"]["name"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["riskInfo"]["transactionRisk"]["calls"]["data"][i]);
                dataX.push(response["riskInfo"]["transactionRisk"]["calls"]["name"][i]);
            }
        }
        topCallsTransactionOptions.series[0].data = dataS;
        topCallsTransactionOptions.xAxis[0].data = dataX;

        myCallsRiskChart.hideLoading();
        myCallsRiskChart.setOption(topCallsTransactionOptions);
    }
    $scope.loadAppmyErrorsRiskChartData = function (response) {
        // 加载事务风险Errors数据
        var topErrorsTransactionOptions = myErrorsRiskChart.getOption();
        topErrorsTransactionOptions.title.text = "Top " + $scope.topN + " Errors";
        topErrorsTransactionOptions.title.link = "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=errors";
        topErrorsTransactionOptions.yAxis[0].name = "errors";

        var dataS = [];
        var dataX = [];
        var i = response["riskInfo"]["transactionRisk"]["errors"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["riskInfo"]["transactionRisk"]["errors"]["data"];
            dataX = response["riskInfo"]["transactionRisk"]["errors"]["name"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["riskInfo"]["transactionRisk"]["errors"]["data"][i]);
                dataX.push(response["riskInfo"]["transactionRisk"]["errors"]["name"][i]);
            }
        }
        topErrorsTransactionOptions.series[0].data = dataS;
        topErrorsTransactionOptions.xAxis[0].data = dataX;

        myErrorsRiskChart.hideLoading();
        myErrorsRiskChart.setOption(topErrorsTransactionOptions);
    }
    $scope.loadAppmyMaxResRiskChartData = function (response) {
        // 加载事务风险MaxResponsetime数据
        var topMaxResTransactionOptions = myMaxResRiskChart.getOption();
        topMaxResTransactionOptions.title.text = "Top " + $scope.topN + " Max Response time";
        topMaxResTransactionOptions.title.link = "./transaction.html?level=application&health=All&appid=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=reponsetime";
        topMaxResTransactionOptions.yAxis[0].name = "Response time";
        var dataS = [];
        var dataX = [];
        var i = response["riskInfo"]["transactionRisk"]["response"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["riskInfo"]["transactionRisk"]["response"]["data"];
            dataX = response["riskInfo"]["transactionRisk"]["response"]["name"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["riskInfo"]["transactionRisk"]["response"]["data"][i]);
                dataX.push(response["riskInfo"]["transactionRisk"]["response"]["name"][i]);
            }
        }
        topMaxResTransactionOptions.series[0].data = dataS;
        topMaxResTransactionOptions.xAxis[0].data = dataX;

        myMaxResRiskChart.hideLoading();
        myMaxResRiskChart.setOption(topMaxResTransactionOptions);
    }
    $scope.loadAppmyBusyServiceRiskChartData = function (response) {
        // 加载服务风险BusyService数据
        var topBusyServiceOptions = myBusyServiceRiskChart.getOption();
        topBusyServiceOptions.title.text = "Top " + $scope.topN + " Busy Service";
        topBusyServiceOptions.title.link = "./analyticsServicesTopNList.html?appid=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        topBusyServiceOptions.xAxis[0].name = "service";
        topBusyServiceOptions.yAxis[0].name = "calls";

        var dataS = [];
        var dataX = [];
        var i = response["riskInfo"]["serviceRisk"]["busyService"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["riskInfo"]["serviceRisk"]["busyService"]["data"];
            dataX = response["riskInfo"]["serviceRisk"]["busyService"]["name"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["riskInfo"]["serviceRisk"]["busyService"]["data"][i]);
                dataX.push(response["riskInfo"]["serviceRisk"]["busyService"]["name"][i]);
            }
        }
        topBusyServiceOptions.series[0].data = dataS;
        topBusyServiceOptions.xAxis[0].data = dataX;

        myBusyServiceRiskChart.hideLoading();
        myBusyServiceRiskChart.setOption(topBusyServiceOptions);
    }
    $scope.loadAppmyRiskServiceRiskChartData = function (response) {
        // 加载服务风险RiskService数据
        var topRiskServiceOptions = myRiskServiceRiskChart.getOption();
        topRiskServiceOptions.title.text = "Top " + $scope.topN + " Risk Service";
        topRiskServiceOptions.title.link = "./analyticsServiceInfo.html?currentAppName=" + $scope.currentAppName + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;
        topRiskServiceOptions.xAxis[0].name = "service";
        topRiskServiceOptions.yAxis[0].name = "Health Score";
        var dataS = [];
        var dataX = [];
        var i = response["riskInfo"]["serviceRisk"]["riskService"]["data"].length;
        if (i < $scope.topN) {
            dataS = response["riskInfo"]["serviceRisk"]["riskService"]["data"];
            dataX = response["riskInfo"]["serviceRisk"]["riskService"]["name"];
            var temp = i;
            while (temp < $scope.topN) {
                temp++;
                dataS.push('');
                dataX.push('');
            }
        }
        else {
            for (var i = 0; i < 5; i++) {
                dataS.push(response["riskInfo"]["serviceRisk"]["riskService"]["data"][i]);
                dataX.push(response["riskInfo"]["serviceRisk"]["riskService"]["name"][i]);
            }
        }
        topRiskServiceOptions.series[0].data = dataS;
        topRiskServiceOptions.xAxis[0].data = dataX;
        myRiskServiceRiskChart.hideLoading();
        myRiskServiceRiskChart.setOption(topRiskServiceOptions);
    }
    $scope.loadAppmySlowSQLRiskChartData =function (response) {
        // 加载DB风险数据;
        $scope.dbNames = response["riskInfo"]["dbRisk"]["dbNames"];
        if ($scope.dbNames.length > 0) {
            $scope.currentdbName = $scope.dbNames[0];
        }
        console.log(12345);
        $scope.dbData = response["riskInfo"]["dbRisk"]["dbData"];
        // Slow SQL
        var topSlowSQLOptions = mySlowSQLRiskChart.getOption();
        topSlowSQLOptions.title.text = "Top " + $scope.topN + " Slow SQL";
        topSlowSQLOptions.title.link = "./analyticsTopNSQLList.html?appid=" + $scope.currentAppName
            + "&currentdbName=" + $scope.currentdbName +
            "&from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=slow";
        topSlowSQLOptions.xAxis[0].name = "sql";
        topSlowSQLOptions.yAxis[0].name = "avg ResTime";
        console.log("dbData length ?");
        if (response["riskInfo"]["dbRisk"]["dbData"].length > 0) {
            console.log("dbData length >0");

            var dataS = [];
            var dataX = [];
            var i = response["riskInfo"]["dbRisk"]["dbData"][0]["slowSql"]["data"].length;
            if (i < $scope.topN) {
                dataS = response["riskInfo"]["dbRisk"]["dbData"][0]["slowSql"]["data"];
                dataX = response["riskInfo"]["dbRisk"]["dbData"][0]["slowSql"]["name"];
                var temp = i;
                while (temp < $scope.topN) {
                    temp++;
                    dataS.push('');
                    dataX.push('');
                }
            }
            else {
                for (var i = 0; i < 5; i++) {
                    dataS.push(response["riskInfo"]["dbRisk"]["dbData"][0]["slowSql"]["data"][i]);
                    dataX.push(response["riskInfo"]["dbRisk"]["dbData"][0]["slowSql"]["name"][i]);
                }
            }
            topSlowSQLOptions.series[0].data = dataS;
            topSlowSQLOptions.xAxis[0].data = dataX;
        }
        mySlowSQLRiskChart.hideLoading();
        mySlowSQLRiskChart.setOption(topSlowSQLOptions);
    }
    $scope.loadAppmyFregquerryCallsRiskChartData = function (response) {
        // Frequency Calls
        var topFregquerryCallsOptions = myFregquerryCallsRiskChart.getOption();
        topFregquerryCallsOptions.title.text = "Top " + $scope.topN + " Frequency Calls";
        topFregquerryCallsOptions.title.link = "./analyticsTopNSQLList.html?appid=" + $scope.currentAppName
            + "&currentdbName=" + $scope.currentdbName +
            "&from=" + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime + "&type=calls";
        topFregquerryCallsOptions.xAxis[0].name = "sql";
        topFregquerryCallsOptions.yAxis[0].name = "calls";
        if (response["riskInfo"]["dbRisk"]["dbData"].length > 0) {

            var dataS = [];
            var dataX = [];
            var i = response["riskInfo"]["dbRisk"]["dbData"][0]["frequeryCalls"]["data"].length;
            if (i < $scope.topN) {
                dataS = response["riskInfo"]["dbRisk"]["dbData"][0]["frequeryCalls"]["data"];
                dataX = response["riskInfo"]["dbRisk"]["dbData"][0]["frequeryCalls"]["name"];
                var temp = i;
                while (temp < $scope.topN) {
                    temp++;
                    dataS.push('');
                    dataX.push('');
                }
            }
            else {
                for (var i = 0; i < 5; i++) {
                    dataS.push(response["riskInfo"]["dbRisk"]["dbData"][0]["frequeryCalls"]["data"][i]);
                    dataX.push(response["riskInfo"]["dbRisk"]["dbData"][0]["frequeryCalls"]["name"][i]);
                }
            }
            topFregquerryCallsOptions.series[0].data = dataS;
            topFregquerryCallsOptions.xAxis[0].data = dataX;

        }
        myFregquerryCallsRiskChart.hideLoading();
        myFregquerryCallsRiskChart.setOption(topFregquerryCallsOptions);
    }
    $scope.loadAppData = function (response) {
        $scope.appNames = response.appNames;
        $scope.currentAppName = response.appName;
        $scope.loadAppmyTransactionHealthChartData(response);
        $scope.loadApmyServiceHealthChartData(response);
        $scope.loadAppmyAppHealthChartData(response);
        $scope.loadAppmyCallsRiskChartData(response);
        $scope.loadAppmyErrorsRiskChartData(response);
        $scope.loadAppmyMaxResRiskChartData(response);
        $scope.loadAppmyBusyServiceRiskChartData(response);
        $scope.loadAppmyRiskServiceRiskChartData(response);
        $scope.loadAppmySlowSQLRiskChartData(response);
        $scope.loadAppmyFregquerryCallsRiskChartData(response);
    }


    $scope.showModalDiag = function (rpc) {
        $scope.rpc = rpc;
        $scope.queryScatterChartUrl = dataSourceURL() + "/analystics/OperationReport/ScatterPlot.pinpoint?appName=" + $scope.currentAppName + "&rpc=" + $scope.rpc + "&from="
            + $scope.selectedStartTime + "&to=" + $scope.selectedEndTime;

        // $scope.queryScatterChartUrl="../mockjson/stest.json";

        console.log($scope.queryScatterChartUrl);

        $http.get($scope.queryScatterChartUrl)
            .success(function (response) {
                $("#chartScatter").empty();
                $("#scatterRange").empty();
                $("#scatterTable").hide();
                var date = new Date();
                if (Modernizr.canvas) {
                    var MaxVVV = 1000;
                    var data = [];
                    response.normalScatter.forEach(function (e) {
                            if (e[1] > MaxVVV) {
                                MaxVVV = e[1];
                            }
                            data.push({
                                x: e[0],
                                y: e[1],
                                type: 'Normal'
                            });
                        }
                    );
                    response.warningScatter.forEach(function (e) {
                            if (e[1] > MaxVVV) {
                                MaxVVV = e[1];
                            }
                            data.push({
                                x: e[0],
                                y: e[1],
                                type: 'Warning'
                            });
                        }
                    );
                    response.criticalScatter.forEach(function (e) {
                            if (e[1] > MaxVVV) {
                                MaxVVV = e[1];
                            }
                            data.push({
                                x: e[0],
                                y: e[1],
                                type: 'Critical'
                            });
                        }
                    );
                    var modV = 1;
                    for (i = 1; i < MaxVVV.toString().length; i++) {
                        modV = modV * 10;
                    }
                    //console.log(modV);
                    MaxVVV = MaxVVV + modV / 2;

                    var from = $scope.selectedStartTime;
                    var to = $scope.selectedEndTime;
                    var oScatterChart = new BigScatterChart({
                        sContainerId: 'chartScatter',
                        nWidth: 1000,
                        nHeight: 500,
                        nXMin: from, nXMax: to,
                        nYMin: 0, nYMax: MaxVVV,
                        nZMin: 0, nZMax: 5,
                        nBubbleSize: 5,
                        nDefaultRadius: 3,
                        htTypeAndColor: {
                            'Normal': '#b6da54', // type name : color
                            'Warning': '#fcc666',
                            'Critical': '#fd7865'
                        },
                        sXLabel: '(time)',
                        sYLabel: '(ms)',
                        htGuideLine: {
                            'nLineWidth': 1,
                            'aLineDash': [2, 5],
                            'nGlobalAlpha': 0.2
                        },
                        sXLabel: '',
                        nPaddingRight: 5,
                        bUseMouseGuideLine: true,
                        fnYAxisFormat: function (tickY, i, minY, maxY) {
                        },
                        fOnSelect: function (htPosition, htXY) {
                            $("#scatterTable").show();
                            //console.log('fOnSelect', htPosition, htXY);
                            console.time('fOnSelect');
                            var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
                            // $("#scatterRange").html('TimeRange :' + new Date(htXY.nXFrom).format('yyyy-MM-dd hh:mm:ss') + "  -  " + new Date(htXY.nXTo).format('yyyy-MM-dd hh:mm:ss') + "        Value : " + htXY.nYFrom + "  -  " + htXY.nYTo);
                            console.timeEnd('fOnSelect');
                            console.log('adata length', aData.length);
                            //alert('Selected data count : ' + aData.length);
                            var startTime = htXY.nXFrom;
                            var endTime = htXY.nXTo;
                            var valueMin = htXY.nYFrom;
                            var valueMax = htXY.nYTo;
                            $scope.queryScatterTableUrl = dataSourceURL() + "/analystics/OperationReport/ScatterPlotTables.pinpoint?appName=" + $scope.currentAppName + "&rpc=" + $scope.rpc + "&from="
                                + startTime + "&to=" + endTime + "&resMax=" + valueMax + "&resMin=" + valueMin;
                            console.log($scope.queryScatterTableUrl);
                            $http.get($scope.queryScatterTableUrl)
                                .success(function (response) {
                                    $scope.scatterTableValues = response;
                                }).error(function (data) {
                                toastPolicyAtionMsg(0, data);
                                console.log("http error: " + "cannot get data from " + queryScatterTableUrl);
                            });
                        }
                    });

                    oScatterChart.setBubbles(data);
                    oScatterChart.redrawBubbles();
                }
            }).error(function (data) {
            toastPolicyAtionMsg(0, data);
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
        });
    }
});
var myHealthChartOption = {
    title: {
        text: 'App Health Degree:',
        link: '',
        target: 'self',
        subtext: '',
        x: 'center',
        textStyle: {
            "fontSize": 25,
            "fontWeight": "bolder",
            "color": "red"
        },
        subtextStyle: {
            fontSize: 12,
            fontStyle: 'normal'
        }
    },
    animation: false,
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        x: '8%',
        y: '16%',
        x2: '8%',
        y2: '16%'
    },
    calculable: false,
    xAxis: [
        {
            name: 'time',
            type: 'category',
            boundaryGap: false,
            data: ['', '', '', '', '', '', '', '', '', '', '', '', '']
        }
    ],
    yAxis: [
        {
            name: 'score',
            type: 'value'
        }
    ],
    series: [
        {
            name: 'value',
            type: 'line',
            smooth: true,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
analyticsApp.directive('chartLineHealth', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            // 加载应用健康度数据
            myAppHealthChart = echarts.init(document.getElementById("appHealthChart"), bluetheme);
            myAppHealthChart.showLoading({
                text: "loadsing..."
            });
            myAppHealthChart.setOption(myHealthChartOption);
            myAppHealthChart.hideLoading();

            // 加载事务健康度数据
            myTransactionHealthChart = echarts.init(document.getElementById("chartTransactionHealthChart"), bluetheme);
            myTransactionHealthChart.showLoading({
                text: "loadsing..."
            });
            myTransactionHealthChart.setOption(myHealthChartOption);
            myTransactionHealthChart.hideLoading();

            // 加载服务健康度数据
            myServiceHealthChart = echarts.init(document.getElementById("chartServiceHealthChart"), bluetheme);
            myServiceHealthChart.showLoading({
                text: "loadsing..."
            });
            myServiceHealthChart.setOption(myHealthChartOption);
            myServiceHealthChart.hideLoading();
        }
    };
});

var myTopNRiskChartOption = {
    title: {
        text: 'Score',
        link: '',
        target: 'self',
        x: 'center',
        textStyle: {
            "fontSize": 16,
            "fontWeight": "bolder",
            "color": "red",
            "text-decoration": "underline"
        },
    },

    tooltip: {
        trigger: 'axis'
    },
    grid: {
        x: '12%',
        y: '15%',
        x2: '15%',
        y2: '15%'
    },
    calculable: false,
    xAxis: [
        {
            name: 'name',
            type: 'category',
            data: ['', '', '', '', '']
        }
    ],
    yAxis: [
        {
            name: 'calls',
            type: 'value'
        }
    ],
    series: [
        {
            name: 'value',
            type: 'bar',
            data: [0, 0, 0, 0, 0]
        }
    ]
};
analyticsApp.directive('chartBarRisk', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            // 加载事务风险Calls数据
            myCallsRiskChart = echarts.init(document.getElementById("topCallsTransactionChart"), bluetheme);
            myCallsRiskChart.showLoading({
                text: "loading..."
            });
            myCallsRiskChart.setOption(myTopNRiskChartOption);
            myCallsRiskChart.hideLoading();

            // 加载事务风险Errors数据
            myErrorsRiskChart = echarts.init(document.getElementById("topErrorsTransactionChart"), bluetheme);
            myErrorsRiskChart.showLoading({
                text: "loading..."
            });
            myErrorsRiskChart.setOption(myTopNRiskChartOption);
            myErrorsRiskChart.hideLoading();

            // 加载事务风险MaxResponsetime数据
            myMaxResRiskChart = echarts.init(document.getElementById("topMaxResTransactionChart"), bluetheme);
            myMaxResRiskChart.showLoading({
                text: "loading..."
            });
            myMaxResRiskChart.setOption(myTopNRiskChartOption);
            myMaxResRiskChart.hideLoading();

            // 加载服务风险BusyService数据
            myBusyServiceRiskChart = echarts.init(document.getElementById("topBusyServiceChart"), bluetheme);
            myBusyServiceRiskChart.showLoading({
                text: "loading..."
            });
            myBusyServiceRiskChart.setOption(myTopNRiskChartOption);
            myBusyServiceRiskChart.hideLoading();

            // 加载服务风险RiskService数据
            myRiskServiceRiskChart = echarts.init(document.getElementById("topRiskServiceChart"), bluetheme);
            myRiskServiceRiskChart.showLoading({
                text: "loading..."
            });
            myRiskServiceRiskChart.setOption(myTopNRiskChartOption);
            myRiskServiceRiskChart.hideLoading();

            // Slow SQL
            mySlowSQLRiskChart = echarts.init(document.getElementById("topSlowSQLChart"), bluetheme);
            mySlowSQLRiskChart.showLoading({
                text: "loading..."
            });
            mySlowSQLRiskChart.setOption(myTopNRiskChartOption);
            mySlowSQLRiskChart.hideLoading();

            // Frequency Calls
            myFregquerryCallsRiskChart = echarts.init(document.getElementById("topFregquerryCallsChart"), bluetheme);
            myFregquerryCallsRiskChart.showLoading({
                text: "loading..."
            });
            myFregquerryCallsRiskChart.setOption(myTopNRiskChartOption);
            myFregquerryCallsRiskChart.hideLoading();
        }
    };
});







