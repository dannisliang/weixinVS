var localJavaUrl = "localUrl_";//缓存后端通信数据
var localcount = "localcount_";//缓存购物车
/**
 * @type 键值前缀，区别不同模块的数据（见上的定义）
 * @key  键值
 * @insertFields 参数名数组
 * @insertParams 参数数组
 */
function setLocalStorage(type,key,insertFields,insertParams)
{
    if(!window.localStorage){
        alert('This browser does not support localStorage');
        return;
    }
    var value = new Object();
    var oldData = window.localStorage.getItem(type + key);
    if(oldData)
    {
        var oldJson = $.parseJSON(oldData);
        for(var i in oldJson)
        {
            value[i] = oldJson[i];
        }
    }

    if((insertFields instanceof Array) && (insertParams instanceof  Array) && insertFields.length == insertParams.length)
    {
        for(var i = 0 ; i < insertFields.length ; i ++)
        {
            value[insertFields[i]] = insertParams[i];
        }
    }else
    {
        return;
    }

    window.localStorage.setItem(type + key, JSON.stringify(value));
}
function getLocalStorage(type,key,callback)
{
    if(!window.localStorage){
        alert('This browser does not support localStorage');
        return;
    }
    var data = window.localStorage.getItem(type + key);
    if(callback != null)
        callback.apply(this,[$.parseJSON(data)]);
}

function removeLocalStorage(type,key)
{
    if(!window.localStorage){
        alert('This browser does not support localStorage');
        return;
    }
    window.localStorage.removeItem(type + key);
}
/**
 * @params 需要返回的参数(string  用逗号分开)
 */
function selectLocalStorage(type,params,callback)
{
    var paramList;
    if(params)
    {
        if(String(params).indexOf(",") < 0)
        {
            paramList = [params];
        }else
        {
            paramList = String(params).split(",");
        }

    }
    var key ;
    var value;
    var dataJson;
    var data = new Array();
    for(var i = 0 ; i <  window.localStorage.length ;i ++)
    {
        key = window.localStorage.key(i);
        if(key.indexOf(type) == 0)
        {
            value = window.localStorage.getItem(key);
            if(value.indexOf("{") != -1 || value.indexOf("[") != -1)
            {
                dataJson =  $.parseJSON(value);
                var obj;
                if(paramList && paramList.length > 0)
                {
                    for(var j = 0 ; j < paramList.length ; j ++ )
                    {
                        obj = new Object();
                        obj[paramList[j]] = dataJson[paramList[j]];
                        obj["key"] = key.substr(key.indexOf("_") + 1);
                        data.push(obj);
                    }
                }
            }
        }
    }
    if(callback != null){
        callback.apply(this,[data]);
    }
}