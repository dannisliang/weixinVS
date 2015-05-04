$(document).on("panelbeforeload", '#regularlyPanel', function (e) {
    tabRegular = function(target,Num){
        if($(target).hasClass("active"))return;
        $(target.parentNode).find("li").each(function(index, elm){
            if(elm != target){
                $(elm).removeClass("active");
            }else{
                $(elm).addClass("active");
            }
        })
        if(Num == 1){
            getCollectionGoods();
        }else{
            checkUserBuyList();
        }
    }

    regularlyListInit = function (){
        $("#pro-sort .sort-left").hide();
        $("#pro-sort .sort-pro-list .topad img").hide();
        $("#pro-sort .sort-pro-list .list-mod").hide();
        $("#pro-sort .sort-pro-list .sorts").hide();
        $("#pro-sort .sort-pro-list").css({"width":"100%", "margin-left":0});
        $("#pro-sort .sort-pro-list").css({
            "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
        });
    }

    getCollectionUrlSuccess = function(dataJson){
        if(dataJson.length != 0){
            bRefreshProlist = true;
            $("#pro-sort .sort-pro-list").show();
            getGoodListUrlSuccess(dataJson);
        }else{
            $("#pro-sort .sort-pro-list").hide();
            showGlobalMessageDialog("兄弟，肯定要有几个最爱的。。。");
        }
    }

    // 收藏商品获取
    getCollectionGoods = function(){
        goods.page = 1;
        var data = "page=" +goods.page;
        data += "&rows=" +goods.rows;
        getDataByURL(getCollectionUrl, getCollectionUrlSuccess, data);
    }

    var bExist = false;
    checkUserBuyList = function(){
        var data = "buyerId=" +userInfo.id;
        data += "&goodsIds=";
        for(var i = 0;i<20;i++){
            if(getLocal("userBuyList" +i) != ""){
                bExist = true;
                data += getLocal("userBuyList" +i) +",";
            }else{
                break;
            }
        }
        if(bExist){
            data = data.substr(0, data.length -1);
            getDataByURL(getGoodsByIdUrl, function(dataJson){
                if(dataJson.length != 0){
                    bRefreshProlist = true;
                    $("#pro-sort .sort-pro-list").show();
                    getGoodListUrlSuccess(dataJson);
                }else{
                    $("#pro-sort .sort-pro-list").hide();
                }
            }, data, true);
        }else{
            showGlobalMessageDialog("兄弟你买的商品正从火星派送中。。。");
            tabRegular($("#titleRegularly li").get(1), 1);
        }
    }
});

$(document).on("panelload", '#regularlyPanel', function (e) {
    regularlyListInit();
    checkUserBuyList();
});

