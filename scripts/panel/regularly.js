$(document).on("panelbeforeload", '#regularlyPanel', function (e) {
    tabRegular = function(Nav,Num){
        if(Nav.className=="active")return;
        var thisNav=Nav.parentNode.id;
        var navName=Nav.nodeName.toLowerCase();
        var navList=document.getElementById(thisNav).getElementsByTagName(navName);
        for(var i=0;i<navList.length;i++){
            if(i==Num){
                Nav.className="active";
                document.getElementById("cont"+i).style.display="block";
            }else{
                navList[i].className="";
                document.getElementById("cont"+i).style.display="none";
            }
        }
    }

    regularlyListInit = function (){
        $("#pro-sort .sort-left").hide();
        $("#pro-sort .sort-pro-list .topad img").hide();
        $("#pro-sort .sort-pro-list .list-mod").hide();
        $("#pro-sort .sort-pro-list .sorts").hide();
        $("#pro-sort .sort-pro-list").css({"width":"100%", "margin-left":0});
        $("#pro-sort .sort-pro-list").css({
            "height": (deviceHeight - (parseInt($(".view header").computedStyle("height"), 10))
            - parseInt($(".view footer").computedStyle("height"), 10)) - isIOSTop() + "px",
        });
    }

    getCollectionUrlSuccess = function(dataJson){
        bRefreshProlist = true;
        $("#goodsList").show();
        getGoodListUrlSuccess(dataJson);
    }
});

$(document).on("panelload", '#regularlyPanel', function (e) {
    regularlyListInit();
    goods.page = 1;
    var data = "page=" +goods.page;
    data += "&rows=" +goods.rows;
    getDataByURL(getCollectionUrl, getCollectionUrlSuccess, data);
});

