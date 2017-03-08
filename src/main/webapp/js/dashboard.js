$(function () {
    //goInit
    goInit();

    //cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours ago
    //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
    //cb(moment().startOf('day'), moment()); //
    //$('#reportrange span').html(moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

    var st =  getCookie("starttime");
    var et =  getCookie("endtime");
    var rg =  getCookie("ranges");
    console.log("cookie starttime=" + st);
    console.log("cookie endtime=" + et);
    console.log("cookie ranges=" + rg);
    if (st != "" && et != "") {
        setDatePicker(st, et,rg);
        datePickerUpdateData(st, et);
    } else {
        cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours age
        //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        $('#reportrange span').html('10 Minutes');
        document.cookie = "ranges=" + '10 Minutes';
    }

});



function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=dashboardCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.replaceModel(start,end);
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
                        font: "bold 9pt helvetica, bold arial, sans-serif",
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

}


//angularjs
var dashboardApp = angular.module('dashboardApp',['chieffancypants.loadingBar']);

dashboardApp.controller('dashboardCtrl', function ($scope, $http, $timeout) {
    //$scope.model.selectedNodeData = null;
    $scope.selectedTimeRange = null;
    $scope.selectedStartTime = null;
    $scope.selectedEndTime = null;
    $scope.records =  null;

    $scope.recordCurrentAppName = function (appName) {
        if(appName != "" && null != appName){
            setCookie("currentAppName",appName,1);
        }
    };

    $scope.isHealth =  function(v){
        if(v>=1){
            return false;
        }else{
            return true;
        }
    };

    $scope.isHealthColor =  function(v){
        if(v>=1){
            return 'red';
        }else{
            return '#79DD1B';
        }
    };

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

       /* var config = {
            url: 'http://10.63.212.141:1337/localhost:28080/alarmRule.pinpoint',
            method: 'get'
        };
        $http(config).success(function(data){
            alert(data);
        })

        $scope.tt = function(){
            $http(config).success(function(data){
                alert(data);
            })}*/


        //$http.get("../mockjson/dashboard1.json")
        //var queryUrl = "http://10.63.212.141:1337/10.63.212.143:28080/applicationDashBoard.pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        var queryUrl = dataSourceURL()+"/dashBoard/applications.pinpoint?from="+$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        console.log("queryUrl = " + queryUrl);
        $http.get(queryUrl)
            .success(function (response) {
                loadingBarFade();

                //update table and summary
                $scope.records = response.summary;

                //update topo
                //myDiagram.model = new go.GraphLinksModel(response["topo"]["nodes"], response["topo"]["links"]);
                console.table($scope.records);
            }).error(function (data,header,config,status) {
                loadingBarFadeOut();
                toastFail();
            });
    }
});


dashboardApp.filter("reverse",function(){
    return function(input){
        var out = ""+input;
        return out;
    }
});



function nodeDoubleClick(event, node) {
    console.log("dataaaaaaaaaaaaaaaa = " + node.data.name);
    window.open("./app.html?appname=" + node.data.name);
    //window.open("../api/symbols/" + node.data.key + ".html");
}


function toastFail ()
{
    var priority = 'danger';
    var title    = 'Tip';
    var message  = 'Server response error!';

    $.toaster({ priority : priority, title : title, message : message });
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