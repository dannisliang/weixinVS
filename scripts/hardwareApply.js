//拍照
showtackpicture = function ()
{
    window.location.href = "#testList";
}

function getPictureFromCamera()
{
    navigator.camera.getPicture(onSuccess, onFail, {quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 288,
        targetHeight: 288
    });
}
function onSuccess(imageData)
{
    var image = document.getElementById("myImage");
    image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message)
{
    alert("fail because" + message);
}

function getPictureFromePhotoLibrary()
{
    navigator.camera.getPicture(onSuccessFromLib, onFail, {
        allowEdit: true,
        quality: 90,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 288,
        targetHeight: 288
    })
}
function onSuccessFromLib(imageURI)
{
    var image = document.getElementById("myImage");
    image.src = imageURI;
}

//定位
function getLocationData()
{
    document.getElementById("locationtitle").innerHTML = "定位中……";
    var p = navigator.platform;

    if (p.indexOf("Win") == 0)
    {
        var position = new Object();
        position.longitude = 112.980365;
        position.latitude = 28.131729;
        var data = "";
        data += "longitude=" + position.longitude;
        data += "&latitude=" + position.latitude;
        getDataByURL(getCompanyByLocation, onGetCompanyByLocation, data);
        return;
    }    
    document.getElementById("r-result").innerHTML = "";
    document.getElementById("geolocation").innerHTML = "";
    navigator.geolocation.getCurrentPosition(onPositonSuccess, onPositonFail, {
        enableHighAccuracy: false,
        timeout: 60 * 1000,
        maximumAge: 1000 * 60 * 10
    });
}
function onPositonSuccess(position)
{
    var latitude = position.coords.latitude;//纬度
    var longitude = position.coords.longitude;//经度
    var altitude = position.coords.altitude;//海拔高度
    var accuracy = position.coords.accuracy;//精确度
    var timestamp = position.coords.timestamp;//时间戳
    console.log("pos " + latitude + " " + longitude + " " + timestamp)
    document.getElementById("geolocation").innerHTML = "坐标信息：纬度:" + latitude + "经度:" + longitude + " ";
    var data = "";
    data += "longitude=" + longitude;
    data += "&latitude=" + latitude;
    getDataByURL(getCompanyByLocation, onGetCompanyByLocation, data);
    // 百度地图API功能
    //var map = new BMap.Map("l-map");
    
    //var mPoint = new BMap.Point(112.979942, 28.131133);
    //map.centerAndZoom(mPoint, 11);
    //console.log("map " + map + " " + mPoint);
    //var options = {
    //    onSearchComplete: onComplete
    //};
    //function onComplete(results)
    //{
    //    console.log("map " + "onSearchComplete");
    //    // 判断状态是否正确
    //    if (local.getStatus() == BMAP_STATUS_SUCCESS)
    //    {
    //        var s = [];
    //        for (var i = 0; i < results.getCurrentNumPois() ; i++)
    //        {
    //            s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
    //        }
    //        console.log("mapghh " + "onSearchComplete" +s);
    //        document.getElementById("r-result").innerHTML = s.join("<br/>");
    //    }
    //}
    //var local = new BMap.LocalSearch(map, options);
    //local.searchNearby('大学', mPoint, 2000);
}
function onPositonFail(error)
{
    document.getElementById("locationtitle").innerHTML = "定位失败!";
}

function watchPositon()
{
    navigator.geolocation.watchPosition(onPositonSuccess, onPositonFail)
}