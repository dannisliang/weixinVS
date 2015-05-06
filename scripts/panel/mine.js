$(document).on("panelbeforeload", '#minePanel', function (e) {
    getMyInfo();
    loginClicked();
});

$(document).on("panelload", '#minePanel', function (e) {
    if(getLocal(charVec.buyerIdLo) != ""){
        var data = "buyerId=" + getLocal(charVec.buyerIdLo);
        getDataByURL(getCurrentPoints, function(dataJson){
            $("#integralMine").text(dataJson);
        }, data);
    }
});

function gotoPanel(stringPanel){
    $.afui.loadContent("#" +stringPanel, false, false, transitionYC);
}

function changeMine(){
    if(isWeixin || $.os.chrome){
        $("#mine .top .headimg img").attr("src", getCookie(charVec.headimgurlCo));
        $("#noLoginMine").hide();
        $("#weininNickname").text("微信账号：" +getCookie(charVec.nicknameCo));
        //$("#bindingPhoneBtnMine").show();
        if(userInfo.phone == null){
            //$("#phoneMine").text("15111303450");
        }else{
            $("#phoneMine").text("15111303450");
            $("#bindingPhoneBtnMine").hide();
        }
    }
}

function bindingPhoneMineClicked(){
    setSession(charVec.bindingPhoneCo, true);
    $.afui.loadContent("#regPanel", false, false, transitionYC);
}

