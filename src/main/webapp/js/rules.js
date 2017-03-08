var rulesApp = angular.module('rulesApp', []);

rulesApp.controller('rulesCtrl', function ($scope, $http, $location) {
    $scope.currentAppName = "test";
    $scope.selectedObj = "test";
    $scope.appName = "";
    $scope.names = "";

    $scope.selectedObjName = "";
    $scope.selectableAppNames = "";
    $scope.selectableSvcNames = "";

    $scope.selectRuleType = "app";
    $scope.selectedMetricName = "";

    $scope.enableStatusCheckbox = true;
    $scope.selectableWaitObjs = "";

    $scope.selectedObjsParam = "";
    $scope.metricNameParam = "calls";
    $scope.selectEventType = "";

    //============== get selectable objs ==============
    // $scope.selectableObjsUrl = "../mockjson/selectableObjs1.json";
    $scope.selectableObjsUrl = dataSourceURL()+"/dashBoard/fullASI.pinpoint";
    console.log("selectableObjsUrl = " + $scope.selectableObjsUrl);
    $http.get($scope.selectableObjsUrl).success(function (response) {

            $scope.selectableAppNames = [];
            $scope.selectableSvcNames = [];
            $scope.selectableInstanceNames = [];

            $scope.appsTmp = response.apps;
            for (var i = 0; i < $scope.appsTmp.length; i++) {
                var v_appName = "app="+$scope.appsTmp[i].name;
                $scope.selectableAppNames.push(v_appName);
                var v_svc = $scope.appsTmp[i].services;
                for (var j = 0; j < v_svc.length; j++){
                    var v_svcName= v_appName +",service="+v_svc[j].name;
                    $scope.selectableSvcNames.push(v_svcName);
                    var v_ins = v_svc[j].instances;
                    for(var k = 0; k < v_ins.length; k++){
                        var v_insName= v_appName +",service="+v_svc[j].name+",instance="+v_ins[k].name;
                        $scope.selectableInstanceNames.push(v_insName);
                    }
                }
            }

            $scope.selectableWaitObjs = $scope.selectableAppNames;

        getTransactionObDN();
        }).error(function (data) {
        console.log("http error: " + "cannot get data from " + $scope.host + resUrl);
    });

    $scope.hostUrl= dataSourceURL()+"/serverlist.pinpoint";
    $http.get($scope.hostUrl)
        .success(function (response) {
            console.log("hostUrl: " + $scope.hostUrl);
            $scope.selectableTmp = response.serverlist;
            $scope.selectableHostNames = [];
            for(var i=0;i< $scope.selectableTmp.length;i++) {
                var host = "hostid=" + $scope.selectableTmp[i].fullname;
                $scope.selectableHostNames.push(host);
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
    });

    var getTransactionObDN = function () {
        $scope.transactionUrl= dataSourceURL()+"/transactions/list.pinpoint";
        $http.get($scope.transactionUrl)
            .success(function (response) {
                console.log("transactionUrl: " + $scope.transactionUrl);
                $scope.selectableTransactions = [];
                $scope.selectableTmp = response.traceList;
                for (var i=0;i<$scope.selectableAppNames.length;i++){
                    var appName = $scope.selectableAppNames[i];
                    for(var j=0;j< $scope.selectableTmp.length;j++) {
                        var transactionName = appName + ",name=" + $scope.selectableTmp[j].fullname;
                        $scope.selectableTransactions.push(transactionName);
                    }
                }

                for (var i=0;i<$scope.selectableSvcNames.length;i++){
                    var svrName = $scope.selectableSvcNames[i];
                    for(var j=0;j< $scope.selectableTmp.length;j++) {
                        var transactionName = svrName + ",name=" + $scope.selectableTmp[j].fullname;
                        $scope.selectableTransactions.push(transactionName);
                    }
                }

                for (var i=0;i<$scope.selectableInstanceNames.length;i++){
                    var insName = $scope.selectableInstanceNames[i];
                    for(var j=0;j< $scope.selectableTmp.length;j++) {
                        var transactionName = insName + ",name=" + $scope.selectableTmp[j].fullname;
                        $scope.selectableTransactions.push(transactionName);
                    }
                }
            }).error(function (data) {
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
        });
    }


    $scope.queryDBListUrl= dataDBSourceURL()+"/mysql_monitor/dblist";
    $http.get($scope.queryDBListUrl)
        .success(function (response) {
            console.log("queryDBListUrl: " + $scope.queryDBListUrl);
            $scope.selectableDBNames = [];
            $scope.selectableTmp = response;
            for(var i=0;i< $scope.selectableTmp.length;i++) {
                $scope.selectableDBNames.push($scope.selectableTmp[i].dbName);
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
    });


    // =================== get selectable metric ==============
    $scope.selectableMetricUrl = "../mockjson/selectableMetric.json";
    console.log("selectableMetricUrl = " + $scope.selectableMetricUrl);
    $http.get($scope.selectableMetricUrl)
        .success(function (response) {
            $scope.metricNames = response;

            $scope.selectableWaitMetrics = response.app;
        }).error(function (data) {
        console.log("http error: " + "cannot get data from " + $scope.host + resUrl);
    });

    // =================== get eventType code ==============
    $scope.eventTypeUrl = "../mockjson/eventType.json";
    console.log("eventTypeUrl = " + $scope.eventTypeUrl);
    $http.get($scope.eventTypeUrl)
        .success(function (response) {
            $scope.eventType = response;

            $scope.selectEventType = response.app;
            $scope.selectedMetricName = $scope.selectEventType[$scope.metricNameParam];
            console.log("now eventType: " + JSON.stringify($scope.selectedMetricName));
        }).error(function (data) {
        console.log("http error: " + "cannot get data from " + $scope.host + resUrl);
    });

    $scope.changeApp = function (v) {
        $scope.selectedObjName = v;
    }

    $scope.deleteOneObj = function (v) {
        console.log("deleteOneObj ===== " + v);
        console.log("pop====" + $scope.selectedValues[0]);

        $scope.selectedObjList.pop($scope.selectedValues[0]);
    }



    //==============   ruleTypeChange ===============
    $scope.selectedRuleType = "";
    $scope.ruleTypeChange = function (v) {
        $scope.selectedRuleType = v;
        //clean selected item
        $scope.selectedObjList = [];
        $scope.selectedObjsParam = "";
        $scope.metricNameParam = $scope.metricNames[v][0].id;

        $scope.selectableWaitMetrics = $scope.metricNames[v];
        $scope.selectEventType =  $scope.eventType[v];
        $scope.selectedMetricName = $scope.selectEventType[$scope.metricNameParam];

        console.log("now eventType: " + JSON.stringify($scope.selectedMetricName));
    }

    //==============   metricName Change ===============
    $scope.metricNameChange = function (v) {
        $scope.selectedMetricName = $scope.selectEventType[v];
        console.log("now eventType: " + JSON.stringify($scope.selectedMetricName));
    }

    $scope.selectedObjList = [];

    $scope.selectableChanged = function () {
        var vv = $scope.selectableValues[0];
        console.log("=====" + $scope.selectableValues[0]);
        if ($scope.selectedObjList.indexOf(vv) == -1) {
            $scope.selectedObjList.push($scope.selectableValues[0]);
        }

        // nosel();
    };

    $scope.selectedChanged = function () {
        console.log("pop====" + $scope.selectedValues[0]);

        $scope.selectedObjList.pop($scope.selectedValues);


    };

    $scope.searchAll = function () {
        $scope.selectedObjName = "";
    };


    //============= addSelectedOjbs2Form ====================
    $scope.addSelectedOjbs2Form = function () {
        $scope.selectedObjsParam = "";
        for(var i=0; i< $scope.selectedObjList.length;i++){
            var t = $scope.selectedObjList[i].replace(/[\r\n]/g,"").trim();
            $scope.selectedObjsParam += '"'+ t + '"' + ",";
        }
        $scope.selectedObjsParam = $scope.selectedObjsParam.substring(0,$scope.selectedObjsParam.length-1);

        console.log("addSelectedOjbs2Form = " + $scope.selectedObjsParam);
        hideSelectableObjDialog();
    };

    //============= openSelectWaitObjsDialog ====================
    $scope.openSelectWaitObjsDialog = function () {
        console.log("selectedRuleType = " + $scope.selectedRuleType);
        switch ($scope.selectedRuleType) {
            case 'app':
                $scope.selectableWaitObjs = $scope.selectableAppNames;
                break;
            case 'service':
                $scope.selectableWaitObjs = $scope.selectableSvcNames;
                break;
            case 'instance':
                $scope.selectableWaitObjs = $scope.selectableInstanceNames;
                break;
            case 'transaction':
                $scope.selectableWaitObjs = $scope.selectableTransactions;
                break;
            case 'host':
                $scope.selectableWaitObjs = $scope.selectableHostNames;
                break;
            case 'db':
                $scope.selectableWaitObjs = $scope.selectableDBNames;
                break;
            default:
                $scope.selectableWaitObjs = $scope.selectableAppNames;
        }
    }

    function rulesURL(hostname) {
        if (hostname == 'localhost') {
            var debugIp = "10.62.100.149";
            return "http://" + debugIp + ":9090";
        } else {
            return "http://" + hostname + ":9090";
        }
    }
    /*-----------------
        get rules
     --------------*/
    $scope.refreshTable = function () {
        // $scope.queryUrl = "http://10.92.217.148:9090/service/cep/getrules?tenantId=apm&appId=apm";
        $scope.queryUrl = rulesURL($location.host()) + "/service/cep/getrules?tenantId=apm&appId=apm";
        // $scope.queryUrl = "../mockjson/newRules.json";
        console.log("queryUrl = " + $scope.queryUrl);
        $http.get($scope.queryUrl)
            .success(function (response) {
                $scope.names = response;
            }).error(function (data) {
            // loadingBarFadeOut();
            console.log("ajaxError:\n" + data.error + "\n" + data.message);
        });
    }

    $scope.refreshTable();


    /*-----------------
     add rules
     --------------*/
    $scope.addRuleParam ={
        "tenantId": "apm",
        "appId": "apm",
        "rules": [{
            "ruleName": "applications-calls",
            "ruleType": "app",
            "checkTime": "8:00-12:00",
            "enableStatus": "true",
            "inputDataRanges": 10,
            "affectObjects": "appname=app1",
            "metricName": "calls",
            "conditions": [{
                "conditionType": "warning",
                "operator": ">",
                "evaluationValue": 80
            }, {
                "conditionType": "critical",
                "operator": ">",
                "evaluationValue": 120
            }],
            "actions": [{
                "actionPlugin": "kafka",
                "actionId": "sender-1",
                "properties": {
                    "normal": "10010",
                    "warning": "10011",
                    "critical": "10012"
                }
            }]
        }]
    };

    $scope.ruleNameModel ="rules_";
    $scope.inputDataRangeParam ="10";

    $scope.addRuleAction = function () {

        $scope.addRuleParam.rules[0].ruleName = $scope.ruleNameModel;
        $scope.addRuleParam.rules[0].enableStatus = $scope.enableStatusCheckbox;
        $scope.addRuleParam.rules[0].ruleType = $scope.selectRuleType;
        $scope.addRuleParam.rules[0].checkTime = "always";
        $scope.addRuleParam.rules[0].inputDataRanges = $scope.inputDataRangeParam;
        $scope.addRuleParam.rules[0].affectObjects = $scope.selectedObjsParam;

        $scope.addRuleParam.rules[0].metricName = $scope.metricNameParam;
        $scope.addRuleParam.rules[0].conditions[0].evaluationValue = $scope.warningLevelValueParam;

        $scope.addRuleParam.rules[0].metricName = $scope.metricNameParam;
        $scope.addRuleParam.rules[0].conditions[1].evaluationValue = $scope.criticalLevelValueParam;

        $scope.addRuleParam.rules[0].actions[0].properties.normal = $scope.selectedMetricName.normal;
        $scope.addRuleParam.rules[0].actions[0].properties.warning = $scope.selectedMetricName.warning;
        $scope.addRuleParam.rules[0].actions[0].properties.critical = $scope.selectedMetricName.critical;

        // $scope.postAddRuleUrl = "http://10.92.217.148:9090/service/cep/addrules";
        $scope.postAddRuleUrl = rulesURL($location.host()) + "/service/cep/addrules";
        console.log("postAddRuleUrl = " + $scope.postAddRuleUrl);
        var paramArray = $scope.addRuleParam;
        toastSend();
        hideDialog();
        $http.post($scope.postAddRuleUrl, paramArray)
            .success(function (data) {
                if (data.result.toUpperCase() == 'OK') {

                    $scope.refreshTable();
                    toastSuccess();
                } else if(data.result.toUpperCase() == 'ERROR'){
                    toastFail(data.msg);
                }
            }).error(function (data) {
            hideDialog();
            toastFail(data.msg);
            console.log("ajaxError:\n" + data.result + "\n" + data.msg);
        });
    };

    /*-----------------
     save rules
     --------------*/
    $scope.saveRuleParam ={
        "tenantId": "apm",
        "appId": "apm",
        "rules": [{
            "ruleName": "applications-calls",
            "ruleType": "app",
            "checkTime": "8:00-12:00",
            "enableStatus": "true",
            "inputDataRanges": 10,
            "affectObjects": "appname=app1",
            "metricName": "calls",
            "conditions": [{
                "conditionType": "warning",
                "operator": ">",
                "evaluationValue": 80
            }, {
                "conditionType": "critical",
                "operator": ">",
                "evaluationValue": 120
            }],
            "actions": [{
                "actionPlugin": "kafka",
                "actionId": "sender-1",
                "properties": {
                    "normal": "10010",
                    "warning": "10011",
                    "critical": "10012"
                }
            }]
        }]
    };
    $scope.saveRuleAction = function () {
        $scope.saveRuleParam.rules[0].ruleName = $scope.modRuleName;
        $scope.saveRuleParam.rules[0].enableStatus = $scope.modEnableStatusCheckbox;
        $scope.saveRuleParam.rules[0].ruleType = tmpModX.ruleType;
        $scope.saveRuleParam.rules[0].checkTime = tmpModX.checkTime;
        $scope.saveRuleParam.rules[0].inputDataRanges = $scope.modInputDataRangeParam;
        $scope.saveRuleParam.rules[0].affectObjects = tmpModX.affectObjects;

        $scope.saveRuleParam.rules[0].metricName = tmpModX.metricName;
        $scope.saveRuleParam.rules[0].conditions[0].evaluationValue = $scope.modWarningLevelValueParam;

        $scope.saveRuleParam.rules[0].metricName = tmpModX.metricName;
        $scope.saveRuleParam.rules[0].conditions[1].evaluationValue = $scope.modCriticalLevelValueParam;

        $scope.addRuleParam.rules[0].actions[0].properties.normal = $scope.selectedMetricName.normal;
        $scope.addRuleParam.rules[0].actions[0].properties.warning = $scope.selectedMetricName.warning;
        $scope.addRuleParam.rules[0].actions[0].properties.critical = $scope.selectedMetricName.critical;

        console.log("saveRuleParam = " + $scope.saveRuleParam);

        // $scope.postSaveRuleUrl = "http://10.92.217.148:9090/service/cep/updaterules";
        $scope.postSaveRuleUrl = rulesURL($location.host()) + "/service/cep/updaterules";
        console.log("postSaveRuleUrl = " + $scope.postSaveRuleUrl);
        var paramArray = $scope.saveRuleParam;

        hideModifyDialog();
        toastSend();

        $http.post($scope.postSaveRuleUrl, paramArray)
            .success(function (data) {
                if (data.result.toUpperCase() == 'OK') {
                    $scope.refreshTable();
                    toastSuccess();
                } else if(data.result.toUpperCase() == 'ERROR'){
                    toastFail(data.msg);
                }
            }).error(function (data) {
            toastFail("found error!");
            hideModifyDialog();
        });
    };

    $scope.enableStatusColor = function (v) {
        if (v == true) {
            return '#79DD1B';
        } else {
            return 'red';
        }
    };
    $scope.enableStatus = function (v) {
        if (v == true) {
            return true;
        } else {
            return false;
        }
    };

    $scope.inputDataRangesStr = function (v) {
        return "last " + v + " min";
    };

    $scope.delectSelectedItem = function (v) {
        console.log("pop = " + v);
        $scope.selectedObjList.pop(v);
    };

    $scope.ruleConditionStr = function (v, index) {
        return v.conditions[index].evaluationValue;
    };

    $scope.selectOneRule2Modify = function (x) {
        tmpModX= x;

        $scope.modRuleName = x.ruleName;
        $scope.modEnableStatusCheckbox = x.enableStatus;
        $scope.modSelectRuleType = x.ruleType;
        $scope.modMetricNameParam = x.metricName;
        $scope.modSelectedObjsParam = x.affectObjects;
        $scope.modInputDataRangeParam = x.inputDataRanges+"";
        $scope.modWarningLevelValueParam = x.conditions[0].evaluationValue;
        $scope.modCriticalLevelValueParam = x.conditions[1].evaluationValue;
    };
});

var tmpModX;

function hideSelectableObjDialog(){
    $('#selectObjId').modal('hide');
}

function hideDialog(){
    $('#createRuleId').modal('hide');
}
function hideModifyDialog(){
    $('#modifyRuleId').modal('hide');
}



function toastFail (message)
{
    var priority = 'danger';
    var title    = 'Tip';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSuccess()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Add Rule Successfully!';

    $.toaster({ priority : priority, title : title, message : message });
}

function toastSend ()
{
    var priority = 'info';
    var title    = 'Tip';
    var message  = 'Sending Data...';

    $.toaster({ priority : priority, title : title, message : message });
}
