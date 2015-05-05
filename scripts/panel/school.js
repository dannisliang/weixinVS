//选择学校
var oldItem;
$(document).on("panelload", '#schoolPanel', function (e)
{
    $.afui.showMask();
    $("#schoollist").empty();
    $("#locationschool").empty();
    getDataByURL(getSchoolListUrl, onGetCompany, "", true);
    getLocationData();
    setFooterVisible(false);
});
$(document).on("panelunload", '#schoolPanel', function (e)
{
    setFooterVisible(true);
});
function onGetCompany(dataJson)
{
    var content = "";
    for (var i = 0; i < dataJson.length; i++)
    {
        schoolData[i] = new Object();
        schoolData[i].id = dataJson[i].id;
        schoolData[i].name = dataJson[i].name;
        content += "<li class=\"selbox col-xs-6 col-md-4\" id=\"" +"company_"+ dataJson[i].id + "\"onclick=\"onItemClick(this)\"><a>"
        content += dataJson[i].name;
        content += "</a></li>"
    }
    $("#schoollist").prepend(content);
    myCompanyId = getLocal("schoolid");
    if(myCompanyId != "")
    {
        $("#schoollist").find("#company_" + myCompanyId).attr("class","selbox selbox-current col-xs-6 col-md-4");
        oldItem =  document.getElementById("company_" + myCompanyId);
    }
}
function onGetCompanyByLocation(dataJson)
{
    var content = "";
    var tempID;
    if (dataJson.length == 1)
    {
        for (var i = 0 ; i < dataJson.length ; i++)
        {
            locationSchoolData[i] = new Object();
            locationSchoolData[i].distance = dataJson[i].distance;
            locationSchoolData[i].id = dataJson[i].id;
            locationSchoolData[i].name = dataJson[i].name;
            content += "<li class=\"selbox col-xs-6 col-md-4\" id=\"" +"location_"+ dataJson[i].id + "\" onclick=\"onLocationItemClick(this)\"><a>"
            content += dataJson[i].name;
            content += "</a></li>"
            tempID = dataJson[i].id;
        }
    } else
    {
        for (var i = 0 ; i < dataJson.length ; i++)
        {
            locationSchoolData[i] = new Object();
            locationSchoolData[i].distance = dataJson[i].distance;
            locationSchoolData[i].id = dataJson[i].id;
            locationSchoolData[i].name = dataJson[i].name;
            content += "<li class=\"selbox col-xs-6 col-md-4\" id=\""+"location_" + dataJson[i].id + "\"onclick=\"onLocationItemClick(this)\"><a>"
            content += dataJson[i].name;
            content += "</a></li>"
        }
    }

    $("#locationschool").prepend(content);
    $.afui.hideMask();
    if(tempID)
    {
        document.getElementById(tempID).click();
    }
    document.getElementById("locationtitle").innerHTML = "";
    myCompanyId = getLocal("schoolid");
    if(myCompanyId != "")
    {
        $("#schoollist").find("#company_" + myCompanyId).attr("class","selbox selbox-current col-xs-6 col-md-4");
        oldItem =  document.getElementById("company_" + myCompanyId);
    }
}

function onItemClick(target)
{
    setSelected(target);
    var targetID = target.getAttribute("id")
    var id = targetID.substr(targetID.indexOf("_") + 1);
    var name = getItemNameById(id);
    $("#schoolname").text(name);
    setLocal("schoolid",id);
    setLocal("schoolname",name);
    $.afui.goBack();
}
function onLocationItemClick(target)
{
    setSelected(target);
    var targetID = target.getAttribute("id")
    var id = targetID.substr(targetID.indexOf("_") + 1);
    var name = getItemNameById(id);
    $("#schoolname").text(name);
    setLocal("schoolid",id);
    setLocal("schoolname",name);
    $.afui.goBack();
}

function getItemNameById(id)
{
    var name = "";
    for(var i = 0 ; i <schoolData.length ; i ++)
    {
        if(schoolData[i].id == id)
        {
            name = schoolData[i].name;
            return name;
        }
    }
    return name;
}
function setSelected(target)
{
    if (oldItem)
    {
        oldItem.setAttribute("class", "selbox  col-xs-6 col-md-4");
    }
    target.setAttribute("class", "selbox selbox-current col-xs-6 col-md-4");
    oldItem = target;
}