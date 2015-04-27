
//var docsUrl = "http://" + window.location.host + "/json.aspx";
var docsUrl = "http://www.rifeng.com.cn/json.aspx";

function loadDocs($pageName, funName, str1, str2, str3, str4) {

    //$pageName.empty().css3Animate({ time: "300ms", opacity: 0 });
    //$.afui.showMask("正在加载中...");

//    if (typeof id === 'undefined') {
//        id = 0;
//    }

    $.jsonP({
    url: docsUrl + "?callback=?&fname=" + funName + "&str1=" + str1 + "&str2=" + str2 + "&str3=" + str3+ "&str4=" + str4,
        success: function(json) { showDocs(json, $pageName) },
        error: function(err) { console.log(err) }
    });

}

function showDocs(json, $pageName) {
    //debugger;
    var obj;
    //对json数据做一些处理之后，赋给obj
    obj = unescape(json.data);
   // alert(obj)
    $pageName.html(obj).css3Animate({ time: "500ms", opacity: 1 });
    $.afui.hideMask();
}





