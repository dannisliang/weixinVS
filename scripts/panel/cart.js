var initcart = false;
var carGoodsItem;
var goodsList;
var idList;
var countList;
var delIDList;
var delCount;
var chooseIDList;
var chooseCountList;
var totalCount;//订单商品个数
var totalCost;//订单总价格
var totalPoints;//买家积分
//购物车
$(document).on("panelbeforeload", '#cartPanel', function (e)
{
    goodsList = new Array();
    idList = new Array();
    countList = new Array();

});
$(document).on("panelload", '#cartPanel', function (e)
{
    if (!initcart)
    {
        carGoodsItem = $("#cargoodslist .grayline").clone();
        initcart = true;
    }
    $("#cargoodslist").empty();
    $("#totalmoney").text("");
    $("#totalcount").text("");
    $("#totalpay").text("");
    $("#points").get(0).value = "";
    $("#remarks").get(0).value = "";
    document.getElementById("defaultaddressradio_1").checked = false;
    document.getElementById("defaultaddressradio_1").style.visibility ="hidden";
    getGooodsDataFromSQL();
    getDataByURL(getCurrentPoints, onGetCurrentPoints,"buyerId="+userInfo.id);
    $("#points").on('input',function(e){
        var min = Math.min(totalCost * 100,totalPoints);
        if(Number(e.target.value) > min)
            $("#points").get(0).value = min;
        if(Number(e.target.value) <0 )
            $("#points").get(0).value = "0";
        $("#totalpay").text("￥" + (totalCost - Number($("#points").get(0).value)/100));
    });
});
function onGetDefualtAddressUrl(dataJson)
{
    defaulAddressData = new Object();
    if (dataJson != null)
    {
        var content = "";
        defaulAddressData.address = dataJson.address;
        defaulAddressData.areaAddressId = dataJson.areaAddressId;
        defaulAddressData.areaAddressName = dataJson.areaAddressName;
        defaulAddressData.areaId = dataJson.areaAddressId;
        defaulAddressData.areaName = dataJson.areaName;
        defaulAddressData.companyId = dataJson.companyId;
        defaulAddressData.companyName = dataJson.companyName;
        defaulAddressData.firstName = dataJson.firstName;
        defaulAddressData.id = dataJson.id;
        defaulAddressData.isDefault = dataJson.isDefault;
        defaulAddressData.phone = dataJson.phone;
        if(dataJson.firstName)
        {
            $("#defaultname").text(defaulAddressData.firstName);
            $("#defaulttel").text(defaulAddressData.phone);

            var adddress = defaulAddressData.companyName + defaulAddressData.areaName + defaulAddressData.areaAddressName;
            $("#defaultadd").text(adddress);
            document.getElementById("defaultaddressradio_1").style.visibility ="visible";
        }else
        {
            $("#defaultname").text("请选择收货地址");
            $("#defaulttel").text("");
            $("#defaultadd").text("");
            document.getElementById("defaultaddressradio_1").style.visibility ="hidden";
        }

    }
    if(defaulAddressData.id  && userInfo.id)
    {
        var data = "areaAddressId=" + defaulAddressData.id;
        data += "&buyerId=" + userInfo.id;
        getDataByURL(getGoodsInfoByAreaAddressId, onGetGoodsInfoByAreaAddressId, data);
    }
}
//购物车商品列表
function onGetCartListUrl(dataJson)
{
    var content = "";
    $("#cargoodslist .grayline").attr("id", 0);
    var temp = $("#cargoodslist #" + 0).clone();
    carGoodsList = new Array();
    for(var i = 0 ;i < dataJson.length ;i++)
    {
        carGoodsList[i] = new Object();
        carGoodsList[i].buyerId = dataJson[i].buyerId;
        carGoodsList[i].count = dataJson[i].count;
        carGoodsList[i].createTime = dataJson[i].createTime;
        carGoodsList[i].goods = dataJson[i].goods;
        carGoodsList[i].goodsId = dataJson[i].goodsId;
        carGoodsList[i].goodsTitle = dataJson[i].goodsTitle;
        carGoodsList[i].id = dataJson[i].id;
        carGoodsList[i].img = dataJson[i].img;
        carGoodsList[i].isChecked = dataJson[i].isChecked;
        carGoodsList[i].isCollection = dataJson[i].isCollection;
        carGoodsList[i].logisticsCompanyId = dataJson[i].logisticsCompanyId;
        carGoodsList[i].platformCode = dataJson[i].platformCode;
        carGoodsList[i].price = dataJson[i].price;
        carGoodsList[i].priceList = dataJson[i].priceList;
        carGoodsList[i].remark = dataJson[i].remark;
        carGoodsList[i].sellerId = dataJson[i].sellerId;
        carGoodsList[i].serialVersionUID = dataJson[i].serialVersionUID;
        carGoodsList[i].specificationList = dataJson[i].specificationList;
        carGoodsList[i].unit = dataJson[i].unit;
        carGoodsList[i].choose = carGoodsList[i].isChecked;

        setCountByID(carGoodsList[i].goodsId,carGoodsList[i].count);
        var tempItem = carGoodsItem.clone();
        tempItem.attr("id", i);
        $("#cargoodslist").append(tempItem);
        var parentNode = $("#cargoodslist #" + i);
        if (carGoodsList[i].img != "")
        {
            parentNode.find("> div >img").attr("src", getImageUrl + carGoodsList[i].img + "?thumb=80x80");
        } else
        {
            parentNode.find("> div >img").attr("src", "images/default_pic.9.png");
        }
        if(carGoodsList[i].isCollection)
        {
            //parentNode.find(".addfav").text("已收藏");
        }else
        {
            //parentNode.find(".addfav").text("收藏");
        }
        parentNode.find(".addfav").attr("id","add_"+i);
        parentNode.find(".del").attr("id","del_"+ i);
        parentNode.find("> input").attr("id","check_"+i);
        parentNode.find("> label").attr("for","check_"+i);
        document.getElementById("check_" + i).checked = carGoodsList[i].isChecked;
        parentNode.find(".title,fontsize-l,ellipsis").text(carGoodsList[i].goodsTitle);
        parentNode.find(".nowprice,fontsize-xl").text("￥" + carGoodsList[i].price +"/" + carGoodsList[i].unit);
        if (carGoodsList[i].priceList.length == 1)
        {
            parentNode.find(".Ladder-price").hide();
        } else
        {
        }

        parentNode.find(".total").text("总价:" + (carGoodsList[i].count * (100 * carGoodsList[i].price)) / 100);
        parentNode.find(".reduce,pull-left,text-center").attr("id", "l_" + i);
        parentNode.find(".reduce,pull-left,text-center").attr("onclick", "onCartClick(this)");
        parentNode.find(".add,pull-left,text-center").attr("id", "r_" + i);
        parentNode.find(".add,pull-left,text-center").attr("onclick", "onCartClick(this)");
        parentNode.find(".count,pull-left,text-center").attr("id", "c_"+ i);
        parentNode.find("#c_"+ i).get(0).value = carGoodsList[i].count;
        // $("#c_"+ carGoodsList[i].goodsId).get(0).value = carGoodsList[i].count;
    }
    getChooseList();
}
function onRadioClick(target)
{

}
//window.location.href = "#pageGoods";

function onOrderOk()
{
    var hasAddress = document.getElementById("defaultaddressradio_1").checked;
    if(defaulAddressData.areaAddressId  == null) {
        showGlobalMessageDialog("收货地址为空");
        return;
    }
    if(carGoodsList.length == 0) {
        showGlobalMessageDialog("购物车为空");
        return;
    }
    if(!hasAddress) {
        showGlobalMessageDialog("请选择收货地址");
        return;
    }
    getChooseList();
    if(delIDList.length == 0)
        return;
    var data = "";
    data += "receiverId="+defaulAddressData.id;
    data += "&remark="+ ($("#remarks").get(0).value ? $("#remarks").get(0).value :"") ;
    data += "&points=" + ($("#points").get(0).value ? $("#points").get(0).value :0) ;
    data += "&goodsId=" +chooseIDList;
    data += "&count=" + chooseCountList;
    //getDataByURL(postOrdelUrl, onPostOrdel,"receiverId="+defaulAddressData.id);
    getDataByURL(postOrdelV2Url, onPostV2Ordel,data);

}
function getChooseList()
{
    delIDList = new Array();
    delCount = 0;
    chooseIDList = "";
    chooseCountList = "";
    totalCount = 0;
    totalCost = 0;
    orderList = new Array();
    for(var i = 0 ; i < carGoodsList.length ; i++)
    {
        if(carGoodsList[i].choose)
        {
            chooseIDList += carGoodsList[i].goodsId +",";
            setLocal(charVec.userBuyList + i, carGoodsList[i].goodsId);
            chooseCountList += carGoodsList[i].count +",";
            delIDList.push(carGoodsList[i].goodsId);
            delCount += carGoodsList[i].count;
            totalCount += Number(carGoodsList[i].count);
            totalCost += (carGoodsList[i].count * (100 * carGoodsList[i].price)) / 100;
            orderList.push(carGoodsList[i].goodsId);
        }
    }
    $("#totalmoney").text("￥" + totalCost);
    $("#totalcount").text(totalCount);
    $("#totalpay").text("￥" + (totalCost - Number($("#points").get(0).value)));
}
function onPostV2Ordel(dataJson)
{
    if(delIDList && delIDList.length )
    {
        for (var i = 0 ;i  < delIDList.length ;i++)
        {
            setCountByID(delIDList[i],0);
        }
    }
    //changeNumGoodsCart(delCount,false);
    $.afui.loadContent("#placeorderPanel", false, false, "transitionYC");
}
function getGooodsDataFromSQL()
{
    var id;
    select(orderTable, "id, count", "", null, function (rows) {
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                goodsList[i] = new Object();
                goodsList[i].id = rows.item(i).id;
                goodsList[i].count = rows.item(i).count;
                idList.push(goodsList[i].id);
                countList.push(goodsList[i].count);
            }
            if(idList.length >0 && countList.length > 0)
            {
                var data = "goodsId=" + idList.join(",") + "&count=" +countList.join(",") ;

                getDataByURL(addShopCartByGoodsIds,onAddShopCartByGoodsIds,data);
            }
        }else
        {
            onAddShopCartByGoodsIds();
        }
    });

}

function onAddShopCartByGoodsIds()
{
    if (userChooseAddress == null)
    {
        getDataByURL(getDefualtAddressUrl, onGetDefualtAddressUrl,"companyId="+ myCompanyId);
        userChooseAddress = null;
    }else
    {
        onGetDefualtAddressUrl(userChooseAddress);
        userChooseAddress = null;
    }

    getDataByURL(getCartListUrl, onGetCartListUrl);
}

function onCartClick(target)
{
    var targetID = target.getAttribute("id");

    var type = targetID.substr(0,1);
    var index  = targetID.substr(2);
    var id = carGoodsList[index].goodsId;
    switch (type)
    {
        case "l":
            if(($("#c_"+index).get(0).value) > 0)
            {
                ($("#c_"+index).get(0).value) --;
                if(($("#c_"+index).get(0).value) == 0)
                {
                    document.getElementById("check_" + index).checked  = false;
                    carGoodsList[index].choose = false;
                    deleteGoodsToCart(id);
                }
            }
            break;
        case "r":
            if(($("#c_"+index).get(0).value) < 100)
                ($("#c_"+index).get(0).value) ++;
            break;
        default :
            break;
    }
    carGoodsList[index].count = $("#c_"+index).get(0).value;


    if(($("#c_"+index).get(0).value) > 0)
    {
        document.getElementById("check_" + index).checked  = true;
        addGoodsToCart(id,($("#c_"+index).get(0).value));
        carGoodsList[index].choose = true;
    }
    getChooseList();
}
//添加商品到购物车
function addGoodsToCart(goodsID,count)
{
    var data = "goodsId="+ goodsID +"&count=" + count;
    getDataByURL(addCartListUrl, onAddCartList,data);
    setCountByID(goodsID,count);
}
function onAddCartList(dataJson)
{

}
function deleteGoodsToCart(goodsID)
{
    var data = "ids="+goodsID;
    setCountByID(goodsID,0);
    getDataByURL(delCartListUrl, onDelCartList,data);

}
function onDelCartList(dataJson)
{

}
function onLisitCheckClick(target)
{
    var id = target.id;
    var index = String(id).substr(id.indexOf("_") + 1);
    carGoodsList[index].choose = target.checked;
    console.log(target.checked +"  " + index) ;
}

function addCartToFavClicked(target)
{
    var targetId = target.getAttribute("id");
    var index = targetId.substr(targetId.indexOf("_") + 1);
    var data;
    if(carGoodsList[index].isCollection){

        addItemToCollect(carGoodsList[index].goodsId,function(data){
         alert(data);
        })
        /*data = "goodsIds=" + carGoodsList[index].goodsId;
        getDataByURL(delCollectionByGoodsIds, function(dataJson){
            //$("#cargoodslist #" + i).find(".addfav").text("收藏");
            carGoodsList[index].isCollection = false;
        }, data);*/
    }else{
        delItemToCollect(carGoodsList[index].goodsId,function(data){

        })
        /*data = "id=" + carGoodsList[index].goodsId;
        getDataByURL(addCollectionUrl, function(dataJson){
           // $("#cargoodslist #" + i).find(".addfav").text("已收藏");
            carGoodsList[index].isCollection = true;
        }, data);*/
    }

}
function delItemFromCarClicked(target)
{
    var targetID = target.getAttribute("id");
    var index = targetID.substr(targetID.indexOf("_") + 1);
    deleteGoodsToCart(carGoodsList[index].goodsId);
    $("#" + targetID).parent().remove();
}

function onGetGoodsInfoByAreaAddressId(dataJson)
{
    var index;
    for(var i = 0 ;i < dataJson.length ;i++)
    {
        index = getIndexByID(dataJson[i].goodsId);

        if(carGoodsList && carGoodsList[index])
        {
            carGoodsList[index].isSelect = dataJson[i].isSelect;
            carGoodsList[index].stockCount = dataJson[i].stockCount;
            $("#cargoodslist #" + index).find("#c_" +index).attr("oninput","onCartCountChange(this)");
            $("#cargoodslist #" + index).find("#c_" +index).attr("max",carGoodsList[index].stockCount);
        }
    }
}
function onGetCurrentPoints(dataJson)
{
    totalPoints = Number(dataJson);
    $("#totalpoints").text(totalPoints);
}
function getIndexByID(id)
{
    for(var i = 0 ;i < carGoodsList.length ; i ++)
    {
        if(carGoodsList[i].goodsId == id)
        {
            return i;
            break;
        }
    }
    return -1;
}

function onCartCountChange(target)
{

}