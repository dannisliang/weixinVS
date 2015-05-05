/**
 * Created by admin on 2015/4/30.
 */
function addItemToCollect(id,callback)
{
    var data = "id=" + id;
    getDataByURL(addCollectionUrl, function(dataJson){
        callback.apply(this,[id]);
    }, data);
}

function delItemToCollect(id,callback)
{
    var data = "goodsIds=" + id;
    getDataByURL(delCollectionByGoodsIds, function(dataJson){
        callback.apply(this,[id]);
    }, data);
}

function setFooterVisible(boo)
{
    if(boo)
    {
        $(".view footer").show();
    }else
    {
        $(".view footer").hide();
    }
}