$(document).on("panelbeforeload", '#regSucPanel', function (e) {
    if(getSession(charVec.bindingPhoneCo)){
        $("#regSuccess .complete").text("绑定成功");
        $("#regSucHead h1").text("绑定手机号");
        setSession(charVec.bindingPhoneCo, false);
    }else if(getSession(charVec.bGetPasswordCo)){
        $("#regSucHead h1").text("取回密码成功");
        $("#regSuccess .complete").text("取回密码成功");
        setSession(charVec.bGetPasswordCo, false);
    }
    else
    {
        $("#regSucHead h1").text("注册成功");
        $("#regSuccess .complete").text("注册成功");
    }
});