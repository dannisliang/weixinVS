/**
 * Created by admin on 2015/4/29.
 */
$(document).on("panelbeforeload", '#newAddressPanel', function (e)
{

});
$(document).on("panelload", '#newAddressPanel', function (e)
{
    document.getElementById("newaddresstoggle2").checked = true;
    $("#sel_selectschool").empty();
    $("#sel_selectqu").empty();
    $("#sel_selectbuild").empty();
    getDataByURL(getSchoolListUrl, onGetNewAddressCompany, "", true);
    $("#newAddressPhone").get(0).value = userInfo.contactPhone;
});
var newAddressID;
var newAddressQU;
function onGetNewAddressCompany(dataJson)
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

    $("#sel_selectschool").prepend(content);
    if(myCompanyId)
    {
        $("#sel_selectschool option[value="+myCompanyId+"]").attr("selected", true);
        newAddressID = myCompanyId;
        getAreaByCompanyId(newAddressID);
    }else
    {
        if(dataJson.length > 0)
        {
            newAddressID = schoolData[0].id;
            getAreaByCompanyId(newAddressID);
        }
    }
}

function newAddressChange(value)
{
    $("#sel_selectqu").empty();
    $("#sel_selectbuild").empty();
    getAreaByCompanyId(value);
}
function newAdreaChange(value)
{
    $("#sel_selectbuild").empty();
    getAreaAddressByAreaId(value);
}
function getAreaByCompanyId(id)
{

    getDataByURL(getAreaListUrl, ontAreaByCompanyId, "companyId=" + id, true);
}

function ontAreaByCompanyId(dataJson)
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
    if(dataJson.length > 0)
    {
        newAddressQU = aredData[0].id;
        getAreaAddressByAreaId(newAddressQU);
    }
    $("#sel_selectqu").prepend(content);
}

function newAddressClicked()
{
    var name = $("#newAddressName").get(0).value;
    var phone = $("#newAddressPhone").get(0).value;
    var companyId = $('#sel_selectschool option:selected').val();
    var areaId = $('#sel_selectqu option:selected').val();
    var areadDressId =  $('#sel_selectbuild option:selected').val();
    var address =$("#newAddressDes").get(0).value;
    var isDefault = document.getElementById("newaddresstoggle2").checked +"";
    if( !name || !phone|| !companyId || !areaId || !address)
    {
        return;
    }
    var data = "name="+ name;
    data += "&phone=" + phone;
    data += "&companyId=" + companyId;
    data += "&areaId=" +areaId;
    data += "&areaAddressId=" + areadDressId;
    data += "&address="  +address;
    data += "&isDefault=" +isDefault;
    getDataByURL(addAddressUrl, onaddAddressComplete, data);
}
function getAreaAddressByAreaId(id)
{
    getDataByURL(getAreaAddressUrl, onGetAreaAddressByAreaId, "areaId=" +id);
}
function onGetAreaAddressByAreaId(dataJson)
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
    $("#sel_selectbuild").prepend(content);
}
function onaddAddressComplete(dataJson)
{
    $("#newAddressName").get(0).value= "";
    $("#newAddressPhone").get(0).value ="";
    $("#newAddressDes").get(0).value ="";
    document.getElementById("newaddresstoggle2").checked = true;
    $.afui.loadContent("#addressPanel", false, false, transitionYC);
}