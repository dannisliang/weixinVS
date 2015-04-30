// 搜索页面
var searchSuggest;
var historySearch = new Array();
$(document).on("panelbeforeload", '#searchPanel', function (e) {
    $("#pro-sort .sort-pro-list .topad img").hide();
    $("#pro-sort .sort-pro-list .list-mod").hide();
    $("#sortsProlist").hide();
    $("#pro-sort .sort-pro-list").hide();
    $("#pro-sort .sort-left").hide();
});


$(document).on("panelload", '#searchPanel', function (e) {
    $(document).ready(function () {
        if (getSession(charVec.bSearchFocusSe) === "true") {
            $("input[id=searchId]").focus();
            if ($.os.android) {
                alert("dddfs");
                var softKeyboard = new SoftKeyboard();
                softKeyboard.show();
            }
        }
    });

    $('#searchId').bind('input propertychange', function () {
        console.log($("#searchId").get(0).value);
    });

    // 获取热门搜索关键字成功
    getHotKeywordUrlSuccess = function(dataJson){
        commonATextSearch(dataJson.split(","), $("#hotSearch"), getHotKeywordCal);
    }

    getHotKeywordCal = function(index, $div){
        $div.attr("onclick", "getSearchGoodByKeyword(\"1" +index +"\")");
    }

    getSearchGoodByKeyword = function(index){
        if(parseInt(index/10) == 1){
            getSearchGoodUrl($("#hotSearch").find("a:eq(" +index%10 +")").text());
        }else{
            bHistoryClicked = true;
            getSearchGoodUrl($("#historySearch").find("a:eq(" +index%10 +")").text());
        }
    }

    //设置热门关键字
    commonATextSearch = function (arrText, div, callback){
        for(var i=0;i<arrText.length;i++){
            var $child = div.find("a").first().clone();
            if(i == 0){
                div.find("a").remove();
            }
            $child.text(arrText[i]);
            getHotKeywordCal(i, $child);
            $child.show();
            div.append($child);
        }
    }

    // 获取历史搜索关键字
    getHistoryKeyword = function(){
        for(var i = 0; i< numHistory;i++){
            if(getLocal("historySearch" +i) != ""){
                var $tempDiv =  $("#historySearch").find("a").first().clone();
                if(i == 0){
                    $("#historySearch").find("a").remove();
                }
                $("#historySearch").append($tempDiv );
                $tempDiv.show();
                $tempDiv.text(getLocal("historySearch" +i));
                $tempDiv.attr("onclick", "getSearchGoodByKeyword(\"0" +i +"\")");
            }else{
                break;
            }
            $("#historySearch").find("a:hidden").remove();
        }
    }

    getDataByURL(getHotKeywordUrl, getHotKeywordUrlSuccess, true);
    getHistoryKeyword();
    // 页面加载初始化
    goods.page = 1;

    //实例化输入提示的JS,参数为进行查询操作时要调用的函数名  
    searchSuggest = new oSearchSuggest(sendKeyWordToBack);

    var firstIdSearch = new Object();   // 一级分类中有商品的分类id
    var successJson = new Object();
    searchGoodUrlSuccess = function(dataJson){
        if(dataJson.length != 0){
            successJson = dataJson;
            $("#pro-sort .sort-pro-list").show();
            $("#pro-sort .sort-left").show();
            // 统计一级分类商品数量
            $("#pro-sort .sort-left .sort-list li").first().removeClass("current");
            var $div = $("#pro-sort .sort-left .sort-list li").first().clone();
            $("#pro-sort .sort-left .sort-list li").remove();
            $div.find("a").attr("onclick", "sortLeftSearchClicked(0, this)");
            $div.find("a").text("搜索结果(" +dataJson.length +")");
            $("#pro-sort .sort-left .sort-list").prepend($div);
            getDataByURL(getCategoryByLeftUrl, function(dataSortJson){
                firstIdSearch.clear;
                for(var i=0;i<dataSortJson.length;i++){
                    $div = $("#pro-sort .sort-left .sort-list li").first().clone();
                    $div.find("a").attr("onclick", "sortLeftSearchClicked(" +i +", this)");
                    var bExist = false;
                    var numGoods = 0;
                    for(var j = 0;j< dataJson.length;j++){
                        if(dataJson[j].parentCategoryId == dataSortJson[i].id){
                            numGoods++;
                            $div.find("a").text(dataSortJson[i].text +"(" +numGoods +")");
                            bExist = true;
                            firstIdSearch["sortLeftSearch" +i] = dataSortJson[i].id;
                        }
                    }
                    if(bExist){
                        $("#pro-sort .sort-left .sort-list").append($div);
                    }
                }
                $("#pro-sort .sort-left .sort-list").find("li:eq(0)").addClass("current");
            }, "", true);
            getGoodListUrlSuccess(dataJson);
        }else{
            showGlobalMessageDialog("您搜索的商品还在月球上。。。");
        }
    }

    sortLeftSearchClicked = function(index, $div){
        if($div.parentElement.className == "current"){
            return;
        }
        $("#pro-sort .sort-left .sort-list li").each(function(idx, elm){
            if($(elm)[0] == $div.parentElement){
                $(elm).addClass("current");
            }else{
                $(elm).removeClass("current");
            }
        })
        if(index == 0){
            getGoodListUrlSuccess(successJson);
        }else{
            var selectId = firstIdSearch["sortLeftSearch" +index];
            var tempJson = new Array();
            for(var i= 0,j=0;i<successJson.length;i++){
                if(successJson[i].parentCategoryId == selectId){
                    tempJson[j] = successJson[i];
                    j++;
                    tempJson.length = j;
                }
            }
            bRefreshProlist = true;
            getGoodListUrlSuccess(tempJson);
        }
    }
});

var bHistoryClicked = false;  // 是否检测完本地存储历史搜索
var numHistory = 10;    // 历史搜索数量
function getSearchGoodUrl(value) {
    if (value == null) {
        value = $("#searchId").get(0).value;
    }
    if(value != ""){
        var i=0;
        var bExist = false;
        var tempValue;
        for(; i<numHistory;i++){
            if(getLocal("historySearch" +i) == ""){
                break;
            }else if(getLocal("historySearch" +i) != "" && getLocal("historySearch" +i) == value){
                // 当前点击的历史搜索置顶
                tempValue = getLocal("historySearch" +0);
                var $firstdiv = $("#historySearch").find("a:eq(0)");
                $firstdiv.text(value);
                setLocal("historySearch" +0, value);
                var $changeDiv = $("#historySearch").find("a:eq(" +i +")");
                $changeDiv.text(tempValue);
                setLocal("historySearch" +i, tempValue);
                bExist = true;
                break;
            }
        }
        if( ! bExist && ! bHistoryClicked){
            if(i<10){
                var $child = $("#historySearch").find("a").first().clone();
                $("#historySearch").find("a:hidden").remove();
                $child.attr("onclick", "getSearchGoodByKeyword(\"0" +i +"\")");
                $child.show();
                $("#historySearch").append($child);
            }else{
                //$("#historySearch").find("a:eq(" +numHistory-1 +")").remove();
            }
            for(var j=i;j> -1; j--){
                if(j != 0){
                    setLocal("historySearch" +j, getLocal("historySearch" +(j-1)));
                    $("#historySearch").find("a:eq(" +j +")").text(getLocal("historySearch" +(j-1)));
                }else{
                    var $firstdiv = $("#historySearch").find("a:eq(0)");
                    $firstdiv.text(value);
                    setLocal("historySearch" +0, value);
                }
            }
        }
        bHistoryClicked = false;
        var data = "buyerId=" +userInfo.id;
        data += "&keyword=" +value;
        data += "&page=" +goods.page;
        getDataByURL(searchGoodUrl, searchGoodUrlSuccess, data, true);
    }else{
        showGlobalMessageDialog("请输入搜索内容！");
    }
}

// 实现搜索输入框的输入提示js类
function oSearchSuggest(searchFuc) {
    var input = $('#searchId');
    var suggestWrap = $('#gov_search_suggest');
    var key = "";
    var init = function () {
        input.bind('keyup', sendKeyWord);
        input.bind('blur', function () { setTimeout(hideSuggest, 100); })
    }
    var hideSuggest = function () {
        suggestWrap.hide();
    }

    //发送请求，根据关键字到后台查询  
    var sendKeyWord = function (event) {

        //键盘选择下拉项  
        if (suggestWrap.css('display') == 'block' && event.keyCode == 38 || event.keyCode == 40) {
            var current = suggestWrap.find('li.hover');
            if (event.keyCode == 38) {
                if (current.length > 0) {
                    var prevLi = current.removeClass('hover').prev();
                    if (prevLi.length > 0) {
                        prevLi.addClass('hover');
                        input.val(prevLi.html());
                    }
                } else {
                    var last = suggestWrap.find('li:last');
                    last.addClass('hover');
                    input.val(last.html());
                }

            } else if (event.keyCode == 40) {
                if (current.length > 0) {
                    var nextLi = current.removeClass('hover').next();
                    if (nextLi.length > 0) {
                        nextLi.addClass('hover');
                        input.val(nextLi.html());
                    }
                } else {
                    var first = suggestWrap.find('li:first');
                    first.addClass('hover');
                    input.val(first.html());
                }
            }

            //输入字符  
        } else {
            var valText = $.trim(input.val());
            if (valText == '' || valText == key) {
                return;
            }
            searchFuc(valText);
            key = valText;
        }

    }
    //请求返回后，执行数据展示  
    this.dataDisplay = function (data) {
        if (data.length <= 0) {
            suggestWrap.hide();
            return;
        }

        //往搜索框下拉建议显示栏中添加条目并显示  
        var li;
        var tmpFrag = document.createDocumentFragment();
        suggestWrap.find('ul').html('');
        for (var i = 0; i < data.length; i++) {
            li = document.createElement('LI');
            li.innerHTML = data[i];
            tmpFrag.appendChild(li);
        }
        suggestWrap.find('ul').append(tmpFrag);
        suggestWrap.show();

        //为下拉选项绑定鼠标事件  
        suggestWrap.find('li').hover(function () {
            suggestWrap.find('li').removeClass('hover');
            $(this).addClass('hover');

        }, function () {
            $(this).removeClass('hover');
        }).bind('click', function () {
            input.val(this.innerHTML);
            suggestWrap.hide();
        });
    }
    init();
};

//这是一个模似函数，实现向后台发送ajax查询请求，并返回一个查询结果数据，传递给前台的JS,再由前台JS来展示数据。本函数由程序员进行修改实现查询的请求  
//参数为一个字符串，是搜索输入框中当前的内容  
function sendKeyWordToBack(keyword) {
    /*  var obj = {  
                "keyword" : keyword  
            };  
            $.ajax({  
                    type: "POST",  
                    url: "${ctx}/front/suqiu2/search/prompt-keyword.action",  
                    async:false,  
                    data: obj,  
                    dataType: "json",  
                    success: function(data){  
                        //var json = eval("("+data+")");  
                        var key=data.split(",");  
                        var aData = [];  
                        for(var i=0;i<key.length;i++){  
                                //以下为根据输入返回搜索结果的模拟效果代码,实际数据由后台返回  
                            if(key[i]!=""){  
                                aData.push(key[i]);  
                            }  
                        }  
                        //将返回的数据传递给实现搜索输入框的输入提示js类  
                        searchSuggest.dataDisplay(aData);  
                    }  
        });      */

    //以下为根据输入返回搜索结果的模拟效果代码,实际数据由后台返回  
    var aData = [];
    aData.push(keyword + '返回数据1');
    aData.push(keyword + '返回数据2');
    aData.push(keyword + '不是有的人天生吃素的');
    aData.push(keyword + '不是有的人天生吃素的');
    aData.push(keyword + '2012是真的');
    aData.push(keyword + '2012是假的');
    //将返回的数据传递给实现搜索输入框的输入提示js类  
    searchSuggest.dataDisplay(aData);
}