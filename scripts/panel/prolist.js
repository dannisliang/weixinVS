﻿$(document).on("panelbeforeload", '#prolistPanel', function (e) {
    if($.os.iphone){
        $("#yicallHeaderProlist").css({
            "top":"-20px",
        })
    }
});

$(document).on("panelload", '#prolistPanel', function (e) {
    function resetUrlData(){
        goods.page = 1;
    }
    // 标签分类被点击
    tagProlistClicked = function(index){
        if($("#tagProlist a:eq(" +index +")").hasClass("selected")){
            $("#tagProlist a:eq(" +index +")").removeClass("selected");
            dataByCondition.tagId = "";
        }else {
            $("#tagProlist a:eq(" + index + ")").addClass("selected");
            for (var i = 0; ; i++) {
                if ($("#tagProlist a:eq(" + i + ")").length > 0) {
                    if (i != index) {
                        $("#tagProlist a:eq(" + i + ")").removeClass("selected");
                    }
                } else {
                    break;
                }
            }
            dataByCondition.tagId = tagProlistId[index];
        }
        loadGoodsListByCondition(true, true);
    }

    tagProlistFunc = function(index, div, id){
        div.attr("onclick", "tagProlistClicked(" +index +")");
        tagProlistId[index] = id;
    }

    // 标签获取成功
    getTagUrlSuccess = function(dataJson){
        if(dataJson.length != 0){
            $("#tagProlist").parent().show();
            commonATextSel(dataJson, $("#tagProlist"), tagProlistFunc);
        }
    }

    // 二级分类被点击
    var resetCateProperties = false;
    nextCategoryClicked = function(index){
        if($("#sortTagProlist a:eq(" +index +")").hasClass("selected")){
            $("#sortTagProlist a:eq(" +index +")").removeClass("selected");
            dataByCondition.categoryId = "";
            if( ! bSpecialPanel){
                bLeftSortClick = true;
                resetCateProperties = true;
                getDataByURL(getCategoryPropertiesUrl, getCategoryPropertiesUrlSuccess, "categoryId=" + prolistLeftID[idxLeftSortClick], true);  //属性
            }
        }else{
            $("#sortTagProlist a:eq(" +index +")").addClass("selected");
            for(var i = 0;;i++){
                if($("#sortTagProlist a:eq(" +i +")").length > 0){
                    if(i !=  index){
                        $("#sortTagProlist a:eq(" +i +")").removeClass("selected");
                    }
                }else{
                    break;
                }
            }
            bLeftSortClick = false;
            resetUrlData();
            dataByCondition.categoryId = nextCategoryId[index];
            if( ! bSpecialPanel){
                getDataByURL(getCategoryPropertiesUrl, getCategoryPropertiesUrlSuccess, "categoryId=" +nextCategoryId[index], true);    // 筛选区
            }
        }
        if(bSpecialPanel){
            loadGoodsListByCondition(true, true, true);
        }else{
            loadGoodsListByCondition(true, true);
        }
    }

    // 二级分类属性更改回调
    nextCategoryFunc = function(index, div, id){
        div.attr("onclick", "nextCategoryClicked(" +index +")");
        nextCategoryId[index] = id;
    }

    // 二级分类属性更改
    onCategoryPropertiesSuccess = function(dataJson){
        if(dataJson.length != 0){
            dataByCondition.categoryId = dataJson[0].id;
        }
        commonATextSel(dataJson, $("#sortTagProlist"), nextCategoryFunc);
    }

    attrSortClicked = function(index){
        commonATextSel(dataJson, $("#sortTagProlist"), nextCategoryFunc);
    }

    commonAttrSortClicked = function(string, index){
        if($("#" +string +index).hasClass("selected")){
            $("#" +string +index).removeClass("selected");
            goods.page = 1;
            loadGoodsListByCondition(true, true);
        }else{
            $("#" +string +index).addClass("selected");
            for (var i = 0; ; i++) {
                if ($("#" +string +parseInt(index/10) +i).length > 0) {
                    if (i != index%10) {
                        $("#" +string +parseInt(index/10) +i).removeClass("selected");
                    }
                } else {
                    break;
                }
            }
            goods.page = 1;
            loadGoodsListByCondition(true, true);
        }
    }

    // 一级分类筛选区点击事件
    firstAttrSortClicked = function(index){
        commonAttrSortClicked("firstAttrSortId", index);
    }

    // 二级分类筛选区点击事件
    secondAttrSortClicked = function(index){
        commonAttrSortClicked("secondAttrSortId", index);
    }

    // 隐藏筛选区
    hideFilterDiv = function(){
        $("#sortAll").find("li").each(function(index, elm){
            if($(elm).find("div").attr("id").indexOf("first") != -1){
                $(elm).hide();
            }
            if($(elm).find("div").attr("id").indexOf("second") != -1){
                $(elm).hide();
            }
        })
    }

    // 更改二级分类筛选区
    getCategoryPropertiesUrlSuccess = function(dataJson){
        var toAddString;
        if(bLeftSortClick){
            toAddString = "firstAttrSort";
        }else{
            toAddString = "secondAttrSort";
        }
        if(dataJson.length != 0){
            for(var i=0;i<dataJson.length;i++){
                var $div;
                if($("#" +toAddString +"0").length != 0){
                    $div = $("#" +toAddString +"0").parent().clone();
                }else{
                    $div = $("#" +toAddString).parent().clone();
                }
                if(i == 0){
                    $("#sortAll").find("li").each(function(index, elm){
                        if(bLeftSortClick){
                            if($(elm).find("div").attr("id").indexOf("first") != -1){
                                $(elm).remove();
                            }
                            if($(elm).find("div").attr("id").indexOf("second") != -1){
                                $(elm).hide();
                            }
                        }else{
                            if($(elm).find("div").attr("id").indexOf("first") != -1){
                                $(elm).hide();
                            }
                            if($(elm).find("div").attr("id").indexOf("second") != -1){
                                $(elm).remove();
                            }
                        }
                    })
                }
                $div.find("span").text(dataJson[i].name +"：");
                $div.show();
                $div.find("div").attr("id", toAddString +i);
                categoryPropertiesId[i] = dataJson[i].id;
                var arrContent=dataJson[i].content.split(",");
                for(var j=0;j<arrContent.length;j++){
                    var $child = $div.find("a").first().clone();
                    if(j == 0){
                        $div.find("a").remove();
                    }
                    $child.text(arrContent[j]);
                    $child.show();
                    $child.attr("onclick", toAddString +"Clicked(\""+i+j +"\")");
                    $child.attr("id", toAddString +"Id"+i+j);
                    $div.find("div").append($child);
                }
                $("#sortAll").append($div);
            }
        }else{
            $("#sortAll").find("li").each(function(index, elm){
                if(bLeftSortClick){
                    if($(elm).find("div").attr("id").indexOf("first") != -1){
                        $(elm).hide();
                    }
                    if($(elm).find("div").attr("id").indexOf("second") != -1){
                        $(elm).hide();
                    }
                }else{
                    if($(elm).find("div").attr("id").indexOf("second") != -1){
                        $(elm).hide();
                    }
                }
            })
        }
    }

    selectDefaultCountProlist = function(){
        // 人气默认选定
        $("#sortsProlist a").each(function(id, elm){
            if(id != 0){
                $(elm).removeClass("current");
            }else{
                $(elm).addClass("current");
            }
        })
    }

    // 点击一级分类
    prolistRight = function (index) {
        if ($("#sortProlist .sort-left .sort-list li")[index].className == 'current')
            return;
        $("#sortProlist .sort-pro-list").animate({scrollTop: '0px'}, 0);
        $("#sortProlist .sort-pro-list").show();
        $("#sortProlist .sort-left .sort-list li").removeClass("current");
        $("#sortProlist .sort-left .sort-list li")[index].className = 'current';
        $("#sortsProlist").show();
        goods.page = 1;
        goods.sort = "saleCount";
        bClickFirstIdProlist = true;
        selectDefaultCountProlist();
        idxLeftSortClick = index;
        bSpecialPanel = false;
        if (index != 0 && prolistLeftID[index] != index) {
            $("#sortProlist .sort-pro-list .list-mod").show();
            $("#sortProlist .sort-pro-list .sorts").show();
            $("#tagProlist").parent().hide();
            goods.categoryId = prolistLeftID[index];
            bLeftSortClick = true;
            var data = "categoryId=" + prolistLeftID[index];
            getDataByURL(getCategoryPropertiesUrl, getCategoryPropertiesUrlSuccess, data, true);  //属性
            getDataByURL(getNextCategoryUrl, onCategoryPropertiesSuccess, data, true);  //分类
            getDataByURL(getTagUrl, getTagUrlSuccess, "", true);    //标签
            data += "&companyId=" +getLocal("schoolid");
            getDataByURL(pageSettingUrl, pageSettingUrlSuccess, data);    //动态图
        } else if (prolistLeftID[index] == index) { // 最近浏览
            var bExist = false;
            var data = "buyerId=" +getLocal(charVec.buyerIdLo);
            data += "&goodsIds=";
            for(var i = 0;i<20;i++){
                if(getLocal("historyProlist" +i) != ""){
                    bExist = true;
                    data += getLocal("historyProlist" +i) +",";
                }else{
                    break;
                }
            }
            $(".bx-wrapper").hide();
            $("#sortProlist .sort-pro-list .list-mod").hide();
            $("#sortsProlist").hide();
            $("#sortProlist .sort-pro-list").show();
            if(bExist){
                data = data.substr(0, data.length -1);
                getDataByURL(getGoodsByIdUrl, function(dataJson){
                    if(dataJson.length != 0){
                        bRefreshProlist = true;
                        getGoodListUrlSuccess(dataJson);
                    }
                }, data);
            }else{
                $("#sortProlist .sort-pro-list").hide();
                showGlobalMessageDialog("您还没有浏览商品。。。");
            }
        }else { // 特惠专区
            $(".bx-wrapper").hide();
            $("#tagProlist").parent().hide();
            $("#sortProlist .sort-pro-list .list-mod").show();
            hideFilterDiv();
            bSpecialPanel = true;
            getDataByURL(getSpecialOfferCategoryUrl, onCategoryPropertiesSuccess, "companyId=" +getLocal("schoolid"));
        }
        bShowNextPage = true;
        loadGoodsList(true, bSpecialPanel);
        //load_content("refresh", false);
    }

    // 创建轮播图片控件
    reloadBxsliderProlist = function(toAddDiv){
        if(bxSliderProlist.reloadSlider == null){
            $('.bx-wrapper').remove();
            $("#sortProlist .sort-pro-list").prepend('<ul class="commonBxslider"> </ul>');
            if($('.commonBxslider').length > 1){
                $('.commonBxslider').last().remove();
                bxSliderProlist = $('.commonBxslider').bxSlider({
                    auto: true,
                    pause: 2000,
                });
            }
        }
        if(toAddDiv != null){
            $('.commonBxslider').append(toAddDiv);
            bxSliderProlist.reloadSlider();
        }
    }

    // 轮播图片获取成功
    pageSettingUrlSuccess = function (dataJson){
        bChangePic = false;
        if(dataJson.length == 0){
            bHideBxslider = true;
            $(".bx-wrapper").hide();
            return;
        }
        bHideBxslider = false;
        $(".commonBxslider").show();
        var width = parseFloat($(".commonBxslider li").first().css("width")).toFixed(2);
        $(".commonBxslider img").css({
            width: width,
            height:parseFloat(width/3).toFixed(2)
        });
        var toAddDiv = "";
        for(var i= 0 ; i < 1 ; i++){
            var sliderPageDataProlist = new Object();
            sliderPageDataProlist.label = dataJson[i].label;
            sliderPageDataProlist.pageId = dataJson[i].pageId;
            sliderPageDataProlist.pageType = dataJson[i].pageType;
            sliderPageDataProlist.size = dataJson[i].size;
            sliderPageDataProlist.typeSetting = dataJson[i].typeSetting;
            sliderPageDataProlist.pageItem = new Array();
            for(var j = 0 ; j <dataJson[i].pageItem.length;j++){
                sliderPageDataProlist.pageItem[j] = new Object();
                sliderPageDataProlist.pageItem[j].fileId = dataJson[i].pageItem[j].fileId;
                sliderPageDataProlist.pageItem[j].gotoType = dataJson[i].pageItem[j].gotoType;
                sliderPageDataProlist.pageItem[j].gotoValue = dataJson[i].pageItem[j].gotoValue;
                sliderPageDataProlist.pageItem[j].pageItemId = dataJson[i].pageItem[j].pageItemId;
                switch (sliderPageDataProlist.typeSetting)
                {
                    case "One"://；轮播
                        bChangePic = true;
                        var $div = $(".commonBxslider li:eq(0)").clone();
                        if(j == 0){
                            $(".commonBxslider li").each(function(index, elm){
                                if($(elm).index() != 0 && $(elm) != $(".commonBxslider li").last()){
                                    $(elm).remove();
                                }
                            })
                        }
                        $div.show();
                        $div.removeClass("bx-clone");
                        $div.find("img").attr("src", getImageUrl + sliderPageDataProlist.pageItem[j].fileId +"?thumb=" +parseInt(width) +"x");
                        $div.find("img").attr("onclick", 'changeToUrlClicked("' +sliderPageDataProlist.pageItem[j].gotoType +'", "' +sliderPageDataProlist.pageItem[j].gotoValue +'")');
                        toAddDiv += '<li>' +$div.html() +'</li>';
                        break;
                    default:
                        $(".bx-wrapper").hide();
                        break;
                }
            }
        }
        if(bChangePic){
            reloadBxsliderProlist(toAddDiv);
        }
    }

    onSortLeftSuccess = function (dataJson) {
        var gotoIndex = null;
        for (var j = 1, i =0; i < dataJson.length +2; i++){
            $("#sortProlist .sort-left .sort-list").find("li").removeClass("current");
            var $div = $("#sortProlist .sort-left .sort-list").find("li").first().clone();
            $div.show();
            if( i != dataJson.length+1 && i != 0){
                if(! dataJson[i-1].isHide == true){
                    $div.find("a").attr("onclick", "prolistRight(" + j + ")");
                    prolistLeftID[j] = dataJson[i-1].id;
                    $div.find("a").text(dataJson[i-1].text);
                    $("#sortProlist .sort-left .sort-list").append($div);
                    if(bGotoDriect){
                        if(prolistLeftID[j] == firstDriectId){
                            gotoIndex = j;
                        }
                    }
                    j++;
                }
            }else if(i == dataJson.length +1){
                $div.find("a").attr("onclick", "prolistRight(" + j + ")");
                $div.find("a").text(textVec.prolistLast);
                prolistLeftID[j] = j;
                $("#sortProlist .sort-left .sort-list").append($div);
            }else if( i== 0){
                $("#sortProlist .sort-left .sort-list").find("li").remove();
                $div.find("a").attr("onclick", "prolistRight(" + 0 + ")");
                $div.find("a").text(textVec.prolistFirst);
                $("#sortProlist .sort-left .sort-list").append($div);
            }
        }
        if(bGotoDriect && gotoIndex != null){
            prolistRight(gotoIndex);
        }else if(bGotoDriect){
            prolistRight(0);
        }else{
            if($("#sortProlist .sort-left .sort-list li")[0] != null){
                $("#sortProlist .sort-left .sort-list li")[0].className = 'current';
            }
            bSpecialPanel = true;
            getDataByURL(getSpecialOfferCategoryUrl, onCategoryPropertiesSuccess, "companyId=" +getLocal("schoolid"), true);
            loadGoodsList(true, true);
        }
        bGotoDriect = false;
    }

    //downloadFile("http://pic.dofay.com/2013/07/20120329211931359.jpg", "dfdfo");
    //$("#wrapper").hide();
    //$.afui.drawer.show('#left', 'left', 'cover');
    prolistInit = function(){
        $("#sortProlist .sort-pro-list").show();
        $("#sortProlist .sort-left").show();
        $("#sortProlist .sort-pro-list .list-mod").show();
        $("#sortProlist .sort-pro-list .sorts").show();
        $(".commonBxslider").show();
        $("#sortProlist .sort-pro-list").css({
            "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
            "width":"", "margin-left":"",
        });
        $("#sortProlist .sort-left").css({
            "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() +20 + "px",
        });
        if(bxSliderProlist == null){
            bxSliderProlist = $('.commonBxslider').bxSlider({
                auto: true,
                pause: 2000,
            });
        }else{
            bxSliderProlist.reloadSlider();
        }
        if(bSpecialPanel){
            $("#tagProlist").parent().hide();
        }
        if (bHideBxslider){
            $(".bx-wrapper").hide();
        }

        $("#sortProlist .sort-pro-list").scroll(function(){
            var viewH =$(this).height(),//可见高度
                contentH =$(this).get(0).scrollHeight,//内容高度
                scrollTop =$(this).scrollTop();//滚动高度
            //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            if(scrollTop/(contentH -viewH)>=0.7){ //在滚动条距离底端60%以内：
                if(bToLoadOnoffProlist){
                    bToLoadOnoffProlist = false;
                    goods.page++;
                    if(bSpecialPanel){
                        loadGoodsList(false, true);
                    }else{
                        loadGoodsList(false);
                    }
                }
            }
            if(contentH - viewH - scrollTop <= 10 && bScrollToBottom){
                showGlobalMessageDialog("已经是最后一页了。。。");
                bScrollToBottom = false;
            }
        });
    }

    prolistInit();

    if( ! bLoadRightProlist || bGotoDriect){
        //load_content();
        bLoadRightProlist = true;
        hideFilterDiv();
        bRefreshProlist = true;
        getDataByURL(getCategoryByLeftUrl, onSortLeftSuccess, "", true);
    }
    if(bxSliderProlist != null){
        reloadBxsliderProlist();
    }
});

var bHideBxslider = true;
var bClickFirstIdProlist = false;   // 是否点击的一级分类
var bScrollToBottom = false;        // 是否下拉到底部
var bToLoadOnoffProlist = false;    // 下拉的時候是否加載新內容
var bChangePic = false; // 轮播控件是否显示
var bxSliderProlist = null;
var bGotoDriect = false;    // 是否是点击图片跳转进浏览界面
var firstDriectId;

// 跳转到一级分类页
function goToProlistById(firstId){
    bGotoDriect = true;
    firstDriectId = firstId;
    if(isNotNullValue(firstId)){
        $.afui.loadContent("#prolistPanel", false, false, transitionYC);
    }
}

function commonATextSel(dataJson, div, callback){
    for(var i=0;i<dataJson.length;i++){
        if(! dataJson[i].isHide == true){
            var $child = div.find("a").first().clone();
            if(i == 0){
                div.find("a").remove();
            }
            $child.text(dataJson[i].name);
            $child.show();
            $child.removeClass("selected");
            callback(i, $child, dataJson[i].id);
            div.append($child);
        }
    }
}

function loadGoodsList(bRefresh, bSpecial){
    if(bShowNextPage){
        bRefreshProlist = bRefresh;
        bShowWaitingDialog = false;
        var data = "";
        data += "buyerId=" +getLocal(charVec.buyerIdLo);
        data += "&page=" + goods.page;
        if( ! bSpecial){
            data += "&categoryId=" +goods.categoryId;
            getDataByURL(getGoodsByNonLastCategoryUrl, getGoodListUrlSuccess, data);
        }else{
            data += "&companyId=" +getLocal("schoolid");
            getDataByURL(getSpecialOfferUrl, getGoodListUrlSuccess, data);
        }
    }
}

// 按照右边分类筛选商品
loadGoodsListByCondition = function (bRefresh, bReset, bSpecial, index){
    if(bShowNextPage || bReset){
        bRefreshProlist = bRefresh;
        var data = "";
        data += "buyerId=" +getLocal(charVec.buyerIdLo);
        data += "&page=" + goods.page;

        // 人气价格参数
        $("#sortsProlist a").each(function(id, elm){
            if($(elm).hasClass("current")){
                switch (id){
                    case 0:
                        data += "&sort=saleCount";
                        break;
                    case 1:
                        data += "&sort=salePrice";
                        break;
                    default :
                        data += "&sort=saleCount";
                }
            }
        })
        data += "&order=asc";

        // 二级分类参数
        var bCateExist = false;
        for(var i=0; i < nextCategoryId.length; i++){
            if($("#sortTagProlist a:eq(" +i +")").hasClass("selected")){
                data += "&categoryId=" +nextCategoryId[i];
                bCateExist = true;
                break;
            }
        }
        if(bSpecial == null && ! bSpecialPanel){
            if(! bCateExist){
                data += "&categoryId=" +prolistLeftID[idxLeftSortClick];
            }
            for(var i=0; i < nextCategoryId.length; i++){
                if($("#tagProlist a:eq(" +i +")").hasClass("selected")){
                    data += "&tagId=" +tagProlistId[i];
                    break;
                }
            }

            // 筛选参数加入
            data+= "&filterStr=";
            var stringAttr = "";
            if($("#secondAttrSortId00").length > 0){
                stringAttr = "#secondAttrSortId";
            }else if($("#firstAttrSortId00").length >0){
                stringAttr = "#firstAttrSortId00";
            }
            if(stringAttr != ""){
                var bFilterExist = false;
                for(var i = 0; ; i++){
                    if($(stringAttr +i +0).length > 0){
                        for(var j = 0; ; j++){
                            var $div = $(stringAttr +i +j);
                            if($div.length > 0){
                                if($div.hasClass("selected")){
                                    if( ! bFilterExist){
                                        bFilterExist = true;
                                        data += categoryPropertiesId[i] +":" +$div.text();
                                    }else{
                                        data += "#" +categoryPropertiesId[i] +":" +$div.text();
                                    }
                                }
                            }else{
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
            }
            getDataByURL(getCategoryGoodsByConditionUrl, getGoodListUrlSuccess, data, true);
        }else{
            data += "&companyId=" +getLocal("schoolid");
            getDataByURL(getSpecialOfferGoodsByCategoryIdUrl, getGoodListUrlSuccess, data, true);
        }
    }
}

// 人气价格排序
sortsClicked = function (index){
    if($("#sortsProlist").find("a:eq(" +index +")").hasClass("current")){
        return;
    }
    $("#sortsProlist a").each(function(id, elm){
        if(id != index){
            $(elm).removeClass("current");
        }else{
            $(elm).addClass("current");
        }
    })
    loadGoodsListByCondition(true, true, null, index);
}

var idxLeftSortClick = 0;     // 左边被点击分类的索引
var bLeftSortClick = false; // 是否是点击的左边分类
var bRefreshProlist = false;
var bLoadRightProlist = false;
var bSpecialPanel = false;  // 是否是加载的特惠专区
var goodsHeadTittle = new Array();  // 商品详细页标题
var bAddFavArr = new Array();   // 是否已收藏
var goodsPageId = new Array();  // 商品页Id
var nextCategoryId = new Array();   //下一级分类id
var tagProlistId = new Array();   //标签id
var categoryPropertiesId = new Array();   //筛选id
var idxFilter = 0;      // 选择的筛选索引
var selectCategoryId = new Array();     // 选择的筛选id
var selectContent = new Array();     // 选择的筛选id的对应内容
var dataByCondition = new Array();      // 按条件选择商品
dataByCondition.categoryId = "";
dataByCondition.tagId = "";

// 浏览加载需重置的参数
var bShowNextPage = true;       // 是否显示下一页。。当没有更多内容时，设置为false
var beforeScrollY = 0;

// 隐藏右边分类的全部
function hideAllTop(){
    $("#sortProlist .sort-pro-list .list-mod").hide();
    $(".easyToHideCommon").hide();
    $(".bx-wrapper").hide();
    $("#sortsProlist").hide();
}

function getGoodListUrlSuccess(dataJson){
    var bLoadContent = true;    // 是否加载商品详细页
    if( dataJson.length >= 1){
        var $tempList = $("#goodsList");
        if($("#goodsList").length == 0){
            $tempList = $("#goodsList0");
        }else{
            //$("#goodsList").show();
        }
        if(bRefreshProlist){
            $("#sortProlist .sort-pro-list a").each(function(index, elm){
                //var id = $(elm).attr("id");
                //if(id != null && id.substr(0, 9) == 'goodsList'){
                //    $(elm).remove();
                //}
            });
            $(".easyToHideCommon").remove();
        }
        for(var i= 0; i<dataJson.length; i++){
            var goodSample = $tempList.clone();
            goodSample.show();
            dataJson[i].price = (parseFloat(dataJson[i].price)).toFixed(1);
            var index = (goods.page -1) *goods.rows +i;
            goodsPageId[index] = dataJson[i].id;
            goodSample.attr("id", "goodsList" +index);
            goodSample.attr("onclick", "prolistRightClicked(" +index +")");
            if (dataJson[i].pictureId != ""){
                goodSample.find(".item .img img").attr("src", getImageUrl + dataJson[i].pictureId + "?thumb=73x73");
            }else{
                goodSample.find(".item .img img").attr("src", "images/temp/pro.png");
            }
            goodSample.find(".title.fontsize-n.ellipsis").text(dataJson[i].name);
            if(isNotNullValue(dataJson[i].subTitle)){
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
                goodSample.find(".addfav").addClass("orange");
            }else{
                goodSample.find(".addfav").removeClass("orange");
            }
            if(dataJson[i].isPriceList){
                goodSample.find("#moreDiscountProlist").show();
            }
            goodSample.find(".setcount .reduce i").attr("onclick" ,"reduceButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .add i").attr("onclick" ,"addButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .count").attr("id" ,"goodCountProlist" +index);
            $("#sortProlist .sort-pro-list").append(goodSample);
            getGoodsCountByID(goodsPageId[index], function setGoodCount(count, index){
                if($("#goodCountProlist" +index).get(0) != null){
                    $("#goodCountProlist" +index).get(0).value = count;
                    if($("#goodCountProlist" +index).get(0).value == 0){
                        $("#goodsList" +index).find(".setcount .reduce i").removeClass("yellow");
                        $("#goodsList" +index).find(".setcount .reduce i").addClass("gray");
                    }else{
                        $("#goodsList" +index).find(".setcount .reduce i").removeClass("gray");
                        $("#goodsList" +index).find(".setcount .reduce i").addClass("yellow");
                    }
                }
            }, index);
        }
        bToLoadOnoffProlist = true;
    }else if(dataJson.length == 0){
        bShowNextPage = false;
        if(goods.page == 1){
            if(bClickFirstIdProlist){
                hideAllTop();
            }else{
                $(".easyToHideCommon").hide();
            }
            showGlobalMessageDialog("该分类商品正在联盟中。。。");
            bToLoadOnoffProlist = true;
        }else{
            bScrollToBottom = true;
            bToLoadOnoffProlist = false;
        }
    }
    bClickFirstIdProlist = false;

    addFavClicked = function(index){
        bLoadContent = false;
        if(bAddFavArr[index]){
            var data = "goodsIds=" +goodsPageId[index];
            getDataByURL(delCollectionByGoodsIds, function(dataJson){
                $("#goodsList" +index).find(".addfav").removeClass("orange");
                bAddFavArr[index] = false;
            }, data);
        }else{
            var data = "id=" +goodsPageId[index];
            getDataByURL(addCollectionUrl, function(dataJson){
                $("#goodsList" +index).find(".addfav").addClass("orange");
                bAddFavArr[index] = true;
            }, data);
        }
    }

    reduceButtonProlistClicked = function (index){
        bLoadContent = false;
        if($("#goodCountProlist" +index).get(0).value != 0){
            $("#goodCountProlist" +index).get(0).value--;
            if($("#goodCountProlist" +index).get(0).value == 0){
                $("#goodsList" +index).find(".setcount a i:eq(0)").removeClass("yellow");
                $("#goodsList" +index).find(".setcount a i:eq(0)").addClass("gray");
            }
            setCountByID(goodsPageId[index], $("#goodCountProlist" +index).get(0).value);
        }
    }

    addButtonProlistClicked = function (index){
        bLoadContent = false;
        $("#goodsList" +index).find(".setcount a i:eq(0)").addClass("yellow");
        $("#goodCountProlist" +index).get(0).value++;
        setCountByID(goodsPageId[index], $("#goodCountProlist" +index).get(0).value);
    }

    prolistRightClicked = function(index){
        if(bLoadContent){
            setSession(charVec.goodHeadTittleSe, goodsHeadTittle[index]);
            setcurrentProviewID(goodsPageId[index]);
            addToHistory(goodsPageId[index], "historyProlist");
            $.afui.loadContent("#proviewPanel", false, false, transitionYC);
        }
        bLoadContent = true;
    }
}

var items_per_page = goods.rows;
var numLiNorefresh = 0;
var scroll_in_progress = false;
var myScroll;
load_content = function (refresh, next_page) {
    // This is a DEMO function which generates DEMO content into the scroller.
    // Here you should place your AJAX request to fetch the relevant content (e.g. $.post(...))
    console.log(refresh, next_page);
    setTimeout(function () { // This immitates the CALLBACK of your AJAX function
        if (!refresh) {
            // Loading the initial content
            if(bSpecialPanel){
                loadGoodsList(true, true);
            }else{
                loadGoodsList(true);
            }
        } else if (refresh && !next_page) {
            // Refreshing the content
            if(bSpecialPanel){
                loadGoodsList(true, true);
            }else{
                loadGoodsList(true);
            }
        } else if (refresh && next_page) {
            // Loading the next-page content and refreshing
            goods.page++;
            if(bSpecialPanel){
                loadGoodsList(false, true);
            }else{
                loadGoodsList(false);
            }
        }
        if (refresh) {
            myScroll.refresh();
            pullActionCallback();

        } else {
            if (myScroll) {
                myScroll.destroy();
                $(myScroll.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
                myScroll = null;
            }
            trigger_myScroll();
        }
    }, 0);
};
function pullDownAction() {
    //load_content('refresh');
    //$('#wrapper > #scroller > ul').data('page', 1);
    //// Since "topOffset" is not supported with iscroll-5
    //$('#wrapper > .scroller').css({ top: 0 });
}
function pullUpAction(callback) {
    if ($('#wrapper > #scroller > ul').data('page')) {
        var next_page = parseInt($('#wrapper > #scroller > ul').data('page'), 10) + 1;
    } else {
        var next_page = 2;
    }
    load_content('refresh', next_page);
    $('#wrapper > #scroller > ul').data('page', next_page);
    if (callback) {
        callback();
    }
}
function pullActionCallback() {
    if (pullDownEl && pullDownEl.className.match('loading')) {
        pullDownEl.className = 'pullDown';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉加载...';
        myScroll.scrollTo(0, parseInt(pullUpOffset) * (-1), 60);
    } else if (pullUpEl && pullUpEl.className.match('loading')) {
        $('.pullUp').removeClass('loading').html('');
    }
}

var pullActionDetect = {
    count: 0,
    limit: 10,
    check: function (count) {
        if (count) {
            pullActionDetect.count = 0;
        }
        // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
        setTimeout(function () {
            if(beforeScrollY == 0){
                beforeScrollY = myScroll.y;
                $(".bx-wrapper").hide();
                $("#sortProlist .sort-pro-list .list-mod").hide();
            }else{
                if(myScroll.y <= beforeScrollY){
                    $("#sortProlist .sort-pro-list .list-mod").hide();
                }else{
                    $("#sortProlist .sort-pro-list .list-mod").show();
                }
                beforeScrollY = myScroll.y;
            }
            if (myScroll.y <= (myScroll.maxScrollY + 600) && pullUpEl && !pullUpEl.className.match('loading') && bShowNextPage) {
                $('.pullUp').addClass('loading').html('<span class="pullUpIcon">&nbsp;</span><span class="pullUpLabel">加载中...</span>');
                pullUpAction();
            } else if (pullActionDetect.count < pullActionDetect.limit) {
                pullActionDetect.check();
                pullActionDetect.count++;
            } else if( ! bShowNextPage && myScroll.y <= myScroll.maxScrollY +30){
                showGlobalMessageDialog("已经是最后一页了。。。");
            }else if(myScroll.y >= 0){
                $("#sortProlist .sort-pro-list .list-mod").show();
                if(bChangePic){
                    $(".bx-wrapper").show();
                }
            }
        }, 200);
    }
}

function trigger_myScroll(offset) {
    pullDownEl = document.querySelector('#wrapper .pullDown');
    if (pullDownEl) {
        pullDownOffset = pullDownEl.offsetHeight;
    } else {
        pullDownOffset = 0;
    }
    pullUpEl = document.querySelector('#wrapper .pullUp');
    if (pullUpEl) {
        pullUpOffset = pullUpEl.offsetHeight;
    } else {
        pullUpOffset = 0;
    }

    if ($('#wrapper ul > li').length < items_per_page) {
        // If we have only 1 page of result - we hide the pullup and pulldown indicators.
        $('#wrapper .pullDown').hide();
        $('#wrapper .pullUp span').hide();
        offset = 0;
    } else if (!offset) {
        // If we have more than 1 page of results and offset is not manually defined - we set it to be the pullUpOffset.
        offset = pullUpOffset;
    }

    myScroll = new IScroll('#wrapper', {
        probeType: 1, tap: true, click: false, preventDefaultException: { tagName: /.*/ }, mouseWheel: true, scrollbars: true, fadeScrollbars: true, interactiveScrollbars: false, keyBindings: false,
        deceleration: 0.0002,
        startY: (parseInt(offset) * (-1))
    });

    myScroll.on('scrollStart', function () {
        scroll_in_progress = true;
    });
    myScroll.on('scroll', function () {

        scroll_in_progress = true;

        if ($('#wrapper ul > li').length >= items_per_page) {
            if (this.y >= 5 && pullDownEl && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始加载...';
                this.minScrollY = 0;
            } else if (this.y <= 5 && pullDownEl && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉加载...';
                this.minScrollY = -pullDownOffset;
            }

            console.log(this.y);
            pullActionDetect.check(0);

        }
    });
    myScroll.on('scrollEnd', function () {
        //console.log('scroll ended');
        setTimeout(function () {
            scroll_in_progress = false;
        }, 100);
        if ($('#wrapper ul > li').length >= items_per_page || $('#wrapper ul > li').length == numLiNorefresh) {
            if (pullDownEl && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownAction();
            }
            // We let the momentum scroll finish, and if reached the end - loading the next page
            pullActionDetect.check(0);
        }
    });

    // In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - the wrapper is located at left:-9999px and returned to left:0 after the iScoll is initiated
    setTimeout(function () {
        $('#wrapper').css({
        });
    }, 100);
}