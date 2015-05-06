$(document).on("panelbeforeload", '#myOrderPanel', function (e) {
    getLocal(charVec.phoneNumberLo);
    getDataByURL(getOrderUrl, function(dataJson){

    }, "page=1");
});

$(document).on("panelload", '#myOrderPanel', function (e) {

});
