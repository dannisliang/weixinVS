﻿// 搜索页面
var searchSuggest;
var historySearch = new Array();
$(document).on("panelbeforeload", '#searchPanel', function (e) {
    $("#pro-sort .sort-pro-list .topad img").hide();
    $("#pro-sort .sort-pro-list .list-mod").hide();
    $("#sortsProlist").hide();
    $("#pro-sort .sort-pro-list").hide();
    $("#pro-sort .sort-left").hide();
    $("#suggest1").focus().autocomplete(cities);

    // 按提示搜索
    searchByHint = function (target){
        $("#searchId").get(0).value = $(target).text();
        getSearchGoodUrl();
    }
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
