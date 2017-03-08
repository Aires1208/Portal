$(function () {
    //goInit
    goInit();

    function cb(start, end) {
        console.log("start = "+start);
        console.log("end = "+end);
        $('#reportrange span').html(start.format('YYYY-MM-DD hh:mm:ss') + ' - ' + end.format('YYYY-MM-DD hh:mm:ss'));


        console.log("start = " + start);
        console.log("end = " + end);
        $('#reportrange span').html(start.format('YYYY-MM-DD hh:mm:ss') + ' - ' + end.format('YYYY-MM-DD hh:mm:ss'));

        //jQuery.getJSON("../mockjson/dashboard.json", load);
        load('test');
    }


    cb(moment().subtract(29, 'days'), moment());

    $('#reportrange').daterangepicker({
        ranges: {
            'last15min': [(new Date()-15*60*1000),new Date()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);
});


function load(jsondata) {
    // create the model from the data in the JavaScript object parsed from JSON text
    tableData = jsondata.summary;
    //myDiagram.model = new go.GraphLinksModel(jsondata["topo"][0], jsondata["topo"][1]);

    var appElement = document.querySelector('[ng-controller=appCtrl]');
    var $scope = angular.element(appElement).scope();
    var timerange = $('#reportrange span').html();
    $scope.replaceModel(tableData);
}

function convertText(pcount) {
    var str = "\n\n\n" + pcount;
    console.log("str === " + str);
    return str;
}

function convertShape(ptype) {
    var shape = "Rectangle";
    switch(ptype)
    {
        case 'USER':
            shape = "Rectangle";
            //shape = "Pentagon";
            break;
        case 'MYSQL':
        case 'ORACLE':
            shape = "DiskStorage";
            //shape = "Database";
            //shape = "Cylinder1";
            break;
        case 'RABBITMQ':
        case 'KAFKA':
            shape = "Ethernet";
            break;
        default:
            shape = "Circle";
    }

    console.log("shape === " + shape);
    return shape;
}

function convertColor(ptype) {
    var pcolor = "white";
    switch(ptype)
    {
        case 'USER':
            pcolor = "#79DD1B";
            //shape = "Pentagon";
            break;
        case 'MYSQL':
        case 'ORACLE':
            //shape = "Database";
            pcolor = "#9AA3B2";
            break;
        default:
            pcolor = "#79DD1B";
    }

    console.log("color === " + pcolor);
    return pcolor;
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
                    {fill: "#79DD1B", stroke: "white"},new go.Binding("fill", "type",convertColor)),
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {margin: 5, fill: "white", stroke: "white"}),
                $(go.TextBlock,
                    {
                        row: 0,
                        column: 0,
                        columnSpan: 15,
                        font: "bold 15pt helvetica, bold arial, sans-serif",
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
            $(go.Shape,  // the link shape
                {stroke: "black"}),
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
                    new go.Binding("text", "respondTime"))
            )
        );

    // Overview
    myOverview = $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
        {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan

    // but use the default Link template, by not setting Diagram.linkTemplate

    // The previous initialization is the same as the minimal.html sample.
    // Here we request JSON-format text data from the server, in this case from a static file.
    //jQuery.getJSON("../mockjson/dashboard.json", load);
}

var appApp = angular.module('appApp', []);

appApp.controller('appCtrl', function ($scope, $http,$location) {
    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();

    $scope.appName=QueryString('appname');
    $scope.from=QueryString('from');
    $scope.to=QueryString('to');
    console.log("param : appName = " + $scope.appName );
    console.log("param : from = " + $scope.from );
    console.log("param : to = " + $scope.to );


    $scope.model = new go.GraphLinksModel(
        [
            {key: 1, text: "Node1\n2"},
            {key: 2, text: "Node2"},
            {key: 3, text: "Node3"},
            {key: 4, text: "Node4"},
            {key: 5, text: "Node5"}
        ],
        [
            {from: 1, to: 2, text: "2ms"},
            {from: 2, to: 3, text: "2ms"},
            {from: 2, to: 4, text: "2ms"},
            {from: 2, to: 5, text: "2ms"},
            {from: 2, to: 6, text: "2ms"},
            {from: 2, to: 10, text: "2ms\n10ms"},
            {from: 2, to: 12, text: "2ms"},
            {from: 4, to: 5, text: "2ms\n2ms"},
            {from: 4, to: 6, text: "2ms"},
            {from: 4, to: 7, text: "2ms"},
            {from: 4, to: 8, text: "2ms"},
            {from: 4, to: 9, text: "2ms"}
        ]);

    $scope.model.selectedNodeData = null;
    $scope.selectedTimeRange = null;

    $scope.respondLineData = [20, 111, 60, 234, 120, 90, 20];

    //更新方法
    $scope.replaceModel = function (time) {
        $scope.selectedTimeRange = time;
        console.log('selectedTimeRange = ' + $scope.selectedTimeRange);
        $scope.records = time;

        $http.get("../mockjson/app1.json")
        //$http.get("http://10.63.212.141:1337/10.63.212.139:28080/applicationDetail.pinpoint?application=%22test%22&from=11111111&to=2222")
        //$http.get("http://10.63.212.141:1337/10.63.212.143:28080/applicationDetail.pinpoint?application=%22test%22&from=11111111&to=2222")
            .success(function (response) {
                $scope.records = response.summary;
                $scope.appName = response.summary.appName;
                $scope.healthRuleViolations = response.summary.healthRuleViolations;
                $scope.calls = response.summary.calls;
                $scope.callsPerMin = response.summary.callsPerMin;
                $scope.responseTime = response.summary.responseTime;
                $scope.errorsPercent = response.summary.errorsPercent;
                $scope.errors = response.summary.errors;
                $scope.errorsPerMin = response.summary.errorsPerMin;

                myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);
                console.log("records ===== "+$scope.records);


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
            });
    }

    function QueryString(item){
        var sValue=$location.absUrl().match(new RegExp("[\?\&]"+item+"=([^\&]*)(\&?)","i"))
        return sValue?sValue[1]:sValue
    }
});

/*----- modal -----*/
/*----- chart -----*/
appApp.directive('loadChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            loadOption = {
                title: {
                    text: 'Load',
                    subtext: '0.9%  70error 8error/min'
                },
                tooltip: {
                    trigger: 'axis'
                },

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
                        name: '意向',
                        type: 'line',
                        smooth: true,
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

appApp.directive('respondChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ($scope) {
            respondOption = {
                title: {
                    text: 'Respond',
                    subtext: '0.9%  70error 8error/min'
                },
                tooltip: {
                    trigger: 'axis'
                },

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
                        name: '意向',
                        type: 'line',
                        smooth: true,
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


appApp.directive('errorChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ($scope) {
            errorOption = {
                title: {
                    text: 'Error',
                    subtext: '0.9%  70error 8error/min'
                },
                tooltip: {
                    trigger: 'axis'
                },

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
                        name: '意向',
                        type: 'line',
                        smooth: true,
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






function nodeDoubleClick(event, node) {
    console.log("dataaaaaaaaaaaaaaaa = "+node.data.key);
    window.open("./node.html?nodeid="+ node.data.text);
    //window.open("../api/symbols/" + node.data.key + ".html");
}

function convertKeyImage(key) {
    if (!key) key = "NE";
    return "images/HS5.png";
}
