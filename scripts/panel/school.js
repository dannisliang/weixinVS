//选择学校
$(document).on("panelload", '#schoolPanel', function (e)
{
    $.afui.showMask();
    $("#schoollist").empty();
    $("#locationschool").empty();
    getDataByURL(getSchoolListUrl, onGetCompany, "", true);
    getLocationData();
});
var oldItem;
function onItemClick(target)
{
    if (oldItem)
    {
        oldItem.setAttribute("class", "selbox  col-xs-6 col-md-4");
    }
    target.setAttribute("class", "selbox selbox-current col-xs-6 col-md-4");
    oldItem = target;
    myCompanyId = target.getAttribute("id");
}
function onGetCompany(dataJson)
{
    var content = "";
    for (i = 0; i < dataJson.length; i++)
    {
        schoolData[i] = new Object();
        schoolData[i].id = dataJson[i].id;
        schoolData[i].name = dataJson[i].name;
        content += "<li class=\"selbox col-xs-6 col-md-4\" id=\"" + dataJson[i].id + "\"onclick=\"onItemClick(this)\"><a>"
        content += dataJson[i].name;
        content += "</a></li>"
    }
    $("#schoollist").prepend(content);
    $.afui.hideMask();
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
            content += "<li class=\"selbox col-xs-6 col-md-4\" id=\"" + dataJson[i].id + "\" onclick=\"onItemClick(this)\"><a>"
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
            content += "<li class=\"selbox col-xs-6 col-md-4\" id=\"" + dataJson[i].id + "\"onclick=\"onItemClick(this)\"><a>"
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
}