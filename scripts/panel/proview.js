var addCount = 0;
var initProview = false;
var sameNameItem;
var currentProviewID ="411911104eab42c9941bf729bb888bef";
$(document).on("panelbeforeload", '#proviewPanel', function (e)
{
    if( document.getElementById("proviewScroll"))
        document.getElementById("proviewScroll").style.visibility = "hidden";
    $("#productpicdes").hide();
    $("#exampleInputAmount").attr("disabled", "disabled");
    if(getSession(charVec.goodHeadTittleSe) != ""){
        $("#headProview h1").text(getSession(charVec.goodHeadTittleSe));
    }else{
        $("#headProview h1").text("商品详情");
    }
});
$(document).on("panelload", '#proviewPanel', function (e)
{
    if (!initProview)
    {
        sameNameItem = $("#clearfixlist #clearfixlistli").clone();
        initProview = true;
    }
    $("#clearfixlist").empty();
    $("#proviewScroll .colimage").attr("src","");
    if(document.getElementById("proviewScroll"))
    {
        document.getElementById("proviewScroll").style.visibility = "visible";
        TouchSlide({ slideCell: "#proviewScroll", titCell: ".hd ul", mainCell: ".bd ul", effect: "left", autoPage: true, autoPlay: true });
    }
    if(currentProviewID)
    {
        getProductInfo(currentProviewID);
    }
});
/**
 * fffeg
 * @param index
 */
function getProductInfo(id)
{
    // var id = "411911104eab42c9941bf729bb888bef";
    // var id = "37159f912f7e4a2aab4f2733b319b7c7";
    $("#PhotoSwipeTarget").empty();
    //var id = goodsPageId[index];
    currentInfoID = id;
    getGoodsCountByID(currentInfoID,getProviewCount);
    var data = "id=" +id +"&buyerId=" + userInfo.id;

    getDataByURL(getGoodUrl, onGetGoodData, data);
    getDataByURL(getVarietyGoods,onGetVarietyGoods,"goodsId=" + id)
}
function getProviewCount(count)
{
    addCount  = count;
    var tempIndex = 0;

    if(tempGoodData  && tempGoodData.priceList &&　　tempGoodData.priceList.length > 1)
    {
        var len = tempGoodData.priceList.length;
        for(var i = 0 ; i < len ;i ++)
        {
            $("#ladderpriceid").find("#ladderpriceid_" + i).attr("class","col-xs-4 Ladder"+(i+1));
            if(addCount > tempGoodData.priceList[i].minCount)
            {
                tempIndex = i;
            }
        }
        $("#ladderpriceid").find("#ladderpriceid_" + tempIndex).attr("class","col-xs-4 LadderChose");
    }

    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}
var tempGoodData
var currentGoodsPrice;
function onGetGoodData(dataJson)
{
    tempGoodData = goodsDataProcess(dataJson);
    currentGoodsPrice = tempGoodData.price;
    $("#captiontitle").text(tempGoodData.title);
    var proviewImage = $("#proviewScroll .colimage");
    var i=0;
    proviewImage.each(function ()
    {
        $(this).attr("src", getImageUrl + tempGoodData.imgArr[i]);
        i++;
    })
    var count = tempGoodData.priceList.length;
    for(var i= 0 ; i < 3; i++)
    {
        if( i < count)
        {
            $("#ladderpriceid_" + i).show();
            switch (i)
            {
                case  0:
                    $("#ladderpriceid_" + i).find(".unit").text("单" + tempGoodData.unit);
                    $("#ladderpriceid_" + i).find(".nowprice,fontsize-xl").text("￥" + tempGoodData.priceList[i].price);
                    break;
                case 1:
                    if(tempGoodData.priceList[i].maxCount == 0)
                    {
                        $("#ladderpriceid_" + i).find(".unit").text(">" + tempGoodData.priceList[i].minCount +tempGoodData.unit);
                    }else
                    {
                        $("#ladderpriceid_" + i).find(".unit").text(tempGoodData.priceList[i].minCount +"~" + tempGoodData.priceList[i].maxCount +tempGoodData.unit);
                    }

                    $("#ladderpriceid_" + i).find(".price").text("￥" + tempGoodData.priceList[i].price);
                    break;
                case 2:
                    if(tempGoodData.priceList[i].maxCount == 0)
                    {
                        $("#ladderpriceid_" + i).find(".unit").text(">" + tempGoodData.priceList[i].minCount +tempGoodData.unit);
                    }else
                    {
                        $("#ladderpriceid_" + i).find(".unit").text(tempGoodData.priceList[i].minCount +"~" + tempGoodData.priceList[i].maxCount +tempGoodData.unit);
                    }
                    $("#ladderpriceid_" + i).find(".price").text("￥" + tempGoodData.priceList[i].price);
                    break;
            }
        }else
        {
            $("#ladderpriceid_" + i).hide();
        }

    }
    if(tempGoodData.isCollect)
    {
        $("#proviewcollect").attr("class","icon icon-hadfav");
    }else{
        $("#proviewcollect").attr("class","icon icon-addfav");
    }
    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}
function onGetGoodsPicinfo()
{
    $("#productpicdes").show();

    $("#productpicdes").append(tempGoodData.description);
}

function onProviewClick(target)
{
    var id = target.getAttribute("id");
    switch(id)
    {
        case "proviewL":
            if (addCount > 0)
                addCount--;
            break;
        case "proviewR":
            if(addCount <100)
                addCount++;
            break;
        default:
            break;
    }
    if(addCount > 0)
        setCountByID(currentInfoID,addCount);
    else
        deleteGoodsToCart(currentInfoID);
    if(tempGoodData  && tempGoodData.priceList &&　　tempGoodData.priceList.length > 1)
    {
        var count = tempGoodData.priceList.length;
        var tempIndex = 0;
        for(var i = 0 ; i < count ;i ++)
        {
            $("#ladderpriceid").find("#ladderpriceid_" + i).attr("class","col-xs-4 Ladder"+(i+1));
            if(addCount > tempGoodData.priceList[i].minCount)
            {
                tempIndex = i;
            }
        }
        $("#ladderpriceid").find("#ladderpriceid_" + tempIndex).attr("class","col-xs-4 LadderChose");
    }
    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}
var sameNameList;
function onGetVarietyGoods(dataJson)
{
    sameNameList = new Array();
    for(var i = 0 ; i <dataJson.length ; i++)
    {
        sameNameList[i] = goodsSNDataProcess(dataJson[i]);
        var tempItem = sameNameItem.clone();
        tempItem.attr("id", i);
        $("#clearfixlist").append(tempItem);
        var parentNode = $("#clearfixlist #" + i);
        parentNode.find("> img").attr("src",getImageUrl + sameNameList[i].imgArr[0] + "?thumb=200x200");
        parentNode.find(".title").text(sameNameList[i].title);
        parentNode.find(".price").text(sameNameList[i].price);
    }
}

function onClickProviewCollect()
{
    var data = "id=" +tempGoodData.id;
    if(tempGoodData.isCollect)
    {
        getDataByURL(delCollectionUrl, function(dataJson){
            $("#proviewcollect").attr("class","icon icon-addfav");
            tempGoodData.isCollect = false;
        }, data);

    }else{
        getDataByURL(addCollectionUrl, function(dataJson){
            $("#proviewcollect").attr("class","icon icon-hadfav");
            tempGoodData.isCollect = true;
        }, data);

    }
}