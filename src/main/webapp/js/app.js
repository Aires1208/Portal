$(function () {
    //goInit
    goInit();

    $("#warning-close").click(function() {
        $("#infoDiv").fadeOut("fast");
    });

    loadChartAtResource.connect([respondChartAtResource, errorChartAtResource]);
    respondChartAtResource.connect([loadChartAtResource, errorChartAtResource]);
    errorChartAtResource.connect([respondChartAtResource,loadChartAtResource ]);

});

var currentSvcSummary;
var instancesMap;
var nodes;
var links;
function showInfoDiv(mousePt,sname,ptype) {
    //$('#cpuLine').prepend($('#cpuLineChartId'));
    var x = Math.floor(mousePt.x);
    var y = Math.floor(mousePt.y)+10;
    //console.log("x========" + x);
    //console.log("y========" + y);

    var limitX = document.documentElement.clientWidth - 550;
    x = Math.min(x,limitX);
    //console.log("document.body.clientWidth ========" + document.body.clientWidth);
    //console.log("document.documentElement.clientWidth ========" + document.documentElement.clientWidth);

    $("#selectedName").html(sname);


    var instancesArr;
    instancesMap.forEach(function (e) {
            //console.log("foreach===" + e.key);
            if (e.key == sname) {
                instancesArr = e.instances;
            }
        }
    );
    var str = "";
    instancesArr.forEach(function (e) {
            //str = str + "<a href='./node.html?nodeid="+e.value+"&from="+selectedStartTime+"&to="+checkToStr(selectedEndTime)+"'><span class='glyphicon glyphicon-ok-sign' style='color:green'></span> " + e.value + " 10.63.212.143 </a>";
            str = str + "<a href='./node.html?appid="+appid+"&serviceid="+sname +"&instanceid="+e.value+"&from="+selectedStartTime+"&to="+ selectedEndTime +"'> " + e.value + " </a>";
}
    );
    //console.log("strstr === " + str);

    $("#instancelistId").html(str);

    $("#techLogoImgId").attr('src',getTechLogoImg(ptype));

    $("#infoDiv").css("visibility", "visible");
    $("#infoDiv").css("top", y + "px");
    $("#infoDiv").css("left", x + "px");

    $("#infoDiv").fadeIn("fast");

    if(currentSvcSummary != sname){
        bufferSvcPopupSummaryChart();
        currentSvcSummary = sname;
    }

}


function bufferSvcPopupSummaryChart(){
    summaryChartAtResource.showLoading({
        text :' '  ,
        effect : 'whirling'  ,
        textStyle : {
            fontSize : 10
        }
    });

   /* sleep(2000);

    var summaryOptions = summaryChartAtResource.getOption();
    summaryOptions.series[0].data = mockSummaryData();
    summaryOptions.series[1].data = mockSummaryData();
    summaryOptions.series[2].data = mockSummaryData();
    summaryOptions.xAxis[0].data = ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00'];
    //summaryOptions.title.subtext = "done";
    summaryChartAtResource.hideLoading();
    summaryChartAtResource.setOption(summaryOptions);*/

    loadingTicket = setTimeout(function (){
        var summaryOptions = summaryChartAtResource.getOption();
        summaryOptions.series[0].data = mockSummaryData();
        summaryOptions.series[1].data = mockSummaryData();
        summaryOptions.series[2].data = mockSummaryData();
        summaryOptions.xAxis[0].data = ['09:00', '09:10', '09:20', '09:30', '09:40', '09:50', '10:00'];
        //summaryOptions.title.subtext = "done";
        summaryChartAtResource.hideLoading();

        $("#summaryLineChart").css("height", "180px");

        summaryChartAtResource.setOption(summaryOptions);
    },1500);

}

function mockSummaryData(){
    var d = [];
    var len = 0;
    var value;
    while (len++ < 6) {
        d.push([
            parseInt(10*Math.random())
        ]);
    }
    return d;
}


function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=appCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
}



function goInit() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates, avoid $ due to jQuery

    myDiagram = $(go.Diagram, "myDiagramDiv",  // create a Diagram for the DIV HTML element
        {
            allowMove: false,
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
                    setsPortSpots: true
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
           /* layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
                {defaultSpringLength: 30, defaultElectricalCharge: 100}),*/
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
                click: doClick,  // this event handler is defined below
                //mouseOver: doMouseOver,
                toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "lightyellow" }),
                        $(go.TextBlock, new go.Binding("text", "type"),
                            { margin: 5 })
                    )
            },
            //center
            $(go.Panel, "Auto",
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {fill: "#79DD1B", stroke: "white"},new go.Binding("fill","", convertColor)),
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {margin: 5, fill: "white", stroke: "white"}),
                $(go.TextBlock,
                    {
                        row: 0,
                        column: 0,
                        columnSpan: 15,
                        font: "bold 13pt helvetica, bold arial, sans-serif",
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
                        font: "bold 9pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        stroke: "white",
                        isMultiline: true,
                        maxSize: new go.Size(50, NaN)
                    },
                    new go.Binding("text", "type"))
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
            )
        );



    // define each Node's appearance replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            //{ routing: go.Link.Orthogonal, corner: 5,reshapable: true,relinkableFrom: true, relinkableTo: true },
            /*{
                routing: go.Link.AvoidsNodes, corner: 5,
                reshapable: true, relinkableFrom: true, relinkableTo: true
            },*/
            {
              relinkableTo: true
             },
            /*$(go.Shape,  // the link shape
                {stroke: "black"}),*/
            $(go.Shape,
                new go.Binding("stroke", "respondTime", lineColor)),
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
                        margin: 1
                    },
                    new go.Binding("text", "respondTime",convertTextInLines))
            )
        );

    // Overview
    myOverview = $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
        {observed: myDiagram, contentAlignment: go.Spot.Center});   // tell it which Diagram to show and pan
    myOverview.box.elt(0).stroke = "#458EF9";
}




function goInitMax() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates, avoid $ due to jQuery

    myDiagramMax = $(go.Diagram, "myDiagramDivMax",  // create a Diagram for the DIV HTML element
        {
            allowMove: false,
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
                    setsPortSpots: true
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
            /* layout: $(ContinuousForceDirectedLayout,  // automatically spread nodes apart while dragging
             {defaultSpringLength: 30, defaultElectricalCharge: 100}),*/
            "SelectionMoved": function (e) {
                e.diagram.layout.invalidateLayout();
            }
        });

    // define a simple Node template
    myDiagramMax.nodeTemplate =
        $(go.Node, "Spot",  // the whole node panel
            // define the node's outer shape, which will surround the TextBlock
            {
                doubleClick: nodeDoubleClick,  // this function is defined below
                click: doClick,  // this event handler is defined below
                //mouseOver: doMouseOver,
                toolTip:
                    $(go.Adornment, "Auto",
                        $(go.Shape, { fill: "lightyellow" }),
                        $(go.TextBlock, new go.Binding("text", "type"),
                            { margin: 5 })
                    )
            },
            //center
            $(go.Panel, "Auto",
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {fill: "#79DD1B", stroke: "white"},new go.Binding("fill","", convertColor)),
                $(go.Shape, new go.Binding("figure", "type",convertShape),
                    {margin: 5, fill: "white", stroke: "white"}),
                $(go.TextBlock,
                    {
                        row: 0,
                        column: 0,
                        columnSpan: 15,
                        font: "bold 13pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        maxSize: new go.Size(100, NaN)
                    },
                    new go.Binding("text", "name")),
                $(go.TextBlock,
                    {
                        row: 1,
                        column: 0,
                        font: "bold 12pt helvetica, bold arial, sans-serif",
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
                        font: "bold 9pt helvetica, bold arial, sans-serif",
                        textAlign: "center",
                        stroke: "white",
                        isMultiline: true,
                        maxSize: new go.Size(50, NaN)
                    },
                    new go.Binding("text", "type"))
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
            )
        );



    // define each Node's appearance replace the default Link template in the linkTemplateMap
    myDiagramMax.linkTemplate =
        $(go.Link,  // the whole link panel
            //{ routing: go.Link.Orthogonal, corner: 5,reshapable: true,relinkableFrom: true, relinkableTo: true },
            /*{
             routing: go.Link.AvoidsNodes, corner: 5,
             reshapable: true, relinkableFrom: true, relinkableTo: true
             },*/
            {
                relinkableTo: true
            },
            /*$(go.Shape,  // the link shape
             {stroke: "black"}),*/
            $(go.Shape,
                new go.Binding("stroke", "respondTime", lineColor)),
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
                        margin: 1
                    },
                    new go.Binding("text", "respondTime",convertTextInLines))
            )
        );

    myDiagramMax.model = new go.GraphLinksModel(nodes, links);
}

function finalizeMax(){
    myDiagramMax = null;
}

function maxWin(){
    $("#myDiagramDivMax").css("width",$(window).width()-20);
    $("#myDiagramDivMax").css("height",$(window).height()-55);
}

var appid;
var appApp = angular.module('appApp', []);
appApp.controller('appCtrl', function ($scope, $http,$location) {
    $scope.myUrl = $location.absUrl();
    $scope.url = $location.url();

    $scope.appName=QueryString('appname');
    appid = $scope.appName;
    $scope.from=QueryString('from');
    $scope.to=QueryString('to');

    var rg =  getCookie("ranges");
    setDatePicker($scope.from, $scope.to,rg);

    $scope.model = new go.GraphLinksModel(
        [
            {key: 5, text: "Node5"}
        ],
        [
            {from: 4, to: 9, text: "2ms"}
        ]);

    $scope.model.selectedNodeData = null;
    $scope.selectedTimeRange = null;

    //chart default value
    $scope.respondLineData = [0, 0, 0, 0, 0, 0, 0];
    $scope.timeXAxisData = ['', '', '', '', '', '', '']; //['09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30']

    $scope.clickToAppHealthRuleViolations = function(){
        console.log(111);
        var url = dataSourceURL() +"/transactions/applications/"+$scope.appName+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        // http://localhost:63342/Esight/pinpoint-web/src/main/webapp/apm/html/healthRuleViolationsList.html?_ijt=ur7sgssn0s4ps3osul38jknanj
        console.log(url);
        window.location.href = url;
    }
    //更新方法
    $scope.replaceModel = function (start,end) {
        loadingBarReset();

        $scope.selectedStartTime = start;
        selectedStartTime = start;
        $scope.selectedEndTime = end;
        selectedEndTime = end;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );

        //$scope.appUrl="http://10.63.212.141:1337/10.63.212.143:28080/serviceDashBoard.pinpoint?application="+$scope.appName+"&from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        $scope.appUrl= dataSourceURL()+"/dashBoard/applications/"+ $scope.appName +".pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        //$scope.appUrl="../mockjson/app1.json";
        console.log("appUrl = "+$scope.appUrl);
        $http.get($scope.appUrl)
            .success(function (response) {
                loadingBarFade();

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

                myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);

                nodes = response["topo"]["nodes"];
                links = response["topo"]["links"];

                //console.log("records ===== "+$scope.records);
                instancesMap = response["topo"]["nodes"];


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
                console.log("ajaxError:\n" + data.error + "\n" + data.message);
                loadingBarFadeOut();
            });
    }

    $scope.replaceModel($scope.from,$scope.to);

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


    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }
});

/*----- chart -----*/
appApp.directive('loadChart', function () {
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
                animation: false,
                tooltip: {
                    trigger: 'axis'
                },

                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', '']
                    }
                ],
                /*xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['', '', '', '', '', '', ''],
                        axisLabel : {
                            show:true,
                            interval: 'auto',    // {number}
                            rotate: 30,
                            textStyle: {
                                fontSize: 2
                            }
                        }
                    }
                ],*/
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
                    text: 'Response Time',
                    subtext: 'loading'
                },
                animation: false,
                tooltip: {
                    trigger: 'axis'
                },

                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: $scope.timeXAxisData
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
                    text: 'Errors',
                    subtext: 'loading'
                },
                animation: false,
                tooltip: {
                    trigger: 'axis'
                },
                calculable: false,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: $scope.timeXAxisData
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

appApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});

appApp.directive('summaryChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function ($scope) {
            summaryOption = {
                legend: {
                    data:['calls','responseTime','errors']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['09:00','09:10','09:20','09:30','09:40','09:50','10:00']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'calls',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name:'responseTime',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        name:'errors',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:[0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };

            summaryChartAtResource = echarts.init(document.getElementById("summaryLineChart"), bluetheme);
            summaryChartAtResource.showLoading({
                text: "loading..."
            });
            summaryChartAtResource.setOption(summaryOption);
            summaryChartAtResource.hideLoading();
        }
    };
});


function nodeDoubleClick(event, node) {
    console.log("nodeDoubleClick = "+ node.data.type);
    if(node.data.type.toLowerCase() == 'oracle' || node.data.type.toLowerCase() == 'mysql'){
        window.open("./dbInfo.html?dbid="+node.data.key+"&from="+selectedStartTime+"&to="+selectedEndTime);
    }else{
        if(node.data.tracked == 'true'){
            window.open("./service.html?appid="+appid+"&serviceid="+ node.data.key+"&from="+selectedStartTime+"&to="+selectedEndTime);
        }
    }
}

function doMouseOver(event, node) {
    console.log("doMouseOverdoMouseOver = "+node.data.key);
        var x =
            "<div>" +
                "<div<a href='#' id='warning-close' class='close'>&times;</a></div>"+
            "<h4>Selected : " + node.data.key + "</h4>" +
                "<a href='./node.html?nodeid=test'><h5>node1</h5></a>"+
                "<a href='./node.html?nodeid=test'><h5>node2</h5></a>"+
           "</div>"

        var box = document.getElementById("infoDiv");
        box.innerHTML = x;

}

function doClick(event, node) {
    console.log("doClick = "+ node.data.type);
    var arr = ['oracle','mysql','user','rabbitmq','kafka'];

    if(arr.indexOf(node.data.type.toLowerCase()) == -1){
        showInfoDiv(event.viewPoint,node.data.key,node.data.type);
    }
}


function initInfoDiv() {
    var x = "<div>" +
        "<h4>Select one app</h4>" +
        "</div>"

    var box = document.getElementById("infoDiv");
    box.innerHTML = x;
}













// This variation on ForceDirectedLayout does not move any selected Nodes
// but does move all other nodes (vertexes).
function ContinuousForceDirectedLayout() {
    go.ForceDirectedLayout.call(this);
    this._isObserving = false;
}
go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);

/** @override */
ContinuousForceDirectedLayout.prototype.isFixed = function (v) {
    return v.node.isSelected;
}

// optimization: reuse the ForceDirectedNetwork rather than re-create it each time
/** @override */
ContinuousForceDirectedLayout.prototype.doLayout = function (coll) {
    if (!this._isObserving) {
        this._isObserving = true;
        // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
        // so we need to track structural model changes to discard the saved network.
        var lay = this;
    }
    var net = this.network;
    if (net === null) {  // the first time, just create the network as normal
        this.network = net = this.makeNetwork(coll);
    } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
        this.diagram.nodes.each(function (n) {
            var v = net.findVertex(n);
            if (v !== null) v.bounds = n.actualBounds;
        });
    }
    // now perform the normal layout
    go.ForceDirectedLayout.prototype.doLayout.call(this, coll);
    // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
    // here we remember it for next time
    this.network = net;
}
// end ContinuousForceDirectedLayout




//fullScreen
var closeFn;
function closeShowingModal() {
    var showingModal = document.querySelector('.modal.show');
    if (!showingModal) return;
    showingModal.classList.remove('show');
    document.body.classList.remove('disable-mouse');
    if (closeFn) {
        closeFn();
        closeFn = null;
    }
    finalizeMax();
}
document.addEventListener('click', function (e) {
    var target = e.target;
    if (target.dataset.ctaTarget) {
        closeFn = cta(target, document.querySelector(target.dataset.ctaTarget), { relativeToWindow: true }, function showModal(modal) {
            modal.classList.add('show');
            document.body.classList.add('disable-mouse');

            try {
                maxWin();
                goInitMax();
            } catch(err) {
                console.warn(err.message);
            }
        });
    }
    else if (target.classList.contains('modal-close-btn')) {
        closeShowingModal();
    }
});
document.addEventListener('keyup', function (e) {
    if (e.which === 27) {
        closeShowingModal();
    }
})