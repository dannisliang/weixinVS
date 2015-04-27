//全局数据
var prolistLeftID = new Array();
var prolistPropertiesID = new Array();
var sortRightID = new Array();
var sortPicID = new Array();
var goodsByConditionID;
var goodsPageImg = new Array();  // 商品图片Id
// 商品数量
var numGoods = 0;
var versionYC = "0.0.1";
var transitionYC="invoke";    // 页面切换动作

// 屏幕适配
var deviceWidth = $(window).width();
var deviceHeight = $(window).height();

var goods = new Object();
goods.companyId = "7411bcb2c9c34675ab02043920d2fb8e";   // 学校ID
goods.categoryId = "066900dcbea745b5b36a276d55ba59c8";  // 商品Id
goods.rows = "10";  // 每页显示多少个
goods.sort = "salePrice";   // 选择按价格排序还是销量排序 saleCount
goods.order = "asc";    // 升序还是  desc降序
goods.page = 1    // 显示第几页

var currentInfoID;

// 方便函数调用参数把字符串写入变量Se代表session，Lo代表local
var charVec = new Object();
charVec.bSearchFocusSe = "bSearchFocus";  //搜索框获取焦点
charVec.tittleProductSe = "tittleProduct";    //商品详情标题
charVec.bIgnoreUpdataLo = "bIgnoreUpdata";      // 忽略更新
charVec.phoneNumberLo = "phoneNumberLo";      // 用户手机号
charVec.passwordLo = "passwordLo";      // 用户密码
charVec.userInfoLo = "userInfoLo";      // 用户密码
charVec.headimgurlLo = "headimgurlLo";  // 用户图像
charVec.openIDLo = "openIDLo";      // 微信openid Lo
charVec.bindingPhoneCo = "bindingPhoneCo";      // 是否为绑定手机
charVec.numGoodsCartLo = "numGoodsCartLo";      // 购物车商品数量
charVec.goodHeadTittleSe = "goodHeadTittleSe";      // 商品详细页标题

var textVec = new Object();
textVec.prolistFirst = "特惠专区";
textVec.prolistLast = "最近浏览";

//首页数据
var mainPageData = new Array();

//获取所有学校列表
var schoolData = new Array();
//定位获得学校数据
var locationSchoolData = new Array();

// 用户信息
var userInfo = new Object();
//用户选择地址
var userChooseAddress;
//默认收货地址
var defaulAddressData = new Object();
//收货地址列表
var addressData = new Array();
//购物车商品列表
var carGoodsList = new Array();
//买家下单前选中的商品
var buyChooseList = new Array();