/**
 * Created by admin on 2015/4/25.
 */
//��������Թ��ﳵ�������orderTable��
// (�ڹ��ﳵ����Ľ�����ӹ��ﳵ���ǻ��浽����)
function setCountByID(id,count)
{
    if(count >0)
        saveOrUpdate(orderTable, ['count'], [count], 'id', id );
    else
        deleteRow(orderTable, "id=?", [id]);
}

//����id��ȡ���ػ��湺�ﳵ��Ʒ����
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