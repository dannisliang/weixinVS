$(document).on("panelbeforeload", '#regPanel', function (e) {
    $("#messHit").hide();
    if(getSession(charVec.bindingPhoneCo)){
        $("#headReg h1").text("绑定手机号");
        $("#regNowBtn").text("立即绑定");
        $("#hintLoginReg").hide();
        setSession(charVec.bindingPhoneCo, false);
        chooseSelectReg = 1;
    }else if(getSession(charVec.bGetPasswordCo)){
        $("#headReg h1").text("取回密码");
        $("#regNowBtn").text("取回密码");
        $("#hintLoginReg").hide();
        setSession(charVec.bGetPasswordCo, false);
        chooseSelectReg = 2;
    }
    else
    {
        $("#headReg h1").text("注册");
        $("#regNowBtn").text("立即注册");
        $("#hintLoginReg").show();
        chooseSelectReg = 0;
    }
});

var chooseSelectReg = 0;   // 0 为注册，1为绑定手机，2为取回密码

function getcodeRegClicked() {
    var number = $("#phoneNumberReg").get(0).value;
    if (number.length != 11) {
        showGlobalMessageDialog("请输入正确的手机号码！！！");
        return;
    } else {
        switch (chooseSelectReg){
            case 0:
                var data = "mobile=" +$("#phoneNumberReg").get(0).value;
                data += "&codeCase=注册";
                getDataByURL(getVerifyCodeUrl, codeSuccess, data);
                break;
            case 1:
                getDataByURL(getVerifyCodeUrl, codeSuccess, data);
                break;
            case 2:
                var data = "contactPhone=" +$("#phoneNumberReg").get(0).value;
                getDataByURL(resetPasswordStep1, codeSuccess, data);
                break;
        }
    }
}

function codeSuccess(dataJson) {
    $("#messHit").text("已经向" + $("#phoneNumberReg").get(0).value + "的手机发送了验证码，如果没有收到验证码请在1分钟后重新获取。");
    $("#messHit").show();
    showCountTime($("#getcodeReg"));
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
    switch (chooseSelectReg){
        case 0:
            data += "password=" + $("#passwordReg").get(0).value;
            data += "&phone=" + $("#phoneNumberReg").get(0).value;
            data += "&code=" + $("#codeReg").get(0).value;
            data += "&referrer=";
            getDataByURL(registerUrl, regSuccess, data);
            break;
        case 1:
            if(isWeixin || $.os.chrome){
                data += "password=" + $("#passwordReg").get(0).value;
                data += "&phone=" + $("#phoneNumberReg").get(0).value;
                data += "&code=" + $("#codeReg").get(0).value;
                data += "&referrer=";
                data += "&openId=" +getLocal(charVec.openIDLo);
                getDataByURL(bindingPhoneByOpenIdUrl, regSuccess, data);
            }
            break;
        case 2:
            data += "password=" + $.md5($("#passwordReg").get(0).value);
            data += "&contactPhone=" + $("#phoneNumberReg").get(0).value;
            data += "&smsCode=" + $("#codeReg").get(0).value;
            getDataByURL(resetPasswordStep2, regSuccess, data);
            break;
    }
}

function regSuccess(dataJson) {
    switch (chooseSelectReg){
        case 0:
            break;
        case 1:
            setSession(charVec.bindingPhoneCo, true);
            // Todo
            setLocal(charVec.buyerIdLo, dataJson);
            break;
        case 2:
            setSession(charVec.bGetPasswordCo, true);
            break;
    }
    $.afui.loadContent("#regSucPanel", false, false, transitionYC);
}
