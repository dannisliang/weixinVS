var addressItem;
var initAddress = false;
//选择收货地址
$(document).on("panelload", '#addressPanel', function (e) {
    if (!initAddress)
    {
        addressItem = $("#addresslist .reciver").clone();
        initAddress = true;
    }

    $("#addresslist").empty();
    getDataByURL(getAddressUrl, onGetAddressUrl,"companyId="+ myCompanyId);
});

//获得收货地址
function onGetAddressUrl(dataJson)
{
    var content = "";
    for (var i = 0 ; i < dataJson.length ; i++)
    {
        addressData[i] = new Object();
        addressData[i].address = dataJson[i].address;
        addressData[i].areaAddressId = dataJson[i].areaAddressId;
        addressData[i].areaAddressName = dataJson[i].areaAddressName;
        addressData[i].areaId = dataJson[i].areaAddressId;
        addressData[i].areaName = dataJson[i].areaName;
        addressData[i].companyId = dataJson[i].companyId;
        addressData[i].companyName = dataJson[i].companyName;
        addressData[i].firstName = dataJson[i].firstName;
        addressData[i].id = dataJson[i].id;
        addressData[i].isDefault = dataJson[i].isDefault;
        addressData[i].phone = dataJson[i].phone;
        var adddress = addressData[0].companyName + addressData[0].areaName + addressData[0].areaAddressName;

        var tempItem = addressItem.clone();
        tempItem.attr("id", i);
        $("#addresslist").append(tempItem);

        var parentNode = $("#addresslist #" + i);

        parentNode.find(">img").attr("id",i);
        parentNode.find("> a").attr("id",i);
        parentNode.find(".name").text(addressData[i].firstName);
        parentNode.find(".tel").text(addressData[i].phone);
        parentNode.find(".address").text(adddress);
    }
    hideWaitingDialog();
}

function onEditButtonClick(target)
{
    currentEditData = addressData[Number(target.getAttribute("id"))];
    $.afui.loadContent("#editAddressPanel", false, false, transitionYC);
}
function onAddresListClick(target)
{
    var id = target.getAttribute("id");
    userChooseAddress = addressData[id];
}