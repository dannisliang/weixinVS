// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    $(document).ready(onDeviceReady);

    function onDeviceReady() {
        initCommon();
        if ($.os.android) {
            initAndroid();
        } else if ($.os.iphone) {
            initIphone();
        } else if (isWeixin) {
            initWeixin();
        }
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function initCommon() {
        var $el = $(document.body);
        $el.removeClass("ios ios7 win8 tizen bb android light dark firefox");
        $el.addClass("yicallTheme");

        setSession(charVec.bSearchFocusSe, true);
        // 版本检测
        if( ! isWeixin){
            var bIgnoreUpdata = getLocal(charVec.bIgnoreUpdataLo)==="true" || false;  // 是否忽略更新
            var lastestVersion = "0.0.5";
            var subVersion = getNumFromChar(lastestVersion) - getNumFromChar(versionYC);
            if (versionYC < lastestVersion) {
                if (subVersion > 10) {
                    updateFunc();
                } else if( ! bIgnoreUpdata){
                    $.afui.popup({
                        title: "版本更新",
                        message: "有新版本啦，赶快更新吧。。。",
                        cancelText: "忽略",
                        cancelCallback: function () {
                            setLocal(charVec.bIgnoreUpdataLo, true);
                            alert("ignore");
                        },
                        doneText: "更新",
                        doneCallback: function () {
                            updateFunc();
                        },
                        cancelOnly: false
                    });
                }
            }
        }

        // 购物车数量操作
        selectSumSql(orderTable, "count", [], [], function (rows) {
            var numGoods;
            for (var key in rows.item(0))
            {
                numGoods = rows.item(0)[key];
                setLocal(charVec.numGoodsCartLo, numGoods);
                $("#afbadgeCart").text(numGoods);
            }
            if( numGoods == null ){
                $("#afbadgeCart").hide();
            }
            $("#afbadgeCart").css("right", $("i.yicall-icon.icon-cart").position().left -deviceWidth*0.42);
        });

        // 自动登陆
        if(debug)
        {
            var phone = testPhone;
            var password = testPasswrod;
        }
        var openID = getLocal(charVec.openIDLo);
        if(phone != "" && password != ""){
            loginClicked(phone, password);
        }else if(openID != ""){
            loginClicked();
        }

        initUrlTime();
    }

    function initAndroid() {
        alert("android");
    }

    function initIphone() {
        $(".yicallTheme .view header").css({
            "margin-top": "20px"
        });
        $(".yicallHeader").css({
            "margin-top": "20px"
        })
    }

    function initWeixin() {
    }
})();