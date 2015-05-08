function showLoginPanel() {
    $.afui.loadContent("#loginPanel", false, false, transitionYC);
    $("#phoneNumber2").css({
        "maxLength": "11"
    })
}

var bLoginPanel = false;
function loginClicked(phone, password) {
    var data = "";
    if (phone == null &&  getLocal(charVec.openIDLo) == "") {
        bLoginPanel = true;
        if ($("#phoneNumber2").get(0).value == "") {
            showGlobalMessageDialog("手机号不能为空");
            return;
        }
        if ($("#passWord2").get(0).value == "") {
            showGlobalMessageDialog("密码不能为空");
            return;
        }
        data += "phone=" + $("#phoneNumber2").get(0).value;
        data += "&loginPass=" + $("#passWord2").get(0).value;
    } else if(phone == null && getLocal(charVec.openIDLo) != "") {
        bLoginPanel = false;
        getDataByURL(openIdLoginUrl, onLoginSuccess, "openId=" +getLocal(charVec.openIDLo));
        return;
    }else{
        bLoginPanel = false;
        data += "phone=" + phone;
        data += "&loginPass=" + password;
    }
    getDataByURL(loginUrl, onLoginSuccess, data);
}

function onLoginSuccess(dataJson) {
    userInfo.address = dataJson.address;
    userInfo.birthDay = dataJson.birthDay;
    userInfo.birthMonth = dataJson.birthMonth;
    userInfo.buyerType = dataJson.buyerType;
    userInfo.city = dataJson.city;
    userInfo.openId = dataJson.openId;
    userInfo.contactPhone = dataJson.contactPhone;
    userInfo.country = dataJson.country;
    userInfo.email = dataJson.email;
    userInfo.firstName = dataJson.firstName;
    userInfo.freezeReason = dataJson.freezeReason;
    userInfo.gender = dataJson.gender;
    userInfo.id = dataJson.id;
    userInfo.lastName = dataJson.lastName;
    userInfo.loginName = dataJson.loginName;
    userInfo.loginPass = dataJson.loginPass;
    userInfo.name = dataJson.name;
    userInfo.points = dataJson.points;
    userInfo.referrer = dataJson.referrer;
    userInfo.registerDate = new Object();
    userInfo.registerDate.date = dataJson.registerDate.date;
    userInfo.registerDate.day = dataJson.registerDate.day;
    userInfo.registerDate.hours = dataJson.registerDate.hours;
    userInfo.registerDate.minutes = dataJson.registerDate.minutes;
    userInfo.registerDate.month = dataJson.registerDate.month;
    userInfo.registerDate.nanos = dataJson.registerDate.nanos;
    userInfo.registerDate.seconds = dataJson.registerDate.seconds;
    userInfo.registerDate.time = dataJson.registerDate.time;
    userInfo.registerDate.timezoneOffset = dataJson.registerDate.timezoneOffset;
    userInfo.registerDate.year = dataJson.registerDate.year;
    userInfo.shopTimes = dataJson.shopTimes;
    userInfo.state = dataJson.state;
    userInfo.status = dataJson.status;
    userInfo.verifyCode = dataJson.verifyCode;
    if (bLoginPanel) {
        setLocal(charVec.phoneNumberLo, $("#phoneNumber2").get(0).value);
        setLocal(charVec.passwordLo, $("#passWord2").get(0).value);
        bLoginPanel = false;
    }else{
        setLocal(charVec.phoneNumberLo, userInfo.contactPhone);
        setLocal(charVec.openIDLo, userInfo.openId);
        setLocal(charVec.buyerIdLo, userInfo.id);
    }
    changeMine();
}