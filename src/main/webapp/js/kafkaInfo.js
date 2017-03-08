$(function () {
    //broker modal active
    $('#brokerInfoId').on('shown.bs.modal', function () {
        var appElement = document.querySelector('[ng-controller=kafkaInfoCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.updateBroker();

        $("#brokerload").css("height","350px");

        $('#brokerChartDiv').prepend($('#brokerload'));
        $("#brokerload").css("visibility", "visible");
    });


    //topic modal active
    $('#topicInfoId').on('shown.bs.modal', function () {
        var appElement = document.querySelector('[ng-controller=kafkaInfoCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.updateTopic();
    });

    //consumer modal active
    $('#consumerInfoId').on('shown.bs.modal', function () {
        var appElement = document.querySelector('[ng-controller=kafkaInfoCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.updateConsumer();
    });


    //consumer topic detail modal active
    $('#consumerTopicId').on('shown.bs.modal', function () {
        //update chart and topo
        var appElement = document.querySelector('[ng-controller=kafkaInfoCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.updateConsumerTopic();
    });

    init();
});

function hideDialog(dialog_id){
    $('#' + dialog_id).modal('hide');
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



function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    if (window.goViewSource) goViewSource(); // for the minimal sample, we show the source by default

    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram = $(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
        {
            allowMove: true,
            initialContentAlignment: go.Spot.Center,  // center the content
            "undoManager.isEnabled": true,  // enable undo & redo
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
            "SelectionMoved": function (e) {
                e.diagram.layout.invalidateLayout();
            }
        });

    myDiagram.nodeTemplate =
        $(go.Node, "Spot",  // the whole node panel
            {
                //mouseOver: doMouseOver,
                toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "lightyellow" }),
                        $(go.TextBlock, new go.Binding("text", "host"),
                            { margin: 5 })
                    )
            },
            //center
            $(go.Panel, "Auto",  // the Shape will go around the TextBlock
                $(go.Shape, "Hexagon",
                    {stroke: "rgb(105,210,231)",
                        toolTip: $(go.Adornment, "Auto",
                            $(go.Shape, {fill: "lightyellow"}),
                            $(go.TextBlock, new go.Binding("text", "name"),
                                {margin: 3})
                        )
                    },
                    // Shape.fill is bound to Node.data.color
                    new go.Binding("fill", "status",statusColor)
                ),$(go.TextBlock,
                    {
                        margin: 15,
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#ffffff",
                    },
                    new go.Binding("text", "name"))
            ),
            //metrix
            $(go.Panel, "Auto",
                {
                    alignment: go.Spot.Bottom
                },
                $(go.TextBlock,
                    {
                        margin: 3,
                        font: "8pt helvetica, arial, sans-serif",
                        stroke: "#555555",
                        textAlign: "center",
                        isMultiline: true,
                        maxSize: new go.Size(150, NaN)
                    },
                    new go.Binding("text", "host"))
            )
        );
    myDiagram.model = new go.GraphLinksModel(
        [
        ],
        [
            /*{ from: "Broker1", to: "Broker2" },
            { from: "Broker3", to: "Broker1" }*/
        ]);
    go.Shape.defineArrowheadGeometry("Feather", "m 0,0 l 3,4 -3,4");

}


function statusColor(v) {
    var _color = "rgb(105,210,231)";
    if(v){
        _color = "rgb(105,210,231)";
    }else{
        _color = "pink";
    }
    return _color;
}

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

function toastFail (v)
{
    var priority = 'danger';
    var title    = 'Tip';
    if(v == undefined){
        var message  = 'Server Response Fail! ';
    }else{
        var message  = 'Server Response Fail! <br>'+v;
    }


    $.toaster({ priority : priority, title : title, message : message });
}

function isNotEmpty(obj){
    for (var name in obj){
        return true;
    }
    return false;
}

var kafkaInfoApp = angular.module('kafkaInfoApp', []);
kafkaInfoApp.controller('kafkaInfoCtrl', function ($scope, $http,$location,$interval) {
    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?&]" + item + "=([^&#]+)(&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }

    $scope.zookeeper = QueryString('zookeeper');
    console.log("$scope.zookeeper = " + $scope.zookeeper);
    $scope.name = QueryString('name');


    //getAllData
    $scope.getAllData = function () {
        loadingBarReset();
        //$scope.kafkaInfoUrl = "../mockjson/kafkaInfo.json";
        $scope.kafkaInfoUrl = dataSourceURL()+ "/kafkamonitor/monitorNodeDetail?zookeeper="+$scope.zookeeper + "&name=" + $scope.name;
        console.log("kafkaInfoUrl = " + $scope.kafkaInfoUrl);
        $http.get($scope.kafkaInfoUrl)
            .success(function (response) {
                loadingBarFade();

                //overview
                $scope.overview = response.overview;

                myDiagram.model = new go.GraphLinksModel(response["overview"]["clusters"], []);

                var pcOptions=pcLoadChartAtResource.getOption();
                pcOptions.series[0].data=response["overview"]["msgCount"]["producer"];
                pcOptions.series[1].data=response["overview"]["msgCount"]["consumer"];
                pcOptions.xAxis[0].data=response["overview"]["msgCount"]["times"];
                pcLoadChartAtResource.hideLoading();
                pcLoadChartAtResource.setOption(pcOptions);

                //brokers
                $scope.combinedMetricRecords = response.brokers.combinedMetrics;
                $scope.brokerListRecords = response.brokers.brokerList;

                //topics
                $scope.topicRecords = response.topics;

                //consumers
                $scope.consumerRecords = response.consumers;
            }).error(function (data) {
                loadingBarFadeOut();
                toastFail();
                console.log("http error: " + data);

            });
    };
    $scope.getAllData();

    $scope.isHealthColor = function (v) {
        if (v == true) {
            return '#79DD1B';
        } else {
            return 'red';
        }
    };

    $scope.myFilter = function (item, type) {
        return item.path == type;
    };

    $scope.updateBroker = function () {
        //$scope.kafkaBrokerUrl = "../mockjson/kafkaBroker.json";
        $scope.kafkaBrokerUrl = dataSourceURL()+ "/kafkamonitor/brokerDetail?zookeeper="+$scope.zookeeper+"&brokerid="+$scope.selectedBroker;
        console.log("kafkaBrokerUrl = " + $scope.kafkaBrokerUrl);
        $http.get($scope.kafkaBrokerUrl)
            .success(function (response) {
                //overview
                $scope.brokerSummary = response.summary;

                var options=brokerLoadChartAtResource.getOption();
                options.series[0].data=response["summary"]["msgCount"]["producer"];
                options.series[1].data=response["summary"]["msgCount"]["consumer"];
                options.xAxis[0].data=response["summary"]["msgCount"]["time"];
                brokerLoadChartAtResource.hideLoading();
                brokerLoadChartAtResource.setOption(options);

                //metric
                $scope.brokerMetricRecords = response.metrics;

                //topic
                $scope.brokerTopicsRecords = response.topics;
            }).error(function (data) {
                toastFail();
                console.log("http error: " + data);
            });
    };



    //update Topic
    $scope.updateTopic = function () {
        //$scope.kafkaTopicUrl = "../mockjson/kafkaTopics.json";
        $scope.kafkaTopicUrl = dataSourceURL()+ "/kafkamonitor/kafkatopics?zookeeper="+$scope.zookeeper+"&topicname="+$scope.selectedTopic;
        console.log("kafkaTopicUrl = " + $scope.kafkaTopicUrl);
        $http.get($scope.kafkaTopicUrl)
            .success(function (response) {
                //overview
                $scope.topicSummaryRecords = response.summary;

                //metric
                $scope.topicMetricRecords = response.metrics;

                //partitionInfo
                $scope.topicPartitionInfoRecords = response.partitionInfo;

                //partitionBroker
                $scope.topicPartitionBrokerRecords = response.partitionBroker;
            }).error(function (data) {
                toastFail();
                console.log("http error: " + data);
            });
    };

    $scope.selectConsumer = function (id) {
        $scope.selectedConsumer = id;
    }

    $scope.selectBroker = function (id) {
        $scope.selectedBroker = id;
    }

    $scope.selectTopic = function (id) {
        $scope.selectedTopic = id;
    }

    $scope.selectConsumerTopic = function (id) {
        $scope.selectedConsumerTopic = id;
    }

    //update Consumer
    $scope.updateConsumer = function () {
        //http://10.62.100.78:8085/kafkamonitor/consumerTopicDetail?zookeeper=10.62.100.78%3A2181&name=group1
        //$scope.kafkaConsumerUrl = "../mockjson/kafkaConsumer.json";
        $scope.kafkaConsumerUrl = dataSourceURL()+ "/kafkamonitor/consumerTopicDetail?zookeeper="+$scope.zookeeper+"&name="+$scope.selectedConsumer;
        console.log("kafkaConsumerUrl = " + $scope.kafkaConsumerUrl);
        $http.get($scope.kafkaConsumerUrl)
            .success(function (response) {
                $scope.consumedTopicInfo = response.consumedTopicInfo;
            }).error(function (data) {
                toastFail();
                console.log("http error: " + data);
            });
    };



    //updateConsumerTopic
    $scope.updateConsumerTopic = function () {
        //http://10.62.100.78:8085/kafkamonitor/topicDetail?zookeeper=10.62.100.76%3A2181&groupname=group1&topicname=result_event
        //$scope.kafkaConsumerTopicDetail = "../mockjson/kafkaCunsumerTopicDetail.json";
        $scope.kafkaConsumerTopicDetail = dataSourceURL()+ "/kafkamonitor/topicDetail?zookeeper="+$scope.zookeeper+"&groupname="+$scope.selectedConsumer+"&topicname="+$scope.selectedConsumerTopic;
        console.log("kafkaConsumerTopicDetail = " + $scope.kafkaConsumerTopicDetail);
        $http.get($scope.kafkaConsumerTopicDetail)
            .success(function (response) {
                $scope.topicSummary = response.topicSummary;
            }).error(function (data) {
                hideDialog('consumerTopicId');
                toastFail();
                console.log("updateConsumerTopic error: " + data);
            });
    };

});



/*----- chart -----*/
kafkaInfoApp.directive('allloadChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            loadOption = {
                title: {
                    text: 'Messages count',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['Producer','Consumer']
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
                    }
                ],
                series: [
                    {
                        name: 'Consumer',
                        type: 'line',
                        smooth: true,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Producer',
                        type: 'line',
                        smooth: true,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            pcLoadChartAtResource = echarts.init(document.getElementById("allload"), bluetheme);
            pcLoadChartAtResource.showLoading({
                text: "loading..."
            });
            pcLoadChartAtResource.setOption(loadOption);
            pcLoadChartAtResource.hideLoading();
        }
    };
});


kafkaInfoApp.directive('brokerloadChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            loadOption = {
                title: {
                    text: 'Messages count',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['Producer','Consumer']
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
                    }
                ],
                series: [
                    {
                        name: 'Consumer',
                        type: 'line',
                        smooth: true,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Producer',
                        type: 'line',
                        smooth: true,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            brokerLoadChartAtResource = echarts.init(document.getElementById("brokerload"), bluetheme);
            brokerLoadChartAtResource.showLoading({
                text: "loading..."
            });
            brokerLoadChartAtResource.setOption(loadOption);
            brokerLoadChartAtResource.hideLoading();
        }
    };
});

