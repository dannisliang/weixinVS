/**
 * Created by admin on 2015/5/4.
 */
var orderList;
var initOrder = false;
var orderGoodsItem;
var orderPoints;
var orderTotalCost;
var oederCode;
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
    orderTotalCost = 0;
    var oldUserBuyList = new Array();
    selectLocalStorage(localBuyList,"id",function(data){
        if(data && data.length >0)
        {
            for (var i = 0; i < data.length; i++) {
                oldUserBuyList.push(data[i].id);
            }

        }
    });
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
        orderTotalCost += (carGoodsList[index].count * (100 * carGoodsList[index].price)) / 100;
        var id = carGoodsList[index].goodsId;
        if(oldUserBuyList.indexOf(id) >= 0)
        {
            oldUserBuyList.splice(oldUserBuyList.indexOf(id) + 1 ,1);
        }
        oldUserBuyList.unshift(id);

    }
    oldUserBuyList = oldUserBuyList.splice(0,20);
    for(var j = 0 ; j < oldUserBuyList.length ;j++)
    {
        setLocalStorage(localBuyList,j,['id'], [oldUserBuyList[j]]);
    }
    $("#ordertotal").text(orderTotalCost);
    $("#orderpoints").text(orderPoints);
    $("#orderneedcost").text(orderTotalCost - (orderPoints / 100));
    $("#ordercode").text(oederCode);
}