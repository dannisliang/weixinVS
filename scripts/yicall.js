$(document).on("panelload", '#sort', function (e) {
    $.afui.showMask();
    //$.afui.blockUI(.1);
    //$.unblockUI();
    isChrome();
    //downloadFile("http://pic.dofay.com/2013/07/20120329211931359.jpg", "dfdfo");
    load_content();
    //$("#wrapper").hide();
    //$.afui.drawer.show('#left', 'left', 'cover');
    leftScroll = new IScroll('#wrapperLeft');
    $("#wrapperLeft").css({
        "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
        "top": parseInt($(".view header").computedStyle("height"), 10) + isIOSTop() + "px",
    });
    $("#splitLeft").css({
        "width": (widthSortLeft - 8 + "px"),
        "display":"block",
    });
    fitSortRight();
    getDataByURL(getCategoryByLeftUrl, onSortLeftSuccess, "", true);
    getDataByURL(getCategoryByRightUrl, onSortRightSuccess, "id=613f3f8d6b134ca3b290e33a04610a92", true);
});

$(document).on("panelbeforeunload", '#sort', function (e) {
    $("#splitLeft").css({
        "display": "none",
    });
    $.afui.drawer.hide('#left');
});

var widthImgSortRight = 0;
var widthSortLeft = 98;
function fitSortRight() {
    var divisor = getNumByWith(3);
    widthImgSortRight = (deviceWidth - widthSortLeft - 7 * divisor) / divisor;
    // 调整css显示
    $("#listSortRight > li > a").css({ "width": widthImgSortRight + "px", "height": (widthImgSortRight + 40) + "px" });
    $("#listSortRight > li > a >img").css({
        "width": (widthImgSortRight - 10) + "px", "height": (widthImgSortRight - 10) + "px",
        "min-height": (widthImgSortRight - 10) + "px", "min-width": (widthImgSortRight - 10) + "px",
    });
    $("#left").css({ "width": widthSortLeft + "px" });
    $("#listSortLeft").css({ "width": widthSortLeft + "px" });
    $("#slideBoxBrowse").css({
        "left": widthSortLeft + "px",
        "top": parseInt($(".view header").computedStyle("height"), 10) + isIOSTop() + "px",
    });
    //$("#slideBox").css({
    //    "width": deviceWidth - widthSortLeft + "px",
    //    "height": (deviceWidth - widthSortLeft) / 3 + "px",
    //});
    //$(".liSlideBrowse").css({
    //    "width": deviceWidth - widthSortLeft +"px",
    //    "height": (deviceWidth - widthSortLeft)/3 +"px",
    //});
    //$(".liSlideBrowse > a > img").css({
    //    "width": deviceWidth - widthSortLeft + "px",
    //    "height": (deviceWidth - widthSortLeft) / 3 + "px",
    //});
}

// 谷歌浏览器调用
function isChrome() {
    //if ($.os.chrome) {
    //    $(".yicallHeader").css({
    //        "position": "absolute",
    //    });
    //}
}

// 商品详细页
(function () {
    $(document).on("panelbeforeload", '#panelProduct', function (e) {
        setSession(charVec.bSearchFocusSe, false);
        swipeLeftChange("#panelProduct");
        $("#h1PanlHeader").text(getSession(charVec.tittleProductSe));
    });

    saveProduct = function () {
        setSession(charVec.tittleProductSe, "糖糖");
        $.afui.loadContent("#panelProduct", false, false, transitionYC);
    }
})();

function changeNumGoodsCart(numEnd){
    numEnd =  numEnd  < 0  ?  0 : numEnd;
    $("#afbadgeCart").text(numEnd);
    setLocal(charVec.numGoodsCartLo, numEnd);
    if(numEnd == 0){
        $("#afbadgeCart").hide();
    }else{
        $("#afbadgeCart").show();
    }
}

function temp() {
    goToSearchByValue("牛奶");
}