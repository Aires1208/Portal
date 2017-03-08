$(function () {
    //goInit
    goInit();


    $("#heapLineChart").css("height","5px");
    $("#permLineChart").css("height","5px");
    $("#jvmLineChart").css("height","5px");
    $("#tranxLineChart").css("height","5px");

    $('#myModal').on('show.bs.modal', function () {
        $("#heapLineChart").css("height","350px");
        $("#permLineChart").css("height","350px");
        $("#jvmLineChart").css("height","350px");
        $("#tranxLineChart").css("height","260px");

        $('#heapLine').prepend($('#heapLineChart'));
        $("#heapLineChart").css("visibility", "visible");

        $('#permLine').prepend($('#permLineChart'));
        $("#permLineChart").css("visibility", "visible");

        $('#jvmLine').prepend($('#jvmLineChart'));
        $("#jvmLineChart").css("visibility", "visible");

        $('#tranxLine').prepend($('#tranxLineChart'));
        $("#tranxLineChart").css("visibility", "visible");

        //update chart and topo
        var appElement = document.querySelector('[ng-controller=nodeCtrl]');
        var $scope = angular.element(appElement).scope();
        $scope.getVMModel();
    })


    heapChartAtResource.connect([jvmChartAtResource, permChartAtResource,tranxChartAtResource]);
    jvmChartAtResource.connect([heapChartAtResource, permChartAtResource,tranxChartAtResource]);
    permChartAtResource.connect([jvmChartAtResource,heapChartAtResource ,tranxChartAtResource]);
    tranxChartAtResource.connect([jvmChartAtResource, permChartAtResource,heapChartAtResource]);



    loadChartAtResource.connect([respondChartAtResource, errorChartAtResource]);
    respondChartAtResource.connect([loadChartAtResource, errorChartAtResource]);
    errorChartAtResource.connect([respondChartAtResource,loadChartAtResource ]);
});


function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=nodeCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
}

function setJvmParam(ver,gctype,startopt){
    $("#jvmver").val(ver);
    $("#gctype").val(gctype);
    $("#jvmstartopt").val(startopt);
}


function goInit() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates, avoid $ due to jQuery

    myDiagram = $(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
        {
            initialContentAlignment: go.Spot.Center,  // center the content
            "undoManager.isEnabled": true,  // enable undo & redo
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            initialAutoScale: go.Diagram.Uniform,  // an initial automatic zoom-to-fit
            //contentAlignment: go.Spot.Center,  // align document to the center of the viewport
            //layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
            //    {defaultSpringLength: 30, defaultElectricalCharge: 100}),
            // do an extra layout at the end of a move
            layout: $(
                go.LayeredDigraphLayout,
                { // rdirection: 90,
                    isOngoing: false,
                    layerSpacing: 100,
                    columnSpacing: 30,
                    setsPortSpots: false
                    // packOption : 7 // sum of 1(PackExpand), 2(PackStraighten), 4(PackMedian)
                    // direction : 0,
                    // cycleRemoveOption : go.LayeredDigraphLayout.CycleDepthFirst,
                    // layeringOption : go.LayeredDigraphLayout.LayerOptimalLinkLength,
                    // initializeOption : go.LayeredDigraphLayout.InitDepthFirstOut,
                    // aggressiveOption : go.LayeredDigraphLayout.AggressiveLess,
                    // packOption : 7,
                    // setsPortSpots : true
                }
            ),
            "SelectionMoved": function (e) {
                e.diagram.layout.invalidateLayout();
            }
        });

    // define a simple Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Spot",  // the whole node panel
            // define the node's outer shape, which will surround the TextBlock
            {
                doubleClick: nodeDoubleClick,  // this function is defined below
                toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "lightyellow" }),
                        $(go.TextBlock, "double-click\nfor documentation",
                            { margin: 5 })
                    )
            },
            $(go.Panel, "Auto",
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {fill: "#79DD1B", stroke: "white"},new go.Binding("fill", "",convertColor)),
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {margin: 5, fill: "white", stroke: "white"}),
                $(go.TextBlock,
                    {
                        row: 0,
                        column: 0,
                        columnSpan: 15,
                        font: "bold 12pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        maxSize: new go.Size(100, NaN)
                    },
                    new go.Binding("text", "name")),
                $(go.TextBlock,
                    {
                        row: 1,
                        column: 0,
                        font: "bold 10pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        maxSize: new go.Size(100, NaN)
                    },
                    new go.Binding("text", "count", convertText))
            ),
            //metrix
            $(go.Panel, "Auto",
                {
                    alignment: go.Spot.Top
                },
                $(go.TextBlock,
                    {
                        margin: 5,
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#555555",
                        textAlign: "center",
                        isMultiline: true,
                        maxSize: new go.Size(80, NaN)
                    },
                    new go.Binding("text", "metrics",convertTextIn3Lines))
            ),
            //type
            $(go.Panel, "Auto",
                {
                    alignment: go.Spot.Right
                },
                $(go.Shape, "Rectangle",
                    {
                        margin: 0,
                        fill: "#288CEB",
                        stroke: "white",
                        maxSize: new go.Size(50, 50),
                        height: 50,
                        width: 50
                    }),
                $(go.TextBlock,
                    {
                        margin: 5,
                        font: "bold 10pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        stroke: "white",
                        isMultiline: true,
                        maxSize: new go.Size(50, NaN)
                    },
                    new go.Binding("text", "type"))
            )
        );

    // define each Node's appearance
    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            /*$(go.Shape,  // the link shape
                {stroke: "black"}),*/
            $(go.Shape,
                new go.Binding("stroke", "respondTime",lineColor)),
            { // this tooltip Adornment is shared by all links
                toolTip: $(go.Adornment, "Auto",
                    $(go.Shape, {fill: "#FFFFCC"}),
                    $(go.TextBlock, {margin: 4},  // the tooltip shows the result of calling linkInfo(data)
                        new go.Binding("text", "", linkInfoTooltip))
                )
            },
            $(go.Shape,  // the arrowhead
                {toArrow: "standard", stroke: null}),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial", {
                            0: "rgb(240, 240, 240)",
                            0.3: "rgb(240, 240, 240)",
                            1: "rgba(240, 240, 240, 0)"
                        }),
                        stroke: null
                    }),
                $(go.TextBlock,  // the label text
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#555555",
                        margin: 4
                    },
                    new go.Binding("text", "respondTime",convertTextInLines))
            )
        );

    // Overview
    myOverview = $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
        {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan
    myOverview.box.elt(0).stroke = "#458EF9";
}

var nodeApp = angular.module('nodeApp', []);
nodeApp.controller('nodeCtrl', function ($scope, $http,$location) {
    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();

    $scope.appId = QueryString('appid');
    $scope.serviceId = QueryString('serviceid');
    $scope.instanceId = QueryString('instanceid');
    $scope.from = QueryString('from');
    selectedStartTime = $scope.from;
    $scope.to = QueryString('to');
    selectedEndTime = $scope.to;

    var rg =  getCookie("ranges");
    setDatePicker($scope.from,$scope.to,rg);

    $scope.model = new go.GraphLinksModel(
        [
            {key: 5, text: "Node5"}
        ],
        [
            {from: 1, to: 2, text: "2ms"}
        ]);

    $scope.model.selectedNodeData = null;
    $scope.selectedTimeRange = null;


    $scope.getVMModel = function () {
        //$scope.vmUrl="../mockjson/vm.json";
        // /dashBoard/applications/{application}/services/{service}/instances/{instance}/agentids/{agentid}
        $scope.vmUrl = dataSourceURL()+"/dashBoard/applications/"+ $scope.appId +"/services/"+ $scope.serviceId +"/instances/" + $scope.instanceId +"/agentids/"+ $scope.agentId +".pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        console.log("vmUrl = " + $scope.vmUrl);
        $http.get($scope.vmUrl)
            .success(function (response) {
                var heapOptions = heapChartAtResource.getOption();
                heapOptions.series[0].data = response["heapInfo"]["max"];
                heapOptions.series[1].data = response["heapInfo"]["used"];
                heapOptions.series[2].data = response["heapInfo"]["fgc"];
                heapOptions.xAxis[0].data = response["heapInfo"]["time"];
                heapOptions.title.subtext = response["heapInfo"]["info"];
                heapChartAtResource.hideLoading();
                heapChartAtResource.setOption(heapOptions);

                var permOptions = permChartAtResource.getOption();
                permOptions.series[0].data = response["permGen"]["max"];
                permOptions.series[1].data = response["permGen"]["used"];
                permOptions.series[2].data = response["permGen"]["fgc"];
                permOptions.xAxis[0].data = response["permGen"]["time"];
                permOptions.title.subtext = response["permGen"]["info"];
                permChartAtResource.hideLoading();
                permChartAtResource.setOption(permOptions);

                var jvmOptions = jvmChartAtResource.getOption();
                jvmOptions.series[0].data = response["jvmSys"]["jvm"];
                jvmOptions.series[1].data = response["jvmSys"]["sys"];
                jvmOptions.xAxis[0].data = response["jvmSys"]["time"];
                jvmOptions.title.subtext = response["jvmSys"]["info"];
                jvmChartAtResource.hideLoading();
                jvmChartAtResource.setOption(jvmOptions);

                var tranxOptions = tranxChartAtResource.getOption();
                tranxOptions.series[0].data = response["tps"]["sc"];
                tranxOptions.series[1].data = response["tps"]["sn"];
                tranxOptions.series[2].data = response["tps"]["uc"];
                tranxOptions.series[3].data = response["tps"]["un"];
                tranxOptions.xAxis[0].data = response["tps"]["time"];
                tranxOptions.title.subtext = 'S.C=Sampled Continuation   S.N=Sampled New   U.C=Unsampled Continuation   U.N=Unsampled New';
                tranxChartAtResource.hideLoading();
                tranxChartAtResource.setOption(tranxOptions);

                //tab 2
                setJvmParam(response["jvmVersion"],response["gcTypeName"],response["vmargs"]);

            }).error(function(data) {
                console.log("data ===== "+data);
                loadingBarFadeOut();
            });
    }



    $scope.respondLineData = [20, 111, 60, 234, 120, 90, 20];

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

    //更新方法
    $scope.replaceModel = function (start,end) {
        loadingBarReset();

        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );

        //$http.get("../mockjson/app.json")
        //$http.get("http://10.63.212.141:1337/10.63.212.143:28080/applicationDetail.pinpoint?application=%22test%22&from=11111111&to=2222")
        //$scope.appUrl="http://10.63.212.141:1337/10.63.212.143:28080/serviceDetail.pinpoint?service="+$scope.appName+"&from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        $scope.appUrl = dataSourceURL() + "/dashBoard/applications/" + $scope.appId + "/services/" +$scope.serviceId+"/instances/"+ $scope.instanceId +".pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        console.log("instanceUrl = " + $scope.appUrl );
        $http.get($scope.appUrl)
            .success(function (response) {
                loadingBarFade();
                console.log("----------");
                console.log(response);
                $scope.records = response.summary;
                $scope.appName = response.summary.appName;

                $scope.healthRuleViolations = response.summary.healthRuleViolations;
                $scope.nodeHealth = response.summary.nodeHealth;
                $scope.transactionHealth = response.summary.transactionHealth;
                $scope.calls = response.summary.calls;
                $scope.callsPerMin = response.summary.callsPerMin;
                $scope.responseTime = response.summary.responseTime;
                $scope.errorsPercent = response.summary.errorsPercent;
                $scope.errors = response.summary.errors;
                $scope.errorsPerMin = response.summary.errorsPerMin;

                $scope.serverIp = response.summary.serverIp;
                $scope.runIn = response.summary.runIn;
                $scope.hostId = response.summary.hostId;

                $scope.pid = response.summary.pid;
                $scope.serviceType = response.summary.serviceType;
                $scope.agentId = response.summary.agentId;
                $scope.agentVersion = response.summary.agentVersion;
                $scope.startTime = response.summary.startTime;
                $scope.status = response.summary.status;

                myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);
                //console.log("records ===== "+$scope.records);

                var loadOptions=loadChartAtResource.getOption();
                loadOptions.series[0].data=response["loadInfo"]["data"];
                loadOptions.xAxis[0].data=response["loadInfo"]["time"];
                loadOptions.title.subtext=response["loadInfo"]["info"];
                loadChartAtResource.hideLoading();
                loadChartAtResource.setOption(loadOptions);

                var respondOptions=respondChartAtResource.getOption();
                respondOptions.series[0].data=response["respondInfo"]["data"];
                respondOptions.xAxis[0].data=response["respondInfo"]["time"];
                respondOptions.title.subtext=response["respondInfo"]["info"];
                respondChartAtResource.hideLoading();
                respondChartAtResource.setOption(respondOptions);

                var errorOptions=errorChartAtResource.getOption();
                errorOptions.series[0].data=response["errorInfo"]["data"];
                errorOptions.xAxis[0].data=response["errorInfo"]["time"];
                errorOptions.title.subtext=response["errorInfo"]["info"];
                errorChartAtResource.hideLoading();
                errorChartAtResource.setOption(errorOptions);
            }).error(function(data) {
                console.log("data ===== "+data);
                loadingBarFadeOut();
            });
    }


    $scope.replaceModel($scope.from,$scope.to);

    function QueryString(item){
        console.log(item.toString() +" : ");
        var sValue=$location.absUrl().match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)","i"));
        console.log(sValue?sValue[1]:sValue);
        return sValue?sValue[1]:sValue
    }
});

/*----- modal -----*/
/*----- chart -----*/
nodeApp.directive('loadChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            loadOption = {
                title: {
                    text: 'Calls',
                    subtext: 'loading'
                },
                tooltip: {
                    trigger: 'axis'
                },
                animation: false,
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: false,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [1320, 1132, 601, 234, 120, 90, 20]
                    }
                ]
            };

            loadChartAtResource = echarts.init(document.getElementById("loadLineChart"), bluetheme);
            loadChartAtResource.showLoading({
                text: "loading..."
            });
            loadChartAtResource.setOption(loadOption);
            loadChartAtResource.hideLoading();
        }
    };
});

nodeApp.directive('respondChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ($scope) {
            respondOption = {
                title: {
                    text: 'Response Time',
                    subtext: 'loading'
                },
                tooltip: {
                    trigger: 'axis'
                },
                animation: false,
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: false,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: $scope.respondLineData,
                    }
                ]
            };

            respondChartAtResource = echarts.init(document.getElementById("respondLineChart"), bluetheme);
            respondChartAtResource.showLoading({
                text: "loading..."
            });
            respondChartAtResource.setOption(respondOption);
            respondChartAtResource.hideLoading();
        }
    };
});


nodeApp.directive('errorChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ($scope) {
            errorOption = {
                title: {
                    text: 'Errors',
                    subtext: 'loading'
                },
                tooltip: {
                    trigger: 'axis'
                },
                animation: false,
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: false,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: $scope.respondLineData,
                    }
                ]
            };

            errorChartAtResource = echarts.init(document.getElementById("errorLineChart"), bluetheme);
            errorChartAtResource.showLoading({
                text: "loading..."
            });
            errorChartAtResource.setOption(errorOption);
            errorChartAtResource.hideLoading();
        }
    };
});


nodeApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});


nodeApp.directive('heapChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            heapOption = {
                legend: {
                    data:['Max','Used','FGC']
                },
                title: {
                    text: 'Heap',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : 100
                },

                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'Memory(bytes)',
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}M'
                        }
                    },
                    {
                        name :'Full GC(ms)',
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name: 'Max',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Used',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'FGC',
                        type: 'bar',
                        barWidth:5,
                        symbol:null,
                        yAxisIndex: 1,
                        data: [0, 100, 0, 0, 0, 0, 0]
                    }
                ]
            };

            heapChartAtResource = echarts.init(document.getElementById("heapLineChart"), bluetheme);
            heapChartAtResource.showLoading({
                text: "loading..."
            });
            heapChartAtResource.setOption(heapOption);
            heapChartAtResource.hideLoading();
        }
    };
});





nodeApp.directive('permChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            permOption = {
                legend: {
                    data:['Max','Used','FGC']
                },
                //color:['green','blue','red'],
                title: {
                    text: 'PermGen',
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
                        data: ['', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'Memory(bytes)',
                        type : 'value',
                        axisLabel : {
                            formatter: '{value}M'
                        }
                    },
                    {
                        name :'Full GC(ms)',
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name: 'Max',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'Used',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'FGC',
                        type: 'bar',
                        symbol:null,
                        barWidth:5,
                        yAxisIndex: 1,
                        data: [0, 100, 0, 0, 0, 0, 0]
                    }
                ]
            };

            permChartAtResource = echarts.init(document.getElementById("permLineChart"), bluetheme);
            permChartAtResource.showLoading({
                text: "loading..."
            });
            permChartAtResource.setOption(permOption);
            permChartAtResource.hideLoading();
        }
    };
});


nodeApp.directive('jvmChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            jvmOption = {
                legend: {
                    data:['JVM','System']
                },
                title: {
                    text: 'JVM/System CPU Usage',
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
                        data: ['', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'CPU Usage(%)',
                        type : 'value'
                    }
                ],
                series: [
                    {
                        name: 'JVM',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'System',
                        type: 'line',
                        smooth: false,
                        symbol:null,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            jvmChartAtResource = echarts.init(document.getElementById("jvmLineChart"), bluetheme);
            jvmChartAtResource.showLoading({
                text: "loading..."
            });
            jvmChartAtResource.setOption(jvmOption);
            jvmChartAtResource.hideLoading();
        }
    };
});


nodeApp.directive('tranxChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            tranxOption = {
                legend: {
                    data:['S.C','S.N','U.C','U.N']
                },
                title: {
                    text: 'Transactions Per Second',
                    subtext: 'S.C=Sampled Continuation   S.N=Sampled New   U.C=Unsampled Continuation   U.N=Unsampled New'
                },
                tooltip: {
                    trigger: 'axis'
                },

                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '']
                    }
                ],
                yAxis: [
                    {
                        name :'TPS',
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'S.C',
                        type: 'line',
                        smooth: false,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'S.N',
                        type: 'line',
                        smooth: false,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'U.C',
                        type: 'line',
                        smooth: false,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name: 'U.N',
                        type: 'line',
                        smooth: false,
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            tranxChartAtResource = echarts.init(document.getElementById("tranxLineChart"), bluetheme);
            tranxChartAtResource.showLoading({
                text: "loading..."
            });
            tranxChartAtResource.setOption(tranxOption);
            tranxChartAtResource.hideLoading();
        }
    };
});

function nodeDoubleClick(event, node) {
    console.log("nodeDoubleClick = "+ node.data.type);
    if(node.data.type.toLowerCase() == 'oracle' || node.data.type.toLowerCase() == 'mysql'){
        window.open("./dbInfo.html?dbid="+node.data.key+"&from="+selectedStartTime+"&to="+selectedEndTime);
    }/*else{
     window.open("./node.html?nodeid="+ node.data.text);
     }*/
}

//function setDatePicker(b,e){
//    $('#reportrange span').html(new Date(parseInt(b)).format('yyyy-MM-dd hh:mm:ss') + ' - ' + new Date(parseInt(e)).format('yyyy-MM-dd hh:mm:ss'));
//}



