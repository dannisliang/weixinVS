$(document).on("panelbeforeload", '#suggestionPanel', function (e) {
    submitClickedSuggestion = function(){
        if($("#textareaSuggestion").get(0).value == ""){
            showGlobalMessageDialog("请填写您的反馈内容……");
            return;
        }
        if($("#phoneSuggestion").get(0).value == ""){
            showGlobalMessageDialog("请填写您的联系方式……");
            return;
        }
        var data = "content=" +$("#textareaSuggestion").get(0).value;
        data += "&buyerId=" +getLocal(charVec.buyerIdLo);
        data += "&phoneNumber=" +getLocal(charVec.phoneNumberLo);
        getDataByURL(submitSuggestUrl, function(dataJson){
            if(dataJson == 0){
                showGlobalMessageDialog("反馈成功，我们团队会尽快处理您的宝贵意见");
            }
        }, data);
    }
    if(getLocal(charVec.phoneNumberLo) != ""){
        $("#phoneSuggestion").get(0).value = getLocal(charVec.phoneNumberLo);
    }
});

$(document).on("panelload", '#suggestionPanel', function (e) {

});
