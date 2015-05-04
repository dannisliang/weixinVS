/**
 * Created by admin on 2015/5/4.
 */
var orderList;
var initOrder = false;
var orderGoodsItem;
$(document).on("panelbeforeload", '#placeorderPanel', function (e)
{


});
$(document).on("panelload", '#placeorderPanel', function (e)
{
    if (!initOrder)
    {
        orderGoodsItem = $("#ordertbody .ordertr").clone();
        initOrder = true;
    }
    //$("#ordertbody").find(">tr >td").eq(0).text("hahahoppkpj ");
    $("#ordertbody").empty();
    initOrderData();
});

function  initOrderData()
{
    if(!orderList)
        return;
    for(var i = 0 ; i  < orderList.length ;i ++)
    {
        var tempItem = orderGoodsItem.clone();
        tempItem.attr("id", i);
        $("#ordertbody").append(tempItem);
        var parentNode = $("#ordertbody #" + i);
        var index = getIndexByID(orderList[i]);
        parentNode.find(">th").html(carGoodsList[index].goodsTitle);
        parentNode.find(">td").eq(0).html(carGoodsList[index].price);
        parentNode.find(">td").eq(1).html(carGoodsList[index].count);
        parentNode.find(">td").eq(2).html((carGoodsList[index].count * (100 * carGoodsList[index].price)) / 100);
    }
}