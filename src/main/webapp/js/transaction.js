var selectedUrl = "../mockjson/tranxTopo.json";

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
        expandLevel: 1
    };

    //open modal dialog
    $('#myModal').on('show.bs.modal', function () {

        //update treetable
        $.get(selectedUrl, function (data, status) {
            /*var htmlv = '';
            $('#tbodyId').empty();
            var tt = data.treeTable;
            tt.forEach(function (e) {
                    htmlv = htmlv + '<tr id="' + e.id + '" pId="' + e.idParent + '"><td>' + e.method + '</td><td>' + e.argument + '</td><td>' + e.startTime + '</td><td>' + e.gap + '</td><td>' + e.exec + '</td><td>' + e.execPer + '</td><td>' + e.self + '</td><td>' + e.class + '</td><td>' + e.api + '</td><td>' + e.agent + '</td><td>' + e.app + '</td></tr>'
                }
            );
            console.log(htmlv);
            $('#tbodyId').append(htmlv);
            $('#mytable').treeTable(option);*/


            //update chart and topo
            var appElement = document.querySelector('[ng-controller=transactionCtrl]');
            var $scope = angular.element(appElement).scope();
            $scope.updateModel(data);
        });
    })

    $('#myModal').on('hidden.bs.modal', function () {
        $('#mytable').treeTable(null);
    })


    //$("[data-toggle='tooltip']").tooltip();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        /*$("#scatterChart").css("height","350px");
        $('#scatterLine').prepend($('#scatterChart'));
        $("#scatterChart").css("visibility", "visible");*/
        if(!isScatterReady){
            var appElement = document.querySelector('[ng-controller=transactionCtrl]');
            var $scope = angular.element(appElement).scope();
            //$scope.updateScatterHigh();
            $scope.updateScatter();
            isScatterReady = true;
        }
    });
});

var isScatterReady = false;
var oldX = 100;
var oldY = 100;
function mockScatterPointArray() {
    var d = [];
    var len = 0;
    var now = new Date();
    var value;
    while (len++ < 1000) {
        d.push([
            new Date(2016, 8, 1, 0, Math.round(Math.random()*10000)),
            (Math.random()*30).toFixed(2) - 0,
            (Math.random()*100).toFixed(2) - 0
        ]);
    }
    return d;
}

function mockScatterPointArrayRed() {
    var d = [];
    var len = 0;
    var now = new Date();
    var value;
    while (len++ < 100) {
        d.push([
            new Date(2016, 8, 1, 0, Math.round(Math.random()*10000)),
            (Math.random()*30).toFixed(2) - 0,
            (Math.random()*100).toFixed(2) - 0
        ]);
    }
    return d;
}

function drawScatter(bt,et,ajaxData){
    $("#scatterLoading").empty();
    $("#scatterLoading").css("height","0px");
    var date = new Date();
    if (Modernizr.canvas) {
        doBigScatterChart(bt,et,ajaxData);
    }
    var oScatterChart;
    function doBigScatterChart(bt,et,ajaxData) {
        var MaxVVV = 1000;
        var data = [];
        ajaxData.normalScatter.forEach(function(e){
                if(e[1] > MaxVVV){
                    MaxVVV = e[1];
                }
                data.push({
                    x: e[0],
                    y: e[1],
                    type: 'Normal'
                });
            }
        );
        ajaxData.warningScatter.forEach(function(e){
                if(e[1] > MaxVVV){
                    MaxVVV = e[1];
                }
                data.push({
                    x: e[0],
                    y: e[1],
                    type: 'Warning'
                });
            }
        );
        ajaxData.criticalScatter.forEach(function(e){
                if(e[1] > MaxVVV){
                    MaxVVV = e[1];
                }
                data.push({
                    x: e[0],
                    y: e[1],
                    type: 'Critical'
                });
            }
        );

        var modV=1;
        for(i=1;i<MaxVVV.toString().length;i++){
            modV = modV*10;
        }
        //console.log(modV);

        MaxVVV = MaxVVV+modV/2;


        oScatterChart = new BigScatterChart({
            sContainerId: 'chartScatter',
            nWidth: 1000,
            nHeight: 500,
            nXMin: parseInt(bt), nXMax: parseInt(et),
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
            bUseMouseGuideLine : true,
            /*fXAxisFormat: function ( tickX, i, minX ) {
                var oMoment = moment( tickX * i + minX );
                return oMoment.format( "MM-DD" ) + "<br>" + oMoment.format( "HH:mm:ss" );
            },*/
            fnYAxisFormat: function ( tickY, i, minY, maxY ) {
                return BigScatterChart2.Util.addComma(( maxY + minY ) - (( tickY * i ) + minY ));
            },
            fOnSelect: function (htPosition, htXY) {
                //console.log('fOnSelect', htPosition, htXY);
                console.time('fOnSelect');
                var aData = this.getDataByXY(htXY.nXFrom, htXY.nXTo, htXY.nYFrom, htXY.nYTo);
                $("#scatterRange").html('TimeRange :' + new Date(htXY.nXFrom).format('yyyy-MM-dd hh:mm:ss') +"  -  " + new Date(htXY.nXTo).format('yyyy-MM-dd hh:mm:ss') +"        Value : " + htXY.nYFrom +"  -  " + htXY.nYTo);

                console.timeEnd('fOnSelect');
                console.log('adata length', aData.length);
                //alert('Selected data count : ' + aData.length);

                var startTime = htXY.nXFrom;
                var endTime = htXY.nXTo;
                var valueMin = htXY.nYFrom;
                var valueMax = htXY.nYTo;

                var url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                if(serviceId == null && instanceId ==null){
                    url = "./trace.html?appid="+appId +"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                }else if(serviceId != null && instanceId ==null){
                    url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                }else {
                    url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                }
                window.open(url);
            }
        });




        oScatterChart.setBubbles(data);
        oScatterChart.redrawBubbles();

        /*$("#chartScatter")./!*find('canvas').*!/mousemove(onMouseMove = function (e) {
            console.log(e.pageX + '------' + e.pageY);
            /!*if(!bIsDraging) return;
             refreshSelectBox(e);

             if (config.selectables && config.selectOnMove) {
             selectElementsInRange();
             }

             if (config.autoScroll) {
             scrollPerhaps(e);
             }*!/

            e.preventDefault();
        })*/
    }
}


function drawScatterHigh(bt,et,ajaxData){
    $('#chartScatter').highcharts({
        chart: {
            exporting: {
                enabled: false
            },
            credits: {
                text: '',
                href: '',
                enabled: false
            },
            events: {
                selection: function (event) {
                    var text, text2, label;
                    if (event.xAxis) {
                        text = 'min: ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min) + ', max: ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max);

                        text2 = 'min: ' + Highcharts.numberFormat(event.yAxis[0].min, 2) + ', max: ' + Highcharts.numberFormat(event.yAxis[0].max, 2);



                        var startTime = Math.floor(event.xAxis[0].min);
                        var endTime = Math.ceil(event.xAxis[0].max);
                        var valueMin = Math.floor(event.yAxis[0].min);
                        var valueMax = Math.ceil(event.yAxis[0].max);

                        var url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        if(serviceId == null && instanceId ==null){
                            url = "./trace.html?appid="+appId +"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }else if($scope.serviceId != null && $scope.instanceId ==null){
                            url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }else {
                            url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }
                        window.open(url);
                    } else {
                        text = 'Selection reset';
                    }

                    console.log(text);
                    console.log(text2);
                    label = this.renderer.label(text, 100, 120)
                        .attr({
                            fill: Highcharts.getOptions().colors[0],
                            padding: 10,
                            r: 5,
                            zIndex: 8
                        })
                        .css({
                            color: '#FFFFFF'
                        })
                        .add();
                    setTimeout(function () {
                        label.fadeOut();
                    }, 1000);
                }
            },
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: ' '
        },
        subtitle: {
            text: ' '
        },

        xAxis: {
            type: 'datetime',
            labels: {
                step: 4,
                formatter: function () {
                    //return Highcharts.dateFormat('%m-%d %H:%M:%S', this.value);
                    var v = new Date(this.value).format('yyyy-MM-dd hh:mm:ss');
                    return v;
                }
            }
        },
        yAxis: {
            title: {
                text: '  (ms)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x}  , {point.y} ms'
                }
            }
        },
        series: [{
            name: 'Critical',
            color: '#fd7865',
            data: ajaxData.criticalScatter
        },{
            name: 'Warning',
            color: '#fcc666',
            data: ajaxData.warningScatter
        },{
            name: 'Normal',
            color: '#b6da54',
            data: ajaxData.normalScatter
        }]
    });

}

var transactionApp = angular.module('transactionApp', []);
transactionApp.controller('transactionCtrl', function ($scope, $http,$location) {

    //$scope.appName=QueryString('service');;
    $scope.appId=QueryString('appid');
    appId = $scope.appId;
    $scope.serviceId=QueryString('serviceid');
    serviceId = $scope.serviceId;
    $scope.instanceId=QueryString('instanceid');
    instanceId = $scope.instanceId;
    $scope.type = QueryString('type');
    $scope.from = QueryString('from');
    //selectedStartTime = $scope.from;
    $scope.to = QueryString('to');
    //selectedEndTime = $scope.to;
    //console.log("$scope.to : " + $scope.to);

    $scope.to = checkToStr($scope.to);
    //console.log("$scope.to : " + $scope.to);

    $scope.level = QueryString('level');

    $scope.health = QueryString('health');
    if($scope.health == 'All'){
        $scope.typeFilter = '';
    }else{
        $scope.typeFilter = $scope.health;
    }


    $scope.fromStr = new Date(parseInt($scope.from)).format('yyyy-MM-dd hh:mm:ss');
    $scope.toStr = new Date(parseInt($scope.to)).format('yyyy-MM-dd hh:mm:ss');
    $scope.topN = 10000;

    // 排序
    $scope.sortflag = ["unknown","Ascending","Descending"];
    $scope.sortbycallsflag =  $scope.sortflag[0];
    $scope.sortbyerrorsflag =  $scope.sortflag[0];
    $scope.sortbyresponseTimeflag =  $scope.sortflag[0];

    $scope.sortbyTypeInitSrc =  "../img/sort_16px_init.png";
    $scope.sortbyTypeSSrc =  "../img/sort_16px_s.png";
    $scope.sortbyTypeXSrc =  "../img/sort_16px_x.png";

    $scope.sortbycallsSrc =  "../img/sort_16px_init.png";
    $scope.sortbyerrorsSrc =  "../img/sort_16px_init.png";
    $scope.sortbyresponseTimeSrc =  "../img/sort_16px_init.png";
    $scope.appList = [""];
    $scope.showLastIterms = [""];
    $scope.showMoreOrTopN = "Show TopN";

    $scope.showFullLocation = false;
    $scope.hideService = false;
    $scope.hideInstance = false;
    $scope.lastItem = "";
    loadingBarReset();
    console.time('ajaxData');

    $scope.healthTypes = [{"id":"","value":"All"},{"id":"Normal","value":"Normal"},{"id":"Warning","value":"Warning"},{"id":"Critical","value":"Critical"}]

    if($scope.serviceId == null && $scope.instanceId ==null){
        //transactions/applications/EMS
        $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+$scope.appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        $scope.lastItem = $scope.appId;
        $scope.hideService = true;
        $scope.hideInstance = true;
        console.log("$scope.serviceId == null && $scope.instanceId ==null");
    }else if($scope.serviceId != null && $scope.instanceId ==null){
        //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca
        $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+$scope.appId+"/services/"+ $scope.serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        $scope.lastItem = $scope.serviceId;
        $scope.hideService = false;
        $scope.hideInstance = true;
        console.log("$scope.serviceId != null && $scope.instanceId ==null");
    }else {
        //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
        $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+$scope.appId+"/services/"+ $scope.serviceId+"/instances/"+$scope.instanceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        $scope.lastItem = $scope.instanceId;
        $scope.hideService = false;
        $scope.hideInstance = false;
        console.log("$scope.serviceId != null && $scope.instanceId !=null");
    }

    //$scope.tableUrl="../mockjson/transactionTable.json";
    //$scope.tableUrl = dataSourceURL() +"/transactions.pinpoint?level=" + $scope.level +   "&name=" + $scope.appName +"&from=" + $scope.from + "&to=" + $scope.to;
    console.log("transactionTableUrl = " + $scope.tableUrl);

    $scope.order = "calls";
    $scope.records = [""];
    $http.get($scope.tableUrl)
        .success(function (response) {
            $scope.healthTypes = [{"id":"","value":"All"},{"id":"Normal","value":"Normal"},{"id":"Warning","value":"Warning"},{"id":"Critical","value":"Critical"}]
            loadingBarFade();
            console.log( response);
            $scope.records = response.tables;
            $scope.apps = response.apps;
            if($scope.serviceId == null && $scope.instanceId ==null){
                $scope.showLastIterms = $scope.getCurrentApps();
            }else if($scope.serviceId != null && $scope.instanceId ==null){
                $scope.showLastIterms = $scope.getCurrentServices($scope.appId);
            } else {
                $scope.showLastIterms  = $scope.getCurrentInstances($scope.appId,$scope.serviceId);
            }
            console.log("get showLastIterms");
            console.log($scope.showLastIterms);
            // 链接过来有type,则根据type类型进行排序；
            if($scope.type === "calls"){
                $scope.sortByCalls();
            } else if($scope.type === "errors"){
                $scope.sortByErrors();
            } else if($scope.type === "reponsetime"){
                $scope.sortByResponseTime();
            }
            $scope.types = response.typeList;
            console.timeEnd('ajaxData');
        }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    // 获取apps
    $scope.getCurrentApps = function () {
        console.log("apps:");
        console.log($scope.apps);
        return $scope.apps;

    }
    // 根据appid获取services
    $scope.getCurrentServices = function(appid){
        for (var i=0;i<$scope.apps.length;i++){
            if ($scope.apps[i].name === appid){
                console.log("services:");
                console.log( $scope.apps[i].services);
                return $scope.apps[i].services;
            }
        }
    }
    // 根据appid和serviceid获取instances
    $scope.getCurrentInstances = function (appid,serviceId) {
        for (var i=0;i<$scope.apps.length;i++){
            if ($scope.apps[i].name === appid){
                for(var j=0;j<$scope.apps[i].services.length;j++){
                    if ($scope.apps[i].services[j].name === serviceId){
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
        console.log("showFullLocation:"+$scope.showFullLocation);
    }
    $scope.changeLastIterm = function (showLastIterm) {
        // $scope.appId = showLastIterm.name;
        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );

        $scope.healthTypes = [{"id":"","value":"All"},{"id":"Normal","value":"Normal"},{"id":"Warning","value":"Warning"},{"id":"Critical","value":"Critical"}]

        if(showLastIterm.level === "application"){
            $scope.appId = showLastIterm.name;
            $scope.serviceId = "";
            $scope.instanceId = "";
            //transactions/applications/EMS
            $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+showLastIterm.name+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else if(showLastIterm.level === "service"){
            $scope.appId = showLastIterm.appName;
            $scope.serviceId = showLastIterm.name;
            $scope.instanceId = "";
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca
            $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+showLastIterm.appName+"/services/"+ showLastIterm.name+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else {
            $scope.appId = showLastIterm.appName;
            $scope.serviceId = showLastIterm.serviceName;
            $scope.instanceId = showLastIterm.name;
            //http://10.63.212.143:28080/transactions/applications/EMS/services/EMS_uca/instances/EMS_uca.pinpoint?
            $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+showLastIterm.appName+"/services/"+ showLastIterm.serviceName+"/instances/"+showLastIterm.name+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }
        var _tempcurrentAppName = getCookie("currentAppName");
        if($scope.appId != ""){
            setCookie("currentAppName",$scope.appId,1);
        }

        $scope.lastItem = showLastIterm.name;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $http.get($scope.tableUrl)
            .success(function (response) {
                loadingBarFade();
                console.log( response);
                $scope.records = response.tables;
                $scope.apps = response.apps;
                // 链接过来有type,则根据type类型进行排序；
                if($scope.type === "calls"){
                    $scope.sortByCalls();
                } else if($scope.type === "errors"){
                    $scope.sortByErrors();
                } else if($scope.type === "reponsetime"){
                    $scope.sortByResponseTime();
                }
                $scope.types = response.typeList;
                console.timeEnd('ajaxData');
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }
    $scope.ClickShowCurrentApp = function (appId) {
        if($scope.hideService === true && $scope.hideInstance === true){
            $scope.showFullLocation = false;
            console.log("showFullLocation:"+$scope.showFullLocation);
            return;
        }
        $scope.lastItem = appId;
        $scope.showFullLocation = false;
        $scope.hideService = true;
        $scope.hideInstance = true;
        $scope.appId = appId;
        $scope.serviceId = "";
        $scope.instanceId = "";
        console.log("$scope.appId:"+$scope.appId);
        $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.showLastIterms = [""];
        $scope.records = [""];
        $http.get($scope.tableUrl)
            .success(function (response) {
                loadingBarFade();
                console.log( response);
                $scope.records = response.tables;
                $scope.apps = response.apps;
                $scope.showLastIterms = $scope.getCurrentApps();
                console.log("ClickShowCurrentApp:");
                console.log("$scope.showLastIterms:");
                console.log($scope.showLastIterms);
                // 链接过来有type,则根据type类型进行排序；
                if($scope.type === "calls"){
                    $scope.sortByCalls();
                } else if($scope.type === "errors"){
                    $scope.sortByErrors();
                } else if($scope.type === "reponsetime"){
                    $scope.sortByResponseTime();
                }
                $scope.types = response.typeList;
                console.timeEnd('ajaxData');
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }
    $scope.ClickShowCurrentService = function (appId,serviceId) {
        if($scope.hideService === false && $scope.hideInstance === true){
            $scope.showFullLocation = false;
            console.log("showFullLocation:"+$scope.showFullLocation);
            return;
        }
        $scope.lastItem = serviceId;
        $scope.showFullLocation = false;
        $scope.hideService = false;
        $scope.hideInstance = true;
        $scope.appId = appId;
        $scope.serviceId = serviceId;
        $scope.instanceId = "";
        $scope.tableUrl = dataSourceURL() +"/transactions/applications/"+appId+"/services/"+serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        console.log("transactionTableUrl = " + $scope.tableUrl);
        $scope.showLastIterms = [""];
        $scope.records = [""];
        $http.get($scope.tableUrl)
            .success(function (response) {
                loadingBarFade();
                console.log( response);
                $scope.records = response.tables;
                $scope.apps = response.apps;
                $scope.showLastIterms  = $scope.getCurrentServices(appId);
                console.log("ClickShowCurrentService:");
                console.log($scope.showLastIterms);
                // 链接过来有type,则根据type类型进行排序；
                if($scope.type === "calls"){
                    $scope.sortByCalls();
                } else if($scope.type === "errors"){
                    $scope.sortByErrors();
                } else if($scope.type === "reponsetime"){
                    $scope.sortByResponseTime();
                }
                $scope.types = response.typeList;
                console.timeEnd('ajaxData');
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }
    $scope.loadMoreOrShowTopNDate = function(){
        if($scope.showMoreOrTopN !== "Show More"){
            $scope.showMoreOrTopN = "Show More";
            $scope.topN = getCommonTopNNum();

        } else {
            $scope.topN = $scope.records.length;
            $scope.showMoreOrTopN = "Show TopN";
        }
    }



    // 根据calls进行排序;
    $scope.sortByCalls = function(){
        console.log("sortByCalls");
        $scope.sortbyerrorsflag = $scope.sortflag[0];
        document.getElementById("sortByErrors").setAttribute("src","../img/sort_16px_init.png");
        // $scope.sortbyerrorsSrc = $scope.sortbyTypeInitSrc;
        $scope.sortbyresponseTimeflag = $scope.sortflag[0];
        // $scope.sortbyresponseTimeSrc = $scope.sortbyTypeInitSrc;
        document.getElementById("sortByResponseTime").setAttribute("src","../img/sort_16px_init.png");
        if($scope.sortbycallsflag == $scope.sortflag[0]) {
            $scope.sortbycallsflag = $scope.sortflag[2];
            // $scope.sortbycallsSrc =  $scope.sortbyTypeXSrc;
            document.getElementById("sortByCalls").setAttribute("src","../img/sort_16px_x.png");
            $scope.sortByType();
        }
    }
    // 根据errors进行排序;
    $scope.sortByErrors = function(){
        console.log("sortByErrors");
        $scope.sortbycallsflag = $scope.sortflag[0];
        // $scope.sortbycallsSrc =  $scope.sortbyTypeInitSrc;
        document.getElementById("sortByCalls").setAttribute("src","../img/sort_16px_init.png");
        $scope.sortbyresponseTimeflag = $scope.sortflag[0];
        // $scope.sortbyresponseTimeSrc = $scope.sortbyTypeInitSrc;
        document.getElementById("sortByResponseTime").setAttribute("src","../img/sort_16px_init.png");
        if($scope.sortbyerrorsflag == $scope.sortflag[0]) {
            $scope.sortbyerrorsflag = $scope.sortflag[2];
            // $scope.sortbyerrorsSrc =  $scope.sortbyTypeXSrc;
            document.getElementById("sortByErrors").setAttribute("src","../img/sort_16px_x.png");
            $scope.sortByType();
        }
    }
    // 根据responseTime进行排序;
    $scope.sortByResponseTime = function(){
        console.log("sortByResponseTime");
        $scope.sortbycallsflag = $scope.sortflag[0];
        // $scope.sortbycallsSrc =  $scope.sortbyTypeInitSrc;
        document.getElementById("sortByCalls").setAttribute("src","../img/sort_16px_init.png");
        $scope.sortbyerrorsflag = $scope.sortflag[0];
        // $scope.sortbyerrorsSrc = $scope.sortbyTypeInitSrc;
        document.getElementById("sortByErrors").setAttribute("src","../img/sort_16px_init.png");
        if($scope.sortbyresponseTimeflag == $scope.sortflag[0]) {
            $scope.sortbyresponseTimeflag = $scope.sortflag[2];
            // $scope.sortbyresponseTimeSrc =  $scope.sortbyTypeXSrc;
            document.getElementById("sortByResponseTime").setAttribute("src","../img/sort_16px_x.png");
            $scope.sortByType();
        }
    }
    // 根据类型进行排序;
    $scope.sortByType = function(){
        if($scope.sortbycallsflag != $scope.sortflag[0]) {
            if($scope.sortbycallsflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acomparecalls);
            }
        } else if($scope.sortbyerrorsflag != $scope.sortflag[0]) {
            if($scope.sortbyerrorsflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acompareerrors);
            }
        } else if($scope.sortbyresponseTimeflag != $scope.sortflag[0]) {
            if($scope.sortbyresponseTimeflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acompareresponseTime);
            }
        }
    }
    $scope.acomparecalls = function(value1, value2) {
        if (value1.calls < value2.calls) {
            return 1;
        } else if (value1.calls  > value2.calls ) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcomparecalls = function(value1, value2) {
        if (value1.calls < value2.calls) {
            return -1;
        } else if (value1.calls  > value2.calls ) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.acompareerrors = function(value1, value2) {
        if (value1.errors < value2.errors) {
            return 1;
        } else if (value1.errors  > value2.errors ) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcompareerrors = function(value1, value2) {
        if (value1.errors < value2.errors) {
            return -1;
        } else if (value1.errors  > value2.errors ) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.acompareresponseTime = function(value1, value2) {
        if (value1.responseTime < value2.responseTime) {
            return 1;
        } else if (value1.responseTime  > value2.responseTime ) {
            return -1;
        } else {
            return 0;
        }
    }
    $scope.dcompareresponseTime = function(value1, value2) {
        if (value1.responseTime < value2.responseTime) {
            return -1;
        } else if (value1.responseTime  > value2.responseTime ) {
            return 1;
        } else {
            return 0;
        }
    }
    $scope.sortByType = function(){
        if($scope.sortbycallsflag != $scope.sortflag[0]) {
            if($scope.sortbycallsflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acomparecalls);
            }
        } else if($scope.sortbyerrorsflag != $scope.sortflag[0]) {
            if($scope.sortbyerrorsflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acompareerrors);
            }
        } else if($scope.sortbyresponseTimeflag != $scope.sortflag[0]) {
            if($scope.sortbyresponseTimeflag == $scope.sortflag[2]) {
                $scope.records.sort($scope.acompareresponseTime);
            }
        }
    }


    $scope.selectOneTrace = function (cmdname) {
        console.log("cmdname = " + cmdname);
        //selectedUrl =  "../mockjson/tranxTopo.json?from="+$scope.from+"&to="+$scope.to +"&command="+cmdname;
        if(serviceId == null && instanceId ==null){
            //http://10.62.100.77:8080/tranxTopo/applications/IaasOps.pinpoint?
            selectedUrl = dataSourceURL()+"/tranxTopo/applications/"+ $scope.appId +".pinpoint?from="+$scope.from+"&to="+$scope.to +"&command="+cmdname;
        }else if($scope.serviceId != null && $scope.instanceId ==null){
            selectedUrl = dataSourceURL()+"/tranxTopo/applications/"+ $scope.appId +"/services/"+serviceId+".pinpoint?from="+$scope.from+"&to="+$scope.to +"&command="+cmdname;
        }else {
            selectedUrl = dataSourceURL()+"/tranxTopo/applications/"+ $scope.appId +"/services/"+serviceId+"/instances/"+instanceId+".pinpoint?from="+$scope.from+"&to="+$scope.to +"&command="+cmdname;
        }
        console.log("selectedUrl = " + selectedUrl);

    };

    //更新方法
    $scope.replaceModel = function () {
        //$http.get("../mockjson/traceDetail1.json")
        $http.get(selectedUrl)
            //$http.get("http://10.63.212.141:1337/10.63.212.139:28080/applicationDashBoard.pinpoint")
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
        myDiagram.model = new go.GraphLinksModel(response["nodes"], response["links"]);
        myDiagram.layout.invalidateLayout();

        //update chart
        /*var cpuOptions = cpuChartAtResource.getOption();
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
        netChartAtResource.setOption(netOptions);*/

    }



    //更新Scatter
    $scope.updateScatter = function () {
        if($scope.serviceId == null && $scope.instanceId ==null){
            //transScatter/applications/EMS
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else if($scope.serviceId != null && $scope.instanceId ==null){
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+"/services/"+ $scope.serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else {
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+"/services/"+ $scope.serviceId+"/instances/"+$scope.instanceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }

        console.log("scatterUrl = " + $scope.scatterUrl);
        $http.get($scope.scatterUrl)
            .success(function (response) {
                loadingBarFade();

                /*//update scatter
                var scatterOptions=scatterChartAtResource.getOption();
                /!*scatterOptions.series[0].data=mockScatterPointArrayRed();
                scatterOptions.series[1].data=mockScatterPointArray();*!/
                scatterOptions.series[0].data=response.criticalScatter;
                scatterOptions.series[1].data=response.warningScatter;
                scatterOptions.series[2].data=response.normalScatter;

                scatterChartAtResource.hideLoading();
                scatterChartAtResource.setOption(scatterOptions);*/

                drawScatter($scope.from,$scope.to,response);
            }).error(function (data) {
                console.log("ajaxError:\n" + data.error + "\n" + data.message);
                loadingBarFadeOut();
            });

    }




    //更新Scatter
    $scope.updateScatterHigh = function () {
        if($scope.serviceId == null && $scope.instanceId ==null){
            //transScatter/applications/EMS
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else if($scope.serviceId != null && $scope.instanceId ==null){
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+"/services/"+ $scope.serviceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }else {
            $scope.scatterUrl = dataSourceURL() +"/transScatter/applications/"+$scope.appId+"/services/"+ $scope.serviceId+"/instances/"+$scope.instanceId+".pinpoint?from=" + $scope.from + "&to=" + $scope.to;
        }

        console.log("scatterUrl = " + $scope.scatterUrl);
        $http.get($scope.scatterUrl)
            .success(function (response) {
                loadingBarFade();

                /*//update scatter
                 var scatterOptions=scatterChartAtResource.getOption();
                 /!*scatterOptions.series[0].data=mockScatterPointArrayRed();
                 scatterOptions.series[1].data=mockScatterPointArray();*!/
                 scatterOptions.series[0].data=response.criticalScatter;
                 scatterOptions.series[1].data=response.warningScatter;
                 scatterOptions.series[2].data=response.normalScatter;

                 scatterChartAtResource.hideLoading();
                 scatterChartAtResource.setOption(scatterOptions);*/

                drawScatterHigh($scope.from,$scope.to,response);
            }).error(function (data) {
                console.log("ajaxError:\n" + data.error + "\n" + data.message);
                loadingBarFadeOut();
            });

    }

    $scope.getResponseTimeColor =  function(v){
        if(v>=100){
            return 'red';
        }else{
            return '#4F6B72';
        }
    };

    $scope.acomparecalls = function(value1, value2){
        if (value1.calls < value2.calls) {
            return 1;
        } else if (value1.calls  > value2.calls ) {
            return -1;
        } else {
            return 0;
        }
    }

    function QueryString(item){
        console.log(item.toString() + " : ");
        var sValue = $location.absUrl().match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        console.log(sValue ? sValue[1] : sValue);
        return sValue ? sValue[1] : sValue;
    }

    function checkToStr(str){
        try {
            var loc = str.indexOf('#');
        } catch(err) {
            return '';
        }

        if(loc == -1){
            return str;
        }else{
            return str.substring(0,loc);
        }
    }


    $scope.myFilter = function (item, type) {
        //return item.path == '/favicon.ico';
        return item.path == type;
        //return true;
    };
});


/*----- chart -----*/
transactionApp.directive('cpuChart', function () {
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

transactionApp.directive('memChart', function () {
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



transactionApp.directive('storeChart', function () {
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


transactionApp.directive('netChart', function () {
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



transactionApp.directive('scatterChart', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link: function () {
            scatterOption = {
                title : {
                    text: '',
                    subtext: ''
                },
                dataZoom: {
                showDetail: true
            },
                color: [
                    "red",
                    "#FF9326",
                    "#79DD1B"
                    /*"#87cefa"*/],
                /*tooltip : {
                    trigger: 'axis',
                    axisPointer:{
                        show: true,
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },*/
                tooltip : {
                    trigger: 'axis',
                    formatter : function (params) {
                        var date = new Date(params.value[0]);
                        return params.seriesName
                            + ' （'
                            + date.getFullYear() + '-'
                            + (date.getMonth() + 1) + '-'
                            + date.getDate() + ' '
                            + date.getHours() + ':'
                            + date.getMinutes()+ ':'
                            + date.getSeconds()
                            +  '）<br/>'
                            + params.value[1] + ', '
                            + params.value[2];
                    },
                    axisPointer:{
                        type : 'cross',
                        lineStyle: {
                            type : 'dashed',
                            width : 1
                        }
                    }
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataZoom : {show: true},
                    }
                },


                xAxis : [
                    {
                        type : 'time'/*,
                        splitNumber:10*/
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                      /*  scale:true,*/
                        axisLabel : {
                            formatter: '{value} ms'
                        }
                    }
                ],
                series : [
                    {
                        name:'critical',
                        type:'scatter',
                        tooltip : {
                            trigger: 'axis',
                            formatter : function (params) {
                                var date = new Date(params.value[0]);
                                return params.seriesName
                                    + ' （'
                                    + date.getFullYear() + '-'
                                    + (date.getMonth() + 1) + '-'
                                    + date.getDate() + ' '
                                    + date.getHours() + ':'
                                    + date.getMinutes()+ ':'
                                    + date.getSeconds()
                                    +  '）<br/>'
                                    + params.value[1] + ', '
                                    + params.value[2];
                            },
                            axisPointer:{
                                type : 'cross',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        data: [[0,0] ]
                    },
                    {
                        name:'warning',
                        type:'scatter',
                        tooltip : {
                            trigger: 'axis',
                            formatter : function (params) {
                                var date = new Date(params.value[0]);
                                return params.seriesName
                                    + ' （'
                                    + date.getFullYear() + '-'
                                    + (date.getMonth() + 1) + '-'
                                    + date.getDate() + ' '
                                    + date.getHours() + ':'
                                    + date.getMinutes()+ ':'
                                    + date.getSeconds()
                                    +  '）<br/>'
                                    + params.value[1] + ', '
                                    + params.value[2];
                            },
                            axisPointer:{
                                type : 'cross',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        data: [[0,0] ]
                    },
                    {
                        name:'normal',
                        type:'scatter',
                        tooltip : {
                            trigger: 'axis',
                            formatter : function (params) {
                                var date = new Date(params.value[0]);
                                return params.seriesName
                                    + ' （'
                                    + date.getFullYear() + '-'
                                    + (date.getMonth() + 1) + '-'
                                    + date.getDate() + ' '
                                    + date.getHours() + ':'
                                    + date.getMinutes()+ ':'
                                    + date.getSeconds()
                                    +  '）<br/>'
                                    + params.value[1] + ', '
                                    + params.value[2];
                            },
                            axisPointer:{
                                type : 'cross',
                                lineStyle: {
                                    type : 'dashed',
                                    width : 1
                                }
                            }
                        },
                        data: [[0,0] ]
                    }
                ]
            };

            scatterChartAtResource = echarts.init(document.getElementById("scatterChart"), bluetheme);
            scatterChartAtResource.showLoading({
                text: "loading..."
            });
            scatterChartAtResource.setOption(scatterOption);
            scatterChartAtResource.hideLoading();


            //var ecConfig = require('echarts/config');
            function eConsole(param) {
                var mes = '【' + param.type + '】';
                if (typeof param.seriesIndex != 'undefined') {
                    mes += '  seriesIndex : ' + param.seriesIndex;
                    mes += '  dataIndex : ' + param.dataIndex;
                }
                if (param.type == 'hover') {
                    document.getElementById('hover-console').innerHTML = 'Event Console : ' + mes;
                }
                else {
                    /*mes = param.zoom.start + "\n" + param.zoom.start2 + "\n" + param.zoom.end + "\n" + param.zoom.end2 +"\n------------";
                    mes =mes + param.zoom.scatterMap[0].x.min + "\n" + param.zoom.scatterMap[0].x.max + "\n" + param.zoom.scatterMap[1].x.min + "\n" + param.zoom.scatterMap[1].x.max ;
                    mes = mes + param.zoom.scatterMap[0].y.min + "\n" + param.zoom.scatterMap[0].y.max + "\n" + param.zoom.scatterMap[1].y.min + "\n" + param.zoom.scatterMap[1].y.max ;
                    document.getElementById('console').innerHTML = mes;
                    console.log(mes);*/
                }

                //if (param.zoom.start != 0 && param.zoom.start2 != 0 && param.zoom.end != 100 && param.zoom.end2 != 100) {
                if (param.type == 'dataZoom') {
                    var timeRangeLen = param.zoom.scatterMap[0].x.max -  param.zoom.scatterMap[0].x.min;
                    var msRangeLen = param.zoom.scatterMap[0].y.max -  param.zoom.scatterMap[0].y.min;

                    console.log("timeRangeLen :" + timeRangeLen);
                    console.log("msRangeLen :" + msRangeLen);

                    var perX = (param.zoom.end-param.zoom.start) ;
                    var perY = (param.zoom.end2-param.zoom.start2);



                    var startTime = Math.ceil(param.zoom.scatterMap[0].x.min + param.zoom.start* timeRangeLen/100);
                    var endTime = Math.floor(param.zoom.scatterMap[0].x.min + param.zoom.end * timeRangeLen/100);

                    var vMin = Math.round(param.zoom.scatterMap[0].y.min + param.zoom.start2 /100* msRangeLen);
                    var vMax = Math.round(param.zoom.scatterMap[0].y.min + param.zoom.end2 /100* msRangeLen);

                    var valueMax = Math.max(vMin,vMax);
                    var valueMin = Math.min(vMin,vMax);
                    //console.log("startTime :" + new Date(param.zoom.scatterMap[0].x.min).format('yyyy-MM-dd hh:mm:ss'));
                    //console.log("endTime :" + new Date(param.zoom.scatterMap[0].x.max).format('yyyy-MM-dd hh:mm:ss'));
                    console.log("startTime :" + new Date(startTime).format('yyyy-MM-dd hh:mm:ss'));
                    console.log("endTime :" + new Date(endTime).format('yyyy-MM-dd hh:mm:ss'));


                    console.log("valueMax :" + valueMax);
                    console.log("valueMin :" + valueMin);

                    if((param.zoom.end != param.zoom.start) && (perX<oldX && perY<oldY )){
                        var url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        if(serviceId == null && instanceId ==null){
                            url = "./trace.html?appid="+appId +"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }else if($scope.serviceId != null && $scope.instanceId ==null){
                            url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }else {
                            url ="./trace.html?appid="+appId+"&serviceid="+ serviceId+"&instanceid="+ instanceId+"&from="+startTime+"&to="+endTime+"&max="+valueMax+"&min="+valueMin;
                        }
                        window.open(url);
                    }

                    oldX = perX;
                    oldY = perY;




                    //console.log(param);
                }


            }
            /*
             // -------全局通用
             REFRESH: 'refresh',
             RESTORE: 'restore',
             RESIZE: 'resize',
             CLICK: 'click',
             DBLCLICK: 'dblclick',
             HOVER: 'hover',
             MOUSEOUT: 'mouseout',
             // -------业务交互逻辑
             DATA_CHANGED: 'dataChanged',
             DATA_ZOOM: 'dataZoom',
             DATA_RANGE: 'dataRange',
             DATA_RANGE_HOVERLINK: 'dataRangeHoverLink',
             LEGEND_SELECTED: 'legendSelected',
             LEGEND_HOVERLINK: 'legendHoverLink',
             MAP_SELECTED: 'mapSelected',
             PIE_SELECTED: 'pieSelected',
             MAGIC_TYPE_CHANGED: 'magicTypeChanged',
             DATA_VIEW_CHANGED: 'dataViewChanged',
             TIMELINE_CHANGED: 'timelineChanged',
             MAP_ROAM: 'mapRoam',
             */
            scatterChartAtResource.on(echarts.config.EVENT.CLICK, eConsole);
//            scatterChartAtResource.on(ecConfig.EVENT.DBLCLICK, eConsole);
////myChart.on(ecConfig.EVENT.HOVER, eConsole);
            scatterChartAtResource.on(echarts.config.EVENT.DATA_ZOOM, eConsole);
            //scatterChartAtResource.on(echarts.config.EVENT.DATA_VIEW_CHANGED, eConsole);
//            scatterChartAtResource.on(ecConfig.EVENT.LEGEND_SELECTED, eConsole);
//            scatterChartAtResource.on(ecConfig.EVENT.MAGIC_TYPE_CHANGED, eConsole);
//            scatterChartAtResource.on(ecConfig.EVENT.DATA_VIEW_CHANGED, eConsole);
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

    // create the model for the concept map
    var nodeDataArray = [
    ];
    var linkDataArray = [
    ];
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}


function update(obj){
    console.log("ojb  ===== "+obj.valueOf());
}


