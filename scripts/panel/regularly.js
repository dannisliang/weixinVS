﻿$(document).on("panelbeforeload", '#regularlyPanel', function (e) {
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

    getCollectionUrlSuccess = function(dataJson){
        if(dataJson.length != 0){
            bRefreshProlist = true;
            getGoodListUrlSuccessRegularly(dataJson);
        }else{
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
        if(userInfo.id =="" || userInfo.id == null){
            showGlobalMessageDialog("正在自动登录。。。");
            $.afui.loadContent("#minePanel", false, false, transitionYC);
            return;
        }
        var data = "buyerId=" +userInfo.id;
        data += "&goodsIds=";
        for(var i = 0;i<20;i++){
            if(getLocal("localBuyList_" +i) != ""){
                bExist = true;
                data += $.parseJSON(getLocal("localBuyList_" +i)).id +",";
            }else{
                break;
            }
        }
        if(bExist){
            $("#titleRegularly").find("li").each(function(index, elm){
                if(index != 0){
                    $(elm).removeClass("active");
                }else{
                    $(elm).addClass("active");
                }
            })
            data = data.substr(0, data.length -1);
            getDataByURL(getGoodsByIdUrl, function(dataJson){
                if(dataJson.length != 0){
                    bRefreshProlist = true;
                    getGoodListUrlSuccessRegularly(dataJson);
                }else{

                }
            }, data, true);
        }else{
            showGlobalMessageDialog("兄弟你买的商品正从火星派送中。。。");
            tabRegular($("#titleRegularly li").get(1), 1);
        }
    }
});

$(document).on("panelload", '#regularlyPanel', function (e) {
    checkUserBuyList();
});


function getGoodListUrlSuccessRegularly(dataJson){
    var bLoadContent = true;    // 是否加载商品详细页
    if( dataJson.length >= 1){
        var $tempList = $("#goodsListRegularly");
        if($("#goodsListRegularly").length == 0){
            $tempList = $("#goodsListRegularly0");
        }else{
            //$("#goodsListRegularly").show();
        }
        if(bRefreshProlist){
            $("#tabRegularly a").each(function(index, elm){
                var id = $(elm).attr("id");
                if(id != null && id.substr(0, 9) == 'goodsList'){
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
            goodSample.attr("id", "goodsListRegularly" +index);
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
                goodSample.find(".addfav").text("已收藏");
            }else{
                goodSample.find(".addfav").text("收藏");
            }
            if(dataJson[i].isPriceList){
                goodSample.find("#moreDiscountRegularly").show();
            }
            goodSample.find(".setcount .reduce").attr("onclick" ,"reduceButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .add").attr("onclick" ,"addButtonProlistClicked(" +index +")");
            goodSample.find(".setcount .count").attr("id" ,"goodCountRegularly" +index);
            $("#tabRegularly").append(goodSample);
            getGoodsCountByID(goodsPageId[index], function setGoodCount(count, index){
                if($("#goodCountRegularly" +index).get(0) != null){
                    $("#goodCountRegularly" +index).get(0).value = count;
                    if($("#goodCountRegularly" +index).get(0).value == 0){
                        $("#goodsListRegularly" +index).find(".setcount .reduce").hide();
                    }else{
                        $("#goodsListRegularly" +index).find(".setcount .reduce").show();
                    }
                }
            }, index);
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
                $("#goodsListRegularly" +index).find(".addfav").text("收藏");
                bAddFavArr[index] = false;
            }, data);
        }else{
            getDataByURL(addCollectionUrl, function(dataJson){
                $("#goodsListRegularly" +index).find(".addfav").text("已收藏");
                bAddFavArr[index] = true;
            }, data);
        }
    }

    reduceButtonProlistClicked = function (index){
        bLoadContent = false;
        if($("#goodCountRegularly" +index).get(0).value != 0){
            $("#goodCountRegularly" +index).get(0).value--;
            if($("#goodCountRegularly" +index).get(0).value == 0){
                $("#goodsListRegularly" +index).find(".setcount .reduce").hide();
            }
            setCountByID(goodsPageId[index], $("#goodCountRegularly" +index).get(0).value);
        }
    }

    addButtonProlistClicked = function (index){
        bLoadContent = false;
        $("#goodsListRegularly" +index).find(".setcount .reduce").show();
        $("#goodCountRegularly" +index).get(0).value++;
        setCountByID(goodsPageId[index], $("#goodCountRegularly" +index).get(0).value);
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

