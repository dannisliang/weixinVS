/**
 * Created by admin on 2015/4/23.
 */
var goodsInfo =
{
    costPrice:null,
    description:null,
    id:null,
    imgArr:null,
    isAddCart:null,
    isCollect:null,
    price:null,
    priceList:null,
    title:null,
    uint:null
}
/**
 *
 * @param money
 * @return {*}
 */
function goodsDataProcess(dataJson)
{
    var tempInfo = Object.create(goodsInfo);
    tempInfo.costPrice = dataJson.costPrice;
    tempInfo.description = dataJson.description;
    tempInfo.id = dataJson.id;
    tempInfo.imgArr = String(dataJson.img).split(",");
    tempInfo.isAddCart = dataJson.isAddCart;
    tempInfo.isCollect = dataJson.isCollect;
    tempInfo.price = dataJson.price;
    tempInfo.priceList = dataJson.priceList;
    tempInfo.title = dataJson.title;
    tempInfo.uint = dataJson.uint;
    return tempInfo;
}