/**
 * Created by admin on 2015/4/28.
 */
var initHome = false;
var imgUpItem;
var imgCenterTtem;
var imgDownTtem;
$(document).on("panelbeforeload", '#home', function (e)
{
    //alert("aaaa");

});
$(document).on("panelload", '#home', function (e)
{
    //$("#slideNav_0").empty();
});
function ongetPageSetting(dataJson)
{
    if (!initHome)
    {
        imgUpItem = $("#slideNavli").clone();
        imgCenterTtem = $("#slideNavli_1").clone();
        imgDownTtem = $("#slideNavli_2").clone();
        initHome = true;
    }
    $("#slideNavul").empty();
    $("#slideNavul_1").empty();
    $("#slideNavul_2").empty();
    for(var i= 0 ; i < dataJson.length ; i++)
    {
        mainPageData[i] = new Object();
        mainPageData[i]["label"] = dataJson[i].label;
        mainPageData[i]["pageId"] = dataJson[i].pageId;
        mainPageData[i]["pageType"] = dataJson[i].pageType;
        mainPageData[i]["size"] = dataJson[i].size;
        mainPageData[i]["typeSetting"] = dataJson[i].typeSetting;
        mainPageData[i]["pageItem"] = new Array();
        for(var j = 0 ; j <dataJson[i].pageItem.length;j++)
        {
            mainPageData[i]["pageItem"][j] = new Object();
            mainPageData[i]["pageItem"][j]["fileId"] = dataJson[i].pageItem[j].fileId;
            mainPageData[i]["pageItem"][j]["gotoType"] = dataJson[i].pageItem[j].gotoType;
            mainPageData[i]["pageItem"][j]["gotoValue"] = dataJson[i].pageItem[j].gotoValue;
            mainPageData[i]["pageItem"][j]["pageItemId"] = dataJson[i].pageItem[j].pageItemId;

            switch (i){
                case 0 :
                    initUpData(mainPageData[i]["typeSetting"], mainPageData[i]["pageItem"][j],i,j);
                    break;
                case 1:
                    initCenterData(mainPageData[i]["typeSetting"], mainPageData[i]["pageItem"][j],i,j);
                    break;
                case 2:
                    initDownData(mainPageData[i]["typeSetting"], mainPageData[i]["pageItem"][j],i,j);
                    break;
                default :
                    break;
            }

        }
        if (mainPageData[i]["typeSetting"] == "One")
        {
            initTouchSlide(i);
        }
    }

}

function initUpData(type,data,i,j)
{
    switch (type)
    {
        case "One"://£»ÂÖ²¥
            $("#eatplusone_0").remove();
            $("#eatplusone_1").remove();
            $("#eatplusone_2").remove();
            var tempItem = imgUpItem.clone();
            tempItem.attr("id", i+"_"+j);
            $("#slideNavul").append(tempItem);
            var parentNode = $("#slideNavul #" + (i+"_"+j));
            parentNode.find(".colimage").attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                parentNode.find(".colimage").parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                parentNode.find(".colimage").parent().attr("href" ,"#");
            break;
        case "Two":
            $("#slideNav_0").remove();
            $("#eatplusone_1").remove();
            $("#eatplusone_2").remove();
            $("#up0_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#up0_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#up0_" + j).parent().attr("href" ,"#");
            break;
        case "Three":
            $("#eatplusone_0").remove();
            $("#slideNav_0").remove();
            $("#eatplusone_2").remove();
            $("#up1_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#up1_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#up1_" + j).parent().attr("href" ,"#");
            break;
        case "Four":
            $("#eatplusone_0").remove();
            $("#slideNav_0").remove();
            $("#eatplusone_1").remove();
            $("#up2_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#up2_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#up2_" + j).parent().attr("href" ,"#");
            break;
        default:
            break;
    }

}
function initCenterData(type,data,i,j)
{
    switch (type)
    {
        case "One"://£»ÂÖ²¥
            $("#eatplustwo_0").remove();
            $("#eatplustwo_1").remove();
            $("#eatplustwo_2").remove();
            var tempItem = imgCenterTtem.clone();
            tempItem.attr("id", i+"_"+j +"_center");
            $("#slideNavul_1").append(tempItem);
            var parentNode = $("#slideNavul_1 #" + (i+"_"+j) +"_center");
            parentNode.find(".colimage").attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                parentNode.find(".colimage").parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                parentNode.find(".colimage").parent().attr("href" ,"#");
            break;
        case "Two":
            $("#slideNav_1").remove();
            $("#eatplustwo_1").remove();
            $("#eatplustwo_2").remove();
            $("#center0_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#center0_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#center0_" + j).parent().attr("href" ,"#");
            break;
        case "Three":
            $("#slideNav_1").remove();
            $("#eatplustwo_0").remove();
            $("#eatplustwo_2").remove();
            $("#center1_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#center1_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#center1_" + j).parent().attr("href" ,"#");
            break;
        case "Four":
            $("#slideNav_1").remove();
            $("#eatplustwo_0").remove();
            $("#eatplustwo_1").remove();
            $("#center2_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#center2_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#center2_" + j).parent().attr("href" ,"#");
            break;
        default:
            break;
    }

}

function initDownData(type,data,i,j)
{
    switch (type)
    {
        case "One"://£»ÂÖ²¥
            $("#eatplusthree_0").remove();
            $("#eatplusthree_1").remove();
            $("#eatplusthree_2").remove();
            var tempItem = imgCenterTtem.clone();
            tempItem.attr("id", i+"_"+j +"_down");
            $("#slideNavul_2").append(tempItem);
            var parentNode = $("#slideNavul_2 #" + (i+"_"+j) +"_down");
            parentNode.find(".colimage").attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                parentNode.find(".colimage").parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                parentNode.find(".colimage").parent().attr("href" ,"#");
            break;
        case "Two":
            $("#slideNav_2").remove();
            $("#eatplusthree_1").remove();
            $("#eatplusthree_2").remove();
            $("#down0_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#down0_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#down0_" + j).parent().attr("href" ,"#");
            break;
        case "Three":
            $("#slideNav_2").remove();
            $("#eatplusthree_0").remove();
            $("#eatplusthree_2").remove();
            $("#down1_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#down1_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#down1_" + j).parent().attr("href" ,"#");
            break;
        case "Four":
            $("#slideNav_2").remove();
            $("#eatplusthree_0").remove();
            $("#eatplusthree_1").remove();
            $("#down2_" + j).attr("src", getImageUrl + data.fileId );
            if(data.gotoType == "Category")
                $("#down2_" + j).parent().attr("href" ,"#prolistPanel");
            else if(data.gotoType == "Url")
                $("#down2_" + j).parent().attr("href" ,"#");
            break;
        default:
            break;
    }

}

function onHomeItemClick(target)
{

}