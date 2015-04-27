$(document).on("panelload", '#prolistPanel', function (e) {
    tagProlistClicked = function(index){

    }

    getTagUrlSuccess = function(dataJson){
        commonATextSel(dataJson, $("#tagProlist"), "tagProlistClicked");
    }

    nextCategoryClicked = function(index){

    }

    onCategoryPropertiesSuccess = function(dataJson){
        commonATextSel(dataJson, $("#sortProlist"), "nextCategoryClicked");
    }

    prolistRight = function (index) {
        if ($("#pro-sort .sort-left .sort-list li")[index].className == 'current')
            return;
        $("#pro-sort .sort-left .sort-list li").removeClass("current");
        $("#pro-sort .sort-left .sort-list li")[index].className = 'current';
        goods.page = 1;
        if (index != 0) {
            $("#pro-sort .sort-pro-list .topad img").show();
            $("#pro-sort .sort-pro-list .list-mod").show();
            goods.categoryId = prolistLeftID[index];
            bSpecialPanel = true;
            getDataByURL(getNextCategoryUrl, onCategoryPropertiesSuccess, "categoryId=" + prolistLeftID[index], true);
            getDataByURL(getTagUrl, getTagUrlSuccess, "", true);
        } else {
            $("#pro-sort .sort-pro-list .topad img").hide();
            $("#pro-sort .sort-pro-list .list-mod").show();
            bSpecialPanel = false;
            getDataByURL(getSpecialOfferCategoryUrl, onCategoryPropertiesSuccess, "companyId=" +goods.companyId, true);
        }
        load_content("refresh", false);
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

    sortsClicked = function (index){
        $("#sortsProlist a").each(function(id, elm){
            if(id != index){
                $(elm).removeClass("current");
            }else{
                $(elm).addClass("current");
            }
        })
    }
});

function commonATextSel(dataJson, div, callbackString){
    for(var i=0;i<dataJson.length;i++){
        var $child = div.find("a").first().clone();
        if(i == 0){
            div.find("a").remove();
        }
        $child.attr("onclick", callbackString +"(" +i +")");
        $child.text(dataJson[i].name);
        $child.show();
        div.append($child);
    }
}

function loadGoodsList(bRefresh, bSpecial){
    if(bShowNextPage){
        bRefreshProlist = bRefresh;
        var data = "";
        data += "companyId=" +goods.companyId;
        data += "&categoryId=" +goods.categoryId;
        data += "&rows=" + goods.rows;
        data += "&sort=" + goods.sort;
        data += "&order=" + goods.order;
        data += "&page=" + goods.page;
        data += "&buyerId=" +userInfo.id;
        if(bSpecial == null){
            getDataByURL(getGoodListUrl, getGoodListUrlSuccess, data, true);
        }else{
            getDataByURL(getSpecialOfferUrl, getGoodListUrlSuccess, data, true);
        }
    }
}

var bRefreshProlist = false;
var bLoadRightProlist = false;
var bSpecialPanel = false;  // 是否是加载的特惠专区
var goodsHeadTittle = new Array();  // 商品详细页标题
var bAddFavArr = new Array();   // 是否已收藏
var goodsPageId = new Array();  // 商品页Id

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
            $("#scroller ul a").empty();
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
            if (myScroll.y <= (myScroll.maxScrollY + 2000) && pullUpEl && !pullUpEl.className.match('loading') && bShowNextPage) {
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