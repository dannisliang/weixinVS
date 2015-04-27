var initcart = false;
var carGoodsItem;
var goodsList;
var idList;
var countList;
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
    getGooodsDataFromSQL();
});
function onGetDefualtAddressUrl(dataJson)
{
    if (dataJson != null && dataJson.length> 0)
    {
        var content = "";
        defaulAddressData.address = dataJson[0].address;
        defaulAddressData.areaAddressId = dataJson[0].areaAddressId;
        defaulAddressData.areaAddressName = dataJson[0].areaAddressName;
        defaulAddressData.areaId = dataJson[0].areaAddressId;
        defaulAddressData.areaName = dataJson[0].areaName;
        defaulAddressData.companyId = dataJson[0].companyId;
        defaulAddressData.companyName = dataJson[0].companyName;
        defaulAddressData.firstName = dataJson[0].firstName;
        defaulAddressData.id = dataJson[0].id;
        defaulAddressData.isDefault = dataJson[0].isDefault;
        defaulAddressData.phone = dataJson[0].phone;
        $("#defaultname").text(defaulAddressData.firstName);
        $("#defaulttel").text(defaulAddressData.phone);
        var adddress = defaulAddressData.companyName + defaulAddressData.areaName + defaulAddressData.areaAddressName;
        $("#defaultadd").text(adddress);
    }
    hideWaitingDialog();
}
//购物车商品列表
function onGetCartListUrl(dataJson)
{
    var content = "";
    $("#cargoodslist .grayline").attr("id", 0);
    var temp = $("#cargoodslist #" + 0).clone();
    var totalCount = 0;
    var totlaCost = 0;
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

        totalCount += carGoodsList[i].count;
        totlaCost += (carGoodsList[i].count * (100 * carGoodsList[i].price)) / 100;
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


        parentNode.find(".title,fontsize-l,ellipsis").text(carGoodsList[i].goodsTitle);
        parentNode.find(".nowprice,fontsize-xl").text("￥" + carGoodsList[i].price);
        if (carGoodsList[i].priceList.length == 1)
        {
            parentNode.find(".Ladder-price").hide();
        } else
        {
        }

        parentNode.find(".total").text("总价:" + (carGoodsList[i].count * (100 * carGoodsList[i].price)) / 100);
        parentNode.find(".reduce,pull-left,text-center").attr("id", "l_" + carGoodsList[i].goodsId);
        parentNode.find(".reduce,pull-left,text-center").attr("onclick", "onCartClick(this)");
        parentNode.find(".add,pull-left,text-center").attr("id", "r_" + carGoodsList[i].goodsId);
        parentNode.find(".add,pull-left,text-center").attr("onclick", "onCartClick(this)");
        parentNode.find(".count,pull-left,text-center").attr("id", "c_"+ carGoodsList[i].goodsId);
        parentNode.find("#c_"+ carGoodsList[i].goodsId).get(0).value = carGoodsList[i].count;
        // $("#c_"+ carGoodsList[i].goodsId).get(0).value = carGoodsList[i].count;
    }
    //$(".detailed,list,inset .price .red").text("￥" + totlaCost);
    $("#totalmoney").text("￥" + totlaCost);
    $("#totalcount").text(totalCount);
    $("#totalpay").text("￥" + totlaCost);
}
function onRadioClick(target)
{

}

function onAddresListClick(target)
{
    var id = target.getAttribute("id");
    userChooseAddress = addressData[id];
}
//window.location.href = "#pageGoods";

function onOrderOk()
{
    console.log("商品总数 " + getGoodsTotalCount());
    if(defaulAddressData.areaAddressId  == null)
    {
        return;
    }
    getDataByURL(postOrdelUrl, onPostOrdel,"receiverId="+defaulAddressData.id);
    //$.afui.loadContent("#placeorderPanel", false, false, "slide");
}
function onPostOrdel(dataJson)
{

}
function getGoodsTotalCount()
{
    var sum = 0;

    for(var i in carGoodsList)
    {
        sum += carGoodsList[i].count;
    }
    return sum;
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
        getDataByURL(getDefualtAddressUrl, onGetDefualtAddressUrl);
    }else
    {
        onGetDefualtAddressUrl([userChooseAddress]);
    }

    getDataByURL(getCartListUrl, onGetCartListUrl);
}

function onCartClick(target)
{
    var targetID = target.getAttribute("id");

    var type = targetID.substr(0,1);
    var id  = targetID.substr(2);
    switch (type)
    {
        case "l":
            if(($("#c_"+id).get(0).value) > 0)
            {
                ($("#c_"+id).get(0).value) --;
                if(($("#c_"+id).get(0).value) == 0)
                    deleteGoodsToCart(id);
            }
            break;
        case "r":
            if(($("#c_"+id).get(0).value) < 100)
                ($("#c_"+id).get(0).value) ++;
            break;
        default :
            break;
    }
    if(($("#c_"+id).get(0).value) > 0)
    {
        addGoodsToCart(id,($("#c_"+id).get(0).value));
    }
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
    getDataByURL(delCartListUrl, onDelCartList,data);
    setCountByID(goodsID,0);
}
function onDelCartList(dataJson)
{

}