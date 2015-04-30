// 判断是否为微信
var isWeixin = false;
var userInfoWeixin;
if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger" || $.os.chrome) {
    isWeixin = true;
    userInfoWeixin = new Object();
    charVec.openIDCo = "openIDCo";      // 微信openid
    charVec.nicknameCo = "nicknameCo";      // 微信昵称
    charVec.headimgurlCo = "headimgurlCo";   // 微信图像

    // 获取微信用户URL
    var getUserInfoInitWXUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getUserInfoInitWX";
    // 获取用户Openid
    var getOpenidUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getOpenid";
    // 获取微信用户信息
    var getUserInfoWXUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getUserInfoWX";
    // 微信登陆
    var openIdLoginUrl = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/openIdLogin";;
    // 根据openId绑定手机
    var bindingPhoneByOpenIdUrl = rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/bindingPhoneByOpenId";
}

function getMyInfo() {
    if (isWeixin) {
        var openID = getCookie(charVec.openIDCo);
        if($.os.chrome){
            if(debug)
            {
                openID = null;
            }else{
                openID = "obhaAt0A3xAF6WoY9oJwWDBDLUAY";
            }

            setLocal(charVec.openIDLo, openID);
        }
        //alert(openID);
        var nickname = getCookie(charVec.nicknameCo);
        //alert(nickname);
        if (nickname == "") {
            var access_code = getRequestParas('code');
            if (openID == "") {
                if (access_code == "") {
                    var data = "";
                    data += "url=";
                    // 微信回调网路连接
                    var rootWeixinUrlCal = "http://test.narwell.cn:89/weixin/indexmine.html";
                    data += rootWeixinUrlCal;
                    //alert(data);
                    getDataByURL(getUserInfoInitWXUrl, getUserInfoInitWXUrlSuc, data);
                }
                else {
                    //alert(access_code);
                    getDataByURL(getOpenidUrl, getOpenidUrlSuc, "code=" + access_code);
                }
            } else {
                if (nickname == '' && openID != ''){
                    getDataByURL(getUserInfoWXUrl, getUserInfoWXUrlSuc, "openid=" + openID);
                }
            }

            function getUserInfoInitWXUrlSuc(dataJson) {
                //alert(dataJson.url);
                window.location = dataJson.url;
            }

            function getOpenidUrlSuc(dataJson){
                userInfoWeixin.openid = dataJson.openid;
                //alert( userInfoWeixin.openid);
                addCookie(charVec.openIDCo, userInfoWeixin.openid, 3);
                setLocal(charVec.openIDLo, userInfoWeixin.openid);
                getMyInfo();
            }

            function getUserInfoWXUrlSuc(dataJson) {
                userInfoWeixin.nickname = dataJson.nickname;
                userInfoWeixin.sex = dataJson.sex;
                userInfoWeixin.city = dataJson.city;
                userInfoWeixin.province = dataJson.province;
                userInfoWeixin.headimgurl = dataJson.headimgurl;
                addCookie(charVec.nicknameCo, userInfoWeixin.nickname, 1);
                addCookie(charVec.headimgurlCo, userInfoWeixin.headimgurl, 1);
                loginClicked();
            }
        }else{
            //alert("exist");
            loginClicked();
        }
    }
}