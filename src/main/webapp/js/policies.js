var policiesApp = angular.module('policiesApp', []);


angular.module("policiesApp").filter("removeSpecialsymbol", function () {
    return function (input) {
        var out = "";
        out = input.toString().replace('"', '').replace('[', '').replace(']', '');
        return out;
    }
});


policiesApp.controller('policiesCtrl', function ($scope, $http, $location) {
    $scope.policyName = "";
    $scope.policyDatas = [];
    $scope.ispolicyDatasLoading = false;
    $scope.receiver = "";

    $scope.ObjectTypes = ["APP", "Service", "Instance", "Transaction", "Host", "DB"];
    $scope.objectType = "APP";

    $scope.apps = [];
    $scope.appType = "";
    $scope.ServiceTypes = [];
    $scope.serviceType = "";
    $scope.InstanceTypes = [];
    $scope.instanceType = "";
    $scope.TransactionTypes = [];
    $scope.transactionType = "";
    $scope.HostTypes = [];
    $scope.hostType = "";

    $scope.DBTypes = [];
    $scope.DBType = "";
    $scope.queryPolicySelectAllChecked = true;
    $scope.Actions = [];
    $scope.isActionsLoading = false;
    $scope.Action = undefined;
    $scope.EventTypes = [];
    $scope.eventType = undefined;
    $scope.objectType === 'APP';
    
    $scope.addPolicyUrl = dataSourcePolicyURL() + "/policy";
    $scope.deletePolicyUrl = dataSourcePolicyURL() + "/policy?policyName=";
    $scope.fullASI = dataSourceURL() + "/dashBoard/fullASI.pinpoint";
    $http.get($scope.fullASI)
        .success(function (response) {
            $scope.apps = response.apps;
            if ($scope.apps.length > 0) {
                $scope.appType = $scope.apps[0].name;
                // 初始时，默认查询第一个app下的所有policy;
                $scope.queryPolicy();
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
        loadingBarFadeOut();
    });

    $scope.hostUrl = dataSourceURL() + "/serverlist.pinpoint";
    $http.get($scope.hostUrl)
        .success(function (response) {
            $scope.HostTypes = response.serverlist;
            if ($scope.HostTypes.length > 0) {
                $scope.hostType = $scope.HostTypes[0].simplifiedname;
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
        loadingBarFadeOut();
    });
    $scope.transactionUrl = dataSourceURL() + "/transactions/list.pinpoint";
    $http.get($scope.transactionUrl)
        .success(function (response) {
            $scope.TransactionTypes = response.traceList;
            if ($scope.TransactionTypes.length > 0) {
                $scope.transactionType = $scope.TransactionTypes[0].simplifiedname;
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
        loadingBarFadeOut();
    });

    $scope.queryDBListUrl = dataDBSourceURL() + "/mysql_monitor/dblist";
    $http.get($scope.queryDBListUrl)
        .success(function (response) {
            $scope.DBTypes = response;
            if ($scope.DBTypes.length > 0) {
                $scope.DBType = $scope.DBTypes[0].dbName + "_" + $scope.DBTypes[0].dbIp + "_" + $scope.DBTypes[0].dbPort;
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
        loadingBarFadeOut();
    });
    $scope.commonInfoUrl = dataSourcePolicyURL() + "/policy/commonInfo";
    $http.get($scope.commonInfoUrl)
        .success(function (response) {
            if (response.commonInfo && response.commonInfo.resMsg.status === 1) {
                $scope.EventTypes = response.commonInfo.eventTypes;
                $scope.changeEventTypes();
            }
        }).error(function (data) {
        console.log("ajaxError:\n" + data.error + "\n" + data.message);
        loadingBarFadeOut();
    });
    $scope.queryPolicyActionUrl = dataSourcePolicyURL() + "/policy/policyAction";
    $scope.isActionsLoading = true;
    $http.get($scope.queryPolicyActionUrl)
        .success(function (data) {
            // console.log(data);
            // $scope.Actions = data.data.policyActions;
            $scope.Actions = [];
            var policyActions = data.data.policyActions;
            for (var i = 0; i < policyActions.length; i++) {
                $scope.Actions.unshift(policyActions[i].policyActionName);
            }
            var myActionID = document.getElementById("ActionID");
            for (var i = 0; i < $scope.Actions.length; i++) {
                var opp = new Option($scope.Actions[i], $scope.Actions[i]);
                myActionID.add(opp);
            }
            if (data.status === 1) {
                $('#createPolicyActionId').modal('hide');
            } else {
                toastPolicyMsg(0, data.resMsg);
            }
            $scope.isActionsLoading = false;
        }).error(function (data) {
        $scope.isActionsLoading = false;
        console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
    });
    Array.prototype.deleteElementByValue = function (varElement) {
        var numDeleteIndex = -1;
        for (var i = 0; i < this.length; i++) {
            // 严格比较，即类型与数值必须同时相等。
            if (this[i] === varElement) {
                this.splice(i, 1);
                numDeleteIndex = i;
                break;
            }
        }
        return numDeleteIndex;
    }
    $scope.name_checkbox = false;
    $scope.name_checkboxToggle = function () {
        if ($scope.name_checkbox) {
            var btSelectItems = document.getElementsByName("btSelectItem");
            for (var i = 0; i < btSelectItems.length; i++) {
                btSelectItems[i].checked = true;
            }
        }
        else {
            var btSelectItems = document.getElementsByName("btSelectItem");
            for (var i = 0; i < btSelectItems.length; i++) {
                btSelectItems[i].checked = false;
            }
        }
        // console.log($scope.name_checkbox);

    }
    $scope.policyName_checkboxToggle = function () {
        var btSelectAll = document.getElementsByName("btSelectAll");
        var btSelectItems = document.getElementsByName("btSelectItem");
        var fullCheckedFlag = true;
        for (var i = 0; i < btSelectItems.length; i++) {
            if (btSelectItems[i].checked === false) {
                fullCheckedFlag = false;
                btSelectAll[0].checked = false;
                break;
            }
        }
        if (fullCheckedFlag) {
            btSelectAll[0].checked = true;
        }
    }
    $scope.changeObjectTypes = function () {
        $scope.appType = "";
        $scope.serviceType = "";
        $scope.ServiceTypes = [];
        $scope.instanceType = "";
        $scope.InstanceTypes = [];
        $scope.instanceType = "";
        $scope.changeEventTypes();
        if ($scope.objectType === 'APP') {
            if ($scope.apps.length > 0) {
                $scope.appType = $scope.apps[0].name;
            }
        }
        else if ($scope.objectType === 'Service') {
            if ($scope.apps.length > 0) {
                $scope.appType = $scope.apps[0].name;
                for (var i = 0; i < $scope.apps.length; i++) {
                    if ($scope.apps[i].name === $scope.appType) {
                        $scope.ServiceTypes = $scope.apps[i].services;
                        if ($scope.ServiceTypes.length > 0) {
                            $scope.serviceType = $scope.ServiceTypes[0].name;
                        }
                        break;
                    }
                }
            }
        }
        else if ($scope.objectType === 'Instance') {
            if ($scope.apps.length > 0) {
                $scope.appType = $scope.apps[0].name;
                for (var j = 0; j < $scope.apps.length; j++) {
                    if ($scope.apps[j].name === $scope.appType) {
                        $scope.ServiceTypes = $scope.apps[j].services;

                        if ($scope.ServiceTypes.length > 0) {
                            $scope.serviceType = $scope.ServiceTypes[0].name;
                            for (var k = 0; k < $scope.ServiceTypes.length; k++) {
                                if ($scope.ServiceTypes[k].name === $scope.serviceType) {
                                    $scope.InstanceTypes = $scope.ServiceTypes[k].instances;
                                    if ($scope.InstanceTypes.length > 0) {
                                        $scope.instanceType = $scope.InstanceTypes[0].name;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        else if ($scope.objectType === 'Transaction') {

        }
        else if ($scope.objectType === 'Host') {

        }
        else if ($scope.objectType === 'DB') {

            if ($scope.DBTypes.length > 0) {
                $scope.DBType = $scope.DBTypes[0].dbName + "_" + $scope.DBTypes[0].dbIp + "_" + $scope.DBTypes[0].dbPort;
            }
        }
        // console.log("appType:" + $scope.appType);
    }

    $scope.changeEventTypes = function () {
        jQuery("#eventTypeID").empty();
        var myEventType = document.getElementById("eventTypeID");
        for (var i = 0; i < $scope.EventTypes.length; i++) {
            if ($scope.objectType === 'APP') {
                if ($scope.EventTypes[i].startWith("APP_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
            else if ($scope.objectType === 'Service') {
                if ($scope.EventTypes[i].startWith("SERVICE_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
            else if ($scope.objectType === 'Instance') {
                if ($scope.EventTypes[i].startWith("INSTANCE_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
            else if ($scope.objectType === 'Transaction') {
                if ($scope.EventTypes[i].startWith("TRANSACTION_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
            else if ($scope.objectType === 'Host') {
                if ($scope.EventTypes[i].startWith("HOST_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
            else if ($scope.objectType === 'DB') {
                if ($scope.EventTypes[i].startWith("DB_")) {
                    var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp);
                }
            }
        }
    }
    $scope.changeAppTypes = function () {
        // console.log("appType:" + $scope.appType);
        if ($scope.objectType === 'Service') {
            if ($scope.apps.length > 0) {
                // console.log("appType:" + $scope.appType);
                console.log($scope.appType);
                for (var i = 0; i < $scope.apps.length; i++) {
                    if ($scope.apps[i].name === $scope.appType) {
                        $scope.ServiceTypes = $scope.apps[i].services;
                        if ($scope.ServiceTypes.length > 0) {
                            $scope.serviceType = $scope.ServiceTypes[0].name;
                        }
                        break;
                    }
                }
            }
        }
        else if ($scope.objectType === 'Instance') {
            if ($scope.apps.length > 0) {
                for (var j = 0; j < $scope.apps.length; j++) {
                    if ($scope.apps[j].name === $scope.appType) {
                        $scope.ServiceTypes = $scope.apps[j].services;
                        if ($scope.ServiceTypes.length > 0) {
                            $scope.serviceType = $scope.ServiceTypes[0].name;
                            for (var k = 0; k < $scope.ServiceTypes.length; k++) {
                                if ($scope.ServiceTypes[k].name === $scope.serviceType) {
                                    $scope.InstanceTypes = $scope.ServiceTypes[k].instances;
                                    if ($scope.InstanceTypes.length > 0) {
                                        $scope.instanceType = $scope.InstanceTypes[0].name;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
        // console.log("objectType:" + $scope.objectType);
    }
    $scope.changeServiceTypes = function () {
        // console.log("changeServiceTypes");
        if ($scope.objectType === 'Instance') {
            if ($scope.apps.length > 0) {
                for (var j = 0; j < $scope.apps.length; j++) {
                    if ($scope.apps[j].name === $scope.appType) {
                        $scope.ServiceTypes = $scope.apps[j].services;
                        if ($scope.ServiceTypes.length > 0) {
                            for (var k = 0; k < $scope.ServiceTypes.length; k++) {
                                if ($scope.ServiceTypes[k].name === $scope.serviceType) {
                                    $scope.InstanceTypes = $scope.ServiceTypes[k].instances;
                                    if ($scope.InstanceTypes.length > 0) {
                                        $scope.instanceType = $scope.InstanceTypes[0].name;
                                    }
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    $scope.changeDBTypes = function () {
        if ($scope.objectType === 'DB') {
            if ($scope.DBTypes.length > 0) {
                $scope.DBType = $scope.DBTypes[0].dbName + "_" + $scope.DBTypes[0].dbIp + "_" + $scope.DBTypes[0].dbPort;
            }
        }
    }

    $scope.clickBeforeAdd = function () {
        if (($scope.Actions === undefined || $scope.Actions.length == 0)) {
            // var ResMsg = "You have not created any action yet. Go to the action page creation action!";
            // toastPolicyMsg(0, ResMsg);
            location.href = "./actions.html";
            return;
        }
        if ($scope.EventTypes === undefined || $scope.EventTypes.length == 0) {
            var ResMsg = "EventType list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }

        $scope.modifyPolicyFalg = false;
        $scope.policyName = "";

        $(".js-multiple-select-events").select2().empty();
        $(".js-multiple-select-actions").select2().empty();
        $scope.changeEventTypes();
        // var myEventType = document.getElementById("eventTypeID");
        // for (var i = 0; i < $scope.EventTypes.length; i++) {
        //     if ($scope.EventTypes[i].startWith("APP_")) {
        //         var opp = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
        //         myEventType.add(opp);
        //     }
        // }
        var myActionID = document.getElementById("ActionID");
        for (var i = 0; i < $scope.Actions.length; i++) {
            var opp = new Option($scope.Actions[i], $scope.Actions[i]);
            myActionID.add(opp);
        }
        $scope.eventType = undefined;
        $scope.Action = undefined;
        $('#createPolicyId').modal('show');
    }
    $scope.addPolicy = function () {
        // 查看一些基本信息是否已经获取到
        if (($scope.objectType === 'APP' || $scope.objectType === 'Service' || $scope.objectType === 'Instance')
            && ($scope.apps === undefined || $scope.apps.length == 0)) {
            var ResMsg = "APP list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        else if ($scope.objectType === 'Transaction' && ($scope.TransactionTypes === undefined || $scope.TransactionTypes.length == 0)) {
            var ResMsg = "Transaction list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        else if ($scope.objectType === 'Host' && ($scope.HostTypes === undefined || $scope.HostTypes.length == 0)) {
            var ResMsg = "Host list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        else if ($scope.objectType === 'DB' && ($scope.DBTypes === undefined || $scope.DBTypes.length == 0)) {
            var ResMsg = "DB list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        if ($scope.EventTypes === undefined || $scope.EventTypes.length == 0) {
            var ResMsg = "EventType list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        if (($scope.Actions === undefined || $scope.Actions.length == 0)) {
            var ResMsg = "You have not created any action yet. Go to the action page creation action!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        var objDN = "";
        if ($scope.objectType === 'APP') {
            objDN = "APP=" + $scope.appType;
        } else if ($scope.objectType === 'Service') {
            objDN = "APP=" + $scope.appType + "&Service=" + $scope.serviceType;
        } else if ($scope.objectType === 'Instance') {
            objDN = "APP=" + $scope.appType + "&Service=" + $scope.serviceType + "&Instance=" + $scope.instanceType;
        } else if ($scope.objectType === 'Transaction') {
            objDN = "Transaction=" + $scope.transactionType;
        } else if ($scope.objectType === 'Host') {
            objDN = "Host=" + $scope.hostType;
        } else if ($scope.objectType === 'DB') {
            objDN = "DB=" + $scope.DBType;
        }
        var condition = '{' +
            '"eventTypes":' + JSON.stringify($scope.eventType) + ',' +
            '"objDN":"' + objDN + '"' +
            '}';
        var msgBody =
            '{' +
            '"policyName":"' + $scope.policyName + '",' +
            '"condition":' + condition + ',' +
            '"policyActions":' + JSON.stringify($scope.Action) +
            '}';
        // console.log(msgBody);
        $http.post($scope.addPolicyUrl, msgBody)
            .success(function (data) {
                // console.log(data);
                if (data.status === 1) {
                    $scope.queryPolicy();
                    $('#createPolicyId').modal('hide');
                } else {
                    toastPolicyMsg(0, data.resMsg);
                }
            }).error(function (data) {
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
        });
        var btSelectAll = document.getElementsByName("btSelectAll");
        btSelectAll[0].checked = false;
    }
    // 修改Policy的前置条件
    $scope.clickBeforeModify = function () {
        if (($scope.Actions === undefined || $scope.Actions.length == 0)) {
            var ResMsg = "You have not created any action yet. Go to the action page creation action!";
            toastPolicyMsg(0, ResMsg);
        }
        if ($scope.EventTypes === undefined || $scope.EventTypes.length == 0) {
            var ResMsg = "EventType list get fail!";
            toastPolicyMsg(0, ResMsg);
        }

        // $scope.ResMsg = "";
        $scope.policyDN = "";
        $scope.receiver = "";
        $scope.modifyPolicyFalg = true;
        var btSelectItems = document.getElementsByName("btSelectItem");
        var j = 0;
        var num = 0;
        for (var i = 0; i < btSelectItems.length; i++) {
            if (btSelectItems[i].checked === true) {
                j++;
                num = i;
            }
        }

        $scope.policyName = "";
        if (j > 1) {
            ResMsg = "You can only select one policy!";
            toastPolicyMsg(0, ResMsg);
        }
        if (j == 0) {
            ResMsg = "You have not selected a policy!";
            toastPolicyMsg(0, ResMsg);
        }
        if (j == 1) {
            var policy = $scope.policyDatas[num];
            $scope.policyName = policy.policyName;
            var objDN = policy.condition.objDN;
            $scope.policyDN = objDN;
            // $scope.eventType = undefined;
            // $scope.Action = undefined;
            $(".js-multiple-select-events").select2().empty();
            var SelectedEvents = policy.condition.eventTypes;
            $scope.eventType = SelectedEvents;
            // console.log(SelectedEvents);
            var myEventType = document.getElementById("eventTypeID");
            // console.log($scope.EventTypes);
            for (var i = 0; i < $scope.EventTypes.length; i++) {
                var flag = false;
                for (var i1 = 0; i1 < SelectedEvents.length; i1++) {
                    if (SelectedEvents[i1] === $scope.EventTypes[i]) {
                        var opp1 = new Option($scope.EventTypes[i], $scope.EventTypes[i], true, true);
                        myEventType.add(opp1);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    var opp1 = new Option($scope.EventTypes[i], $scope.EventTypes[i]);
                    myEventType.add(opp1);
                }
            }

            $(".js-multiple-select-actions").select2().empty();
            var SelectedActions = policy.policyActions;
            $scope.Action = SelectedActions;
            var myActionID = document.getElementById("ActionID");
            for (var i = 0; i < $scope.Actions.length; i++) {
                var flag = false;
                for (var i1 = 0; i1 < SelectedActions.length; i1++) {
                    if (SelectedActions[i1] === $scope.Actions[i]) {
                        var opp1 = new Option($scope.Actions[i], $scope.Actions[i], true, true);
                        myActionID.add(opp1);
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    var opp1 = new Option($scope.Actions[i], $scope.Actions[i]);
                    myActionID.add(opp1);
                }
            }
            // console.log($scope.eventType);
            $('#createPolicyId').modal('show');
        }
    }
    $scope.modifyPolicy = function () {
        if (($scope.Actions === undefined || $scope.Actions.length == 0)) {
            var ResMsg = "You have not created any action yet. Go to the action page creation action!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        if ($scope.EventTypes === undefined || $scope.EventTypes.length == 0) {
            var ResMsg = "EventType list get fail!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        if ($scope.eventType === undefined || $scope.eventType.length == 0) {
            var ResMsg = "you have have not select any events!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        if (($scope.Action === undefined || $scope.Action.length == 0)) {
            var ResMsg = "you have have not select any actions!";
            toastPolicyMsg(0, ResMsg);
            return;
        }
        var condition = '{' +
            '"eventTypes":' + JSON.stringify($scope.eventType) + ',' +
            '"objDN":"' + $scope.policyDN + '"' +
            '}';

        var msgBody =
            '{' +
            '"policyName":"' + $scope.policyName + '",' +
            '"condition":' + condition + ',' +
            '"policyActions":' + JSON.stringify($scope.Action) +
            '}';
        // console.log(msgBody);
        $http.put($scope.addPolicyUrl, msgBody)
            .success(function (data) {
                // console.log(data);
                if (data.status === 1) {
                    $('#createPolicyId').modal('hide');
                    $scope.queryPolicy();
                } else {
                    toastPolicyMsg(0, 'modify Policy Fail!');
                }

            }).error(function (data) {
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
        });
        var btSelectAll = document.getElementsByName("btSelectAll");
        btSelectAll[0].checked = false;


    }
    $scope.queryPolicy = function () {
        $scope.queryPolicyUrl = dataSourcePolicyURL() + "/policy";
        $scope.ispolicyDatasLoading = true;
        $http.get($scope.queryPolicyUrl)
            .success(function (data) {
                $scope.policyDatas = [];
                if (data.status === 1) {
                    $scope.policyDatas = data.data.policies;
                } else {
                    toastPolicyAtionMsg(0, data.resMsg);
                }
                if ($scope.policyDatas.length === 0) {
                    var btSelectAll = document.getElementsByName("btSelectAll");
                    btSelectAll[0].checked = false;
                }
                $scope.ispolicyDatasLoading = false;
            }).error(function (data) {
            $scope.ispolicyDatasLoading = false;
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
        });
    }
    // 批量删除Policy
    $scope.FullNoCheckedFlag = true;
    $scope.clickBeforeDelete = function () {
        $scope.fullDeleteOK = true;
        $scope.FullNoCheckedFlag = true;
        var btSelectItems = document.getElementsByName("btSelectItem");
        for (var i = 0; i < btSelectItems.length; i++) {
            if (btSelectItems[i].checked === true) {
                $scope.FullNoCheckedFlag = false;
                break;
            }
        }
        // 未选择
        if (!$scope.FullNoCheckedFlag) {
            $('#deletePolicyId').modal('show');
        }
        else {
            var ResMsg = "";
            if ($scope.policyDatas.length === 0) {
                ResMsg = "You have not create a policy!";
            }
            else {
                ResMsg = "You have not selected a policy!";
            }
            toastPolicyMsg(0, ResMsg);
        }
    }
    $scope.deletePolicy = function () {
        $scope.fullDeleteOK = true;
        var btSelectItems = document.getElementsByName("btSelectItem");
        var num = btSelectItems.length;
        var failArray = [];
        for (var i = 0; i < num; i++) {
            if (btSelectItems[i].checked === true) {
                $http.delete($scope.deletePolicyUrl + $scope.policyDatas[i].policyName)
                    .success(function (response) {
                        $scope.queryPolicy();
                    }).error(function (data) {
                    console.log("ajaxError:\n" + data.error + "\n" + data.message);
                    toastPolicyMsg(0, 'delete' + $scope.policyDatas[i].policyName + ' Policy Fail!');
                });
            }
        }
        var btSelectAll = document.getElementsByName("btSelectAll");
        btSelectAll[0].checked = false;
    }
    String.prototype.startWith = function (str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    }
});
// flag 成功或失败
function toastPolicyMsg(flag, msg) {
    var title = 'Tip';
    var priority = 'danger';
    var message = msg;
    if (flag === 0) {
        priority = 'danger';
        message = msg;
    }
    else if (flag === 1) {
        priority = 'info';
    }
    // console.log("msg:"+msg);
    $.toaster({priority: priority, title: title, message: message});
}






