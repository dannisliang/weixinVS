
var i_load = 1;

function loadindex(){

	if ( i_load == 1){
	    TouchSlide({ slideCell:"#slideNav",titCell:".hd ul",mainCell:".bd ul", effect:"left", autoPage:true,autoPlay:true});
	   
	    TouchSlide({
	        slideCell: "#picScroll",
	        titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
	        autoPage: true, //自动分页
	        pnLoop: "false", // 前后按钮不循环
	        autoPlay:true
	    });
	    i_load = i_load + 1;
	}

};


//history.html
function his_load(){
    loadDocs($("#aboutRf_histry_json"), "aboutRf_histry_json", "company", 213);

};


//企业文化、企业展厅、集团简介
function about_msg(tid){
    loadDocs($("#aboutJJ_json"), "aboutRf_json", "company", tid);
    loadDocs($("#aboutTitle_json"), "getTitle_json", "deeptree", tid);
}


//企业荣誉
function honor_List(){
    loadDocs($("#aboutRf_honor_json"), "aboutRf_honor_json", "company", 215);
}

function honorView(id){
	loadDocs($("#honorView_json"), "honorView_json", "company", id);
}

//newsMenu
function newsMenu_load(){
     loadDocs($(".news_Banner"), "page_Banner", 194);
	loadDocs($("#newsTree_json"), "newsTree_json", "deeptree", 0);
	$(".path ol li:last-child").css("color", "#0081c1");
}


function showNewsList(tid) {
	$("#tidVal").val(tid);
	loadDocs($("#newsList_json"), "newsList_json", "news", tid, 0);
	loadDocs($("#newsTitle_json"), "getTitle_json", "deeptree", tid);
}

function showNewsMore_josn(amun) {
	var tid = $("#tidVal").val();
	  //每次加上多少
	var mval = $("#munVal").val();
	if (mval == "") { mval = 12 };
	var am = (parseInt(mval) + parseInt(amun));
	$("#munVal").val(am);
	loadDocs($("#newsList_json"), "newsList_json", "news", tid, am);
}

//新闻详情
function getNewsInfo_json(nid) {
  //内容
  loadDocs($("#newsInfo"), "newsInfo", "news", nid);
  //标题
  loadDocs($("#newsTitle"), "newsTitle", "news", nid);
  
}



//解决方案详情
function getSoluInfo_json(nid) {
    loadDocs($(".solu_Banner"), "page_Banner", 195);
    //面包屑
    loadDocs($("#soluTitle"), "getTitle_json", "deeptree", nid);
    
	//详细内容
	loadDocs($("#soluCon1_json"), "soluCon_json", "goods", nid, 1);
	loadDocs($("#soluCon2_json"), "soluCon_json", "goods", nid, 2);
	loadDocs($("#soluCon3_json"), "soluCon_json", "goods", nid, 3);
	loadDocs($("#soluCon4_json"), "soluCon_json", "goods", nid, 4);
	
	setTimeout(function() {
		TouchSlide({
			slideCell: "#suloTab",
			titCell: ".hd li",
			mainCell: ".bd",
			autoPaly: true
		});
	}, 500);
}


//case
function case_load() {
    loadDocs($(".case_Banner"), "page_Banner", 196);
	loadDocs($("#caseTree_json"), "caseTree_json", "deeptree", 0);
};

//case
function showCaseList(tid) {
	loadDocs($("#caseList_json"), "caseList_json", "net", tid);
}

 function showCaseCon(nid) {
	loadDocs($("#caseCon_json"), "caseCon_json", "net", nid);
}


//serviceMenu 服务中心目录
function serviceMenu_load() {
    loadDocs($(".form_Banner"), "page_Banner", 198);
    loadDocs($("#serviceTree_json"), "serviceTree_json", "deeptree", 0);
}


//服务中心 列表
function showServiceList(tid) {
    $("#tidVal").val(tid);
    loadDocs($("#serviceList_json"), "serviceList_json", "nserver", tid, 0);
    loadDocs($("#serviceTitle_json"), "getTitle_json", "deeptree", tid);
}

function showNewsMore_josn(amun) {
    var tid = $("#tidVal").val();
    //每次加上多少
    var mval = $("#munVal").val();
    if (mval == "") { mval = 12 };
    var am = (parseInt(mval) + parseInt(amun));
    $("#munVal").val(am);
    loadDocs($("#serviceList_json"), "serviceList_json", "nserver", tid, am);
}

//详情
function getServiceInfo_json(nid) {
    //内容
    loadDocs($("#serviceInfo"), "newsInfo", "nserver", nid);
    //标题
    loadDocs($("#serviceTitle"), "newsTitle", "nserver", nid);
}


function Service_msg(tid) {
    loadDocs($(".form_Banner"), "page_Banner", 198);
    loadDocs($("#serviceView_json"), "aboutRf_json", "nserver", tid);
    loadDocs($("#servTitle_json"), "getTitle_json", "deeptree", tid);
}


//jobs
function jobs_load() {
    loadDocs($(".jobs_Banner"), "page_Banner", 199);
};


//jobsMenu 招聘目录
function jobsMenuClic(tid) {
    loadDocs($(".jobs_Banner"), "page_Banner", 199);
    loadDocs($("#jobsTree_json"), "jobsTree_json", "deeptree", tid);
}


//详细
function showJobsMsg(tid) {
   // $("#tidVal").val(tid);
    loadDocs($("#jobsMsg_json"), "aboutRf_json", "companyMob", tid);
    loadDocs($("#jobsTitle_json"), "getTitle_json", "deeptree", tid);
}

 
//jobList.html  社会招聘
function jobList_load(){
    loadDocs($("#jobs_json"), "jobs_json", "resume", 288);
};

function jobsSearch() {
	   var netv = $("#netVal").val();
	   loadDocs($("#jobs_json"), "jobsSearch_json", "resume",288 ,netv);
}

//jobSch.html 校园招聘
function jobSch_load(){
	loadDocs($("#jobsSch_json"), "jobs_json", "resume", 289);
};

function jobsSearch_sch() {
	var netv = $("#netVal").val();
	loadDocs($("#jobsSch_json"), "jobsSearch_json", "resume", 289, netv);
}

//jobDev.html 职业发展
function jobDev_load(){
	loadDocs($("#deveTree_json"), "deveTree_json", "deeptree", 300);
};

function showDeveCon(tid) {
    loadDocs($("#showDeveCon"), "aboutRf_json", "companyMob", tid);
    loadDocs($("#devTitle_json"), "getTitle_json", "deeptree", tid);
}


//userTree.html  经销商专区
function userTree_load() {
    loadDocs($(".user_Banner"), "page_Banner", 200);
    loadDocs($("#userList"), "userTree_json", "zy", 286);
};

function showUserCon(id) {
    loadDocs($("#userTitle"), "newsTitle", "zy", id);
    loadDocs($("#showUserCon"), "newsInfo", "zy", id);
}


//jobsAct.html 我在日丰
function jobsAct_load(){
    loadDocs($("#actTree_json"), "actTree_json", "deeptree", 309);
};


function showActList(tid) {
    loadDocs($("#actList_json"), "actList_json", "newsMob", tid);
    loadDocs($("#actTitle_json"), "getTitle_json", "deeptree", tid);
};


// 我在日丰 详情
function getActInfo_json(nid) {
    //内容
    loadDocs($("#actInfo"), "newsInfo", "newsMob", nid);
    //标题
    loadDocs($("#actTitle"), "newsTitle", "newsMob", nid);
}


//jobsMon  薪酬福利
function jobsMon_load() {
    loadDocs($("#jobsMon_json"), "aboutRf_json", "companyMob", 303);
}



//日丰产品
function proWarm_load(tid) {
    loadDocs($("#proTree_json"), "proTree_json", "deeptree", tid);
    //banner
    if (tid == 19) {
        loadDocs($(".pro_Banner"), "page_Banner", 191);
    } else if (tid == 20) {
        loadDocs($(".pro_Banner"), "page_Banner", 192);
    } else if (tid == 12) {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    } else {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    }
};

//日丰产品
function showProList(tid, pid) {
    $("#tidVal").val(tid);  //赋值 点击更多用到
    //banner
    if (pid == 19) {
        loadDocs($(".pro_Banner"), "page_Banner", 191);
    } else if (pid == 20) {
        loadDocs($(".pro_Banner"), "page_Banner", 192);
    } else if (pid == 12) {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    }else {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    }
    //List
	loadDocs($("#rfProList_json"), "rfProList_json", "products", tid, 0);
	loadDocs($("#proTreeTitle23_json"), "getTitle_json", "deeptree", tid);
};


//查看更多
function showMore_josn(amun) {
    
	 var tid = $("#tidVal").val();
	 //每次加上多少
	 var mval = $("#munVal").val();
	 if (mval == "") { mval = 12 };
	 var am = (parseInt(mval) + parseInt(amun));
	 $("#munVal").val(am);
	 loadDocs($("#rfProList_json"), "rfProList_json", "products", tid, am);
}
 

//产品详情
function getProInfo_json(nid,tid) {
    //banner
    if (tid == 19) {
        loadDocs($(".pro_Banner"), "page_Banner", 191);
    } else if (tid == 20) {
        loadDocs($(".pro_Banner"), "page_Banner", 192);
    } else if (tid == 12) {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    } else {
        loadDocs($(".pro_Banner"), "page_Banner", 193);
    }
	 //图片
	 loadDocs($(".proViewImg_json"), "proViewImg_json", "products", nid);
	 //标题
	 loadDocs($("#proTitle"), "msgTitle_json", "products", nid);
	 //详细内容
	 loadDocs($("#proCon_json"), "proCon_json", "products", nid, 1);
	 loadDocs($("#proCon2_json"), "proCon_json", "products", nid, 2);
	 loadDocs($("#proCon3_json"), "proCon_json", "products", nid, 3);
	
}

//日丰产品 搜索
function search_load() {
    function proSearch(keyword) {
    loadDocs($("#proSearch_json"), "proSearch_json", "products", keyword);
    }
};


function proCon_load(){
	setTimeout(function(){
		TouchSlide({ slideCell: "#profocus",titCell: ".hd li",mainCell: ".bd ul"});
		TouchSlide({ slideCell: "#proTab",titCell: ".hd li",mainCell: ".bd",autoPaly: true});
	},1000);
}


//networkMenu
function networkMenu_load() {
    loadDocs($(".net_Banner"), "page_Banner", 197);
}
//network
function network_load() {
	loadDocs($("#network_json"), "network_json", "cam", 47);
}

//form
function form_load() {
    loadDocs($(".form_Banner"), "page_Banner", 198);
}

function netSearch() {
    var netv = $("#networkVal").val();
	loadDocs($("#network_json"), "netSearch_json", "cam", netv);
}

//netShop
function netShop_load(){
    loadDocs($("#networkPic"), "networkPic", "applica", 285);
}


function showCustomHtmlSheet() {
    $("#afui").actionsheet(" <a onclick='kxfx()'  target='_blank'>分享到QQ空间</a> <a onclick='xlwb()'  target='_blank'>分享到新浪微博</a> <a onclick='txwb()'  target='_blank'>分享到腾讯微博</a>");
    $("#af_actionsheet .cancel").html("取消");
}
function kxfx() {
    location.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=http%3A%2F%2Flocalhost%2Frf%2F%230-qzone-1-4895-d020d2d2a4e8d1a374a433f596ad1440&title=%E6%97%A5%E4%B8%B0%E6%89%8B%E6%9C%BA%E7%AB%99&desc=&summary=&site=';
				};
function xlwb(){
	location.href='http://service.weibo.com/share/share.php?url=http%3A%2F%2Flocalhost%2Frf%2F%23index%230-tsina-1-22349-397232819ff9a47a7b7e80a40613cfe1&title=%E6%97%A5%E4%B8%B0%E6%89%8B%E6%9C%BA%E7%AB%99&appkey=1343713053';
};
function txwb(){
	location.href='http://s.share.baidu.com/?click=1&url=http%3A%2F%2Flocalhost%2Frf%2F%23index&uid=0&to=tqq&type=text&pic=&title=%E6%97%A5%E4%B8%B0%E6%89%8B%E6%9C%BA%E7%AB%99&key=&desc=&comment=&relateUid=&searchPic=0&sign=on&l=18enai9tn18enaiasv18enamfbq&linkid=hqng3jk2iqu&firstime=1390201306564';
};

function about_Banner_load() {
    loadDocs($(".about_Banner"), "page_Banner",190);
}





