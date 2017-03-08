$(function () {

});

var policiesApp = angular.module('emailgigestsApp', []);
policiesApp.controller('emailgigestsCtrl', function ($scope, $http, $location) {

    $scope.EmailDigest = "";
    $scope.EmailDigests = [];

    $scope.queryPolicySelectAllChecked = true;


    // $scope.ResMsg = "";
    // 切换模拟数据
    $scope.isMockFlag = isMock();
    console.log("isMockFlag = " + $scope.isMockFlag);
    $scope.addEmailDigestUrl= dataSourcePolicyURL()+"/emailDigest";
    $scope.deleteEmailDigestUrl= dataSourcePolicyURL()+"/emailDigest?emailDigestName=";


    $scope.name_checkbox = false;
    $scope.name_checkboxToggle = function(){
        if($scope.name_checkbox){
            var btSelectItems = document.getElementsByName("btSelectItem");
            for(var i=0;i< btSelectItems.length;i++){
                btSelectItems[i].checked = true;
            }
        }
        else {
            var btSelectItems = document.getElementsByName("btSelectItem");
            for(var i=0;i< btSelectItems.length;i++){
                btSelectItems[i].checked = false;
            }
        }
        console.log($scope.name_checkbox);

    }

    $scope.EmailDigest_checkboxToggle = function(){
        var btSelectAll = document.getElementsByName("btSelectAll");
        var btSelectItems = document.getElementsByName("btSelectItem");
        var fullCheckedFlag = true;
        for(var i=0;i< btSelectItems.length;i++){
            if(btSelectItems[i].checked === false){
                fullCheckedFlag = false;
                btSelectAll[0].checked = false;
                break;
            }
        }
        if(fullCheckedFlag){
            btSelectAll[0].checked = true;
        }
    }

});
// flag 成功或失败
function toastEmailDigestMsg (flag,msg)
{
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






