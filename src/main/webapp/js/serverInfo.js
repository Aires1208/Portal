$(function () {
    serverInfo_updateoverViewDatas();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activeTab = $(e.target).text();
        var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
        var $scope = angular.element(appElement).scope();
        if(activeTab == 'Overview'){
            serverInfo_updateoverViewDatas();
            $scope.activeTabName = "Overview";
        } else if (activeTab == 'Disk') {
            $('#myDiskoperationsChartBar').prepend($('#myDiskoperationsChartID'));
            $("#myDiskoperationsChartID").css("visibility", "visible");

            $('#myDiskusageChartBar').prepend($('#myDiskusageChartID'));
            $("#myDiskusageChartID").css("visibility", "visible");
            serverInfo_updatediskDatas();
            $scope.activeTabName = "Disk";
        } else if (activeTab == 'Aggregate CPU Usage') {
            $('#myTopfivecpuusageChartBar').prepend($('#myTopfivecpuusageChartID'));
            $("#myTopfivecpuusageChartID").css("visibility", "visible");

            $('#myAggregatecpuusagedetailsChartBar').prepend($('#myAggregatecpuusagedetailsChartID'));
            $("#myAggregatecpuusagedetailsChartID").css("visibility", "visible");
            serverInfo_updateaggregateCPUUsageDatas();
            $scope.activeTabName = "Aggregate CPU Usage";
            $scope.showTop5CPU_Usage = true;
            $scope.showTop5CPU_TIME = true;
            $scope.showTop5VIRT = false;
            $('#showDetailsModalBody').append($('#processInformationTabIdContent'));
            $("#processInformationTabIdContent").css("visibility", "visible");

        } else if (activeTab == 'Memory Usage') {
            $scope.activeTabName = "Memory Usage";
            $('#mySwapmemoryusageChartBar').prepend($('#mySwapmemoryusageChartID'));
            $("#mySwapmemoryusageChartID").css("visibility", "visible");

            $('#myPageschedulingChartBar').prepend($('#myPageschedulingChartID'));
            $("#myPageschedulingChartID").css("visibility", "visible");

            $('#myVirtualmemoryusageChartBar').prepend($('#myVirtualmemoryusageChartID'));
            $("#myVirtualmemoryusageChartID").css("visibility", "visible");

            $('#myRealmemoryusageChartBar').prepend($('#myRealmemoryusageChartID'));
            $("#myRealmemoryusageChartID").css("visibility", "visible");
            $scope.showTop5CPU_Usage = false;
            $scope.showTop5CPU_TIME = false;
            $scope.showTop5VIRT = true;
            $('#showDetailsModalBody').append($('#processInformationTabIdContent'));
            $("#processInformationTabIdContent").css("visibility", "visible");

            serverInfo_updatememoryUsageDatas();
        } else if (activeTab == 'Network Interface') {
            $scope.activeTabName = "Network Interface";
            $('#myAggregatenetworkinterfaceiorateChartBar').prepend($('#myAggregatenetworkinterfaceiorateChartID'));
            $("#myAggregatenetworkinterfaceiorateChartID").css("visibility", "visible");

            $('#myAggregatenetworkinterfaceerrorChartBar').prepend($('#myAggregatenetworkinterfaceerrorChartID'));
            $("#myAggregatenetworkinterfaceerrorChartID").css("visibility", "visible");
            serverInfo_updatenetworkInterfaceDatas();
        } else if (activeTab == 'File System') {
            $scope.activeTabName = "File System";
            $('#myAggregatefilesystemusageChartBar').prepend($('#myAggregatefilesystemusageChartID'));
            $("#myAggregatefilesystemusageChartID").css("visibility", "visible");

            $('#myAggregatefilesystemspaceusageChartBar').prepend($('#myAggregatefilesystemspaceusageChartID'));
            $("#myAggregatefilesystemspaceusageChartID").css("visibility", "visible");
            serverInfo_updatefileSystemDatas();
        } else if (activeTab == 'Process Information') {
            $scope.activeTabName = "Process Information";
            $scope.showTop5CPU_Usage = true;
            $scope.showTop5CPU_TIME = true;
            $scope.showTop5VIRT = true;
            $('#processInformationTabId').append($('#processInformationTabIdContent'));
            $("#processInformationTabIdContent").css("visibility", "visible");
            serverInfo_updateprocessInformationDatas();
        }
    });
});



function datePickerUpdateData(start, end) {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();

    $scope.replaceModel(start, end);
}
// 请求 overView 页面数据
function serverInfo_updateoverViewDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updateoverViewDatas();
}
// 请求 aggregateCPUUsage 页面数据
function serverInfo_updateaggregateCPUUsageDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updateaggregateCPUUsageDatas();
}

// 请求 memoryUsage 页面数据
function serverInfo_updatememoryUsageDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updatememoryUsageDatas();
}

// 请求 fileSystem 页面数据
function serverInfo_updatefileSystemDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updatefileSystemDatas();
}

// 请求 disk 页面数据
function serverInfo_updatediskDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updatediskDatas();
}

// 请求 networkInterface 页面数据
function serverInfo_updatenetworkInterfaceDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updatenetworkInterfaceDatas();
}

// 请求 processInformation 页面数据
function serverInfo_updateprocessInformationDatas() {
    var appElement = document.querySelector('[ng-controller=serverInfoCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.updateprocessInformationDatas(null);
}

var serverInfoApp = angular.module('serverInfoApp', []);
serverInfoApp.controller('serverInfoCtrl', function ($scope, $http, $location) {
    $scope.hostid = QueryString('hostid');
    $scope.application = QueryString('application');
    $scope.service = QueryString('service');
    if ($scope.hostid.length > 15) {
        $("#hostid").css("padding-top", "10px");
        $("#hostid").css("font-size", "10px");
        $("#hostid").css("font-weight", "bold");
    }

    $scope.from = QueryString('from');
    $scope.to = QueryString('to');
    $scope.activeTabName = "Overview";

    var rg =  getCookie("ranges");
    setDatePicker($scope.from, $scope.to,rg);
    $scope.showTop5CPU_Usage = true;
    $scope.showTop5CPU_TIME = true;
    $scope.showTop5VIRT = true;
    // 请求 overView 页面数据
    $scope.processInformation = {
        "numberOfActiveProcesses": 0,
        "numberOfZombieProcesses": 0,
        "numberOfThreads": 0,
        "theMaximumNumberOfProcessesAllowed": 0,
        "theMaximumNumberOfThreadsAllowed": 0
    }
    $scope.systemMessage = {
        "operatingSystem": "---",
        "theKernelVersion": "---",
        "FQDName": "---",
        "hostAddress": "---",
        "minutesOfTheSystem": "---",
        "systemUptime": "---",
    }
    $scope.theLogFile = [];
    $scope.updateoverViewDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfoOverViewUrl = serverMockdataSourceURL() + "/api/overview?hostid=" + $scope.hostid + "&from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfoOverViewUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/overview.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        console.log("serverInfoOverViewUrl:" + $scope.serverInfoOverViewUrl);
        $scope.initoverViewDatas();
        $scope.isoverViewLoading = true;
        $scope.isoverViewGetMsgFail = false;
        $http.get($scope.serverInfoOverViewUrl)
            .success(function (response) {
                console.log("---updateoverViewDatas---");
                console.log(response["overview"]);
                console.log("---updateoverViewDatas---");
                $scope.isoverViewLoading = false;
                $scope.isoverViewGetMsgFail = false;
                // 更新 聚焦 CPU 使用率
                var myCpuChartOptions = myCpuChart.getOption();
                myCpuChartOptions = myCpuChartOption;
                myCpuChartOptions.series[0].data = response["overview"]["aggregateCPUUsage"]["busyPercentage"];
                myCpuChartOptions.series[1].data = response["overview"]["aggregateCPUUsage"]["idlePercentage"];
                myCpuChartOptions.xAxis.data = response["overview"]["aggregateCPUUsage"]["time"];
                myCpuChart.setOption(myCpuChartOptions);
                myCpuChart.hideLoading();
                // 更新 内存使用情况
                var mySmemoryChartOptions = mySmemoryChart.getOption();
                mySmemoryChartOptions = mySmemoryChartOption;
                mySmemoryChartOptions.series[0].data = response["overview"]["smemory"]["percentageUsed"];
                mySmemoryChartOptions.series[1].data = response["overview"]["smemory"]["availablePercentage"];
                mySmemoryChart.hideLoading();
                mySmemoryChart.setOption(mySmemoryChartOptions);
                // 更新 排名前5位的文件系统
                var myTopfivefileststemOptions = myTopfivefileststemChart.getOption();
                myTopfivefileststemOptions = myTopfivefileststemOption;
                myTopfivefileststemOptions.series[0].data = response["overview"]["topfivefileststem"]["percentageUsed"];
                myTopfivefileststemOptions.series[1].data = response["overview"]["topfivefileststem"]["availablePercentage"];
                myTopfivefileststemOptions.yAxis[0].data = response["overview"]["topfivefileststem"]["installationPoint"];
                myTopfivefileststemChart.hideLoading();
                myTopfivefileststemChart.setOption(myTopfivefileststemOptions);
                // 更新 排名前5位的磁盘
                var myTopfivediskOptions = myTopfivediskChart.getOption();
                myTopfivediskOptions = myTopfivediskOption;
                myTopfivediskOptions.series[0].data = response["overview"]["topfivedisk"]["dataTransferredPerSecond"];
                myTopfivediskOptions.yAxis[0].data = response["overview"]["topfivedisk"]["disk"];
                myTopfivediskChart.hideLoading();
                myTopfivediskChart.setOption(myTopfivediskOptions);
                // 更新 排名前10位的按传输包列出的网络接口
                var myToptennetworkinterfaceOptions = myToptennetworkinterfaceChart.getOption();
                myToptennetworkinterfaceOptions = myToptennetworkinterfaceOption;
                myToptennetworkinterfaceOptions.series[0].data = response["overview"]["toptennetworkinterface"]["packetsTransferredPerSecond"];
                myToptennetworkinterfaceOptions.yAxis[0].data = response["overview"]["toptennetworkinterface"]["networkinterface"];
                myToptennetworkinterfaceChart.hideLoading();
                myToptennetworkinterfaceChart.setOption(myToptennetworkinterfaceOptions);
                $scope.processInformation = response["overview"]["processInformation"];
                $scope.theLogFile = response["overview"]["theLogFile"];
                $scope.systemMessage = response["overview"]["systemMessage"];
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isoverViewLoading = false;
            $scope.isoverViewGetMsgFail = true;
        });
    }
    // 请求前 初始化图表数据;
    $scope.initoverViewDatas = function(){
        // 更新 聚焦 CPU 使用率
        myCpuChart = echarts.init(document.getElementById("myCpuChartID"), bluetheme);
        var myCpuChartOptions = myCpuChart.getOption();
        myCpuChartOptions = myCpuChartOption;
        myCpuChartOptions.series[0].data = [];
        myCpuChartOptions.series[1].data = [];
        myCpuChartOptions.xAxis.data = [];
        myCpuChart.showLoading({
            text: "loading..."
        });
        myCpuChart.setOption(myCpuChartOptions);
        // 更新 内存使用情况
        mySmemoryChart = echarts.init(document.getElementById("mySmemoryChartID"), bluetheme);
        var mySmemoryChartOptions = mySmemoryChart.getOption();
        mySmemoryChartOptions = mySmemoryChartOption;
        mySmemoryChartOptions.series[0].data = [];
        mySmemoryChartOptions.series[1].data = [];
        mySmemoryChart.showLoading({
            text: "loading..."
        });
        mySmemoryChart.setOption(mySmemoryChartOptions);
        // 更新 排名前5位的文件系统
        myTopfivefileststemChart = echarts.init(document.getElementById("myTopfivefileststemID"), bluetheme);
        var myTopfivefileststemOptions = myTopfivefileststemChart.getOption();
        myTopfivefileststemOptions = myTopfivefileststemOption;
        myTopfivefileststemOptions.series[0].data = [];
        myTopfivefileststemOptions.series[1].data = [];
        myTopfivefileststemOptions.yAxis[0].data = [];
        myTopfivefileststemChart.showLoading({
            text: "loading..."
        });
        myTopfivefileststemChart.setOption(myTopfivefileststemOptions);
        // 更新 排名前5位的磁盘
        myTopfivediskChart = echarts.init(document.getElementById("myTopfivediskID"), bluetheme);
        var myTopfivediskOptions = myTopfivediskChart.getOption();
        myTopfivediskOptions = myTopfivediskOption;
        myTopfivediskOptions.series[0].data = [];
        myTopfivediskOptions.yAxis[0].data = [];
        myTopfivediskChart.showLoading({
            text: "loading..."
        });
        myTopfivediskChart.setOption(myTopfivediskOptions);
        // 更新 排名前10位的按传输包列出的网络接口
        myToptennetworkinterfaceChart = echarts.init(document.getElementById("myToptennetworkinterfaceID"), bluetheme);
        var myToptennetworkinterfaceOptions = myToptennetworkinterfaceChart.getOption();
        myToptennetworkinterfaceOptions = myToptennetworkinterfaceOption;
        myToptennetworkinterfaceOptions.series[0].data = [];
        myToptennetworkinterfaceOptions.yAxis[0].data = [];
        myToptennetworkinterfaceChart.showLoading({
            text: "loading..."
        });
        myToptennetworkinterfaceChart.setOption(myToptennetworkinterfaceOptions);
    }
    // 请求 overView 页面数据

    // 请求 aggregateCPUUsage 页面数据
    $scope.aggregateCPUUsage = [];
    $scope.isaggregateCPUUsageLoading = false;
    $scope.updateaggregateCPUUsageDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfoaggregateCPUUsageUrl = serverMockdataSourceURL() + "/api/aggregateCPUUsage?hostid=" + $scope.hostid + "from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfoaggregateCPUUsageUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/aggregateCPUUsage.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        console.log("serverInfoaggregateCPUUsageUrl:" + $scope.serverInfoaggregateCPUUsageUrl);
        $scope.initaggregateCPUUsageDatas();
        $scope.isaggregateCPUUsageLoading = true;
        $scope.aggregateCPUUsage = [];
        $http.get($scope.serverInfoaggregateCPUUsageUrl)
            .success(function (response) {
                console.log("---updateaggregateCPUUsageDatas---");
                console.log(response["aggregateCPUUsage"]);
                console.log("---updateaggregateCPUUsageDatas---");
                $scope.aggregateCPUUsage = response["aggregateCPUUsage"];
                $scope.isaggregateCPUUsageLoading = false;
                // 更新 排名前5位的按使用率列出的CPU
                var myTopfivecpuusageChartOptions = myTopfivecpuusageChart.getOption();
                myTopfivecpuusageChartOptions = myTopfivecpuusageChartOption;
                myTopfivecpuusageChartOptions.series[0].data = response["aggregateCPUUsage"]["topfivecpuusage"]["percentageOfSystemTime"];
                myTopfivecpuusageChartOptions.series[1].data = response["aggregateCPUUsage"]["topfivecpuusage"]["percentOfUserTime"];
                myTopfivecpuusageChartOptions.series[2].data = response["aggregateCPUUsage"]["topfivecpuusage"]["waitForIOTimePercentage"];
                myTopfivecpuusageChartOptions.series[3].data = response["aggregateCPUUsage"]["topfivecpuusage"]["percentageOfIdleTime"];
                myTopfivecpuusageChartOptions.xAxis.data = response["aggregateCPUUsage"]["topfivecpuusage"]["cpuIdentification"];
                myTopfivecpuusageChart.hideLoading();
                myTopfivecpuusageChart.setOption(myTopfivecpuusageChartOptions);

                // 更新 聚集CPU使用率详细信息
                var myAggregatecpuusagedetailsChartOptions = myAggregatecpuusagedetailsChart.getOption();
                myAggregatecpuusagedetailsChartOptions = myAggregatecpuusagedetailsChartOption;
                myAggregatecpuusagedetailsChartOptions.series[0].data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["percentageOfUsers"];
                myAggregatecpuusagedetailsChartOptions.series[1].data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["userNicePercentage"];
                myAggregatecpuusagedetailsChartOptions.series[2].data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["percentageOfSystem"];
                myAggregatecpuusagedetailsChartOptions.series[3].data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["waitForIOPercentage"];
                myAggregatecpuusagedetailsChartOptions.series[4].data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["userToSystemPercentage"];
                myAggregatecpuusagedetailsChartOptions.xAxis.data = response["aggregateCPUUsage"]["aggregatecpuusagedetails"]["time"];
                myAggregatecpuusagedetailsChart.hideLoading();
                myAggregatecpuusagedetailsChart.setOption(myAggregatecpuusagedetailsChartOptions);
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isaggregateCPUUsageLoading = false;
        });
    }
    // 请求前 初始化图表数据;
    $scope.initaggregateCPUUsageDatas = function(){
        // 更新 排名前5位的按使用率列出的CPU
        myTopfivecpuusageChart = echarts.init(document.getElementById("myTopfivecpuusageChartID"), bluetheme);
        var myTopfivecpuusageChartOptions = myTopfivecpuusageChart.getOption();
        myTopfivecpuusageChartOptions = myTopfivecpuusageChartOption;
        myTopfivecpuusageChartOptions.series[0].data = [];
        myTopfivecpuusageChartOptions.series[1].data = [];
        myTopfivecpuusageChartOptions.series[2].data = [];
        myTopfivecpuusageChartOptions.series[3].data = [];
        myTopfivecpuusageChartOptions.xAxis.data = [];
        myTopfivecpuusageChart.showLoading({
            text: "loading..."
        });
        myTopfivecpuusageChart.setOption(myTopfivecpuusageChartOptions);

        // 更新 聚集CPU使用率详细信息
        myAggregatecpuusagedetailsChart = echarts.init(document.getElementById("myAggregatecpuusagedetailsChartID"), bluetheme);
        myAggregatecpuusagedetailsChart.on('click', function (params) {
            $('#showDetails').modal('show');
            console.log(params);
            // null 给为时刻值;
            serverInfo_updateprocessInformationDatas(null);
        });
        var myAggregatecpuusagedetailsChartOptions = myAggregatecpuusagedetailsChart.getOption();
        myAggregatecpuusagedetailsChartOptions = myAggregatecpuusagedetailsChartOption;
        myAggregatecpuusagedetailsChartOptions.series[0].data = [];
        myAggregatecpuusagedetailsChartOptions.series[1].data = [];
        myAggregatecpuusagedetailsChartOptions.series[2].data = [];
        myAggregatecpuusagedetailsChartOptions.series[3].data = [];
        myAggregatecpuusagedetailsChartOptions.series[3].data = [];
        myAggregatecpuusagedetailsChartOptions.xAxis.data = [];
        myAggregatecpuusagedetailsChart.showLoading({
            text: "loading..."
        });
        myAggregatecpuusagedetailsChart.setOption(myAggregatecpuusagedetailsChartOptions);
    }
    // 请求 aggregateCPUUsage 页面数据

    // 请求 memoryUsage 页面数据
    $scope.updatememoryUsageDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfomemoryUsageUrl = serverMockdataSourceURL() + "/api/memoryUsage?hostid=" + $scope.hostid + "from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfomemoryUsageUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/memoryUsage.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        console.log("serverInfomemoryUsageUrl:" + $scope.serverInfomemoryUsageUrl);
        $scope.initmemoryUsageDatas();
        $http.get($scope.serverInfomemoryUsageUrl)
            .success(function (response) {
                console.log("---updatememoryUsageDatas---");
                console.log(response["memoryUsage"]);
                console.log("---updatememoryUsageDatas---");
                // 更新 交换内存使用情况
                var mySwapmemoryusageChartOptions = mySwapmemoryusageChart.getOption();
                mySwapmemoryusageChartOptions = mySwapmemoryusageChartOption;
                mySwapmemoryusageChartOptions.series[0].data = response["memoryUsage"]["swapmemoryusage"]["used"];
                mySwapmemoryusageChartOptions.series[1].data = response["memoryUsage"]["swapmemoryusage"]["idle"];
                mySwapmemoryusageChartOptions.series[2].data = response["memoryUsage"]["swapmemoryusage"]["total"];
                mySwapmemoryusageChartOptions.xAxis.data = response["memoryUsage"]["swapmemoryusage"]["time"];
                mySwapmemoryusageChart.setOption(mySwapmemoryusageChartOptions);
                mySwapmemoryusageChart.hideLoading();
                mySwapmemoryusageChart.on('click', function (params) {
                    $('#showDetails').modal('show');
                    console.log(params);
                    // null 给为时刻值;
                    serverInfo_updateprocessInformationDatas(null);
                });
                // 更新 页面调度
                var myPageschedulingChartOptions = myPageschedulingChart.getOption();
                myPageschedulingChartOptions = myPageschedulingChartOption;
                myPageschedulingChartOptions.series[0].data = response["memoryUsage"]["pagescheduling"]["numberIn"];
                myPageschedulingChartOptions.series[1].data = response["memoryUsage"]["pagescheduling"]["numberOut"];
                myPageschedulingChartOptions.xAxis.data = response["memoryUsage"]["pagescheduling"]["time"];
                myPageschedulingChart.hideLoading();
                myPageschedulingChart.setOption(myPageschedulingChartOptions);
                myPageschedulingChart.on('click', function (params) {
                    $('#showDetails').modal('show');
                    console.log(params);
                    // null 给为时刻值;
                    serverInfo_updateprocessInformationDatas(null);
                });
                // 更新 虚拟内存使用情况
                var myVirtualmemoryusageChartOptions = myVirtualmemoryusageChart.getOption();
                myVirtualmemoryusageChartOptions = myVirtualmemoryusageChartOption;
                myVirtualmemoryusageChartOptions.series[0].data = response["memoryUsage"]["virtualmemoryusage"]["used"];
                myVirtualmemoryusageChartOptions.series[1].data = response["memoryUsage"]["virtualmemoryusage"]["idle"];
                myVirtualmemoryusageChartOptions.series[2].data = response["memoryUsage"]["virtualmemoryusage"]["total"];
                myVirtualmemoryusageChartOptions.xAxis.data = response["memoryUsage"]["virtualmemoryusage"]["time"];
                myVirtualmemoryusageChart.hideLoading();
                myVirtualmemoryusageChart.setOption(myVirtualmemoryusageChartOptions);
                myVirtualmemoryusageChart.on('click', function (params) {
                    $('#showDetails').modal('show');
                    console.log(params);
                    // null 给为时刻值;
                    serverInfo_updateprocessInformationDatas(null);
                });
                // 更新 实内存使用情况
                var myRealmemoryusageChartOptions = myRealmemoryusageChart.getOption();
                myRealmemoryusageChartOptions = myRealmemoryusageChartOption;
                myRealmemoryusageChartOptions.series[0].data = response["memoryUsage"]["realmemoryusage"]["idle"];
                // myRealmemoryusageChartOptions.series[1].data = response["memoryUsage"]["realmemoryusage"]["usedNetwork"];
                myRealmemoryusageChartOptions.series[1].data = response["memoryUsage"]["realmemoryusage"]["used"];
                myRealmemoryusageChartOptions.series[2].data = response["memoryUsage"]["realmemoryusage"]["total"];
                myRealmemoryusageChartOptions.xAxis.data = response["memoryUsage"]["realmemoryusage"]["time"];
                myRealmemoryusageChart.setOption(myRealmemoryusageChartOptions);
                myRealmemoryusageChart.hideLoading();
                myRealmemoryusageChart.on('click', function (params) {
                    $('#showDetails').modal('show');
                    console.log(params);
                    // null 给为时刻值;
                    serverInfo_updateprocessInformationDatas(null);
                });

            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
        });
    }
    // 请求前 初始化图表数据;
    $scope.initmemoryUsageDatas = function () {
        // 更新 交换内存使用情况
        mySwapmemoryusageChart = echarts.init(document.getElementById("mySwapmemoryusageChartID"), bluetheme);
        var mySwapmemoryusageChartOptions = mySwapmemoryusageChart.getOption();
        mySwapmemoryusageChartOptions = mySwapmemoryusageChartOption;
        mySwapmemoryusageChartOptions.series[0].data = [];
        mySwapmemoryusageChartOptions.series[1].data = [];
        mySwapmemoryusageChartOptions.series[2].data = [];
        mySwapmemoryusageChartOptions.xAxis.data = [];
        mySwapmemoryusageChart.showLoading({
            text: "loading..."
        });
        mySwapmemoryusageChart.setOption(mySwapmemoryusageChartOptions);
        // 更新 页面调度
        myPageschedulingChart = echarts.init(document.getElementById("myPageschedulingChartID"), bluetheme);
        var myPageschedulingChartOptions = myPageschedulingChart.getOption();
        myPageschedulingChartOptions = myPageschedulingChartOption;
        myPageschedulingChartOptions.series[0].data = [];
        myPageschedulingChartOptions.series[1].data = [];
        myPageschedulingChartOptions.xAxis.data = [];
        myPageschedulingChart.showLoading({
            text: "loading..."
        });
        myPageschedulingChart.setOption(myPageschedulingChartOptions);
        // 更新 虚拟内存使用情况
        myVirtualmemoryusageChart = echarts.init(document.getElementById("myVirtualmemoryusageChartID"), bluetheme);
        var myVirtualmemoryusageChartOptions = myVirtualmemoryusageChart.getOption();
        myVirtualmemoryusageChartOptions = myVirtualmemoryusageChartOption;
        myVirtualmemoryusageChartOptions.series[0].data = [];
        myVirtualmemoryusageChartOptions.series[1].data = [];
        myVirtualmemoryusageChartOptions.series[2].data = [];
        myVirtualmemoryusageChartOptions.xAxis.data = [];
        myVirtualmemoryusageChart.showLoading({
            text: "loading..."
        });
        myVirtualmemoryusageChart.setOption(myVirtualmemoryusageChartOptions);
        // 更新 实内存使用情况
        myRealmemoryusageChart = echarts.init(document.getElementById("myRealmemoryusageChartID"), bluetheme);
        var myRealmemoryusageChartOptions = myRealmemoryusageChart.getOption();
        myRealmemoryusageChartOptions = myRealmemoryusageChartOption;
        myRealmemoryusageChartOptions.series[0].data = [];
        // myRealmemoryusageChartOptions.series[1].data = response["memoryUsage"]["realmemoryusage"]["usedNetwork"];
        myRealmemoryusageChartOptions.series[1].data = [];
        myRealmemoryusageChartOptions.series[2].data = [];
        myRealmemoryusageChartOptions.xAxis.data = [];
        myRealmemoryusageChart.showLoading({
            text: "loading..."
        });
        myRealmemoryusageChart.setOption(myRealmemoryusageChartOptions);
        echarts.connect([mySwapmemoryusageChart, myVirtualmemoryusageChart,myRealmemoryusageChart]);
    }
    // 请求 fileSystem 页面数据
    $scope.fileSystem = [];
    $scope.isfileSystemLoading = false;
    $scope.updatefileSystemDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfofileSystemUrl = serverMockdataSourceURL() + "/api/fileSystem?hostid=" + $scope.hostid + "from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfofileSystemUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/fileSystem.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        console.log("serverInfofileSystemUrl:" + $scope.serverInfofileSystemUrl);
        $scope.initfileSystemDatas();
        $scope.isfileSystemLoading = true;
        $scope.fileSystem = [];
        $http.get($scope.serverInfofileSystemUrl)
            .success(function (response) {
                console.log("---updatefileSystemDatas---");
                console.log(response["fileSystem"]);
                console.log("---updatefileSystemDatas---");
                $scope.fileSystem = response["fileSystem"];
                $scope.isfileSystemLoading = false;
                // 更新 聚集文件系统使用情况
                var myAggregatefilesystemusageChartOptions = myAggregatefilesystemusageChart.getOption();
                myAggregatefilesystemusageChartOptions = myAggregatefilesystemusageChartOption;
                myAggregatefilesystemusageChartOptions.series[0].data = response["fileSystem"]["aggregatefilesystemusage"]["percentageUsed"];
                myAggregatefilesystemusageChartOptions.series[1].data = response["fileSystem"]["aggregatefilesystemusage"]["availablePercentage"];
                myAggregatefilesystemusageChartOptions.xAxis.data = response["fileSystem"]["aggregatefilesystemusage"]["time"];
                myAggregatefilesystemusageChart.hideLoading();
                myAggregatefilesystemusageChart.setOption(myAggregatefilesystemusageChartOptions);

                // 更新 聚集文件系统空间使用情况
                var myAggregatefilesystemspaceusageChartOptions = myAggregatefilesystemspaceusageChart.getOption();
                myAggregatefilesystemspaceusageChartOptions = myAggregatefilesystemspaceusageChartOption;
                myAggregatefilesystemspaceusageChartOptions.series[0].data = response["fileSystem"]["aggregatefilesystemspaceusage"]["used"];
                myAggregatefilesystemspaceusageChartOptions.series[1].data = response["fileSystem"]["aggregatefilesystemspaceusage"]["total"];
                myAggregatefilesystemspaceusageChartOptions.xAxis.data = response["fileSystem"]["aggregatefilesystemspaceusage"]["time"];
                myAggregatefilesystemspaceusageChart.hideLoading();
                myAggregatefilesystemspaceusageChart.setOption(myAggregatefilesystemspaceusageChartOptions);
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isfileSystemLoading = false;
        });
    }
    $scope.initfileSystemDatas = function () {
        // 更新 聚集文件系统使用情况
        myAggregatefilesystemusageChart = echarts.init(document.getElementById("myAggregatefilesystemusageChartID"), bluetheme);
        var myAggregatefilesystemusageChartOptions = myAggregatefilesystemusageChart.getOption();
        myAggregatefilesystemusageChartOptions = myAggregatefilesystemusageChartOption;
        myAggregatefilesystemusageChartOptions.series[0].data = [];
        myAggregatefilesystemusageChartOptions.series[1].data = [];
        myAggregatefilesystemusageChartOptions.xAxis.data = [];
        myAggregatefilesystemusageChart.showLoading({
            text: "loading..."
        });
        myAggregatefilesystemusageChart.setOption(myAggregatefilesystemusageChartOptions);

        // 更新 聚集文件系统空间使用情况
        myAggregatefilesystemspaceusageChart = echarts.init(document.getElementById("myAggregatefilesystemspaceusageChartID"), bluetheme);
        var myAggregatefilesystemspaceusageChartOptions = myAggregatefilesystemspaceusageChart.getOption();
        myAggregatefilesystemspaceusageChartOptions = myAggregatefilesystemspaceusageChartOption;
        myAggregatefilesystemspaceusageChartOptions.series[0].data = [];
        myAggregatefilesystemspaceusageChartOptions.series[1].data = [];
        myAggregatefilesystemspaceusageChartOptions.xAxis.data = [];
        myAggregatefilesystemspaceusageChart.showLoading({
            text: "loading..."
        });
        myAggregatefilesystemspaceusageChart.setOption(myAggregatefilesystemspaceusageChartOptions);
        echarts.connect([myAggregatefilesystemusageChart, myAggregatefilesystemspaceusageChart]);
    }
    // 请求 disk 页面数据
    $scope.disk = [];
    $scope.isdiskLoading = false;
    $scope.updatediskDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfodiskUrl = serverMockdataSourceURL() + "/api/disk?hostid=" + $scope.hostid + "from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfodiskUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/disk.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        // 真实后端有假数据
        $scope.serverInfodiskUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/disk.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("serverInfodiskUrl:" + $scope.serverInfodiskUrl);
        $scope.initdiskDatas();
        $scope.isdiskLoading = true;
        $scope.disk = [];
        $http.get($scope.serverInfodiskUrl)
            .success(function (response) {
                console.log("---updatediskDatas---");
                console.log(response["disk"]);
                console.log("---updatediskDatas---");
                $scope.disk = response["disk"];
                $scope.isdiskLoading = false;
                // 更新 聚焦每秒磁盘操作数
                var myDiskoperationsChartOptions = myDiskoperationsChart.getOption();
                myDiskoperationsChartOptions = myDiskoperationsChartOption;
                myDiskoperationsChartOptions.series[0].data = response["disk"]["diskoperations"]["readsTheNumberOfBlocksPerSecond"];
                myDiskoperationsChartOptions.series[1].data = response["disk"]["diskoperations"]["numberOfBlocksWrittenPerSecond"];
                myDiskoperationsChartOptions.xAxis.data = response["disk"]["diskoperations"]["time"];
                myDiskoperationsChart.hideLoading();
                myDiskoperationsChart.setOption(myDiskoperationsChartOptions);

                // 更新 聚焦磁盘I/O使用情况
                var myDiskusageChartOptions = myDiskusageChart.getOption();
                myDiskusageChartOptions = myDiskusageChartOption;
                myDiskusageChartOptions.series[0].data = response["disk"]["diskusage"]["numberOfTransfersPerSecond"];
                myDiskusageChartOptions.xAxis.data = response["disk"]["diskusage"]["time"];
                myDiskusageChart.hideLoading();
                myDiskusageChart.setOption(myDiskusageChartOptions);
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isdiskLoading = false;
        });
    }
    $scope.initdiskDatas = function () {
        // 更新 聚焦每秒磁盘操作数
        myDiskoperationsChart = echarts.init(document.getElementById("myDiskoperationsChartID"), bluetheme);
        var myDiskoperationsChartOptions = myDiskoperationsChart.getOption();
        myDiskoperationsChartOptions = myDiskoperationsChartOption;
        myDiskoperationsChartOptions.series[0].data = [];
        myDiskoperationsChartOptions.series[1].data = [];
        myDiskoperationsChartOptions.xAxis.data = [];
        myDiskoperationsChart.showLoading({
            text: "loading..."
        });
        myDiskoperationsChart.setOption(myDiskoperationsChartOptions);

        // 更新 聚焦磁盘I/O使用情况
        myDiskusageChart = echarts.init(document.getElementById("myDiskusageChartID"), bluetheme);
        var myDiskusageChartOptions = myDiskusageChart.getOption();
        myDiskusageChartOptions = myDiskusageChartOption;
        myDiskusageChartOptions.series[0].data = [];
        myDiskusageChartOptions.xAxis.data = [];
        myDiskusageChart.showLoading({
            text: "loading..."
        });
        myDiskusageChart.setOption(myDiskusageChartOptions);
        echarts.connect([myDiskoperationsChart, myDiskusageChart]);
    }
    // 请求 networkInterface 页面数据
    $scope.networkInterface = [];
    $scope.isnetworkInterfaceLoading = false;
    $scope.updatenetworkInterfaceDatas = function () {
        if (getMockFlag()) {
            $scope.serverInfonetworkInterfaceUrl = serverMockdataSourceURL() + "/api/networkInterface?hostid=" + $scope.hostid + "from=" + $scope.from + "&to=" + $scope.to;
        }
        else {
            $scope.serverInfonetworkInterfaceUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/networkInterface.pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        console.log("serverInfonetworkInterfaceUrl:" + $scope.serverInfonetworkInterfaceUrl);
        $scope.initnetworkInterfaceDatas();
        $scope.isnetworkInterfaceLoading = true;
        $scope.networkInterface = [];
        $http.get($scope.serverInfonetworkInterfaceUrl)
            .success(function (response) {
                console.log("---updatenetworkInterfaceDatas---");
                console.log(response["networkInterface"]);
                console.log("---updatenetworkInterfaceDatas---");
                $scope.networkInterface = response["networkInterface"];
                $scope.isnetworkInterfaceLoading = false;
                // 更新 聚焦每秒磁盘操作数
                var myAggregatenetworkinterfaceiorateChartOptions = myAggregatenetworkinterfaceiorateChart.getOption();
                myAggregatenetworkinterfaceiorateChartOptions = myAggregatenetworkinterfaceiorateChartOption;
                myAggregatenetworkinterfaceiorateChartOptions.series[0].data = response["networkInterface"]["aggregatenetworkinterfaceiorate"]["theNumberOfKilobytesReceivedPerSecond"];
                myAggregatenetworkinterfaceiorateChartOptions.series[1].data = response["networkInterface"]["aggregatenetworkinterfaceiorate"]["theNumberOfKilobytesTransferredPerSecond"];
                myAggregatenetworkinterfaceiorateChartOptions.xAxis.data = response["networkInterface"]["aggregatenetworkinterfaceiorate"]["time"];
                myAggregatenetworkinterfaceiorateChart.hideLoading();
                myAggregatenetworkinterfaceiorateChart.setOption(myAggregatenetworkinterfaceiorateChartOptions);

                // 更新 聚焦磁盘I/O使用情况
                var myAggregatenetworkinterfaceerrorChartOptions = myAggregatenetworkinterfaceerrorChart.getOption();
                myAggregatenetworkinterfaceerrorChartOptions = myAggregatenetworkinterfaceerrorChartOption;
                myAggregatenetworkinterfaceerrorChartOptions.series[0].data = response["networkInterface"]["aggregatenetworkinterfaceerror"]["theNumberOfPacketConflicts"];
                myAggregatenetworkinterfaceerrorChartOptions.series[1].data = response["networkInterface"]["aggregatenetworkinterfaceerror"]["theNumberOfPacketInputErrors"];
                myAggregatenetworkinterfaceerrorChartOptions.series[2].data = response["networkInterface"]["aggregatenetworkinterfaceerror"]["theNumberOfPacketOutputErrors"];
                myAggregatenetworkinterfaceerrorChartOptions.xAxis.data = response["networkInterface"]["aggregatenetworkinterfaceerror"]["time"];
                myAggregatenetworkinterfaceerrorChart.hideLoading();
                myAggregatenetworkinterfaceerrorChart.setOption(myAggregatenetworkinterfaceerrorChartOptions);
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isnetworkInterfaceLoading = false;
        });
    }
    $scope.initnetworkInterfaceDatas = function () {
        // 更新 聚焦每秒磁盘操作数
        myAggregatenetworkinterfaceiorateChart = echarts.init(document.getElementById("myAggregatenetworkinterfaceiorateChartID"), bluetheme);
        var myAggregatenetworkinterfaceiorateChartOptions = myAggregatenetworkinterfaceiorateChart.getOption();
        myAggregatenetworkinterfaceiorateChartOptions = myAggregatenetworkinterfaceiorateChartOption;
        myAggregatenetworkinterfaceiorateChartOptions.series[0].data = [];
        myAggregatenetworkinterfaceiorateChartOptions.series[1].data = [];
        myAggregatenetworkinterfaceiorateChartOptions.xAxis.data = [];
        myAggregatenetworkinterfaceiorateChart.showLoading({
            text: "loading..."
        });
        myAggregatenetworkinterfaceiorateChart.setOption(myAggregatenetworkinterfaceiorateChartOptions);

        // 更新 聚焦磁盘I/O使用情况
        myAggregatenetworkinterfaceerrorChart = echarts.init(document.getElementById("myAggregatenetworkinterfaceerrorChartID"), bluetheme);
        var myAggregatenetworkinterfaceerrorChartOptions = myAggregatenetworkinterfaceerrorChart.getOption();
        myAggregatenetworkinterfaceerrorChartOptions = myAggregatenetworkinterfaceerrorChartOption;
        myAggregatenetworkinterfaceerrorChartOptions.series[0].data = [];
        myAggregatenetworkinterfaceerrorChartOptions.series[1].data = [];
        myAggregatenetworkinterfaceerrorChartOptions.series[2].data = [];
        myAggregatenetworkinterfaceerrorChartOptions.xAxis.data = [];
        myAggregatenetworkinterfaceerrorChart.showLoading({
            text: "loading..."
        });
        myAggregatenetworkinterfaceerrorChart.setOption(myAggregatenetworkinterfaceerrorChartOptions);
        echarts.connect([myAggregatenetworkinterfaceiorateChart, myAggregatenetworkinterfaceerrorChart]);
    }
    // 请求 processInformation 页面数据
    $scope.processInformation = [];
    $scope.isprocessInformationLoading = false;
    $scope.updateprocessInformationDatas = function (to) {
        if(to == null) {
            if (getMockFlag()) {
                $scope.serverInfoprocessInformationUrl = serverMockdataSourceURL() + "/api/processInformation?hostid=" + $scope.hostid + "&from=" + $scope.from + "&to=" + $scope.to;
            }
            else {
                $scope.serverInfoprocessInformationUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/processInformation" + ".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
            }
        }
        else {
            if (getMockFlag()) {
                $scope.serverInfoprocessInformationUrl = serverMockdataSourceURL() + "/api/processInformation?hostid=" + $scope.hostid + "&to=" + to;
            }
            else {
                $scope.serverInfoprocessInformationUrl = dataSourceURL() + "/hosts/host/" + $scope.hostid + "/processInformation" + ".pinpoint?to=" + to;
            }
        }
        console.log("serverInfoprocessInformationUrl:" + $scope.serverInfoprocessInformationUrl);
        $scope.isprocessInformationLoading = true;
        $scope.processInformation = [];
        $http.get($scope.serverInfoprocessInformationUrl)
            .success(function (response) {
                console.log("---updateprocessInformationDatas---");
                console.log(response["processInformation"]);
                console.log("---updateprocessInformationDatas---");
                $scope.processInformation = response["processInformation"];
                $scope.isprocessInformationLoading = false;
            }).error(function (data) {
            console.error("ajaxError:\n" + data.error + "\n" + data.message);
            $scope.isprocessInformationLoading = false;
        });
    }

    //更新方法
    $scope.replaceModel = function (start, end) {
        $scope.from = start;
        $scope.to = end;
        var _activeTabName = $scope.activeTabName;
        console.log(_activeTabName);
        if ($scope.activeTabName == "Overview") {
            $scope.updateoverViewDatas();
        }
        else if (_activeTabName == "Aggregate CPU Usage") {
            $scope.updateaggregateCPUUsageDatas();
        }
        else if (_activeTabName == "Memory Usage") {
            $scope.updatememoryUsageDatas();
        }
        else if (_activeTabName == "File System") {
            $scope.updatefileSystemDatas();
        }
        else if (_activeTabName == "Disk") {
            $scope.updatediskDatas();
        }
        else if (_activeTabName == "Network Interface") {
            $scope.updatenetworkInterfaceDatas();
        }
        else if (_activeTabName == "Process Information") {
            $scope.updateprocessInformationDatas(null);
        }
    }

    $scope.replaceModel($scope.from, $scope.to);

    $scope.toLowCase = function (str) {
        var s = str[0] + str.substring(1, str.length).toLowerCase();
        return s
    };


    $scope.isHealthColor = function (v) {
        return 'black';
    };

    function QueryString(item) {
        console.log(item.toString() + " : ");
        console.log( $location.absUrl());
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }

    function checkToStr(str) {
        var loc = str.indexOf('#');
        if (loc == -1) {
            return str;
        } else {
            return str.substring(0, loc);
        }
    }
});

// overView 页面数据
var myCpuChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 0,
        itemGap: 20,
        data: ['%busy', '%idle']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['', '', '', '', '', '', '', '']

    },
    yAxis: {
        type: 'value',
        name: '%',
        max: 100,
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: '%busy',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: '%idle',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myCpuChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myCpuChart = echarts.init(document.getElementById("myCpuChartID"), bluetheme);
        //     myCpuChart.showLoading({
        //         text: "loading..."
        //     });
        //     myCpuChart.setOption(myCpuChartOption);
        //     myCpuChart.hideLoading();
        // }
    };
});

var mySmemoryChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 10,
        itemWidth: 15,
        data: ['%used', '%available']
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            data: ['swap', 'virtual', 'physical']
        }
    ],
    yAxis: [
        {
            type: 'value',
            max: 100,
            name: '%',
            nameLocation: 'end',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '15'
        }
    ],
    series: [
        {
            name: '%used',
            type: 'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#734098',
                    barBorderRadius: 2,
                    label: {
                        show: true, position: 'insideTop'
                    }
                }
            },
            data: [0, 0, 0]
        },
        {
            name: '%available',
            type: 'bar',
            stack: 'sum',
            barWidth: '35%',
            itemStyle: {
                normal: {
                    color: '#FF7832',
                    barBorderRadius: 2,
                }
            },
            data: [0, 0, 0]
        }
    ]
};
serverInfoApp.directive('mySmemoryChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     mySmemoryChart = echarts.init(document.getElementById("mySmemoryChartID"), bluetheme);
        //     mySmemoryChart.showLoading({
        //         text: "loading..."
        //     });
        //     mySmemoryChart.setOption(mySmemoryChartOption);
        //     mySmemoryChart.hideLoading();
        // }
    };
});

var myTopfivefileststemOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 10,
        itemWidth: 15,
        data: ['%used', '%available']
    },
    calculable: true,
    xAxis: [
        {
            type: 'value',
            max: '100',
        }
    ],
    yAxis: [
        {
            type: 'category',
            data: ['', '', '', '', ''],
            name: 'mount point',
            axisTick: {
                interval: 0,

            },
            axisLabel: {
                rotate: 30
            },
            nameLocation: 'end',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '15'
        }
    ],
    series: [
        {
            name: '%used',
            type: 'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#734098',
                    barBorderRadius: 2,
                    label: {
                        show: true, position: 'insideTop'
                    }
                }
            },
            data: [0, 0, 0, 0, 0]
        },
        {
            name: '%available',
            type: 'bar',
            stack: 'sum',
            barWidth: '65%',
            itemStyle: {
                normal: {
                    color: '#FF7832',
                    barBorderRadius: 2,
                }
            },
            data: [0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myTopfivefileststemChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myTopfivefileststemChart = echarts.init(document.getElementById("myTopfivefileststemID"), bluetheme);
        //     myTopfivefileststemChart.showLoading({
        //         text: "loading..."
        //     });
        //     myTopfivefileststemChart.setOption(myTopfivefileststemOption);
        //     myTopfivefileststemChart.hideLoading();
        // }
    };
});

var myTopfivediskOption = {
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'value',
            name: 'Blk/s',
            nameLocation: 'middle',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '25'
        }
    ],
    yAxis: [
        {
            type: 'category',
            data: ['', '', '', '', ''],
            name: 'disk',
            axisTick: {
                interval: 0,
            },
            axisLabel: {
                rotate: 30
            },
            nameLocation: 'end',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '15'
        }
    ],
    series: [
        {
            name: 'Blk/s',
            type: 'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#734098',
                    barBorderRadius: 2,
                    label: {
                        show: true, position: 'insideTop'
                    }
                }
            },
            data: [0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myTopfivediskChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myTopfivediskChart = echarts.init(document.getElementById("myTopfivediskID"), bluetheme);
        //     myTopfivediskChart.showLoading({
        //         text: "loading..."
        //     });
        //     myTopfivediskChart.setOption(myTopfivediskOption);
        //     myTopfivediskChart.hideLoading();
        // }
    };
});

var myToptennetworkinterfaceOption = {
    tooltip: {
        trigger: 'axis'
    },
    calculable: true,
    xAxis: [
        {
            type: 'value',
            boundaryGap: [0, 0.1],
            name: 'packets/s',
            nameLocation: 'middle',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '25'
        }
    ],
    yAxis: [
        {
            type: 'category',
            data: ['', '', '', '', '', '', '', '', '', ''],
            name: 'NIC',
            axisTick: {
                interval: 0,
            },
            axisLabel: {
                rotate: 30
            },
            nameLocation: 'end',
            nameTextStyle: {
                fontStyle: 'italic',
                fontWeight: 'bolder',
                fontSize: '16'
            },
            nameGap: '15'
        }
    ],
    series: [
        {
            name: 'packets/s',
            type: 'bar',
            stack: 'sum',
            itemStyle: {
                normal: {
                    color: '#734098',
                    barBorderRadius: 2
                }
            },
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myToptennetworkinterfaceChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myToptennetworkinterfaceChart = echarts.init(document.getElementById("myToptennetworkinterfaceID"), bluetheme);
        //     myToptennetworkinterfaceChart.showLoading({
        //         text: "loading..."
        //     });
        //     myToptennetworkinterfaceChart.setOption(myToptennetworkinterfaceOption);
        //     myToptennetworkinterfaceChart.hideLoading();
        // }
    };
});
// overView 页面数据

// disk 页面数据
var myDiskoperationsChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 0,
        itemGap: 20,
        data: ['Blk_read/s', 'Blk_wrtn/s']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '']
    },
    yAxis: {
        type: 'value',
        name: 'Blk/s',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'Blk_read/s',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Blk_wrtn/s',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myDiskoperationsChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myDiskoperationsChart = echarts.init(document.getElementById("myDiskoperationsChartID"), bluetheme);
        //     myDiskoperationsChart.showLoading({
        //         text: "loading..."
        //     });
        //     myDiskoperationsChart.setOption(myDiskoperationsChartOption);
        //     myDiskoperationsChart.hideLoading();
        // }
    };
});

var myDiskusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '', '']

    },
    yAxis: {
        type: 'value',
        name: 'tps',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'tps',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myDiskusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myDiskusageChart = echarts.init(document.getElementById("myDiskusageChartID"), bluetheme);
        //     myDiskusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myDiskusageChart.setOption(myDiskusageChartOption);
        //     myDiskusageChart.hideLoading();
        // }
    };
});
// disk 页面数据

// aggregateCPUUsage 页面数据
var myTopfivecpuusageChartOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['system%', 'user%', 'iowait%', 'idle%'],
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 0,
        itemWidth: 20,

    },
    xAxis: {
        type: 'category',
        name: 'CPU id',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        data: ['', '', '', '', '']

    },
    yAxis: {
        type: 'value',
        max: 100,
        name: '%',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'system%',
            type: 'bar',
            data: [0, 0, 0, 0, 0]
        },
        {
            name: 'user%',
            type: 'bar',
            data: [0, 0, 0, 0, 0]
        },
        {
            name: 'iowait%',
            type: 'bar',
            data: [0, 0, 0, 0, 0]
        },
        {
            name: 'idle%',
            type: 'bar',
            data: [0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myTopfivecpuusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myTopfivecpuusageChart = echarts.init(document.getElementById("myTopfivecpuusageChartID"), bluetheme);
        //     myTopfivecpuusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myTopfivecpuusageChart.setOption(myTopfivecpuusageChartOption);
        //     myTopfivecpuusageChart.hideLoading();
        // }
    };
});

var myAggregatecpuusagedetailsChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['user%', 'nice%', 'system%', 'iowait%', 'user/system%']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['', '', '', '', '', '', '']
    },
    yAxis: {
        type: 'value',
        name: '%',
        // max: 100,
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'user%',
            type: 'line',
            data: [0, 0,0, 0, 0, 0, 0]
        },
        {
            name: 'nice%',
            type: 'line',
            data: [0, 0,0, 0, 0, 0, 0]
        },
        {
            name: 'system%',
            type: 'line',
            data: [0, 0,0, 0, 0, 0, 0]
        },
        {
            name: 'iowait%',
            type: 'line',
            data: [0, 0,0, 0, 0, 0, 0]
        },
        {
            name: 'user/system%',
            type: 'line',
            data: [0, 0,0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myAggregatecpuusagedetailsChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myAggregatecpuusagedetailsChart = echarts.init(document.getElementById("myAggregatecpuusagedetailsChartID"), bluetheme);
        //     myAggregatecpuusagedetailsChart.showLoading({
        //         text: "loading..."
        //     });
        //     myAggregatecpuusagedetailsChart.setOption(myAggregatecpuusagedetailsChartOption);
        //     myAggregatecpuusagedetailsChart.hideLoading();
        // }
    };
});
// aggregateCPUUsage 页面数据

// memoryUsage 页面数据
var mySwapmemoryusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['used', 'available', 'total']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'mb',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'used',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'available',
            type: 'line',
            data: [8000, 8000, 8000, 8000, 8000, 8000, 8000]
        },
        {
            name: 'total',
            type: 'line',
            stack: '总量',
            data: [8000, 8000, 8000, 8000, 8000, 8000, 8000]
        }
    ]
};
serverInfoApp.directive('mySwapmemoryusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     mySwapmemoryusageChart = echarts.init(document.getElementById("mySwapmemoryusageChartID"), bluetheme);
        //     mySwapmemoryusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     mySwapmemoryusageChart.setOption(mySwapmemoryusageChartOption);
        //     mySwapmemoryusageChart.hideLoading();
        // }
    };
});

var myPageschedulingChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['每秒页面调进数', '每秒页面调出数']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01', '2017-2-7 9:02', '2017-2-7 9:03', '2017-2-79:04', '2017-2-7 9:05', '2017-2-7 9:06', '2017-2-7 9:07', '2017-2-7 9:08']
    },
    yAxis: {
        type: 'value',
        name: '页面数',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: '每秒页面调进数',
            type: 'line',
            data: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]
        },
        {
            name: '每秒页面调出数',
            type: 'line',
            data: [2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000]
        }
    ]
};
serverInfoApp.directive('myPageschedulingChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myPageschedulingChart = echarts.init(document.getElementById("myPageschedulingChartID"), bluetheme);
        //     myPageschedulingChart.showLoading({
        //         text: "loading..."
        //     });
        //     myPageschedulingChart.setOption(myPageschedulingChartOption);
        //     myPageschedulingChart.hideLoading();
        // }
    };
});

var myVirtualmemoryusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['used', 'available', 'total']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'mb',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'used',
            type: 'line',
            data: [16000, 16000, 16000, 16000, 16000, 16000, 16000]
        },
        {
            name: 'available',
            type: 'line',
            data: [9000, 9000, 9000, 9000, 9000, 9000, 9000]
        },
        {
            name: 'total',
            type: 'line',
            stack: '总量',
            data: [25000, 25000, 25000, 25000, 25000, 25000, 25000]
        }
    ]
};
serverInfoApp.directive('myVirtualmemoryusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myVirtualmemoryusageChart = echarts.init(document.getElementById("myVirtualmemoryusageChartID"), bluetheme);
        //     myVirtualmemoryusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myVirtualmemoryusageChart.setOption(myVirtualmemoryusageChartOption);
        //     myVirtualmemoryusageChart.hideLoading();
        // }
    };
});

var myRealmemoryusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,  // data: ['available', 'usedNetwork', 'used', 'total']

        data: ['available',  'used', 'total']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'mb',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'available',
            type: 'line',
            data: [4000, 4000, 4000, 4000, 4000, 4000, 4000]
        },
        // {
        //     name: 'usedNetwork',
        //     type: 'line',
        //     data: [4000, 4000, 4000, 4000, 4000, 4000, 4000]
        // },
        {
            name: 'used',
            type: 'line',
            data: [4000, 4000, 4000, 4000, 4000, 4000, 4000]
        },
        {
            name: 'total',
            type: 'line',
            stack: '总量',
            data: [12000, 12000, 12000, 12000, 12000, 12000, 12000]
        }
    ]
};
serverInfoApp.directive('myRealmemoryusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myRealmemoryusageChart = echarts.init(document.getElementById("myRealmemoryusageChartID"), bluetheme);
        //     myRealmemoryusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myRealmemoryusageChart.setOption(myRealmemoryusageChartOption);
        //     myRealmemoryusageChart.hideLoading();
        // }
    };
});
// memoryUsage 页面数据

// networkInterface 页面数据
var myAggregatenetworkinterfaceiorateChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 0,
        itemGap: 20,
        data: ['receive', 'transmit']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'kb/s',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'receive',
            type: 'line',
            stack: '总量',
            data: [0.8, 0.9, 1.1, 1.2, 0.5, 0.8, 0.9]
        },
        {
            name: 'transmit',
            type: 'line',
            stack: '总量',
            data: [1.5, 2.5, 1.6, 1.5, 2.5, 1.8, 1.6]
        }
    ]
};
serverInfoApp.directive('myAggregatenetworkinterfaceiorateChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myAggregatenetworkinterfaceiorateChart = echarts.init(document.getElementById("myAggregatenetworkinterfaceiorateChartID"), bluetheme);
        //     myAggregatenetworkinterfaceiorateChart.showLoading({
        //         text: "loading..."
        //     });
        //     myAggregatenetworkinterfaceiorateChart.setOption(myAggregatenetworkinterfaceiorateChartOption);
        //     myAggregatenetworkinterfaceiorateChart.hideLoading();
        // }
    };
});

var myAggregatenetworkinterfaceerrorChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        padding: 0,
        itemGap: 20,
        data: ['colls', 'errs_Receive', 'errs_Transmit']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'packets',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'colls',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'errs_Receive',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'errs_Transmit',
            type: 'line',
            stack: '总量',
            data: [0, 0, 0, 0, 0, 0, 0]
        }
    ]
};
serverInfoApp.directive('myAggregatenetworkinterfaceerrorChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myAggregatenetworkinterfaceerrorChart = echarts.init(document.getElementById("myAggregatenetworkinterfaceerrorChartID"), bluetheme);
        //     myAggregatenetworkinterfaceerrorChart.showLoading({
        //         text: "loading..."
        //     });
        //     myAggregatenetworkinterfaceerrorChart.setOption(myAggregatenetworkinterfaceerrorChartOption);
        //     myAggregatenetworkinterfaceerrorChart.hideLoading();
        // }
    };
});
// networkInterface 页面数据

// fileSystem 页面数据
var myAggregatefilesystemusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['%used', '%available']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: '%',
        max: 100,
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: '%used',
            type: 'line',
            stack: '总量',
            data: [24, 24, 24, 24, 24, 24, 24]
        },
        {
            name: '%available',
            type: 'line',
            data: [76, 76, 76, 76, 76, 76, 76]
        }
    ]
};
serverInfoApp.directive('myAggregatefilesystemusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myAggregatefilesystemusageChart = echarts.init(document.getElementById("myAggregatefilesystemusageChartID"), bluetheme);
        //     myAggregatefilesystemusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myAggregatefilesystemusageChart.setOption(myAggregatefilesystemusageChartOption);
        //     myAggregatefilesystemusageChart.hideLoading();
        // }
    };
});

var myAggregatefilesystemspaceusageChartOption = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        orient: 'horizontal',
        x: 'center', // 'center' | 'left' | {number},
        y: 'bottom', //
        padding: 0,    // [5, 10, 15, 20]
        itemGap: 20,
        data: ['size', 'Used']
    },
    xAxis: {
        type: 'category',
        name: 'time',
        nameLocation: 'middle',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '25',
        boundaryGap: false,
        data: ['2017-2-7 8:55', '2017-2-7 8:56', '2017-2-7 8:57', '2017-2-7 8:58', '2017-2-7 8:59', '2017-2-7 9:00', '2017-2-7 9:01']
    },
    yAxis: {
        type: 'value',
        name: 'MB',
        nameLocation: 'end',
        nameTextStyle: {
            fontStyle: 'italic',
            fontWeight: 'bolder',
            fontSize: '16'
        },
        nameGap: '15'
    },
    series: [
        {
            name: 'size',
            type: 'line',
            stack: '总量',
            data: [160000, 160000, 160000, 160000, 160000, 160000, 160000]
        },
        {
            name: 'Used',
            type: 'line',
            stack: '总量',
            data: [650000, 650000, 650000, 650000, 650000, 650000, 650000]
        }
    ]
};
serverInfoApp.directive('myAggregatefilesystemspaceusageChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        // link: function () {
        //     myAggregatefilesystemspaceusageChart = echarts.init(document.getElementById("myAggregatefilesystemspaceusageChartID"), bluetheme);
        //     myAggregatefilesystemspaceusageChart.showLoading({
        //         text: "loading..."
        //     });
        //     myAggregatefilesystemspaceusageChart.setOption(myAggregatefilesystemspaceusageChartOption);
        //     myAggregatefilesystemspaceusageChart.hideLoading();
        // }
    };
});
// fileSystem 页面数据