var selectedUrl = "../mockjson/traceDetail1.json";

$(function () {
    //layout
    $("#cpuLineChart").css("height","5px");
    $("#memLineChart").css("height","5px");
    $("#storeLineChart").css("height","5px");
    $("#netLineChart").css("height","5px");

    $('#myModal').on('shown.bs.modal', function () {
        $("#cpuLineChart").css("height","350px");
        $("#memLineChart").css("height","350px");
        $("#storeLineChart").css("height","350px");
        $("#netLineChart").css("height","350px");
        //
        $("#myDiagramDiv").css("height","500px");


        $('#cpuLine').prepend($('#cpuLineChart'));
        $("#cpuLineChart").css("visibility", "visible");

        $('#memLine').prepend($('#memLineChart'));
        $("#memLineChart").css("visibility", "visible");

        $('#storeLine').prepend($('#storeLineChart'));
        $("#storeLineChart").css("visibility", "visible");

        $('#netLine').prepend($('#netLineChart'));
        $("#netLineChart").css("visibility", "visible");
        //
        $('#sample').prepend($('#myDiagramDiv'));
        $("#myDiagramDiv").css("visibility", "visible");
    })

    //gojs init
    init();


    //treetable
    option = {
        //theme:'vsStyle',
        expandLevel: 1
    };

    //open modal dialog
    $('#myModal').on('show.bs.modal', function () {

        //update treetable
        $.get(selectedUrl, function (data, status) {
            var htmlv = '';
            $('#tbodyId').empty();
            var tt = data.treeTable;
            tt.forEach(function (e) {
                    var w = calWidth(e.execPercent);
                    htmlv = htmlv + '<tr id="' + e.id + '" pId="' + e.idParent + '"><td>' + e.method + '</td><td>' + e.argument + '</td><td>' + e.startTime + '</td><td>' + e.exec + '</td><td>' + e.self + '</td><td>' + e.execPercent + '<div style="background-color: #008ed3;color:white;height:5px;margin:0px;padding:0px;width: '+w+'">&nbsp</div></td><td>' + e.class + '</td><td>' + e.api + '</td><td>' + e.agent + '</td><td>' + e.app + '</td><td>' + e.gap + '</td>'
                }
            );
            console.log(htmlv);
            $('#tbodyId').append(htmlv);
            $('#mytable').treeTable(option);




            $("#traceTableId tr").find("td:eq(7)").width(100);

            $("#mytable tr").find("td:eq(0)").width(350);
            //$("#mytable tr").find("td:eq(1)").width(200);
            $("#mytable tr").find("td:eq(2)").width(125);
            $("#mytable tr").find("td:eq(3)").width(70);
            $("#mytable tr").find("td:eq(4)").width(70);
            $("#mytable tr").find("td:eq(5)").width(80);
            $("#mytable tr").find("td:eq(10)").width(90);
            $("#mytable").width(1500);


            //update chart and topo
            var appElement = document.querySelector('[ng-controller=traceCtrl]');
            var $scope = angular.element(appElement).scope();
            $scope.updateModel(data);
        });
    })

    $('#myModal').on('hidden.bs.modal', function () {
        $('#mytable').treeTable(null);
    })


    $("[data-toggle='tooltip']").tooltip();
});




var traceApp = angular.module('traceApp', []);
traceApp.controller('traceCtrl', function ($scope, $http,$location) {
    $scope.records = null;
    //$scope.appName=QueryString('service');
    //$scope.level=QueryString('level');
    $scope.appId=QueryString('appid');
    $scope.serviceId=QueryString('serviceid');
    $scope.instanceId=QueryString('instanceid');
    $scope.from = QueryString('from');
    $scope.to = QueryString('to');
    $scope.command = QueryString('command');

    $scope.max = QueryString('max');
    $scope.min = QueryString('min');

    $scope.fromStr = new Date(parseInt($scope.from)).format('yyyy-MM-dd hh:mm:ss');
    $scope.toStr = new Date(parseInt($scope.to)).format('yyyy-MM-dd hh:mm:ss');


    loadingBarReset();
    if ($scope.max != null && $scope.min != null) {
        if($scope.serviceId == null && $scope.instanceId == null){
            //http://10.63.212.143:28080/traceTable/applications/EMS
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&max="+$scope.max+"&min="+$scope.min;
        }else if($scope.serviceId != null && $scope.instanceId ==null){
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+"/services/"+ $scope.serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&max="+$scope.max+"&min="+$scope.min;
        }else {
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+"/services/"+ $scope.serviceId+"/instances/"+$scope.instanceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&max="+$scope.max+"&min="+$scope.min;
        }
    } else {
        //$scope.tableUrl="../mockjson/traceTable1.json";
        //$scope.tableUrl="http://10.63.212.141:1337/10.63.212.143:28080/traceTable.pinpoint?name="+$scope.appName+"&level="+$scope.level+"&from="+$scope.from+"&to="+$scope.to+"&command="+$scope.command;
        if($scope.serviceId == '' && $scope.instanceId ==''){
            //http://10.63.212.143:28080/traceTable/applications/EMS
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&command="+$scope.command;
        }else if($scope.serviceId != '' && $scope.instanceId ==''){
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+"/services/"+ $scope.serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&command="+$scope.command;
        }else {
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
            $scope.tableUrl = dataSourceURL() +"/traceTable/applications/"+$scope.appId+"/services/"+ $scope.serviceId+"/instances/"+$scope.instanceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to+"&command="+$scope.command;
        }
    }


    console.log("tableUrl === " + $scope.tableUrl);
    $scope.isrecordsLoading = true;
    $http.get($scope.tableUrl)
        .success(function (response) {
            try {
                loadingBarFade();
                $scope.records = response.traceTable;
                console.log("records Length : " + $scope.records.length);
                $scope.types = response.typeList;
                $scope.isrecordsLoading = false;
            } catch (err) {
                toastFail();
                console.warn(err.message);
            }
        }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });



    $scope.selectOneTrace = function (startTimex, tranx) {
        console.log("startTime ===== " + startTimex);
        console.log("traceId ===== " + tranx);
        startTime = new Date(Date.parse(startTimex)).getTime();

        //selectedUrl = "http://10.63.212.141:1337/10.63.212.139:28080/applicationTraceDetail.pinpoint?traceId="+tranx+"&startTime="+startTime;
        selectedUrl =dataSourceURL()+ "/serviceTraceDetail.pinpoint?traceId=" + tranx + "&startTime=" + startTime;
        console.log("selectedUrl = " + selectedUrl);
    };

    //更新方法
    $scope.replaceModel = function () {
        //$http.get("../mockjson/traceDetail1.json")
        $http.get(selectedUrl)
            .success(function (response) {
                //update topo
                myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);
                myDiagram.layout.invalidateLayout();

                //update chart
                var cpuOptions=cpuChartAtResource.getOption();
                cpuOptions.series[0].data=response["cpuInfo"]["data"];
                cpuOptions.xAxis[0].data=response["cpuInfo"]["time"];
                cpuOptions.title.subtext=response["cpuInfo"]["info"];
                cpuChartAtResource.hideLoading();
                cpuChartAtResource.setOption(cpuOptions);

                var memOptions=memChartAtResource.getOption();
                memOptions.series[0].data=response["memInfo"]["data"];
                memOptions.xAxis[0].data=response["memInfo"]["time"];
                memOptions.title.subtext=response["memInfo"]["info"];
                memChartAtResource.hideLoading();
                memChartAtResource.setOption(memOptions);

                var storeOptions=storeChartAtResource.getOption();
                storeOptions.series[0].data=response["storeInfo"]["data"];
                storeOptions.xAxis[0].data=response["storeInfo"]["time"];
                storeOptions.title.subtext=response["storeInfo"]["info"];
                storeChartAtResource.hideLoading();
                storeChartAtResource.setOption(storeOptions);

                var netOptions=netChartAtResource.getOption();
                netOptions.series[0].data=response["netInfo"]["data"];
                netOptions.xAxis[0].data=response["netInfo"]["time"];
                netOptions.title.subtext=response["netInfo"]["info"];
                netChartAtResource.hideLoading();
                netChartAtResource.setOption(netOptions);
            }).error(function (data) {
                console.log("data ===== " + data);
            });
    }


    //更新方法
    $scope.updateModel = function (response) {
        //update topo
        myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);
        myDiagram.layout.invalidateLayout();

        //update chart
        var cpuOptions = cpuChartAtResource.getOption();
        cpuOptions.series[0].data = response["cpuInfo"]["data"];
        cpuOptions.xAxis[0].data = response["cpuInfo"]["time"];
        cpuOptions.title.subtext = response["cpuInfo"]["info"];
        cpuChartAtResource.hideLoading();
        cpuChartAtResource.setOption(cpuOptions);

        var memOptions = memChartAtResource.getOption();
        memOptions.series[0].data = response["memInfo"]["data"];
        memOptions.xAxis[0].data = response["memInfo"]["time"];
        memOptions.title.subtext = response["memInfo"]["info"];
        memChartAtResource.hideLoading();
        memChartAtResource.setOption(memOptions);

        var storeOptions = storeChartAtResource.getOption();
        storeOptions.series[0].data = response["storeInfo"]["data"];
        storeOptions.xAxis[0].data = response["storeInfo"]["time"];
        storeOptions.title.subtext = response["storeInfo"]["info"];
        storeChartAtResource.hideLoading();
        storeChartAtResource.setOption(storeOptions);

        var netOptions = netChartAtResource.getOption();
        netOptions.series[0].data = response["netInfo"]["data"];
        netOptions.xAxis[0].data = response["netInfo"]["time"];
        netOptions.title.subtext = response["netInfo"]["info"];
        netChartAtResource.hideLoading();
        netChartAtResource.setOption(netOptions);

    }

    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }


    $scope.myFilter = function (item, type) {
        //return item.path == '/favicon.ico';
        return item.path == type;
        //return true;
    };
});


/*----- chart -----*/
traceApp.directive('cpuChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            cpuOption = {
                title: {
                    text: 'Load',
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
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            cpuChartAtResource = echarts.init(document.getElementById("cpuLineChart"), bluetheme);
            cpuChartAtResource.showLoading({
                text: "loading..."
            });
            cpuChartAtResource.setOption(cpuOption);
            cpuChartAtResource.hideLoading();
        }
    };
});

traceApp.directive('memChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            memOption = {
                title: {
                    text: 'mem',
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
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            memChartAtResource = echarts.init(document.getElementById("memLineChart"), bluetheme);
            memChartAtResource.showLoading({
                text: "loading..."
            });
            memChartAtResource.setOption(memOption);
            memChartAtResource.hideLoading();
        }
    };
});



traceApp.directive('storeChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            storeOption = {
                title: {
                    text: 'Store',
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
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            storeChartAtResource = echarts.init(document.getElementById("storeLineChart"), bluetheme);
            storeChartAtResource.showLoading({
                text: "loading..."
            });
            storeChartAtResource.setOption(storeOption);
            storeChartAtResource.hideLoading();
        }
    };
});


traceApp.directive('netChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            netOption = {
                title: {
                    text: 'net',
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
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'value',
                        type: 'line',
                        smooth: true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            netChartAtResource = echarts.init(document.getElementById("netLineChart"), bluetheme);
            netChartAtResource.showLoading({
                text: "loading..."
            });
            netChartAtResource.setOption(netOption);
            netChartAtResource.hideLoading();
        }
    };
});


/*gojs init*/
function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                initialContentAlignment: go.Spot.Center,  // center the content
                "undoManager.isEnabled": true,  // enable undo & redo
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                initialAutoScale: go.Diagram.Uniform,
                contentAlignment: go.Spot.Center,
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

    // dragging a node invalidates the Diagram.layout, causing a layout during the drag
    myDiagram.toolManager.draggingTool.doMouseMove = function () {
        go.DraggingTool.prototype.doMouseMove.call(this);
        if (this.isActive) {
            this.diagram.layout.invalidateLayout();
        }
    }

    // define each Node's appearance
    myDiagram.nodeTemplate =
        $(go.Node, "Spot",  // the whole node panel
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

    // define each Node's appearance replace the default Link template in the linkTemplateMap
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
                    new go.Binding("text", "respondTime",convertTextInLines))
            )
        );

    // create the model for the concept map
    var nodeDataArray = [
        /*{"key": 1, "name": "AppApp11111","type":"USER","count":2},
        {"key": 2, "name": "AppApp2","type":"TOMCAT","count":1},
        {"key": 3, "name": "Appxxx3","type":"PHP","count":3},*/
    ];
    var linkDataArray = [
        /*{"from": 1, "to": 2, "respondTime": "2ms"},
        {"from": 2, "to": 3, "respondTime": "1ms"},
        {"from": 2, "to": 4, "respondTime": "2ms"},
        {"from": 2, "to": 5, "respondTime": "2ms"},
        {"from": 2, "to": 6, "respondTime": "2ms"}*/
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}



function update(obj){
    console.log("ojb  ===== "+obj.valueOf());
}

function toastFail ()
{
    var priority = 'danger';
    var title    = 'Tip';
    var message  = 'Server Response Error! ';
    $.toaster({ priority : priority, title : title, message : message });
}

function calWidth(str){
    var s = str.substring(0,str.length-1);
    var i = Number(s);

    console.log("i  ===== "+i);
    return i+'px';
}

$(window).scroll(function(){
    var sc=$(window).scrollTop();
    var rwidth=$(window).width()
    if(sc>0){
        $("#goTopBtn").css("display","block");
        $("#goTopBtn").css("left",(rwidth-36)+"px")
    }else{
        $("#goTopBtn").css("display","none");
    }
})
$("#goTopBtn").click(function(){
    var sc=$(window).scrollTop();
    $('body,html').animate({scrollTop:0},500);
})
