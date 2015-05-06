// 搜索页面
var searchSuggest;
var historySearch = new Array();
var firstIdSearch = new Object();   // 一级分类中有商品的分类id
var successGoodsJson = new Object();     // 缓存获取右边商品列表成功数据
$(document).on("panelbeforeload", '#searchPanel', function (e) {
    $("#sortSearch .sort-pro-list .list-mod").hide();
    $("#sortSearch .sort-pro-list").hide();
    $("#sortSearch .sort-left").hide();
    $("#sortSearch .sort-pro-list").css({
        "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
        - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
        "width":"", "margin-left":"",
    });

    $("#searchId").focus().autocomplete(goodHintKey);
    $("#searchId").result(function(event, data, formatted) {
        if (data){
            $("#searchId").get(0).value = data[0];
            getSearchGoodUrl(data[0]);
        }
    });

    loadGoodsListByConditionSearch = function (bRefresh, bReset, bSpecial, index){
        if(bShowNextPage || bReset){
            bRefreshProlist = bRefresh;
            var data = "";
            data += "buyerId=" +userInfo.id;
            data += "&page=" + goods.page;
            if(index != null){
                if(index == 0){
                    goods.sort = "saleCount";
                    data += "&sort=saleCount";
                }else{
                    goods.sort = "salePrice";
                    data += "&sort=salePrice";
                }
                data += "&keyword=" +$("#searchId").get(0).value;
                data += "&order=asc";
            }else{
                data += "&categoryId=" +dataByCondition.categoryId;
            }
            getDataByURL(getCategoryGoodsByConditionUrl, getGoodListUrlSuccessSearch, data, true);
        }
    }
// 人气价格排序
    sortsClickedSearch = function (index){
        if($("#sortsSearch").find("a:eq(" +index +")").hasClass("current")){
            return;
        }
        $("#sortsSearch a").each(function(id, elm){
            if(id != index){
                $(elm).removeClass("current");
            }else{
                $(elm).addClass("current");
            }
        })
        loadGoodsListByConditionSearch(true, true, null, index);
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

    searchGoodUrlSuccess = function(dataJson){
        if(dataJson.length != 0){
            successGoodsJson = dataJson;
            $("#sortSearch .sort-pro-list").show();
            $("#sortSearch .sort-left").show();
            // 统计一级分类商品数量
            $("#sortSearch .sort-left .sort-list li").first().removeClass("current");
            var $div = $("#sortSearch .sort-left .sort-list li").first().clone();
            $("#sortSearch .sort-left .sort-list li").remove();
            $div.find("a").attr("onclick", "sortLeftSearchClicked(\"all\", this)");
            $div.find("a").text("搜索结果(" +dataJson.length +")");
            $div.show();
            $("#sortSearch .sort-left .sort-list").prepend($div);
            getDataByURL(getCategoryByLeftUrl, function(dataSortJson){
                firstIdSearch.clear;
                for(var i=0;i<dataSortJson.length;i++){
                    $div = $("#sortSearch .sort-left .sort-list li").first().clone();
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
                        $("#sortSearch .sort-left .sort-list").append($div);
                    }
                }
                $("#sortSearch .sort-left .sort-list").find("li:eq(0)").addClass("current");
            }, "", true);
            getGoodListUrlSuccessSearch(dataJson);
        }else{
            showGlobalMessageDialog("您搜索的商品还在月球上。。。");
        }
    }

    sortLeftSearchClicked = function(index, $div){
        if($div.parentElement.className == "current"){
            return;
        }
        $("#sortSearch .sort-left .sort-list li").each(function(idx, elm){
            if($(elm)[0] == $div.parentElement){
                $(elm).addClass("current");
            }else{
                $(elm).removeClass("current");
            }
        })
        if(index == "all"){
            getGoodListUrlSuccessSearch(successGoodsJson);
        }else{
            var selectId = firstIdSearch["sortLeftSearch" +index];
            var tempJson = new Array();
            for(var i= 0,j=0;i<successGoodsJson.length;i++){
                if(successGoodsJson[i].parentCategoryId == selectId){
                    tempJson[j] = successGoodsJson[i];
                    j++;
                    tempJson.length = j;
                }
            }
            bRefreshProlist = true;
            getGoodListUrlSuccessSearch(tempJson);
        }
    }

    getDataByURL(getHotKeywordUrl, getHotKeywordUrlSuccess, true);
    getHistoryKeyword();
    // 页面加载初始化
    goods.page = 1;
    bSpecialPanel = false;

    if(bGotoSearchDriect){
        getSearchGoodUrl(valueGotoSearch);
        bGotoSearchDriect = false;
    }
});

var bHistoryClicked = false;  // 是否检测完本地存储历史搜索
var numHistory = 10;    // 历史搜索数量
function getSearchGoodUrl(value) {
    if (value == null) {
        if($("#searchId").get(0) != null){
            value = $("#searchId").get(0).value;
        }else{
            value = "";
        }
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
        $("#searchId").get(0).value = value;
        data += "&page=" +goods.page;
        getDataByURL(searchGoodUrl, searchGoodUrlSuccess, data, true);
    }else{
        showGlobalMessageDialog("请输入搜索内容！");
    }
}

var bGotoSearchDriect = false;    // 是否是点击图片跳转进搜索界面
var valueGotoSearch;
function goToSearchByValue(value){
    bGotoSearchDriect = true;
    valueGotoSearch = value;
    if(isNotNullValue(value)){
        $.afui.loadContent("#searchPanel", false, false, transitionYC);
    }
}

function getGoodListUrlSuccessSearch(dataJson){
    var bLoadContent = true;    // 是否加载商品详细页
    if( dataJson.length >= 1){
        var $tempList = $("#goodsListSearch");
        if($("#goodsListSearch").length == 0){
            $tempList = $("#goodsListSearch0");
        }else{
            //$("#goodsListSearch").show();
        }
        if(bRefreshProlist){
            $("#sortSearch .sort-pro-list a").each(function(index, elm){
                var id = $(elm).attr("id");
                if(id != null && id.substr(0, 15) == 'goodsListSearch'){
                    $(elm).remove();
                }
            });
        }
        for(var i= 0; i<dataJson.length; i++){
            var goodSample = $tempList.clone();
            goodSample.show();
            dataJson[i].price = (parseFloat(dataJson[i].price)).toFixed(1);
            var index = (goods.page -1) *goods.rows +i;
            goodsPageId[index] = dataJson[i].id;
            goodSample.attr("id", "goodsListSearch" +index);
            goodSample.attr("onclick", "prolistRightClicked(" +index +")");
            if (dataJson[i].pictureId != ""){
                goodSample.find(".item .img img").attr("src", getImageUrl + dataJson[i].pictureId + "?thumb=73x73");
            }else{
                goodSample.find(".item .img img").attr("src", "images/temp/pro.png");
            }
            goodSample.find(".title.fontsize-n.ellipsis").text(dataJson[i].name);
            if(dataJson[i].subTitle != null){
                goodSample.find(".intro").show();
                goodSample.find(".intro").text(dataJson[i].subTitle);
            }
            goodsHeadTittle[index] = dataJson[i].name;
            goodSample.find(".nowprice").text("￥ " +dataJson[i].price);
            if(dataJson[i].price < dataJson[i].costPrice){
                goodSample.find(".nowprice").show();
                goodSample.find(".nowprice").text("￥ " +dataJson[i].costPrice);
            }
            goodSample.find(".addfav").attr("onclick" ,"addFavClicked(" +index +")");
            bAddFavArr[index] = dataJson[i].isCollect;
            if(dataJson[i].isCollect){
                goodSample.find(".addfav").text("已收藏");
            }else{
                goodSample.find(".addfav").text("收藏");
            }
            if(dataJson[i].isPriceList){
                goodSample.find("#moreDiscountSearch").show();
            }
            goodSample.find(".setcount .reduce").attr("onclick" ,"reduceButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .add").attr("onclick" ,"addButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .count").attr("id" ,"goodCountSearch" +index);
            getGoodsCountByID(goodsPageId[index], function setGoodCount(count, index){
                if($("#goodCountSearch" +index).get(0) != null){
                    $("#goodCountSearch" +index).get(0).value = count;
                    if($("#goodCountSearch" +index).get(0).value == 0){
                        $("#goodsListSearch" +index).find(".setcount .reduce").hide();
                    }else{
                        $("#goodsListSearch" +index).find(".setcount .reduce").show();
                    }
                }
            }, index);
            $("#sortSearch .sort-pro-list").append(goodSample);
        }
        bToLoadOnoffProlist = true;
    }else if(dataJson.length == 0){
        bShowNextPage = false;
        if(goods.page == 1){
            hideAllTop();
            showGlobalMessageDialog("该分类商品正在联盟中。。。");
            bToLoadOnoffProlist = true;
        }else{
            bScrollToBottom = true;
            bToLoadOnoffProlist = false;
        }
    }

    addFavClicked = function(index){
        bLoadContent = false;
        var data = "id=" +goodsPageId[index];
        data += "&buyerId";
        if(bAddFavArr[index]){
            getDataByURL(delCollectionUrl, function(dataJson){
                $("#goodsListSearch" +index).find(".addfav").text("收藏");
                bAddFavArr[index] = false;
            }, data);
        }else{
            getDataByURL(addCollectionUrl, function(dataJson){
                $("#goodsListSearch" +index).find(".addfav").text("已收藏");
                bAddFavArr[index] = true;
            }, data);
        }
    }

    reduceButtonProlistClicked = function (index){
        bLoadContent = false;
        if($("#goodCountSearch" +index).get(0).value != 0){
            $("#goodCountSearch" +index).get(0).value--;
            if($("#goodCountSearch" +index).get(0).value == 0){
                $("#goodsListSearch" +index).find(".setcount .reduce").hide();
            }
            setCountByID(goodsPageId[index], $("#goodCountSearch" +index).get(0).value);
        }
    }

    addButtonProlistClicked = function (index){
        bLoadContent = false;
        $("#goodsListSearch" +index).find(".setcount .reduce").show();
        $("#goodCountSearch" +index).get(0).value++;
        setCountByID(goodsPageId[index], $("#goodCountSearch" +index).get(0).value);
    }

    prolistRightClicked = function(index){
        if(bLoadContent){
            setSession(charVec.goodHeadTittleSe, goodsHeadTittle[index]);
            currentProviewID =  goodsPageId[index];
            addToHistory(goodsPageId[index], "historyProlist");
            $.afui.loadContent("#proviewPanel", false, false, transitionYC);
        }
        bLoadContent = true;
    }
}

