/**
 * Created by admin on 2015/4/29.
 */
$(document).on("panelbeforeload", '#editAddressPanel', function (e)
{

});
$(document).on("panelload", '#editAddressPanel', function (e)
{
    $("#sel_selectschooledit").empty();
    $("#sel_selectquedit").empty();
    $("#sel_selectbuildedit").empty();
    getDataByURL(getSchoolListUrl, onGetNewAddressCompanyEidt, "");
    initEditData();
});
var newAddressID;
var newAddressQU;
function initEditData()
{
    $("#editAddressName").get(0).value = currentEditData.firstName;
    $("#editAddressPhone").get(0).value = currentEditData.phone;
    $("#editAddressDes").get(0).value = currentEditData.address;
    document.getElementById("editaddresstoggle2").checked = currentEditData.isDefault;
}
function onGetNewAddressCompanyEidt(dataJson)
{
    var content = "";
    for (var i = 0; i < dataJson.length; i++)
    {
        schoolData[i] = new Object();
        schoolData[i].id = dataJson[i].id;
        schoolData[i].name = dataJson[i].name;
        content += "<option value=\""+schoolData[i].id+"\">";
        content += dataJson[i].name;
        content += "</option>"
    }

    $("#sel_selectschooledit").prepend(content);
    $("#sel_selectschooledit option[value="+currentEditData.companyId+"]").attr("selected", true);
    newAddressID = currentEditData.companyId;
    getAreaByCompanyIdEidt(newAddressID);
}

function editAddressChange(value)
{
    $("#sel_selectqu").empty();
    $("#sel_selectbuild").empty();
    getAreaByCompanyIdEidt(value);
}
function editAdreaChange(value)
{
    $("#sel_selectbuild").empty();
    getAreaAddressByAreaIdEdit(value);
}
function getAreaByCompanyIdEidt(id)
{

    getDataByURL(getAreaListUrl, ontAreaByCompanyIdEdit, "companyId=" + id);
}

function ontAreaByCompanyIdEdit(dataJson)
{
    var content = "";
    var aredData = new Array();
    for (var i = 0; i < dataJson.length; i++)
    {
        aredData[i] = new Object();
        aredData[i].id = dataJson[i].id;
        aredData[i].name = dataJson[i].name;
        content += "<option value=\""+aredData[i].id+"\">";
        content += dataJson[i].name;
        content += "</option>"
    }
    $("#sel_selectquedit").prepend(content);
    if(dataJson.length > 0)
    {
        newAddressQU = currentEditData.areaId;
        getAreaAddressByAreaIdEdit(newAddressQU);
        $("#sel_selectquedit option[value="+currentEditData.areaId+"]").attr("selected", true);
    }

}
function editAddressClicked()
{
    var name = $("#editAddressName").get(0).value;
    var phone = $("#editAddressPhone").get(0).value;
    var companyId = $('#sel_selectschooledit option:selected').val();
    var areaId = $('#sel_selectquedit option:selected').val();
    var areadDressId =  $('#sel_selectbuildedit option:selected').val();
    var address =$("#editAddressDes").get(0).value;
    var isDefault = document.getElementById("editaddresstoggle2").checked +"";
    if( !name || !phone|| !companyId || !address)
    {
        return;
    }
    var data = "id="+ currentEditData.id;
    data +="&name="+ name;
    data += "&phone=" + phone;
    data += "&companyId=" + companyId;
    data += "&areaId=" +areaId;
    data += "&areaAddressId=" + areadDressId;
    data += "&address="  +address;
    data += "&isDefault=" +isDefault;
    getDataByURL(setAddressUrl, onaddAddressCompleteEdit, data);
}
function delAddressClicked()
{

    getDataByURL(deleteAddressUrl, ondeleteAddress, "id=" + currentEditData.id);
}
function getAreaAddressByAreaIdEdit(id)
{
    getDataByURL(getAreaAddressUrl, onGetAreaAddressByAreaIdEdit, "areaId=" +id);
}
function onGetAreaAddressByAreaIdEdit(dataJson)
{
    var content = "";
    var buildData = new Array();
    for (var i = 0; i < dataJson.length; i++)
    {
        buildData[i] = new Object();
        buildData[i].id = dataJson[i].id;
        buildData[i].name = dataJson[i].name;
        content += "<option value=\""+buildData[i].id+"\">";
        content += dataJson[i].name;
        content += "</option>"
    }
    $("#sel_selectbuildedit").prepend(content);
    $("#sel_selectbuildedit option[value="+currentEditData.areaAddressId+"]").attr("selected", true);
}
function onaddAddressCompleteEdit(dataJson)
{
    $.afui.loadContent("#addressPanel", false, false, transitionYC);
}
function ondeleteAddress(dataJson)
{
    $.afui.loadContent("#addressPanel", false, false, transitionYC);
}