/**
 * Created by admin on 2015/4/23.
 */
var goodsInfo =
{
    companyId:null,
    costPrice:null,
    description:null,
    id:null,
    imgArr:null,
    isAddCart:null,
    isCollect:null,
    price:null,
    priceList:null,
    quickMemo:null,
    subTitle:null,
    tagId:null,
    title:null,
    unit:null
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
    tempInfo.unit = dataJson.unit;
    return tempInfo;
}
//同名商品数据
function goodsSNDataProcess(dataJson)
{
    var tempInfo = Object.create(goodsInfo);
    tempInfo.companyId = dataJson.companyId;
    tempInfo.costPrice = dataJson.costPrice;
    tempInfo.description = dataJson.description;
    tempInfo.id = dataJson.id;
    tempInfo.imgArr = String(dataJson.pictureId).split(",");
    tempInfo.isAddCart = dataJson.isAddCart;
    tempInfo.isCollect = dataJson.isCollect;
    tempInfo.price = dataJson.price;
    tempInfo.priceList = dataJson.priceList;
    tempInfo.title = dataJson.name;
    tempInfo.uint = dataJson.uint;
    tempInfo.quickMemo = dataJson.quickMemo;
    tempInfo.subTitle = dataJson.subTitle;
    tempInfo.tagId = dataJson.tagId;
    return tempInfo;
}