$(document).on("panelbeforeload", '#myInfoPanel', function (e) {
    if(getCookie(charVec.headimgurlCo) != ""){
        $("#myinfo .header img").attr("src", getCookie(charVec.headimgurlCo));
    }
    getDataByURL(getDefualtAddressUrl, function(dataJson){
        if( ! isEmptyValue(dataJson)){
            var string = dataJson.companyName +dataJson.areaName +dataJson.areaAddressName +dataJson.address;
            $("#addressMyinfo").text(string);
        }else{
            var string = "您尚未添加收货地址";
            $("#addressMyinfo").text(string);
        }
    },"companyId="+ myCompanyId);
    if(getCookie(charVec.nicknameCo) != ""){
        $("#nickNameMyinfo").text(getCookie(charVec.nicknameCo));
    }
    if(getCookie(charVec.sexCo) != ""){
        if(getCookie(charVec.sexCo) == 1){
            $("#sexMyinfo").text("男");
        }else{
            $("#sexMyinfo").text("女");
        }
    }
});

$(document).on("panelload", '#myInfoPanel', function (e) {

});
