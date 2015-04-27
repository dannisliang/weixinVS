var addCount = 0;;
$(document).on("panelbeforeload", '#proviewPanel', function (e)
{
    document.getElementById("proviewScroll").style.visibility = "hidden";
    $("#infohtml").hide();
    $(".Ladder-price,row").hide();
    $("#exampleInputAmount").attr("disabled", "disabled");
    if(getSession(charVec.goodHeadTittleSe) != ""){
        $("#headProview h1").text(getSession(charVec.goodHeadTittleSe));
    }else{
        $("#headProview h1").text("商品详情");
    }
});
$(document).on("panelload", '#proviewPanel', function (e)
{

    document.getElementById("proviewScroll").style.visibility = "visible";
    TouchSlide({ slideCell: "#proviewScroll", titCell: ".hd ul", mainCell: ".bd ul", effect: "left", autoPage: true, autoPlay: true });
    getProductInfo(1);
});
/**
 * fffeg
 * @param index
 */
function getProductInfo(index)
{
    var id = "411911104eab42c9941bf729bb888bef";
    $("#PhotoSwipeTarget").empty();
    //var id = goodsPageId[index];
    currentInfoID = id;
    getGoodsCountByID(currentInfoID,getProviewCount);
    getDataByURL(getGoodUrl, onGetGoodData, "id=" + id);
}
function getProviewCount(count)
{
    addCount  = count;
    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}
var currentGoodsPrice;
function onGetGoodData(dataJson)
{
    var tempGoodData = goodsDataProcess(dataJson);
    currentGoodsPrice = tempGoodData.price;
    $("#captiontitle").text(tempGoodData.title);
    var proviewImage = $("#proviewScroll .colimage");
    var i=0;
    proviewImage.each(function ()
    {
        $(this).attr("src", getImageUrl + tempGoodData.imgArr[i]);
        i++;
    })
    if(tempGoodData.priceList.length <=1)
    {
        $(".Ladder-price,row").hide();
    }
    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}
function onGetGoodsPicinfo()
{
    $("#infohtml").show();
    var srcurl = getGoodsDescriptUrl + "?id=" + currentInfoID;
    $("#infohtml").attr("src", srcurl);
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
    setCountByID(currentInfoID,addCount);
    //if (addCount == 0)
    //    document.getElementById("proviewL").style.visibility = "hidden";
    //else
    //    document.getElementById("proviewL").style.visibility = "visible";
    $("#exampleInputAmount").get(0).value = addCount;
    $(".setpricepanel .red").text(addCount);
    $(".setpricepanel .gray4").text("￥" + (currentGoodsPrice * 100 *addCount)/100 + "元");
}