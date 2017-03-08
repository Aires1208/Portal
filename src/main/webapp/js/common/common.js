/* ----- gojs ----- */
function convertShape(ptype) {
    var shape = "Rectangle";
    switch (ptype.toUpperCase()) {
        case 'USER':
            shape = "Rectangle";
            break;
        case 'MYSQL':
        case 'ORACLE':
            shape = "DiskStorage";
            break;
        case 'RABBITMQ':
        case 'KAFKA':
            //shape = "Ethernet";
            //shape = "Cylinder2";
            //shape = "SquareArrow";
            shape = "OutPut";
            break;
        default:
            shape = "Circle";
    }
    return shape;
}

function convertColor(d) {
    var pcolor = "white";
    switch (d.type.toUpperCase()) {
        case 'USER':
            //pcolor = "#79DD1B";//green
            pcolor = "#E3E3E4";
            break;
        case 'MYSQL':
        case 'ORACLE':
        case 'RABBITMQ':
        case 'KAFKA':
            pcolor = "#9AA3B2";
            break;
        default:
            if(d.tracked == 'true'){
                if(d.metrics.indexOf('/0errors') == -1){
                    pcolor = "#EA041B";//red
                }else{
                    pcolor = "#79DD1B";
                }
            }else{
                pcolor = "#E3E3E4";
            }

    }
    return pcolor;
}

function convertColorByType(d) {
    var pcolor = "white";
    switch (d.toUpperCase()) {
        case 'USER':
            pcolor = "#79DD1B"; //green
            break;
        case 'MYSQL':
        case 'ORACLE':
            pcolor = "#9AA3B2";
            break;
        default:
            pcolor = "#79DD1B";
    }
    return pcolor;
}

//node number break line
function convertText(pcount) {
    var str = "\n\n\n\n\n" + pcount;
    //console.log("str === " + str);
    return str;
}

function lineColor(param) {
    var arr = param.split('/');
    var errorStr = arr[1];
    var i = errorStr.indexOf('errors');
    var error = errorStr.substring(0, i);
    //console.log("error === " + error);
    if (Number(error) > 0) {
        return 'red';
    } else {
        return 'black';
    }
}


// link text break line
function convertTextInLines(pcount) {
    var str =   pcount.replace('/','\n');
    return str;
}

// link text break line
function convertTextIn3Lines(datastr) {
    str=datastr.split("/");
    var ret ="";
    for (i=0;i<str.length ;i++ )
    {
        ret = ret + str[i]+'\n'
    }
    return ret;
}


function convertKeyImage(key) {
    if (!key) key = "NE";
    return "images/HS5.png";
}

// link tooltip
function linkInfoTooltip(d) {  // Tooltip info for a link data object
    return "\n" + d.from + " -> " + d.to + "\n\n" + d.respondTime + "\n";
}


function getTechLogoImg(ptype) {
    var imgUrl = '../img/pythonlogo1.JPG';
    switch (ptype.toUpperCase()) {
        case 'JAVA':
            imgUrl = '../img/javalogo1.jpg';
            break;
        case 'MYSQL':
        case 'ORACLE':
            imgUrl = '../img/oraclelogo1.jpg';
            break;
        case 'USER':
            imgUrl = '../img/user1.gif';
            break;
        default:
            imgUrl = '../img/pythonlogo1.JPG';
    }
    return imgUrl;
}


/* ----- common ----- */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}




Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

/**
 *ת�����ڶ���Ϊ�����ַ���
 * @param date ���ڶ���
 * @param isFull �Ƿ�Ϊ��������������,
 *               Ϊtrueʱ, ��ʽ��"2000-03-05 01:05:04"
 *               Ϊfalseʱ, ��ʽ�� "2000-03-05"
 * @return ����Ҫ��������ַ���
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}

/**
 *ת����ǰ���ڶ���Ϊ�����ַ���
 * @param date ���ڶ���
 * @param isFull �Ƿ�Ϊ��������������,
 *               Ϊtrueʱ, ��ʽ��"2000-03-05 01:05:04"
 *               Ϊfalseʱ, ��ʽ�� "2000-03-05"
 * @return ����Ҫ��������ַ���
 */
function getSmpFormatNowDate(isFull) {
    return getSmpFormatDate(new Date(), isFull);
}
/**
 *ת��longֵΪ�����ַ���
 * @param l longֵ
 * @param isFull �Ƿ�Ϊ��������������,
 *               Ϊtrueʱ, ��ʽ��"2000-03-05 01:05:04"
 *               Ϊfalseʱ, ��ʽ�� "2000-03-05"
 * @return ����Ҫ��������ַ���
 */
function getSmpFormatDateByLong(l, isFull) {
    return getSmpFormatDate(new Date(l), isFull);
}


/**
 *ת��longֵΪ�����ַ���
 * @param l longֵ
 * @param pattern ��ʽ�ַ���,���磺yyyy-MM-dd hh:mm:ss
 * @return ����Ҫ��������ַ���
 */
function getFormatDateByLong(l, pattern) {
    return getFormatDate(new Date(l), pattern);
}

/**
 *ת�����ڶ���Ϊ�����ַ���
 * @param l longֵ
 * @param pattern ��ʽ�ַ���,���磺yyyy-MM-dd hh:mm:ss
 * @return ����Ҫ��������ַ���
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}




/* ----- Cookie ----- */
function getCookie(cname)
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function delCookie(cname){
    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function toLowCase(str){
    var s = str[0]+ str.substring(1, str.length).toLowerCase() ;
    return s
};

/* ----- onLoad ----- */
$(document).ready(function(){
    //modal dialog draggable
    $.getScript("../lib/jquery-ui-1.12.1/jquery-ui.min.js", function(){
        $("div[role='dialog']").draggable({
            handle: ".modal-header",
            cursor: 'move',
            refreshPositions: false
        });
    });

    //toggle topo overview div
    $("#toolbarDiv").click(function(){
        $("#myOverviewDiv").toggle();
    });



    //screen height auto
    var wH = window.screen.height - 768;
    //console.log("clientHeight : " + wH);
    if (wH > 25) {
        var h = 385 + wH - 25
        $("#myDiagramDiv").css("height", h);
        $("#overviewPanelId").css("height", h);
    }

    //select datepicker
    $("#reportrange").attr("title","10 Minutes");
    //$("[data-toggle='tooltip']").tooltip(); //����ҳ���е����е���ʾ���ߣ�tooltip��
    $('#reportrange').daterangepicker(
        {
            // startDate: moment().startOf('day'),
            //endDate: moment(),
            //minDate: '01/01/2012',    //��Сʱ��
            //maxDate : moment(), //���ʱ��
            dateLimit : {
                days : 150
            }, //��ֹʱ��������
            showDropdowns : true,
            showWeekNumbers : false, //�Ƿ���ʾ�ڼ���
            timePicker : true, //�Ƿ���ʾСʱ�ͷ���
            timePickerIncrement : 1, //ʱ�����������λΪ����
            timePicker12Hour : false, //�Ƿ�ʹ��12Сʱ������ʾʱ��
            ranges : {
                '10 Minutes': [moment().subtract(10,'minutes'), moment()],
                '30 Minutes': [moment().subtract(30,'minutes'), moment()],
                '2 Hours': [moment().subtract(2,'hours'), moment()],
                'Today': [moment().startOf('day'), moment()],
                'Yesterday': [moment().subtract(1,'days').startOf('day'), moment().subtract(1,'days').endOf('day')],
                '1 Week': [moment().subtract(6,'days'), moment()],
                '30 Days': [moment().subtract(29,'days'), moment()]
            },
            opens : 'left', //����ѡ���ĵ���λ��
            buttonClasses : [ 'btn btn-default' ],
            applyClass : 'btn-small btn-primary blue',
            cancelClass : 'btn-small',
            format : 'YYYY-MM-DD HH:mm:ss', //�ؼ���from��to ��ʾ�����ڸ�ʽ
            separator : ' to ',
            /*locale : {
                applyLabel : 'ȷ��',
                cancelLabel : 'ȡ��',
                fromLabel : '��ʼʱ��',
                toLabel : '����ʱ��',
                customRangeLabel : '�Զ���',
                daysOfWeek : [ '��', 'һ', '��', '��', '��', '��', '��' ],
                monthNames : [ 'һ��', '����', '����', '����', '����', '����',
                    '����', '����', '����', 'ʮ��', 'ʮһ��', 'ʮ����' ],
                firstDay : 1
            }*/
        }, cb);





});

/* ----- datepicker ----- */
function cb(start, end,ranges) {
    console.log("ranges = " + ranges);
    console.log("timepicker start = " + start);
    console.log("timepicker end = " + end);
    console.log("timepicker timeRange = " + start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    //$('#reportrange span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    //$("#reportrange").attr("title",ranges);
    if(ranges == 'Custom Range'){
        $('#reportrange span').html(start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    }else{
        $('#reportrange span').html(ranges);
    }

    $("#reportrange").attr("title",start.format('YYYY-MM-DD HH:mm:ss') + ' - ' + end.format('YYYY-MM-DD HH:mm:ss'));
    //write cookie
    document.cookie = "endtime=" + end;
    document.cookie = "starttime=" + start;
    document.cookie = "ranges=" + ranges;
    try {
        datePickerUpdateData(start,end);
    } catch(err) {
        console.warn(err.message);
    }
}

function setDatePicker(b,e,ranges){
    if(ranges  == 'Custom Range'){
        $('#reportrange span').html(new Date(parseInt(b)).format('yyyy-MM-dd hh:mm:ss') + ' - ' + new Date(parseInt(e)).format('yyyy-MM-dd hh:mm:ss'));
    }else{
        $('#reportrange span').html(ranges);
    }
    $("#reportrange").attr("title",new Date(parseInt(b)).format('yyyy-MM-dd hh:mm:ss') + ' - ' + new Date(parseInt(e)).format('yyyy-MM-dd hh:mm:ss'));

}

/* ----- url util ----- */
/*
 * ȥ��#��������: to=1472669674652#/objid ��� to=1472669674652
 * sometimes url param to has a # behind
 */
function checkToStr(str){
    var loc = str.indexOf('#');
    if(loc == -1){
        return str;
    }else{
        return str.substring(0,loc);
    }
}
function getMockFlag() {
    // return true;
    return false;
}
function getRealIp() {
    return "10.62.100.241";
}
function serverMockdataSourceURL() {
    // return "http://" + "10.62.100.158" + ":8100";
    return "http://" + "10.60.56.155" + ":8100";
}

function dataSourceURL() {
    if (document.location.hostname == 'localhost') {
        //return "http://10.62.100.141:1337/" + realIp + ":8084";
        return "http://" + getRealIp() + ":8084";
    } else {
        //return "http://10.62.100.141:1337/" + document.location.hostname + ":8084";
        return "http://" + document.location.hostname + ":8084";
    }
}

function dataDBSourceURL() {
    if (document.location.hostname == 'localhost') {
        //return "http://10.62.100.141:1337/" + realIp + ":8080";
        return "http://" + getRealIp() + ":8081";
    } else {
        // var realIp = "10.62.100.241";
        //return "http://10.62.100.141:1337/" + realIp + ":8080";
        return "http://" + document.location.hostname + ":8081";
        //return "http://10.62.100.141:1337/" + document.location.hostname + ":8080";
        // return "";
    }
}
function dataSourcePolicyURL() {
    if (document.location.hostname == 'localhost') {
        //return "http://10.62.100.141:1337/" + realIp + ":8080";
        return "http://" + getRealIp() + ":8083";
    } else {
        //return "http://10.62.100.141:1337/" + document.location.hostname + ":8080";
        return "http://" + document.location.hostname + ":8083";
        // return "";
    }
}



/*
 * chenlipeng
 */
function  getCommonTopNNum() {
    return 5;
}
function isMock() {
    return false;
}
