function getNumByWith(numMiddle) {
    if (deviceWidth < 300) {
        numMiddle--;
    } else if (300 <= deviceWidth && deviceWidth < 400) {
        numMiddle;
    } else {
        numMiddle++;
    }
    return numMiddle;
}

function getNumByHeight() {
    if (deviceWidth < 500) {
        return 0.8;
    } else if (500 <= deviceWidth && deviceWidth < 600) {
        return 1;
    } else {
        return 1.2;
    }
}

// A button will call this function
//
function capturePhoto() {
    sessionStorage.removeItem('imagepath');
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
}

function onPhotoDataSuccess(imageURI) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);

    // Get image handle
    //
    movePic(imageURI);
}

// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
}

function movePic(file) {
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry) {
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "MyAppFolder";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
        //The folder is created if doesn't exist
        fileSys.root.getDirectory(myFolderApp,
                        { create: true, exclusive: false },
                        function (directory) {
                            entry.moveTo(directory, newFileName, successMove, resOnError);
                        },
                        resOnError);
    },
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
    sessionStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) {
    alert(error.code);
}

function downloadPic(url)
{
    var fileTransfer = new FileTransfer();
    var filePath = "pic";
    alert(filePath);
    var uri = encodeURI(url);

    fileTransfer.download(
        uri,
        filePath,
        function (entry) {
            console.log("download complete: " + entry.fullPath);
            alert(entry.fullPath);
            alert("successs");
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
            alert("fail");
        },
        false,
        {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
}

function downloadFile(URL, File_Name, id) {

    var Folder_Name = cordova.file.cacheDirectory + "pic";
    alert(Folder_Name);
    //Parameters mismatch check
    if (URL == null && Folder_Name == null && File_Name == null) {
        return;
    }
    else {
        //checking Internet connection availablity
        var networkState = navigator.connection.type;
        if (networkState == Connection.NONE) {
            return;
        } else {
            download(URL, Folder_Name, File_Name, id); //If available download function call
        }
    }
}

function download(URL, Folder_Name, File_Name, id) {
    //step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = encodeURI(URL);
        ext = download_link.substr(download_link.lastIndexOf('.') + 1); 
        fp = Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp, File_Name, id);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        alert("Unable to create new directory: " + error.code);
    }

    function fileSystemFail(evt) {
        //Unable to access file system
        alert(evt.target.error.code);
    }
}

function filetransfer(download_link, fp, File_Name, id) {
    var fileTransfer = new FileTransfer();
    if (id === "apk") {
        fileTransfer.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
                var percentLoaded = Math.round(100 * (progressEvent.loaded / progressEvent.total));
                var progressbarWidth = percentLoaded + "%";
                $.afui.showMask("正在下载" + progressbarWidth);
                if (progressbarWidth = 100) {
                    //设置延时
                    setTimeout("$.afui.hideMask()", 3000);
                }
            } else {
                loadingStatus.increment();
            }
        };
    }
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function (entry) {
            alert("download complete: " + entry.fullPath);
            window.localStorage.setItem(id, File_Name);
        },
        function (error) {
            //Download abort errors or download failed errors
            alert("download error source " + error.source);
        }
    );
}

function Dictionary() {
    this.data = new Array();

    this.set = function (key, value) {
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.getBySet = function (key, time) {
        if (time != null) {
            return time;
        }
        else {
            return this.data[key];
        }
    };

    this.remove = function (key) {
        this.data[key] = null;
    };

    this.isEmpty = function () {
        return this.data.length == 0;
    };

    this.size = function () {
        return this.data.length;
    };
}

function isIOSTop() {
    if ($.os.ios7) {
        return 20;
    } else {
        return 0;
    }
}

(function () {
    getSession = function (key) {
        var data = window.sessionStorage.getItem(key);
        if(data == null){
            return "";
        }
        else{
            return data;
        }
    };

    setSession = function (key, value) {
        window.sessionStorage.setItem(key, value);
    };

    getLocal = function (key) {
        var data = window.localStorage.getItem(key);
        if(data == null){
            return "";
        }
        else{
            return data;
        }
    };

    setLocal = function (key, value) {
        window.localStorage.setItem(key, value);
    };

    swipeLeftChange = function(panel) {
        $(panel).bind("swipeLeft", function () {
            $(panel).unbind("swipeLeft");
            $.afui.goBack();
        });
    }

    // 时间为小时单位
    addCookie = function (name, value, expiresHours) {
        var cookieString = name + "=" + escape(value);
        //判断是否设置过期时间 
        if (expiresHours > 0) {
            var date = new Date();
            date.setTime(date.getTime + expiresHours * 3600 * 1000);
            cookieString = cookieString + "; expires=" + date.toGMTString();
        }
        document.cookie = cookieString;
    }

    getCookie = function (name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name){
                return unescape(arr[1]);
            }
        }
        return "";
    }

    deleteCookie = function (name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=v; expires=" + date.toGMTString();
    }
})();

function getNumFromChar(text) {
    return text.replace(/[^0-9]/ig, "");
}

function updateFunc() {
    if ($.os.android) {
        downloadFile("http://server.1calljifa.com:86/public/yicalljifa_v1.0.5.apk", "yicall.apk", "apk");
    } else if ($.os.iphone) {

    }
}

function showWaitingDialog(text) {
    if (text == null) {
        text = "正在加载中。。。";
    }
    $.afui.showMask(text);
    $.afui.blockUI(.1);
}

function hideWaitingDialog() {
    $.afui.hideMask();
    $.unblockUI();
}

function showGlobalMessageDialog(text) {
    $("#globalMessageHint").attr("data-message", text);
    $("#globalMessageHint").click();
    $(".afToastContainer.bc").find("div").each(function(index,elm){
        if(index != 0 && index != 1){
            $(elm).remove();
        }
    })
}

var subCountReg;
function showCountTime(label) {
    subCount = function () {
        if (reGetCode > 0) {
            label.text("重新获取(" + reGetCode-- + "秒)");
        } else {
            reGetCode = 60;
            label.text("获取验证码");
            label.removeAttr("disabled");
            clearInterval(subCountReg);
        }
    }
    var reGetCode = 60;
    label.attr({ "disabled": "disabled" });
    subCountReg = setInterval("subCount()", 1000);
}

function getRequestParas(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}