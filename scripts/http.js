// JavaScript Document

function getDataByURL(url, okcall, data, bCache, time) {
    if (bCache && !time && dicUrlTime)
    {
        dicUrlTime.set(url, 30);
    }
    console.log(url);
    if (bCache == null) {
        bCache = false;
    }
    if (bCache) {
        getUrlByTime(url, okcall, data, bCache, time);
    }
    else {
        getDataAjax(url, okcall, data, bCache, time);
    }
}

function getDataAjax(url, okcall, data, bCache, time) {
    showWaitingDialog();
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        timeout: 8000,
        success: function (object) {
            hideWaitingDialog();
            var tempString
            if (object != null) {
                if (object.code == 0) {
                    if (bCache) {
                        if(object.data != "[]"){
                            saveOrUpdate(tableUrl, ['data', 'time'], [object.data, dicUrlTime.get(url, time)], 'url', url +data);
                        }
                    }
                    if (object.data != null) {
                        tempString = object.data;
                        if(tempString.indexOf("{") != -1 || tempString.indexOf("[") != -1)
                        {
                            var dataJson = $.parseJSON(object.data);
                            okcall.apply(this, [dataJson]);
                        }else
                        {
                            if(tempString == 0){
                                okcall.apply(this, [0]);
                            }else{
                                okcall.apply(this, [object.data]);
                            }
                        }

                    } else {
                       // showGlobalMessageDialog(object.message);
                        okcall();
                    }
                }
                else {
                    if(typeof(object) == "string")
                    {
                        if($.parseJSON(object) && $.parseJSON(object).message != null){
                            showGlobalMessageDialog($.parseJSON(object).message);
                        }
                    }else  if(typeof(object) == "object"){
                        showGlobalMessageDialog(object.message);
                    }else
                    {
                        showGlobalMessageDialog("获取数据失败");
                    }
                }
            }
        },
        error: function (err) {
            console.log('Error:' + err.dataGet);
            hideWaitingDialog();
            if (err.dataGet == null) {
                showGlobalMessageDialog("连接服务器失败！！！");
            } else {
                showGlobalMessageDialog(err.dataGet);
            }
        }
    });
}

function getUrlByTime(url, okcall, data, bCache, time) {
    select(tableUrl, "data,time", "url=?", [url+data], function (rows) {
        if (rows) {
            var time = rows.item(0).time;
            if (time != null && time > 0) {
                okcall.apply(this, [$.parseJSON(rows.item(0).data)]);
                //alert("cache");
            }
        }
        else {
            getDataAjax(url, okcall, data, bCache, time);
        }
    });
}

// 缓存默认时间
var dicUrlTime = "";
function initUrlTime() {
    self.setInterval("subUrlTime()", 60000);    // 60秒执行一次减一的函数，所以设置30就代表30分钟
    dicUrlTime = new Dictionary();
    dicUrlTime.set(loginUrl, 20);
    dicUrlTime.set(getCategoryByRightUrl, 30);
    dicUrlTime.set(getCategoryByLeftUrl, 30);
    dicUrlTime.set(getSchoolListUrl, 30);
}

function subUrlTime() {
    select(tableUrl, "time, url", "", null, function (rows) {
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                var time = --rows.item(i).time;
                if (time == 0) {
                    deleteRow(tableUrl, "url=?", [rows.item(i).url]);
                }
                else {
                    saveOrUpdate(tableUrl, ['time'], [time], 'url', rows.item(i).url);
                }
            }
        }
    });
}

function onSortRightSuccess(dataJson) {
    $("#listSortRight").empty();
    var content = "";
    for (i = 0; i < dataJson.length; i++) {
        sortRightID[i] = dataJson[i].id;
        content += "<li><a href=\"javascript:void(0)\" onclick=\"goodsByCondition(" + i + ")\" data-transition=\"slidefade\">";
        if (dataJson[i].pictureId != "")
            content += "<img src=\"" + rootUrl + "/service/rest/tk.File/" + dataJson[i].pictureId + "?thumb=" + (widthImgSortRight - 10)*3 + "x" + (widthImgSortRight - 10)*3
        else
            content += "<img src=\"images/default_pic.9.png"
        content += "\" border=0>";
        content += "<p>" + dataJson[i].text + "</p>";
        content += "</a></li>"
    }
    $("#listSortRight").prepend(content);
    fitSortRight();
}

function goodsByCondition(index) {
    goods.categoryId = sortRightID[index];
    goTo("#pageGoods");
    $("#thelist").empty();
    goods.page = 1;
    myScroll.scrollToPage(0, 0, 0);
    getGoodsList();
}

function getGoodsList() {
    var data = "";
    data += "companyId=" +goods.companyId;
    data += "&categoryId=" +goods.categoryId;
    data += "&rows=" + goods.rows;
    data += "&sort=" + goods.sort;
    data += "&order=" + goods.order;
    data += "&page=" + goods.page;
    data += "&buyerId=" +goods.buyerId;
    getDataByURL(getGoodListUrl, goodsListSuccess, data);
}

// 商品数量
var numGoods =0;

function goodsListSuccess(dataJson) {
    var content = "";
    for (i = 0; i < dataJson.length; i++, numGoods++) {
        goodsPageId[numGoods] = dataJson[i].id;
        dataJson[i].price = (dataJson[i].price).toFixed(1);
        content += "<li><a href=\"#productinfo\"  data-transition=\"invoke\" onclick=\"getProductInfo(" + i + ")\">";
        content += "<img id=\"listImage\" src=\"" + rootUrl + "/service/rest/tk.File/" + dataJson[i].pictureId +"?thumb=80x80\"/>";
        content += "<h2 id=\"listTopText\">"+  dataJson[i].name +"</h2>";
        content += "<p id=\"listPriceText\">￥ " + dataJson[i].price + "</p></a>"
        var btnCart = "", btnColl = "", btnCartClicked = "", btnCollClicked = "";
        if (dataJson[i].isAddCart == false) {
            btnCart = "btnAddToCartNor";
            btnCartClicked = "btnAddToCartClicked";
        }
        else {
            btnCart = "btnAddToCartSel";
            btnCartClicked = "btnRemoveCartClicked";
        }
        if (dataJson[i].isCollect == false) {
            btnColl = "btnAddToCollNor";
            btnCollClicked = "btnAddToCollClicked";
        }
        else {
            btnColl = "btnAddToCollSel";
            btnCollClicked = "btnRemoveCollClicked";
        }
        content += "<a class=\"" + btnCart + "\" id=\"cartGoods" + numGoods + "\" href=\"javascript:void(0)\" onclick=\"" + btnCartClicked + "(" + numGoods + ")\"></a>";
        content += "<a class=\"" +btnColl +"\" id=\"collGoods" + numGoods + "\"href=\"javascript:void(0)\" onclick=\"" + btnCollClicked + "(" + numGoods + ")\"></a><a style=\"display:none\"></a></li>";
    }
    $("#thelist").append(content).listview('refresh');
    myScroll.refresh();

    //<li>
    //    <a href="#">
    //        <img id="listImage" src="images/album-bb.jpg">
    //        <h2 id="listTopText">Broken Bells</h2>
    //        <p id="listPriceText">Broken Bells</p>
    //    </a>
    //    <a href="#" id="btnAddToCart" data-role="button" onclick="btnAddToCartClicked();" data-icon="custom"></a>
    //    <a href="#" id="btnAddToColl" data-role="button" onclick="btnAddToCollClicked();"></a>
    //</li>
}

var addOrDelGoodId = 0;

function btnAddToCartClicked(id) {
    var data = "id=" + goodsPageId[id];
    addAddressUrl = id;
    getDataByURL(addCartListUrl, addCartListSuccess, data);
}

function addCartListSuccess(dataJson) {
    document.getElementById("cartGoods" + 4).setAttribute("class", "btnAddToCartSel");
}

function btnRemoveCartClicked(id) {
    var data = "id=" + goodsPageId[id];
    addAddressUrl = id;
    getDataByURL(delCartListUrl, delCartListSuccess, data);
}

function delCartListSuccess(dataJson) {
    document.getElementById("cartGoods" + 4).setAttribute("class", "btnAddToCartNor");
}

function btnAddToCollClicked(id) {
    var data = "id=" + goodsPageId[id];
    addAddressUrl = id;
    getDataByURL(addCollectionUrl, addCollectionSuccess, data);
}

function addCollectionSuccess(dataJson) {
    document.getElementById("cartGoods" + 4).setAttribute("class", "btnAddToCollSel");
}

function btnRemoveCollClicked(id) {
    var data = "id=" + goodsPageId[id];
    addAddressUrl = id;
    getDataByURL(delCollectionUrl, delCollectionSuccess, data);
}

function delCollectionSuccess(dataJson) {
    document.getElementById("cartGoods" + 4).setAttribute("class", "btnAddToCollNor");
}

function btnAdddddicked(id) {
    window.location.href = "#goodgood";
}

function onInfoBack()
{
    photoSwipe.unsetActivateInstance(instance);
    photoSwipe.activeInstances = [];
}
