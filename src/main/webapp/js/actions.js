var policiesApp = angular.module('actionsApp', []);
policiesApp.controller('actionsCtrl', function ($scope, $http, $location) {

    $scope.Action = "";
    $scope.Actions = [];
    $scope.actionTypes = ["MAIL"];
    $scope.actionType = "MAIL";
    $scope.receivers = [];
    $scope.receiver;
    $scope.addReceiver = "";
    $scope.policyActionName = undefined;
    $scope.queryPolicySelectAllChecked = true;
    $scope.addPolicyActionUrl= dataSourcePolicyURL()+"/policy/policyAction";
    $scope.deletePolicyActionUrl= dataSourcePolicyURL()+"/policy/policyAction?policyActionName=";
    $scope.queryPolicyActionUrl = dataSourcePolicyURL()+"/policy/policyAction";

    // 初始化时查询PolicyAction
    $scope.queryPolicyActions = function () {
        $http.get($scope.queryPolicyActionUrl)
            .success(function (data) {
                // 查询返回状态码1，则查询成功
                if(data.status === 1){
                    $scope.Actions = data.data.policyActions;
                } else {
                    toastPolicyAtionMsg(0,data.resMsg);
                }
                // 当未创建PolicyAction时，选择全部checkBox置为false;
                if($scope.Actions.length === 0){
                    var btActionSelectAll = document.getElementsByName("btActionSelectAll");
                    btActionSelectAll[0].checked = false;
                    var ResMsg = "You have not created any action, you must create at least one acton before creating the policy!";
                    toastPolicyAtionMsg(0, ResMsg);
                }
            }).error(function (data) {
            console.log("http error: " + "cannot get data from " + dataSourcePolicyURL());
        });
    }
    $scope.queryPolicyActions();


    // chackBox切换，当全部选择时，policyAction的checkBox为true,否则为false
    $scope.name_checkbox = false;
    $scope.name_checkboxToggle = function(){
        if($scope.name_checkbox){
            var btActionSelectItems = document.getElementsByName("btActionSelectItem");
            for(var i=0;i< btActionSelectItems.length;i++){
                btActionSelectItems[i].checked = true;
            }
        }
        else {
            var btActionSelectItems = document.getElementsByName("btActionSelectItem");
            for(var i=0;i< btActionSelectItems.length;i++){
                btActionSelectItems[i].checked = false;
            }
        }
    }
    $scope.actionName_checkboxToggle = function(){
        var btActionSelectAll = document.getElementsByName("btActionSelectAll");
        var btActionSelectItems = document.getElementsByName("btActionSelectItem");
        var fullCheckedFlag = true;
        for(var i=0;i< btActionSelectItems.length;i++){
            if(btActionSelectItems[i].checked === false){
                fullCheckedFlag = false;
                btActionSelectAll[0].checked = false;
                break;
            }
        }
        if(fullCheckedFlag){
            btActionSelectAll[0].checked = true;
        }
    }

    // 删除数组的一个元素
    Array.prototype.deleteElementByValue = function(varElement)
    {
        var numDeleteIndex = -1;
        for (var i=0; i<this.length; i++)
        {
            // 严格比较，即类型与数值必须同时相等。
            if (this[i] === varElement)
            {
                this.splice(i, 1);
                numDeleteIndex = i;
                break;
            }
        }
        return numDeleteIndex;
    }
    // 删除接收者列表的当前接收者
    $scope.clickDeleteReceiver = function () {
        if($scope.receiver){
            $scope.receivers.deleteElementByValue($scope.receiver);
        }
        if($scope.receivers.length > 0) {
            $scope.receiver = $scope.receivers[0];
        }
    }

    // 点击增加接收者按钮;
    $scope.clickAddReceiver = function () {
        if($scope.addReceiver){
            var flag = false;
            for(var i=0;i<$scope.receivers.length;i++){
                if($scope.addReceiver === $scope.receivers[i]){
                    flag = true;
                    return ;
                }
            }
            $scope.receivers.unshift($scope.addReceiver);
        }
        if($scope.receivers.length > 0) {
            $scope.receiver = $scope.receivers[0];
        }
        $scope.addReceiver = "";
    }

    // 增加PolicyAction
    $scope.clickBeforeAdd = function () {
        $scope.modifyPolicyActionFalg = false;
        $scope.policyActionName = undefined;
        $scope.receivers.length = 0;
        $('#createPolicyActionId').modal('show');
    }
    $scope.addPolicyAction = function () {
        if(($scope.receivers === undefined ||  $scope.receivers.length == 0)
        ){
            var ResMsg = "You have not added recipient information yet!";
            toastPolicyAtionMsg(0,ResMsg);
        }
        else {
            var receiverMsg = "";
            var receiverList= "";
            for(var i=0;i<$scope.receivers.length-1;i++){
                receiverMsg =  receiverMsg + '"'+$scope.receivers[i]+'",';
            }
            receiverMsg =  receiverMsg + '"'+$scope.receivers[$scope.receivers.length-1]+'"' +  ']';
            receiverList = '[' + receiverMsg;
            var msgBody =
                '{' +
                '"policyActionName":"'+$scope.policyActionName+'",'+
                '"actionTypeEnum":"'+$scope.actionType+'",'+
                '"policyNames":'+'[],'+
                '"receiverInfo":'+ receiverList +
                '}';
            // console.log(msgBody);
            $http.post($scope.addPolicyActionUrl,msgBody)
                .success(function (data) {
                    console.log(data);
                    if(data.status === 1){
                        $scope.queryPolicyActions();
                    } else {
                        toastPolicyAtionMsg(0,data.resMsg);
                    }
                    $('#createPolicyActionId').modal('hide');
                }).error(function (data) {
                toastPolicyAtionMsg(0,data.message);
                $('#createPolicyActionId').modal('hide');
                console.log("http error: " + "cannot get data from " + $scope.addPolicyActionUrl);
            });
            $scope.receivers = [];
            $scope.addReceiver = "";
            var btActionSelectAll = document.getElementsByName("btActionSelectAll");
            btActionSelectAll[0].checked = false;
        }
    }

    // 当全部删除时，name 前的checkBox置为false;
    $scope.FullNoCheckedFlag = true;
    $scope.clickBeforeDelete = function () {
        $scope.fullDeleteOK = true;
        $scope.FullNoCheckedFlag = true;

        var btActionSelectItems = document.getElementsByName("btActionSelectItem");
        for(var i=0;i< btActionSelectItems.length;i++){
            if(btActionSelectItems[i].checked === true){
                $scope.FullNoCheckedFlag = false;
                break;
            }
        }
        // 未选择
        if(!$scope.FullNoCheckedFlag){
            $('#deleteActionPolicyId').modal('show');
        }
        else {
            var ResMsg = "";
            if($scope.Actions.length === 0) {
                ResMsg = "You have not create a policy action!";
            }
            else {
                ResMsg = "You have not selected a policy action!";
            }
            toastPolicyAtionMsg(0,ResMsg);
        }
    }
    // 批量删除PolicyAction
    $scope.deletePolicyAction = function () {
        $scope.fullDeleteOK  = true;
        var btActionSelectItems = document.getElementsByName("btActionSelectItem");
        var num = btActionSelectItems.length;
        var failArray = [];
        for(var i=0;i< num;i++){
            if(btActionSelectItems[i].checked === true){
                $http.delete($scope.deletePolicyActionUrl + $scope.Actions[i].policyActionName)
                    .success(function (response) {
                        $scope.queryPolicyActions();
                    }).error(function (data) {
                    console.log("ajaxError:\n" + data.error + "\n" + data.message);
                    toastPolicyAtionMsg(0,'delete' + $scope.Actions[i].policyActionName + ' Policy Fail!');
                });
            }
        }
        var btActionSelectAll = document.getElementsByName("btActionSelectAll");
        btActionSelectAll[0].checked = false;
    }
    // 修改PolicyAction的前置条件
    $scope.clickBeforeModify = function () {
        $scope.modifyPolicyActionFalg = true;
        var btActionSelectItem = document.getElementsByName("btActionSelectItem");
        var j = 0;
        var num = 0;
        for(var i=0;i< btActionSelectItem.length;i++){
            if(btActionSelectItem[i].checked === true){
                j++;
                num = i;
            }
        }
        var ResMsg = "";
        $scope.policyActionName = undefined;
        if(j>1){
            ResMsg = "You can only select one policyAction!";
            toastPolicyAtionMsg(0,ResMsg);
        }
        if(j == 0){
            if($scope.Actions.length === 0) {
                ResMsg = "You have not create a policy action!";
            }
            else {
                ResMsg = "You have not selected a policy action!";
            }
            toastPolicyAtionMsg(0,ResMsg);
        }
        if(j == 1){
            var policyAction = $scope.Actions[num];
            $scope.policyActionName = policyAction.policyActionName;
            $scope.receivers = policyAction.receiverInfo;
            if($scope.receivers.length > 0) {
                $scope.receiver = $scope.receivers[0];
            }
            $scope.policyName = policyAction.policyName;
            $('#createPolicyActionId').modal('show');
        }
    }
    // todo 如果没作任何修改，也可以成功，前端应该加限制
    $scope. modifyPolicyAction = function () {
        if(($scope.policyActionName === undefined || $scope.receivers === undefined ||  $scope.receivers.length == 0)
        ){
            var ResMsg = "Missing required information!";
            toastPolicyAtionMsg(0,ResMsg);
            $('#createPolicyActionId').modal('hide');
        }
        else {
            var receiverMsg = "";
            var receiverList= "";
            for(var i=0;i<$scope.receivers.length-1;i++){
                receiverMsg =  receiverMsg + '"'+$scope.receivers[i]+'",';
            }
            receiverMsg =  receiverMsg + '"'+$scope.receivers[$scope.receivers.length-1]+'"' +  ']';
            receiverList = '[' + receiverMsg;
            if(!$scope.policyName){
                $scope.policyName = '[]';
            }
            var msgBody =
                '{' +
                '"policyActionName":"'+$scope.policyActionName+'",'+
                '"actionTypeEnum":"'+$scope.actionType+'",'+
                '"policyNames":'+$scope.policyName+','+
                '"receiverInfo":'+ receiverList +
                '}';
            console.log(msgBody);
            // toastPolicyAtionMsg(1,'create policy action ...');
            $http.put($scope.addPolicyActionUrl,msgBody)
                .success(function (data) {
                    console.log(data);
                    if(data.status === 1){
                        $('#createPolicyActionId').modal('hide');
                        $scope.queryPolicyActions();
                        toastPolicyAtionMsg(1,'Modify PolicyAction Success!');
                    } else {
                        toastPolicyAtionMsg(0,data.resMsg);
                    }
                }).error(function (data) {
                console.log("http error: " + "cannot get data from " + $scope.addPolicyActionUrl);
            });
            var btActionSelectAll = document.getElementsByName("btActionSelectAll");
            btActionSelectAll[0].checked = false;
        }
    }
});
// flag 成功或失败
function toastPolicyAtionMsg (flag,msg) {
    var title    = 'Tip';
    var priority = 'danger';
    var message  = msg;
    if(flag === 0){
        priority = 'danger';
        message  = msg;
    }
    else if(flag === 1){
        priority = 'info';
    }
    $.toaster({ priority : priority, title : title, message : message });
}






