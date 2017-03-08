$(function () {

    //cb(moment().subtract(10, 'minutes'), moment()); //default setting 2 hours ago
    //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));

    var start =  getCookie("starttime");
    var end =  getCookie("endtime");
    var rg =  getCookie("ranges");

    if (start !== "" && end !== "") {
        console.log("cookie: start time = " + start);
        console.log("cookie: end time = " + end);
        console.log("cookie: ranges = " + rg);

        setDatePicker(start, end,rg);
        datePickerUpdateData(start, end);
    } else {
        cb(moment().subtract(10, 'minutes'), moment());
        //$('#reportrange span').html(moment().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss') + ' - ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        $('#reportrange span').html('10 Minutes');
        document.cookie = "ranges=" + '10 Minutes';
    }
});

function datePickerUpdateData(start,end) {
    var appElement = document.querySelector('[ng-controller=nfvtraceCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.getGids(start,end);
    $scope.replaceModel(start,end);
}

function nfvtraceURL(hostname) {
    if (hostname == 'localhost') {
        var debugIp = "10.62.100.236";
        return "http://" + debugIp + ":8082";
    } else {
        return "http://" + hostname + ":8082";
    }
}


$('.checkbox').mouseenter(function(){
    var removeClassA = $('.checkbox ul li a .clckClass');
    $('.checkbox ul li a').click(function(){
        removeClassA .removeClass('clckClass');
        $(this).addClass('clckClass');
        removeClassA = $(this);
    });
});

function toastFail (msg)
{
    var priority = 'danger';
    var title    = 'Tip';
    var message  = msg;

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSuccess()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Add SubFlow Success!';

    $.toaster({ priority : priority, title : title, message : message });
}

function changeSwitchStatusSuccess()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Change NFV SwitchStatus Success!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSend ()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Sending Data...';

    $.toaster({ priority : priority, title : title, message : message });
}


//angularjs
var nfvtraceApp = angular.module('nfvtraceApp',['chieffancypants.loadingBar']);

nfvtraceApp.controller('nfvtraceCtrl', function ($scope, $http, $timeout ,$location) {
    $scope.selectedTimeRange = null;
    $scope.selectedStartTime = null;
    $scope.selectedEndTime = null;
    $scope.records =  null;
    $scope.gids = [];
    $scope.templates = [];
    $scope.gid = null;
    $scope.templateName = null;
    $scope.subFlowDetail = null;
    $scope.switchStatus = null;


    //更新方法
    $scope.replaceModel = function (start,end) {
        loadingBarReset();
        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;

        console.log('[[[selectedTimeRange]]] = ' + $scope.selectedStartTime + ' ' + $scope.selectedEndTime );

        if($scope.gid === null) return;

        $scope.queryUrl= nfvtraceURL($location.host()) + "/nfvtrace/gid/" + $scope.gid['id'] + "?from="
            // $scope.queryUrl=  "http://10.62.100.139:8082/nfvtrace/gid/123?"   + "&from="
            +$scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        console.log("queryUrl = " + $scope.queryUrl);
        $http.get($scope.queryUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.model1 = go.Model.fromJson(response);
            }).error(function (data) {
            console.log("ajaxError---replaceModel:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });

    }

    $scope.changeApp = function(gid) {
        $scope.gid = gid;
        $scope.replaceModel($scope.selectedStartTime,$scope.selectedEndTime);
    }

    $scope.getGids = function (start,end) {
        $scope.selectedStartTime = start;
        $scope.selectedEndTime = end;
        var queryEndTime = new Date().getTime();
        var queryStartTime = (queryEndTime - 365 * 24 * 60 * 60 * 1000);
        console.log('[[[selectedTimeRange]]] = ' +queryStartTime + ' ' + queryEndTime );
        $scope.queryGidUrl= nfvtraceURL($location.host()) + "/nfvtrace/gid" + "?from=" +
            queryStartTime +"&to="+queryEndTime;
        console.log("queryGidUrl = " + $scope.queryGidUrl);
        $http.get($scope.queryGidUrl)
            .success(function (response) {
                loadingBarFade();
                $scope.gids = response;
            }).error(function (data) {
            console.log("ajaxError---getGids:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
        });
    }

    $scope.saveSubFlow = function() {

        function readDatas(tab){
            var links=[];

            var link = {};
            var tableData={};
            $("#" + tab + " tbody tr").each(function(trindex,tritem){//遍历每一行
                var link = {};

                $(tritem).children().each(function(tdindex,tditem){
                    if(tdindex === 0) link["from"] = tditem.textContent;
                    if(tdindex === 1) link["to"] = tditem.textContent;
                    if(tdindex === 2) link["eventId"] = tditem.textContent;
                    if(tdindex === 3) link["description"] = tditem.textContent;

                });

                links.push(link);

            });

            return links;
        }

        var subflowName = $scope.subflowName ;
        var links = readDatas('subflowTable');
        var postUrl = nfvtraceURL($location.host()) + "/subflowtrace/subflow";
        var postData = [{"name":subflowName,"links":links}];
        console.log(links);

        if(subflowName === "" || subflowName === undefined) {
            toastFail('subflowName can not be empty!');
            return;
        }


        console.log("postUrl = " + postUrl);
        toastSend();
        $http.post(postUrl,postData)
            .success(function (response) {
                loadingBarFade();
                $("#infoDiv").fadeOut("fast");

                loadTemplates();
                toastSuccess();

            }).error(function (data) {
            console.log("ajaxError---saveSubFlow:\n" + data.error + "\n" + data.message);
            loadingBarFadeOut();
            toastFail('Add SubFlow Fail!');
        });

    }


    $scope.load = function(){
        loadTemplates();
        getSwitchStatus();
    }


    function getSwitchStatus() {
        $scope.getSwitchStatusUrl = nfvtraceURL($location.host()) + "/nfvtrace/switch"
        $http.get($scope.getSwitchStatusUrl)
            .success(function (response) {
                if(response.status==0){
                    if(!($("#on").hasClass("select")) && ($("#off").hasClass("select"))){
                        $("#off").removeClass("select").addClass("unselect");
                        $("#on").removeClass("unselect").addClass("select");
                    }

                }else if(response.status==1){
                    if(($("#on").hasClass("select")) && !($("#off").hasClass("select"))){
                        $("#on").removeClass("select").addClass("unselect");
                        $("#off").removeClass("unselect").addClass("select");
                    }
                }
            }).error(function (data) {
            console.log("ajaxError---getSwitchStatus:\n" + data.error + "\n" + data.message);
        });

    }


    $scope.getSubFlowDetail = function (templateName) {
        $scope.templateName = templateName;
        $scope.querySubFlowDetailUrl= nfvtraceURL($location.host()) + "/subflowtrace/dashBoard/subflow" +
            "?name="+templateName+"&from=" + $scope.selectedStartTime +"&to="+$scope.selectedEndTime;
        $http.get($scope.querySubFlowDetailUrl)
            .success(function (response) {
                $scope.subFlowDetail = response.data;
                var subflowData = $scope.subFlowDetail["subflow"];
                $scope.model2 = go.Model.fromJson(subflowData);
            }).error(function (data) {
            console.log("ajaxError---getSubFlowDetail:\n" + data.error + "\n" + data.message);
        });
    }

    function loadTemplates() {
        $scope.queryTemplatesUrl = nfvtraceURL($location.host()) + "/subflowtrace/subflow"
        $http.get($scope.queryTemplatesUrl)
            .success(function (response) {
                $scope.templates = response.data;
            }).error(function (data) {
            console.log("ajaxError---loadTemplates:\n" + data.error + "\n" + data.message);
        });

    }

    $scope.deleteTemplate = function () {

        var result = new Array();
        $("[name = chkItem]:checkbox").each(function () {
            if ($(this).is(":checked")) {
                result.push($(this).attr("value"));
            }
        });

        if(result.length !=0){
            var delTemplate = confirm('Are you absolutely sure you want to delete?');
            if (delTemplate){
                $scope.delSubflowUrl = nfvtraceURL($location.host()) + "/subflowtrace/subflow/del";
                $http.post($scope.delSubflowUrl, JSON.stringify(result)
                ).success(function(){

                    loadTemplates();
                    $scope.subFlowDetail.topn = null;
                    $scope.subFlowDetail.avgElapse = 0
                    $scope.subFlowDetail.instances = 0
                    $scope.subFlowDetail.errors = 0
                    $scope.model2 = go.Model.fromJson([]);

                }).error(function (data) {
                    console.log("ajaxError---deleteTemplate:\n" + data.error + "\n" + data.message);
                });
            }
        }


    }

    $scope.showSubFlowDiag = function(traceSequence){
        $scope.model3 = go.Model.fromJson(traceSequence);
    }

    function switchPost() {
        $scope.trackSwitchUrl = nfvtraceURL($location.host()) + "/nfvtrace/switch";
        $http.post($scope.trackSwitchUrl, JSON.stringify($scope.switchStatus)
        ).success(function (response) {
            if (response.status == 0) {
                changeSwitchStatusSuccess();
            } else {
                toastFail('Change NFV SwitchStatus Fail!')
                if(($("#on").hasClass("select")) && !($("#off").hasClass("select"))){
                    $("#on").removeClass("select").addClass("unselect");
                    $("#off").removeClass("unselect").addClass("select");
                }else {
                    $("#on").removeClass("unselect").addClass("select");
                    $("#off").removeClass("select").addClass("unselect");
                }
            }
        }).error(function (data) {
            console.log("ajaxError---trackSwitch:\n" + data.error + "\n" + data.message);
            toastFail('Change NFV SwitchStatus Fail!');
        });
    }

    $scope.statusChange = function () {

        $scope.switchStatus = null;
        if(($("#on").hasClass("select")) && !($("#off").hasClass("select"))){
            $scope.switchStatus = false;
        }else {
            $scope.switchStatus = true;
        }
        switchPost();
    }


});

nfvtraceApp.service('statusFilter', function() {
    this.filterStatus = function (x) {
        if (x == 0)
            return 'normal'
        else
            return 'exception';
    }
});

nfvtraceApp.filter('statusFormat',['statusFilter', function(statusFilter) {
    return function(x) {
        return statusFilter.filterStatus(x);
    };
}]);



