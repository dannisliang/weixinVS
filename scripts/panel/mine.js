$(document).on("panelbeforeload", '#minePanel', function (e) {
    getMyInfo();
});

$(document).on("panelload", '#minePanel', function (e) {
    gotoMymessageClicked = function(){
        $.afui.loadContent("#mymessagePanel", false, false, transitionYC);
    }
});

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

