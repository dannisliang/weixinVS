$(document).on("panelbeforeload", '#regPanel', function (e) {
    $("#messHit").hide();
    if(getSession(charVec.bindingPhoneCo)){
        $("#headReg h1").text("绑定手机号");
        $("#regNowBtn").text("立即绑定");
        $("#hintLoginReg").hide();
        setSession(charVec.bindingPhoneCo, false);
    }else{
        $("#headReg h1").text("注册");
        $("#regNowBtn").text("立即注册");
        $("#hintLoginReg").show();
    }
});

function getcodeRegClicked() {
    var number = $("#phoneNumberReg").get(0).value;
    if (number.length != 11) {
        showGlobalMessageDialog("请输入正确的手机号码！！！");
        return;
    } else {
        $("#messHit").text("已经向" + $("#phoneNumberReg").get(0).value + "的手机发送了验证码，如果没有收到验证码请在1分钟后重新获取。");
        $("#messHit").show();
        showCountTime($("#getcodeReg"));
        var data = "mobile=" +$("#phoneNumberReg").get(0).value;
        data += "&codeCase=注册";
        getDataByURL(getVerifyCodeUrl, codeSuccess, data);
    }
}

function codeSuccess(dataJson) {

}

function regNow() {
    if ($("#phoneNumberReg").get(0).value.length != 11) {
        showGlobalMessageDialog("请输入正确的手机号码！！！");
        return;
    }
    if ($("#codeReg").get(0).value.length == "") {
        showGlobalMessageDialog("请输入验证码！！！");
        return;
    }
    if ($("#passwordReg").get(0).value == "" || $("#passwordReg").get(0).value != $("#passwordRegConfirm").get(0).value) {
        showGlobalMessageDialog("输入的密码为空或不相符！！！");
        return;
    }
    var data = "";
    data += "password=" + $("#passwordReg").get(0).value;
    data += "&phone=" + $("#phoneNumberReg").get(0).value;
    data += "&code=" + $("#codeReg").get(0).value;
    data += "&referrer=";
    if(isWeixin || $.os.chrome){
        data += "&openId=" +getLocal(charVec.openIDLo);
        getDataByURL(bindingPhoneByOpenIdUrl, regSuccess, data);
    }else{
        getDataByURL(registerUrl, regSuccess, data);
    }
}

function regSuccess(dataJson) {
    $.afui.loadContent("#regSucPanel", false, false, transitionYC);
}
