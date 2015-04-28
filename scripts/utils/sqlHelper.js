/**
 * Created by admin on 2015/4/25.
 */
//以下是针对购物车缓存操作orderTable表
// (在购物车以外的界面添加购物车都是缓存到本地)
function setCountByID(id,count)
{
    if(count >0)
        saveOrUpdate(orderTable, ['count'], [count], 'id', id ,onSQLCallBack);
    else
    {
        deleteRow(orderTable, "id=?", [id],onSQLCallBack);
    }


}
function onSQLCallBack(boo)
{
  if(boo)
  {
      var tempCount = 0;
      select(orderTable, "id, count", "", null, function (rows) {
          if (rows) {
              for (var i = 0; i < rows.length; i++) {
                  tempCount += Number(rows.item(i).count);
              }
                  changeNumGoodsCart(tempCount);
          }else
          {
              changeNumGoodsCart(0);
          }

      });
  }
}
//根据id获取本地缓存购物车商品数量
function getGoodsCountByID(id,callback, index)
{
    select(orderTable, "id,count", "id=?", [id], function (rows) {
        if (rows) {
            callback.apply(this, [rows.item(0).count, index]);
        }else
        {
            callback.apply(this,[0, index]);
        }
    });
}