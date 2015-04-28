$(document).on("panelload", '#prolistPanel', function (e) {
    function resetUrlData(){
        goods.page = 1;
    }
    // 标签分类被点击
    tagProlistClicked = function(index){
        dataByCondition.tagId = tagProlistId[index];
        loadGoodsListByCondition(true, true);
    }

    tagProlistFunc = function(index, div, id){
        div.attr("onclick", "tagProlistClicked(" +index +")");
        tagProlistId[index] = id;
    }

    // 标签获取成功
    getTagUrlSuccess = function(dataJson){
        commonATextSel(dataJson, $("#tagProlist"), tagProlistFunc);
    }

    // 二级分类被点击
    nextCategoryClicked = function(index){
        bLeftSortClick = false;
        resetUrlData();
        dataByCondition.categoryId = nextCategoryId[index];
        if(bSpecialPanel){
            loadGoodsListByCondition(true, true, true);
        }else{
            loadGoodsListByCondition(true, true);
            getDataByURL(getCategoryPropertiesUrl, getCategoryPropertiesUrlSuccess, "categoryId=" +nextCategoryId[index], true);    // 筛选区
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
        commonATextSel(dataJson, $("#sortProlist"), nextCategoryFunc);
    }

    // 按照右边分类筛选商品
    function loadGoodsListByCondition(bRefresh, bReset, bSpecial, index){
        if(bShowNextPage || bReset){
            bRefreshProlist = bRefresh;
            var data = "";
            data += "buyerId=" +userInfo.id;
            data += "&page=" + goods.page;
            data += "&categoryId=" +dataByCondition.categoryId;
            if(index != null){
                if(index == 0){
                    goods.sort = "saleCount";
                    data += "&sort=saleCount";
                }else{
                    goods.sort = "salePrice";
                    data += "&sort=salePrice";
                }
                data += "&order=asc";
            }
            if(bSpecial == null && ! bSpecialPanel){
                data += "&tagId=" +dataByCondition.tagId;
                data+= "&filterStr=";
                for(var i = 0; i<idxFilter; i++){
                    if(i==0){
                        data += selectCategoryId[i] +":" +selectContent[i];
                    }else{
                        data += "#" +selectCategoryId[i] +":" +selectContent[i];
                    }
                }
                getDataByURL(getCategoryGoodsByConditionUrl, getGoodListUrlSuccess, data, true);
            }else{
                data += "&companyId=" +goods.companyId;
                getDataByURL(getSpecialOfferGoodsByCategoryIdUrl, getGoodListUrlSuccess, data, true);
            }
        }
    }

    attrSortClicked = function(index){
        commonATextSel(dataJson, $("#sortProlist"), nextCategoryFunc);
    }

    commonAttrSortClicked = function(string, index){
        if($("#" +string +index).text().indexOf("已") != -1){
            for(var i = 0; i<idxFilter;i++){
                if(selectContent[i] == $("#" +string +index).text().substr(1)){
                    if(idxFilter-1 != 0){
                        selectCategoryId[i] = selectCategoryId[idxFilter-1];
                        selectContent[i] = selectCategoryId[idxFilter-1];
                    }else{
                        selectCategoryId[i] = null;
                        selectContent[i] = null;
                    }
                }
            }
            idxFilter--;
            $("#" +string +index).text($("#" +string +index).text().substr(1));
            goods.page = 1;
            loadGoodsListByCondition(true, true);
        }else{
            selectCategoryId[idxFilter] = categoryPropertiesId[parseInt(index/10)];
            selectContent[idxFilter] = $("#" +string +index).text();
            idxFilter++;
            $("#" +string +index).text("已" +$("#" +string +index).text());
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

    // 点击一级分类
    prolistRight = function (index) {
        if ($("#pro-sort .sort-left .sort-list li")[index].className == 'current')
            return;
        $("#pro-sort .sort-left .sort-list li").removeClass("current");
        $("#pro-sort .sort-left .sort-list li")[index].className = 'current';
        goods.page = 1;
        goods.sort = "saleCount";
        myScroll.scrollTo(0);
        myScroll.refresh();
        $("#sortsProlist a").each(function(id, elm){
            if(id != 0){
                $(elm).removeClass("current");
            }else{
                $(elm).addClass("current");
            }
        })
        if (index != 0) {
            $("#pro-sort .sort-pro-list .topad img").show();
            $("#pro-sort .sort-pro-list .list-mod").show();
            $("#tagProlist").parent().show();
            goods.categoryId = prolistLeftID[index];
            bSpecialPanel = false;
            bLeftSortClick = true;
            var data = "categoryId=" + prolistLeftID[index];
            getDataByURL(getCategoryPropertiesUrl, getCategoryPropertiesUrlSuccess, data, true);  //属性
            getDataByURL(getNextCategoryUrl, onCategoryPropertiesSuccess, data, true);  //分类
            getDataByURL(getTagUrl, getTagUrlSuccess, "", true);    //标签
            data += "&companyId=" +goods.companyId;
            getDataByURL(pageSettingUrl, pageSettingUrlSuccess, data, true);    //动态图
        } else {
            $("#pro-sort .sort-pro-list .topad img").hide();
            $("#pro-sort .sort-pro-list .list-mod").show();
            $("#tagProlist").parent().hide();
            hideFilterDiv();
            bSpecialPanel = true;
            getDataByURL(getSpecialOfferCategoryUrl, onCategoryPropertiesSuccess, "companyId=" +goods.companyId, true);
        }
        bShowNextPage = true;
        load_content("refresh", false);
    }

    pageSettingUrlSuccess = function (dataJson){

    }

    onSortLeftSuccess = function (dataJson) {
        $("#pro-sort .sort-left .sort-list").empty();
        var content = "";
        for (i = 0; i < dataJson.length+2; i++) {
            content += "<li><a href=\"javascript:void(0)\" onclick=\"prolistRight(" + i + ")\">";
            if (i == 0) {
                prolistLeftID[i] = 21;
                content += textVec.prolistFirst;
            } else if (i < dataJson.length + 1) {
                prolistLeftID[i] = dataJson[i-1].id;
                content += dataJson[i-1].text;
            } else {
                prolistLeftID[i] = 22;
                content += textVec.prolistLast;
            }
            content += "</a></li>"
        }
        $("#pro-sort .sort-left .sort-list").prepend(content);
        if($("#pro-sort .sort-left .sort-list li")[0] != null){
            $("#pro-sort .sort-left .sort-list li")[0].className = 'current';
        }
    }

    //downloadFile("http://pic.dofay.com/2013/07/20120329211931359.jpg", "dfdfo");
    //$("#wrapper").hide();
    //$.afui.drawer.show('#left', 'left', 'cover');
    if( ! bLoadRightProlist){
        bSpecialPanel = true;
        load_content();
        bLoadRightProlist = true;
        hideFilterDiv();
    }
    //leftScroll = new IScroll('#wrapperLeft');
    $("#pro-sort .sort-left").css({
        "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() +20 + "px",
    });
    $("#pro-sort .sort-pro-list").css({
        "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
    });

    //$("#splitLeft").css({
    //    "width": (widthSortLeft - 8 + "px"),
    //    "display": "block",
    //});
    //fitSortRight();
    getDataByURL(getCategoryByLeftUrl, onSortLeftSuccess, "", true);
    //getDataByURL(getCategoryByRightUrl, onSortRightSuccess, "id=613f3f8d6b134ca3b290e33a04610a92", true);
    getDataByURL(getSpecialOfferCategoryUrl, onCategoryPropertiesSuccess, "companyId=" +goods.companyId, true);
    $("#pro-sort .sort-pro-list .topad img").hide();
    $("#tagProlist").parent().hide();

    // 人气价格排序
    sortsClicked = function (index){
        $("#sortsProlist a").each(function(id, elm){
            if(id != index){
                $(elm).removeClass("current");
            }else{
                $(elm).addClass("current");
            }
        })
        loadGoodsListByCondition(true, true, null, index);
    }
});

function commonATextSel(dataJson, div, callback){
    for(var i=0;i<dataJson.length;i++){
        if(dataJson[i].isHide == null){
            var $child = div.find("a").first().clone();
            if(i == 0){
                div.find("a").remove();
            }
            $child.text(dataJson[i].name);
            $child.show();
            callback(i, $child, dataJson[i].id);
            div.append($child);
        }
    }
}

function loadGoodsList(bRefresh, bSpecial){
    if(bShowNextPage){
        bRefreshProlist = bRefresh;
        var data = "";
        data += "buyerId=" +userInfo.id;
        data += "&page=" + goods.page;
        if(bSpecial == null){
            data += "&categoryId=" +goods.categoryId;
            getDataByURL(getGoodsByNonLastCategoryUrl, getGoodListUrlSuccess, data, true);
        }else{
            data += "&companyId=" +goods.companyId;
            getDataByURL(getSpecialOfferUrl, getGoodListUrlSuccess, data, true);
        }
    }
}

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
            $("#goodsList").remove();
            $("#scroller ul a").remove();
        }
        for(var i= 0; i<dataJson.length; i++){
            var goodSample = $tempList.clone();
            goodSample.show();
            dataJson[i].price = (dataJson[i].price).toFixed(1);
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
            goodsHeadTittle[index] = dataJson[i].name;
            goodSample.find(".nowprice").text("￥ " +dataJson[i].price);
            goodSample.find(".addfav").attr("onclick" ,"addFavClicked(" +index +")");
            bAddFavArr[index] = dataJson[i].isCollect;
            if(dataJson[i].isCollect){
                goodSample.find(".addfav").text("已收藏");
            }else{
                goodSample.find(".addfav").text("收藏");
            }
            goodSample.find(".setcount .reduce").attr("onclick" ,"reduceButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .add").attr("onclick" ,"addButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .count").attr("id" ,"goodCountProlist" +index);
            getGoodsCountByID(goodsPageId[index], function setGoodCount(count, index){
                if($("#goodCountProlist" +index).get(0) != null){
                    $("#goodCountProlist" +index).get(0).value = count;
                    if($("#goodCountProlist" +index).get(0).value == 0){
                        $("#goodsList" +index).find(".setcount .reduce").hide();
                    }
                }
            }, index);
            $("#scroller ul").append(goodSample);
        }
    }else if(dataJson.length == 0){
        bShowNextPage = false;
        if(goods.page == 1){
            $("#scroller ul a").hide();
            showGlobalMessageDialog("该分类商品正在联盟中。。。");
        }
    }

    addFavClicked = function(index){
        bLoadContent = false;
        var data = "id=" +goodsPageId[index];
        data += "&buyerId"
        if(bAddFavArr[index]){
            getDataByURL(delCollectionUrl, function(dataJson){
                $("#goodsList" +index).find(".addfav").text("收藏");
                bAddFavArr[index] = false;
            }, data);
        }else{
            getDataByURL(addCollectionUrl, function(dataJson){
                $("#goodsList" +index).find(".addfav").text("已收藏");
                bAddFavArr[index] = true;
            }, data);
        }
    }

    reduceButtonProlistClicked = function (index){
        bLoadContent = false;
        if($("#goodCountProlist" +index).get(0).value != 0){
            $("#goodCountProlist" +index).get(0).value--;
            if($("#goodCountProlist" +index).get(0).value == 0){
                $("#goodsList" +index).find(".setcount .reduce").hide();
            }
            setCountByID(goodsPageId[index], $("#goodCountProlist" +index).get(0).value);
            changeNumGoodsCart(1, false);
        }
    }

    addButtonProlistClicked = function (index){
        bLoadContent = false;
        $("#goodsList" +index).find(".setcount .reduce").show();
        $("#goodCountProlist" +index).get(0).value++;
        setCountByID(goodsPageId[index], $("#goodCountProlist" +index).get(0).value);
        changeNumGoodsCart(1, true);
    }

    prolistRightClicked = function(index){
        if(bLoadContent){
            setSession(charVec.goodHeadTittleSe, goodsHeadTittle[index]);
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
                $("#pro-sort .sort-pro-list .topad img").hide();
                $("#pro-sort .sort-pro-list .list-mod").hide();
            }else{
                if(myScroll.y <= beforeScrollY){
                    $("#pro-sort .sort-pro-list .list-mod").hide();
                }else{
                    $("#pro-sort .sort-pro-list .list-mod").show();
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
                $("#pro-sort .sort-pro-list .list-mod").show();
                $("#pro-sort .sort-pro-list .topad img").show();
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