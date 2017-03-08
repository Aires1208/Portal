$(function () {
    //cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
    //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

    // only can get active tab name after one tab has been clicked
    // if no click, the function will be skipped
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        activeTab = $(e.target).text();
        console.log("activeTab = " + activeTab);

        //if updateData() outside of $('a[data-toggle="tab"]').on()
        //when the tab is clicked, it can not update page, with page is empty
        //should be here for action of changing tab
        updateData();
    });

    //$("#select_id").val(1);
    //$("#select_querytopn_id").val(5);
    //$("#select_clienttopn_id").val(5);
    //$("#select_sessiontopn_id").val(5);


    //db obj database table col width
    $("#dbOjbDatabaseable tr").find("td:eq(0)").width(100);

});




function updateData(){
    var appElement = document.querySelector('[ng-controller=dbInfoCtrl]');
    var $scope = angular.element(appElement).scope();

    if (typeof(activeTab) == 'undefined'){
        activeTab = 'Dashboard';
    }

    //activeTab is global variable, so datePickerUpdateData() can update data
    if (activeTab == 'Dashboard'){
        $scope.initDashboardData();
    }else if (activeTab == 'Live View') {
        $('#cpuLive').prepend($('#cpuLiveLineChart'));
        $("#cpuLiveLineChart").css("visibility", "visible");

        $('#memLive').prepend($('#memLiveLineChart'));
        $("#memLiveLineChart").css("visibility", "visible");

        $('#sqlWaitLive').prepend($('#sqlWaitLiveLineChart'));
        $("#sqlWaitLiveLineChart").css("visibility", "visible");

        $scope.getLiveViewData();
    } else if (activeTab == 'Queries') {
        $scope.getQueryTopNData();
    } else if (activeTab == 'Clients') {
        $scope.getClientTopNData();
    } else if (activeTab == 'Sessions') {
        $scope.getSessionTopNData();
    } else if (activeTab == 'DB Objects') {
        $scope.getDBObjectsData();
    } else if (activeTab == 'Reports') {
        $('#waitStateReport').prepend($('#waitStateReportLineChart'));
        $("#waitStateReportLineChart").css("visibility", "visible");

        $('#topActivityReport').prepend($('#topActivityLineChart'));
        $("#topActivityLineChart").css("visibility", "visible");

        $scope.getReportWaitStateData();
    }
}

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=dbInfoCtrl]');
    var $scope = angular.element(appElement).scope();

    $scope.from = start;
    $scope.to = end;

    $scope.liveViewFrom = start;
    $scope.liveViewTo = end;

    //write cookie
    document.cookie = "endtime=" + end;
    document.cookie = "starttime=" + start;

    updateData();
}

function toastSend(){
    var priority = 'info';
    var title    = 'Tip';
    var message = 'Refresh Live View... ';
    $.toaster({ priority : priority, title : title, message : message });
}

function toastStop(){
    var priority = 'info';
    var title    = 'Tip';
    var message = 'Stop Refresh Live View...';
    $.toaster({ priority : priority, title : title, message : message });
}

function dbURL(hostname) {
    if (hostname == 'localhost') {
        var debugIp = "10.62.100.137";
        return "http://" + debugIp + ":8081";
    } else {
        return "http://" + hostname + ":8081";
    }
}

function isNotEmpty(obj){
    for (var name in obj){
        return true;
    }
    return false;
}

var rabbitmqInfoApp = angular.module('rabbitmqInfoApp', []);
rabbitmqInfoApp.controller('rabbitmqInfoCtrl', function ($scope, $http,$location,$interval) {
    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?&]" + item + "=([^&#]+)(&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }

    $scope.host = dbURL($location.host());
    $scope.neId = QueryString('neId');
    $scope.from = QueryString('from');
    $scope.to = QueryString('to');

    var start =  getCookie("starttime");
    var end =  getCookie("endtime");
    if (start !== "" && end !== "") {
        $scope.from = start;
        $scope.to = end;
    }

    setDatePicker($scope.from,$scope.to);

    $scope.liveViewFrom = $scope.from;
    $scope.liveViewTo = $scope.to;

    //init dashboard data
    $scope.initDashboardData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

    };
    //should execute initDashboardData() firstly
    $scope.initDashboardData();

    //live view
    $scope.getLiveViewData = function () {
        console.log("from = " + $scope.liveViewFrom);
        console.log("to = " + $scope.liveViewTo);

        var resUrl = "/mysql_monitor/dbInfoLive";
        $scope.liveViewUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.liveViewFrom + "&to=" + $scope.liveViewTo;
        console.log("liveViewUrl = " + $scope.liveViewUrl);
        $http.get($scope.liveViewUrl)
            .success(function (response) {
                //cpu usage
                var cpuliveOptions = cpuliveChartAtResource.getOption();
                //init chart data
                cpuliveOptions.legend.data = [];
                cpuliveOptions.series[0].name = '';
                cpuliveOptions.series[0].data = [];
                cpuliveOptions.series[1].name = '';
                cpuliveOptions.series[1].data = [];
                cpuliveOptions.series[2].name = '';
                cpuliveOptions.series[2].data = [];
                cpuliveOptions.series[3].name = '';
                cpuliveOptions.series[3].data = [];
                if (isNotEmpty(response["cpuUsage"])){
                    cpuliveOptions.legend.data[0] = "IO";
                    cpuliveOptions.legend.data[1] = "System";
                    cpuliveOptions.legend.data[2] = "User";
                    cpuliveOptions.legend.data[3] = "Idle";

                    cpuliveOptions.series[0].name = "IO";
                    cpuliveOptions.series[0].data = response["cpuUsage"]["io"];
                    cpuliveOptions.series[1].name = "System";
                    cpuliveOptions.series[1].data = response["cpuUsage"]["sys"];
                    cpuliveOptions.series[2].name = "User";
                    cpuliveOptions.series[2].data = response["cpuUsage"]["user"];
                    cpuliveOptions.series[3].name = "Idle";
                    cpuliveOptions.series[3].data = response["cpuUsage"]["idle"];
                }
                cpuliveChartAtResource.hideLoading();
                cpuliveChartAtResource.setOption(cpuliveOptions);

                //mem usage
                var memliveOptions = memliveChartAtResource.getOption();
                //init chart data
                memliveOptions.legend.data = [];
                memliveOptions.series[0].data = [];
                if (response["memUsage"].length > 0){
                    for (var i=0; i<response["memUsage"].length; i++) {
                        memliveOptions.legend.data[i] = response["memUsage"][i]["name"];
                        memliveOptions.series[0].data[i] = response["memUsage"][i];
                    }
                }
                memliveChartAtResource.hideLoading();
                memliveChartAtResource.setOption(memliveOptions);

                //sqlWaitStates   sqlwaitliveChart
                var sqlwaitliveOptions = sqlWaitliveChartAtResource.getOption();
                //init chart data
                sqlwaitliveOptions.legend.data = [];
                sqlwaitliveOptions.series[0].data = [];
                if (response["sqlWaitStateLive"].length > 0){
                    for (var i=0; i<response["sqlWaitStateLive"].length; i++) {
                        sqlwaitliveOptions.legend.data[i] = response["sqlWaitStateLive"][i]["name"];
                        sqlwaitliveOptions.series[0].data[i] = response["sqlWaitStateLive"][i];
                    }
                }
                sqlWaitliveChartAtResource.hideLoading();
                sqlWaitliveChartAtResource.setOption(sqlwaitliveOptions);

                //table
                $scope.sessionList = response.sessionList;
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //更新 query top n
    $scope.getQueryTopNData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        if (typeof($scope.queryTopN) == 'undefined'){
            $scope.queryTopValue = 5;
        } else {
            $scope.queryTopValue = $scope.queryTopN;
        }

        var resUrl = "/mysql_monitor/queries";
        $scope.queryTopNUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.from + "&to=" + $scope.to + "&topN=" + $scope.queryTopValue;
        console.log("queryTopNUrl = " + $scope.queryTopNUrl);
        $http.get($scope.queryTopNUrl)
            .success(function (response) {
                $scope.queries = response.queryTopN;
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //client top n
    $scope.getClientTopNData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        if (typeof($scope.clientTopN) == 'undefined'){
            $scope.clientTopValue = 5;
        } else {
            $scope.clientTopValue = $scope.clientTopN;
        }

        var resUrl = "/mysql_monitor/clients";
        $scope.clientTopNUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.from + "&to=" + $scope.to + "&topN=" + $scope.clientTopValue;
        console.log("clientTopNUrl = " + $scope.clientTopNUrl);
        $http.get($scope.clientTopNUrl)
            .success(function (response) {
                $scope.clients = response.clientTopN;
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //session top n
    $scope.getSessionTopNData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        if (typeof($scope.sessionTopN) == 'undefined'){
            $scope.sessionTopValue = 5;
        } else {
            $scope.sessionTopValue = $scope.sessionTopN;
        }

        var resUrl = "/mysql_monitor/sessions";
        $scope.sessionTopNUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.from + "&to=" + $scope.to + "&topN=" + $scope.sessionTopValue;
        console.log("sessionTopNUrl = " + $scope.sessionTopNUrl);
        $http.get($scope.sessionTopNUrl)
            .success(function (response) {
                $scope.sessions = response.sessionTopN;
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //db objects
    $scope.getDBObjectsData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        var resUrl = "/mysql_monitor/dbInfoObjects";
        $scope.dbObjectsUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.from + "&to=" + $scope.to;
        console.log("dbObjectsUrl = " + $scope.dbObjectsUrl);
        $http.get($scope.dbObjectsUrl)
            .success(function (response) {
                $scope.objUsers = response.users;
                $scope.objVariables = response.variables;
                $scope.objStorage = response.storage;
                $scope.objLog = response.log.logPath;
                $scope.objDBUptime = response.database.uptime;
                $scope.objDBVer = response.database.version;
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //report : wait state
    $scope.getReportWaitStateData = function () {
        console.log("from = " + $scope.from);
        console.log("to = " + $scope.to);

        var resUrl = "/mysql_monitor/reports";
        $scope.dbReportUrl = $scope.host + resUrl + "?neId="+ $scope.neId + "&from=" + $scope.from + "&to=" + $scope.to;
        console.log("dbReportUrl = " + $scope.dbReportUrl);
        $http.get($scope.dbReportUrl)
            .success(function (response) {
                //tab 1 :Wait States
                //report sqlWaitStates
                var waitstatereportOptions = waitstatereportChartAtResource.getOption();
                //init chart data
                waitstatereportOptions.legend.data = [];
                waitstatereportOptions.xAxis[0].data = [];
                waitstatereportOptions.series = [];
                if (isNotEmpty(response["waitStateChart"]) && response["waitStateChart"]["legend"].length > 0){
                    waitstatereportOptions.legend.data = response["waitStateChart"]["legend"];
                    waitstatereportOptions.xAxis[0].data = response["waitStateChart"]["time"];

                    for (var i=0;i< response["waitStateChart"]["legend"].length;i++) {
                       //define like this, not concat in string format, even has variables
                       var item = {name: response["waitStateChart"]["legend"][i],
                                  type: 'line',
                                  smooth: true,
                                  data: response["waitStateChart"]["data"][i]
                                  };
                       waitstatereportOptions.series.push(item);
                    }
                }
                waitstatereportChartAtResource.hideLoading();
                waitstatereportChartAtResource.setOption(waitstatereportOptions);

                //waitState table
                $scope.reportWaitState = response["waitStateTable"];

                //tab 2 :top activity
                //report top activity
                var topActivityreportOptions = topActivityChartAtResource.getOption();
                //init chart data
                topActivityreportOptions.legend.data = [];
                topActivityreportOptions.xAxis[0].data = [];
                topActivityreportOptions.series = [];
                if (isNotEmpty(response["topActivityChart"]) && response["topActivityChart"]["legend"].length > 0) {
                    topActivityreportOptions.legend.data = response["topActivityChart"]["legend"];
                    topActivityreportOptions.xAxis[0].data = response["topActivityChart"]["time"];

                    for (var i=0;i< response["topActivityChart"]["legend"].length;i++) {
                       //define like this, not concat in string format, even has variables
                       var item = {name: response["topActivityChart"]["legend"][i],
                                  type: 'line',
                                  smooth: true,
                                  data: response["topActivityChart"]["data"][i]
                                  };
                       topActivityreportOptions.series.push(item);
                    }
                }
                topActivityChartAtResource.hideLoading();
                topActivityChartAtResource.setOption(topActivityreportOptions);

                //top activity table
                $scope.reportTopActivity = response["topActivityTable"];
            }).error(function (data) {
                console.log("http error: cannot get data from " + $scope.host + resUrl);
            });
    };

    //refreshLive
    $scope.refreshLive = function () {
        $scope.isChangeInterval = false;

        if ($scope.liveCheckbox) {
            if (typeof($scope.interval) == 'undefined'){
                $scope.refreshInterval = 1;
            } else {
                $scope.refreshInterval = $scope.interval;
            }
            console.log("refresh interval : " + $scope.refreshInterval);

            console.log("refresh live view... ");
            toastSend();

            $scope.liveTimer = setInterval(function () {
                $scope.liveViewFrom = $scope.from;
                $scope.liveViewTo = new Date().getTime();
                $scope.getLiveViewData();
            }, $scope.refreshInterval * 60 * 1000);
        } else {
            console.log("stop refresh live view... ");
            toastStop();

            if ($scope.isChangeInterval) {
                clearInterval($scope.liveTimer2);
            } else {
                clearInterval($scope.liveTimer);
            }
        }
    };

    $scope.changeLive = function(){
        if($scope.liveCheckbox){
            $scope.isChangeInterval = true;
            clearInterval($scope.liveTimer);

            if (typeof($scope.interval) == 'undefined'){
                $scope.refreshInterval = 1;
            } else {
                $scope.refreshInterval = $scope.interval;
            }
            console.log("refresh interval : " + $scope.refreshInterval);

            console.log("refresh live view... ");
            toastSend();

            $scope.liveTimer2 = setInterval(function () {
                $scope.liveViewFrom = $scope.from;
                $scope.liveViewTo = new Date().getTime();
                $scope.getLiveViewData();
            }, $scope.refreshInterval * 60 * 1000);
        }
    }

    //更新方法
    $scope.replaceModel = function () {

    };

    $scope.isHealthColor = function (v) {
        if (v == true) {
            return '#79DD1B';
        } else {
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

    $scope.myFilter = function (item, type) {
        return item.path == type;
    };
});



/*----- chart -----*/
rabbitmqInfoApp.directive('loadtimespentChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            loadtimespentOption = {
                title: {
                    text: 'Queued messages',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['Ready','Unacknowledged','Total']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'Load',
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}'
                        }
                    },
                    {
                        name :'Time Spent(sec)',
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name: 'Ready',
                        type: 'line',
                        smooth: true,
                        data: [0, 100, 10, 0, 200, 150, 50, 10, 120, 80]
                    },
                    {
                        name: 'Unacknowledged',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 1,
                        data: [10, 0, 200, 150, 50, 10, 120, 80, 0, 10]
                    },
                    {
                        name: 'Total',
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 1,
                        data: [30, 10, 100, 20, 10, 110, 220, 180, 50, 120]
                    }
                ]
            };

            loadtimespentChartAtResource = echarts.init(document.getElementById("loadTimespent"), bluetheme);
            loadtimespentChartAtResource.showLoading({
                text: "loading..."
            });
            loadtimespentChartAtResource.setOption(loadtimespentOption);
            loadtimespentChartAtResource.hideLoading();
        }
    };
});

rabbitmqInfoApp.directive('sqlwaitstatesChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        //'Top 10 SQL Wait States
        link: function () {
            sqlWaitStatesOption = {
                title: {
                    text: 'Top 10 SQL Wait States',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'left',
                    y : 'bottom',
                    data:['','']
                },
                calculable : true,
                series : [
                    {
                        name:'Sql States',
                        type:'pie',
                        radius : ['50%', '60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '20',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:[
                            {value:0, name:''},
                            {value:0, name:''}
                        ]
                    }
                ]
            };

            sqlWaitStatesChartAtResource = echarts.init(document.getElementById("sqlWaitStates"), bluetheme);
            sqlWaitStatesChartAtResource.showLoading({
                text: "loading..."
            });
            sqlWaitStatesChartAtResource.setOption(sqlWaitStatesOption);
            sqlWaitStatesChartAtResource.hideLoading();
        }
    };
});

rabbitmqInfoApp.directive('avgconnectChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            avgconnectOption = {
                title: {
                    text: 'Average number of active connections',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },

                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            avgconnectChartAtResource = echarts.init(document.getElementById("avgConnect"), bluetheme);
            avgconnectChartAtResource.showLoading({
                text: "loading..."
            });
            avgconnectChartAtResource.setOption(avgconnectOption);
            avgconnectChartAtResource.hideLoading();
        }
    };
});

rabbitmqInfoApp.directive('cpuChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            cpuOption = {
                title: {
                    text: 'CPU',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['','']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel : {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            cpuChartAtResource = echarts.init(document.getElementById("cpuLine"), bluetheme);
            cpuChartAtResource.showLoading({
                text: "loading..."
            });
            cpuChartAtResource.setOption(cpuOption);
            cpuChartAtResource.hideLoading();
        }
    };
});



rabbitmqInfoApp.directive('memChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            memOption = {
                title: {
                    text: 'Memory',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },

                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel : {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            memChartAtResource = echarts.init(document.getElementById("memLine"), bluetheme);
            memChartAtResource.showLoading({
                text: "loading..."
            });
            memChartAtResource.setOption(memOption);
            memChartAtResource.hideLoading();
        }
    };
});



rabbitmqInfoApp.directive('storeChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            storeOption = {
                title: {
                    text: 'Disk I/O',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['','']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            storeChartAtResource = echarts.init(document.getElementById("storeLine"), bluetheme);
            storeChartAtResource.showLoading({
                text: "loading..."
            });
            storeChartAtResource.setOption(storeOption);
            storeChartAtResource.hideLoading();
        }
    };
});


rabbitmqInfoApp.directive('netChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            netOption = {
                title: {
                    text: 'Network I/O',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['','']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: '',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            netChartAtResource = echarts.init(document.getElementById("netLine"), bluetheme);
            netChartAtResource.showLoading({
                text: "loading..."
            });
            netChartAtResource.setOption(netOption);
            netChartAtResource.hideLoading();
        }
    };
});


rabbitmqInfoApp.directive('cpuliveChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            cpuliveOption = {
                title: {
                    text: 'CPU Usage',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    x : 'right',
                    y : 'bottom',
                    data:['','','','']
                },

                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}%'
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : ['']
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        barWidth:50,
                        stack: 'total',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[0]
                    },
                    {
                        name:'',
                        type:'bar',
                        barWidth:50,
                        stack: 'total',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[0]
                    },
                    {
                        name:'',
                        type:'bar',
                        barWidth:50,
                        stack: 'total',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[0]
                    },
                    {
                        name:'',
                        type:'bar',
                        barWidth:50,
                        stack: 'total',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:[0]
                    }
                ]
            };

            cpuliveChartAtResource = echarts.init(document.getElementById("cpuLiveLineChart"), bluetheme);
            cpuliveChartAtResource.showLoading({
                text: "loading..."
            });
            cpuliveChartAtResource.setOption(cpuliveOption);
            cpuliveChartAtResource.hideLoading();
        }
    };
});


rabbitmqInfoApp.directive('memliveChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            memliveOption =  {
                title: {
                    text: 'Memory Usage',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'right',
                    y : 'bottom',
                    data:['','']
                },
                calculable : true,
                series : [
                    {
                        name:'Memory',
                        type:'pie',
                        radius : ['50%','60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '20',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:[
                            {value:0, name:''},
                            {value:0, name:''}
                        ]
                    }
                ]
            };

            memliveChartAtResource = echarts.init(document.getElementById("memLiveLineChart"), bluetheme);
            memliveChartAtResource.showLoading({
                text: "loading..."
            });
            memliveChartAtResource.setOption(memliveOption);
            memliveChartAtResource.hideLoading();
        }
    };
});


rabbitmqInfoApp.directive('sqlwaitliveChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        //'Top 10 SQL Wait States
        link: function () {
            sqlWaitliveOption = {
                title: {
                    text: 'Top 10 SQL Wait States',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'right',
                    y : 'bottom',
                    data:['','']
                },
                calculable : true,
                series : [
                    {
                        name:'Sql States',
                        type:'pie',
                        radius : ['50%','60%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : true,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '20',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:[
                             {value:0, name:''},
                             {value:0, name:''}
                        ]
                    }
                ]
            };

            sqlWaitliveChartAtResource = echarts.init(document.getElementById("sqlWaitLiveLineChart"), bluetheme);
            sqlWaitliveChartAtResource.showLoading({
                text: "loading..."
            });
            sqlWaitliveChartAtResource.setOption(sqlWaitliveOption);
            sqlWaitliveChartAtResource.hideLoading();
        }
    };
});

rabbitmqInfoApp.directive('waitstatereportChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            waitstatereportOption = {
                title: {
                    text: 'Wait State Report',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'Time(Sec)',
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                      name: 'null',
                      type: 'line',
                      smooth: true,
                      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            waitstatereportChartAtResource = echarts.init(document.getElementById("waitStateReportLineChart"), bluetheme);
            waitstatereportChartAtResource.showLoading({
                text: "loading..."
            });
            waitstatereportChartAtResource.setOption(waitstatereportOption);
            waitstatereportChartAtResource.hideLoading();
        }
    };
});


rabbitmqInfoApp.directive('topactivityreportChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            topActivityOption = {
                title: {
                    text: 'Top Activity Report',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'Time(Sec)',
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                      name: 'null',
                      type: 'line',
                      smooth: true,
                      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            topActivityChartAtResource = echarts.init(document.getElementById("topActivityLineChart"), bluetheme);
            topActivityChartAtResource.showLoading({
                text: "loading..."
            });
            topActivityChartAtResource.setOption(topActivityOption);
            topActivityChartAtResource.hideLoading();
        }
    };
});