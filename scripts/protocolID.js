//发布地址 http://server.1calljifa.com:82
//本地地址 http://192.168.2.2:8080
//var rootUrl = "http://server.1calljifa.com:86";
//var rootUrl = "http://o.narwell.com/yicalljifa";
//var rootUrl = "http://o.narwell.com:8085";
//var rootUrl = "http://o.narwell.com:8888";
var rootUrl = myURL;

//登录
var loginUrl = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/login";
//获取首页滚动图
var pageSettingUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getPageSetting";
//左边的分类
var getCategoryByLeftUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getCategoryByLeft";
//右边的分类
var getCategoryByRightUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getCategoryByRight";
//根据分类查询商品
var getGoodListUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getCategoryGoodsByCondition";
//根据商品ids获取商品的详细信息
var getGoodsByIdUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getGoodsByGoodsIds";
//获取商品详情
var getGoodUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getGoodsById";
//获得文件
var getImageUrl;
//商品详情的展示页
var getGoodsDescriptUrl;
if(debug) {
    getImageUrl = "http://server.1calljifa.com:86" + "/service/rest/tk.File/";
    getGoodsDescriptUrl = "http://server.1calljifa.com:86" + "/emall/goodsDescript.jsp";
}
else{
    getImageUrl = rootUrl + "/service/rest/tk.File/";
    getGoodsDescriptUrl = rootUrl + "/emall/goodsDescript.jsp";
}
//首页焦点图栏位ID
//var buyerHomeID = "c9c488db1f594a92aff54ec356c4d3c7";
//获取收货地址
var getAddressUrl =  rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/getDeliveryAddressV2";
//删除收货地址
var deleteAddressUrl =  rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/delDeliveryAddress";
//获取默认收货地址
var  getDefualtAddressUrl    =   rootUrl +   "/service/rest/emallapp.login.order.buyerService/collection/getDefaultaddressV2";
//新增收货地址
var addAddressUrl =  rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/addAddress";
//修改收货地址
var setAddressUrl = rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/setAddressById";
//获取收藏列表
var getCollectionUrl = rootUrl + "/service/rest/emallapp.login.member.collectionService/collection/getPagination";
//加入收藏列表
var addCollectionUrl = rootUrl + "/service/rest/emallapp.login.member.collectionService/collection/addCollection";
//取消收藏
var  delCollectionUrl = rootUrl + "/service/rest/emallapp.login.member.collectionService/collection/delCollectionByIds";
var  delCollectionByGoodsIds = rootUrl + "/service/rest/emallapp.login.member.collectionService/collection/delCollectionByGoodsIds";
//获取购物车列表
var getCartListUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/getShopCart";
//删除购物车商品
var delCartListUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/delShopCartByIds";
//清空购物车
var clearCartUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/delShopCart";
//新增商品到购物车
var addCartListUrl=rootUrl + "/service/rest/emallapp.login.order.orderService/collection/addShopCart";
//注册
var registerUrl = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/register";
//修改密码
var updatePasswordUrl = rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/setPassWord";
//注销
var loginOutUrl = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/logout";
//获取注册手机号
var getDefaultPhoneUrl = rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/getDefaultPhone";
// 修改购物车
var updateCartUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/updateShopCart";
//获取起送价
var getSendPriceUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/getSendUpPrices";
//提交订单
var postOrdelUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/createOrder";
//得到不同订单下的订单数量
var getOrderCounts = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/getOrderCounts";
//订单分页查询
var getOrderUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/getPagingOrder";
//获取评论
var getCommentUrl = rootUrl  + "/service/rest/emallapp.login.order.orderService/collection/getOrderComment";
//提交评论
var createCommentUrl = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/createOrderComment";
//获取高校列表
var getSchoolListUrl = rootUrl + "/service/rest/emallapp.nologin.logistic.logisticService/collection/getCompany";
//获取区域列表
var getAreaListUrl = rootUrl + "/service/rest/emallapp.nologin.logistic.logisticService/collection/getAreaByCompanyId";
//获取建筑列表
var getAreaAddressUrl  = rootUrl + "/service/rest/emallapp.nologin.logistic.logisticService/collection/getAreaAddressByAreaId";
//搜索
var searchGoodUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/searchKeyword";
//提交验证码
var  getVerifyCodeUrl    =   rootUrl +"/service/rest/emallapp.nologin.member.buyerService/collection/sendVerifyCode";
//获取快速下单表
var  getQuickBuyUrl  =   rootUrl + "/service/rest/emallapp.login.order.orderService/collection/listRecentOrderGoods";
//找回密码步骤1
var  resetPasswordStep1    =   rootUrl +"/service/rest/emallapp.nologin.member.buyerService/collection/resetPasswordStep1";
//找回密码步骤1
var resetPasswordStep2 = rootUrl + "/service/rest/emallapp.nologin.member.buyerService/collection/resetPasswordStep2";
//获取定位学校列表
var getCompanyByLocation = rootUrl + "/service/rest/emallapp.nologin.logistic.logisticService/collection/getCompanyByLocation";
//根据分类获得分类属性及三级属性
var getCategoryPropertiesUrl = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getCategoryProperties";
//本地购物车上传到服务器
var  addShopCartByGoodsIds  =   rootUrl + "/service/rest/emallapp.login.order.orderService/collection/addShopCartByGoodsIds";
//得到筛选区的分类参数
var getNextCategoryUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getNextCategory";
//得到筛选区的标签参数
var getTagUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getTag";
//根据筛选区过滤商品
var getCategoryGoodsByConditionUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getCategoryGoodsByCondition";
//得到特惠专区商品列表接口
var getSpecialOfferUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getSpecialOffer";
//得到特惠专区的商品分类
var getSpecialOfferCategoryUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getSpecialOfferCategory";
//根据非末级分类获得商品
var getGoodsByNonLastCategoryUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getGoodsByNonLastCategory";
//特惠专区根据分类得到商品
var getSpecialOfferGoodsByCategoryIdUrl =  rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getSpecialOfferGoodsByCategoryId";
//提交订单v2
var postOrdelV2Url = rootUrl + "/service/rest/emallapp.login.order.orderService/collection/createOrderForV2";
//得到同一品名的商品
var getVarietyGoods = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getVarietyGoods";
//得到后台设置的热门关键字
var getHotKeywordUrl = rootUrl+ "/service/rest/emallapp.nologin.goods.goodsService/collection/getHotKeyword";
//根据收货地址获取购物车信息
var getGoodsInfoByAreaAddressId = rootUrl + "/service/rest/emallapp.nologin.goods.goodsService/collection/getGoodsInfoByAreaAddressId";
//获取买家积分
var getCurrentPoints = rootUrl + "/service/rest/emallapp.login.order.buyerService/collection/getCurrentPoints";
