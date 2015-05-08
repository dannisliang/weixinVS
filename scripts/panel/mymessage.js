$(document).on("panelbeforeload", '#mymessagePanel', function (e) {
    selectAllClicked = function(){
        var bSelectAll = $("#selectAllMes").get(0).checked;
        for(var i = 0;;i++){
            if($("#singleMes" +i).length > 0){
                $("#singleMes" +i).get(0).checked = bSelectAll;
            }else{
                break;
            }
        }
    }

    delSelectMes = function(){
        for(var i = 0;;i++){
            if($("#singleMes" +i).length > 0){
                if($("#singleMes" +i).get(0).checked){
                    $("#singleMes" +i).parent().remove();
                }
            }else{
                break;
            }
        }
    }
});

$(document).on("panelload", '#mymessagePanel', function (e) {
    //$("#selectAllMes").attr("checked", true);

});
