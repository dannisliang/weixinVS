// 搜索页面
var searchSuggest;
var historySearch = new Array();

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

    //实例化输入提示的JS,参数为进行查询操作时要调用的函数名  
    searchSuggest = new oSearchSuggest(sendKeyWordToBack);

    // scroll
    if( ! bLoadRightSearch){
        loadContentSearch();
        bLoadRightSearch = true;
    }
});

var bCheckHistory = false;  // 是否检测完本地存储历史搜索
function getSearchGoodUrl(value) {
    if (value == null) {
        value = $("#searchId").get(0).value;
    }
    console.log(value);
    if( ! bCheckHistory){
        var $tempDiv =  $("#historySearch").first().clone();
        for(var i = 0; ;i++){
            if(getLocal("historySearch" +i) != ""){
                $("#historySearch").append($tempDiv );
                $tempDiv.text(getLocal("historySearch" +i));
                $tempDiv.attr("onclick", "getSearchGoodUrl(" +getLocal("historySearch" +i) +")");
            }else{
                break;
            }
        }
    }
    if(value != ""){
        setLocal("historySearch" +historySearch.length, value);
    }else{
        showGlobalMessageDialog("请输入搜索内容！");
    }
}

//实现搜索输入框的输入提示js类  
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

var bRefreshSearch = false;
var bLoadRightSearch = false;
var goodsHeadTittleSearch = new Array();  // 商品详细页标题
var bAddFavArrSearch = new Array();   // 是否已收藏
var goodsPageId = new Array();  // 商品页Id

// 浏览加载需重置的参数
var bShowNextPageSearch = true;       // 是否显示下一页。。当没有更多内容时，设置为false
var searchScroll;

function loadGoodsListSearch(bRefresh){
    if(bShowNextPage){
        bRefreshSearch = bRefresh;
        var data = "";
        data += "companyId=" +goods.companyId;
        data += "&categoryId=" +goods.categoryId;
        data += "&rows=" + goods.rows;
        data += "&sort=" + goods.sort;
        data += "&order=" + goods.order;
        data += "&page=" + goods.page;
        data += "&buyerId=" +userInfo.id;
        getDataByURL(getGoodListUrl, getGoodListUrlSuccessSearch, data, true);
    }
}

function getGoodListUrlSuccessSearch(dataJson){
    var bLoadContent = true;    // 是否加载商品详细页

    if( dataJson.length >= 1){
        var $tempList = $("#goodsListSearch");
        if($("#goodsListSearch").length == 0){
            $tempList = $("#goodsListSearch0");
        }else{
            //$("#goodsList").show();
        }
        if(bRefreshSearch){
            $("#goodsListSearch").remove();
            $("#scrollerSearch ul a").empty();
        }
        for(var i= 0; i<dataJson.length; i++){
            var goodSample = $tempList.clone();
            goodSample.show();
            dataJson[i].price = (dataJson[i].price).toFixed(1);
            var index = (goods.page -1) *goods.rows +i;
            goodsPageId[index] = dataJson[i].id;
            goodSample.attr("id", "goodsListSearch" +index);
            goodSample.attr("onclick", "rightClickedSearch(" +index +")");
            if (dataJson[i].pictureId != ""){
                goodSample.find(".item .img img").attr("src", getImageUrl + dataJson[i].pictureId + "?thumb=73x73");
            }else{
                goodSample.find(".item .img img").attr("src", "images/temp/pro.png");
            }
            goodSample.find(".title.fontsize-n.ellipsis").text(dataJson[i].name);
            goodsHeadTittleSearch[index] = dataJson[i].name;
            goodSample.find(".nowprice").text("￥ " +dataJson[i].price);
            goodSample.find(".addfav").attr("onclick" ,"addFavClickedSearch(" +index +")");
            bAddFavArrSearch[index] = dataJson[i].isCollect;
            if(dataJson[i].isCollect){
                goodSample.find(".addfav").text("已收藏");
            }else{
                goodSample.find(".addfav").text("收藏");
            }
            goodSample.find(".setcount .reduce").attr("onclick" ,"reduceButtonClickedSearch(" +index +")");
            goodSample.find(".setcount .add").attr("onclick" ,"addButtonClickedSearch(" +index +")");
            goodSample.find(".setcount .count").attr("id" ,"goodCountSearch" +index);
            getGoodsCountByID(goodsPageId[index], function setGoodCount(count, index){
                if($("#goodCountSearch" +index).get(0) != null){
                    $("#goodCountSearch" +index).get(0).value = count;
                    if($("#goodCountSearch" +index).get(0).value == 0){
                        $("#goodsListSearch" +index).find(".setcount .reduce").hide();
                    }
                }
            }, index);
            $("#scrollerSearch ul").append(goodSample);
        }
    }else if(dataJson.length == 0){
        bShowNextPage = false;
    }

    addFavClickedSearch = function(index){
        bLoadContent = false;
        var data = "id=" +goodsPageId[index];
        if(bAddFavArrSearch[index]){
            getDataByURL(delCollectionUrl, function(dataJson){
                $("#goodsListSearch" +index).find(".addfav").text("收藏");
                bAddFavArrSearch[index] = false;
            }, data);
        }else{
            getDataByURL(addCollectionUrl, function(dataJson){
                $("#goodsListSearch" +index).find(".addfav").text("已收藏");
                bAddFavArrSearch[index] = true;
            }, data);
        }
    }

    reduceButtonClickedSearch = function (index){
        bLoadContent = false;
        if($("#goodCountSearch" +index).get(0).value != 0){
            $("#goodCountSearch" +index).get(0).value--;
            if($("#goodCountSearch" +index).get(0).value == 0){
                $("#goodsListSearch" +index).find(".setcount .reduce").hide();
            }
            setCountByID(goodsPageId[index], $("#goodCountSearch" +index).get(0).value);
            changeNumGoodsCart(1, false);
        }
    }

    addButtonClickedSearch = function (index){
        bLoadContent = false;
        $("#goodsListSearch" +index).find(".setcount .reduce").show();
        $("#goodCountSearch" +index).get(0).value++;
        setCountByID(goodsPageId[index], $("#goodCountSearch" +index).get(0).value);
        changeNumGoodsCart(1, true);
    }

    rightClickedSearch = function(index){
        if(bLoadContent){
            setSession(charVec.goodHeadTittleSe, goodsHeadTittleSearch[index]);
            $.afui.loadContent("#proviewPanel", false, false, transitionYC);
        }
        bLoadContent = true;
    }
}

loadContentSearch = function (refresh, next_page) {
    // This is a DEMO function which generates DEMO content into the scrollerSearch.
    // Here you should place your AJAX request to fetch the relevant content (e.g. $.post(...))
    console.log(refresh, next_page);
    setTimeout(function () { // This immitates the CALLBACK of your AJAX function
        if (!refresh) {
            // Loading the initial content
            loadGoodsListSearch(true);
        } else if (refresh && !next_page) {
            // Refreshing the content
            //loadGoodsList();
        } else if (refresh && next_page) {
            // Loading the next-page content and refreshing
            goods.page++;
            loadGoodsListSearch(false);
        }
        if (refresh) {
            searchScroll.refresh();
            pullActionCallbackSearch();

        } else {
            if (searchScroll) {
                searchScroll.destroy();
                $(searchScroll.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
                searchScroll = null;
            }
            trigger_searchScrollSearch();
        }
    }, 0);
};
function pullDownActionSearch() {
    //loadContentSearch('refresh');
    //$('#wrapperSearch > #scrollerSearch > ul').data('page', 1);
    //// Since "topOffset" is not supported with iscroll-5
    //$('#wrapperSearch > .scrollerSearch').css({ top: 0 });
}
function pullUpActionSearch(callback) {
    if ($('#wrapperSearch > #scrollerSearch > ul').data('page')) {
        var next_page = parseInt($('#wrapperSearch > #scrollerSearch > ul').data('page'), 10) + 1;
    } else {
        var next_page = 2;
    }
    loadContentSearch('refresh', next_page);
    $('#wrapperSearch > #scrollerSearch > ul').data('page', next_page);
    if (callback) {
        callback();
    }
}
function pullActionCallbackSearch() {
    if (pullDownEl && pullDownEl.className.match('loading')) {
        pullDownEl.className = 'pullDown';
        pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉加载...';
        searchScroll.scrollTo(0, parseInt(pullUpOffset) * (-1), 60);
    } else if (pullUpEl && pullUpEl.className.match('loading')) {
        $('.pullUp').removeClass('loading').html('');
    }
}

var pullActionDetectSearch = {
    count: 0,
    limit: 10,
    check: function (count) {
        if (count) {
            pullActionDetectSearch.count = 0;
        }
        // Detects whether the momentum has stopped, and if it has reached the end - 200px of the scroller - it trigger the pullUpAction
        setTimeout(function () {
            if(beforeScrollY == 0){
                beforeScrollY = searchScroll.y;
                $("#pro-sort .sort-pro-list .topad img").hide();
                $("#pro-sort .sort-pro-list .list-mod").hide();
            }else{
                if(searchScroll.y <= beforeScrollY){
                    $("#pro-sort .sort-pro-list .list-mod").hide();
                }else{
                    $("#pro-sort .sort-pro-list .list-mod").show();
                }
                beforeScrollY = searchScroll.y;
            }
            if (searchScroll.y <= (searchScroll.maxScrollY + 2000) && pullUpEl && !pullUpEl.className.match('loading') && bShowNextPage) {
                $('.pullUp').addClass('loading').html('<span class="pullUpIcon">&nbsp;</span><span class="pullUpLabel">加载中...</span>');
                pullUpActionSearch();
            } else if (pullActionDetectSearch.count < pullActionDetectSearch.limit) {
                pullActionDetectSearch.check();
                pullActionDetectSearch.count++;
            } else if( ! bShowNextPage && searchScroll.y <= searchScroll.maxScrollY +30){
                showGlobalMessageDialog("已经是最后一页了。。。");
            }else if(searchScroll.y >= 0){
                $("#pro-sort .sort-pro-list .list-mod").show();
                $("#pro-sort .sort-pro-list .topad img").show();
            }
        }, 200);
    }
}

function trigger_searchScrollSearch(offset) {
    pullDownEl = document.querySelector('#wrapperSearch .pullDown');
    if (pullDownEl) {
        pullDownOffset = pullDownEl.offsetHeight;
    } else {
        pullDownOffset = 0;
    }
    pullUpEl = document.querySelector('#wrapperSearch .pullUp');
    if (pullUpEl) {
        pullUpOffset = pullUpEl.offsetHeight;
    } else {
        pullUpOffset = 0;
    }

    if ($('#wrapperSearch ul > li').length < items_per_page) {
        // If we have only 1 page of result - we hide the pullup and pulldown indicators.
        $('#wrapperSearch .pullDown').hide();
        $('#wrapperSearch .pullUp span').hide();
        offset = 0;
    } else if (!offset) {
        // If we have more than 1 page of results and offset is not manually defined - we set it to be the pullUpOffset.
        offset = pullUpOffset;
    }

    searchScroll = new IScroll('#wrapperSearch', {
        probeType: 1, tap: true, click: false, preventDefaultException: { tagName: /.*/ }, mouseWheel: true, scrollbars: true, fadeScrollbars: true, interactiveScrollbars: false, keyBindings: false,
        deceleration: 0.0002,
        startY: (parseInt(offset) * (-1))
    });

    searchScroll.on('scrollStart', function () {
        scroll_in_progress = true;
    });
    searchScroll.on('scroll', function () {

        scroll_in_progress = true;

        if ($('#wrapperSearch ul > li').length >= items_per_page) {
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
            pullActionDetectSearch.check(0);

        }
    });
    searchScroll.on('scrollEnd', function () {
        //console.log('scroll ended');
        setTimeout(function () {
            scroll_in_progress = false;
        }, 100);
        if ($('#wrapperSearch ul > li').length >= items_per_page || $('#wrapperSearch ul > li').length == numLiNorefresh) {
            if (pullDownEl && pullDownEl.className.match('flip')) {
                pullDownEl.className = 'pullDown loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                pullDownActionSearch();
            }
            // We let the momentum scroll finish, and if reached the end - loading the next page
            pullActionDetectSearch.check(0);
        }
    });

    // In order to prevent seeing the "pull down to refresh" before the iScoll is trigger - the wrapperSearch is located at left:-9999px and returned to left:0 after the iScoll is initiated
    setTimeout(function () {
        $('#wrapperSearch').css({
        });
    }, 100);
}