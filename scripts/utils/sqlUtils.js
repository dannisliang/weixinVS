/** 
*数据库操作辅助类,定义对象、数据操作方法都在这里定义 
*/
var dbname = 'yicalldb';
var version = '1.0';
var dbdesc = 'YCDB';

var tableAttr = 'tableAttr',
    tableUrl = 'tableUrl',
    orderTable = "orderTable";

var dbsize = 30000;
var db = null;

var pictureFields = [
   'id',
   'picName',
   'text',
   'clickCount',
   'isDefault',
]

var urlFields = [
   'url',
   'data',
   'time',
]
var urlOrder = [
    'id',
    'count',
]
/** 
 * 打开数据库 
 * @returns {Boolean} 
 */
function openDB(callback) {
    try {
        if (!window.openDatabase) {
            console.log('该浏览器不支持数据库');
            return false;
        }
        db = window.openDatabase(dbname, version, dbdesc, dbsize);
        initDB();
        return true;
    } catch (e) {
        if (e == 2) {
            console.log("数据库版本无效");
        } else {
            console.log("未知错误 " + e + ".");
        }
        return false;
    }
}

/** 
 * 执行一段sql 
 * @param sql 
 */
function execSql(sql, param, callback) {
    if (db == null) { openDB(); }
    db.transaction(function (tx) {
        tx.executeSql(sql, param, function (tx, result) {
            if (typeof (callback) == 'function') { callback(true) }
            return true;
        }, function (tx, error) {
            if (typeof (callback) == 'function') { callback(false) }
            console.log(error);
            return false;
        });
    });
}

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS DEMO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    alert("success!");
}

/** 
 * 初始化数据库 
 */
function initDB() {
    if (db == null) { openDB(); }
    createTable(tableAttr, pictureFields, { "id": "unique" });
    createTable(tableUrl, urlFields, { "url": "unique" });
    createTable(orderTable, urlOrder, { "id": "unique" });
}

/** 
 * 创建数据库 
 * @param tableName     表名称 
 * @param fields        表字段 
 * @param constraint    约束或者字段的其他补充，可以为空, 
 *  格式如：{"id":"integer primary key autoincrement","picName":"not null"} 
 */
function createTable(tableName, fields, constraint) {

    if (db == null) { openDB(); }
    var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
    for (i in fields) {
        var key = "";
        if (typeof (constraint) != "undefined" && typeof (constraint[fields[i]]) != "undefined") {
            key = " " + constraint[fields[i]];
        }
        sql += fields[i] + key + ",";
    }
    sql = sql.substr(0, sql.length - 1);
    sql += ")";
    //log(sql);  
    execSql(sql);
}


/** 
 * 更新数据 
 * @param tableName 表名称 
 * @param setFields 要更新的字段数组 
 * @param setParams 要更新的字段对应的参数数组 
 * @param whereStr  where语句，如果没有可不传，不包含where关键字，参数用?代替，如：id=? and name=? 
 * @param wherParams    where语句用到的参数数组,如['111','2222']
 * @param callback 回到
 */
function updateTable(tableName, setFields, setParams, whereStr, wherParams,callback) {
    var sql = "update " + tableName + " set ";
    for (i in setFields) {
        sql += setFields[i] + "=?,";
    }
    sql = sql.substr(0, sql.length - 1);
    if (typeof (whereStr) != "undefined" && typeof (wherParams) != "undefined"
        && whereStr != "") {
        sql += " where " + whereStr;
        setParams = setParams.concat(wherParams);
    }
    execSql(sql, setParams,callback);
}

/** 
 * 插入数据 
 * @param tableName 
 * @param insertFields 
 * @param insertParams
 * @param callback 回调
 */
function insertTable(tableName, insertFields, insertParams,callback) {
    var sql = "insert into " + tableName + " (";
    var sql2 = " values(";
    for (i in insertFields) {
        sql += insertFields[i] + ",";
        sql2 += "?,"
    }
    sql = sql.substr(0, sql.length - 1);
    sql2 = sql2.substr(0, sql2.length - 1);
    sql += ")";
    sql2 += ")";
    execSql(sql + sql2, insertParams,callback);
}

/** 
 * 删除数据 
 * @param tableName 
 * @param whereStr 
 * @param wherParams 
 */
function deleteRow(tableName, whereStr, wherParams,callback) {
    var sql = "delete from " + tableName;
    if (typeof (whereStr) != "undefined" && typeof (wherParams) != "undefined"
        && whereStr != "") {
        sql += " where " + whereStr;
    }
    execSql(sql, wherParams,callback);
}

/** 
 * 查询 
 * @param tableName 
 * @param selectFields  select的字段，用逗号分开，如果全部传"*" 
 * @param whereStr      where语句，参数用?代替 
 * @param wherParams    参数数组 
 * @callback 必填，返回的对象会放在callback函数作为参数传递 
 */
function select(tableName, selectFields, whereStr, wherParams, callback) {
    if (db == null) { openDB(); }
    var sql = "SELECT " + selectFields + " FROM " + tableName;
    if (typeof (whereStr) != "undefined" && typeof (wherParams) != "undefined"
        && whereStr != "") {
        sql += " where " + whereStr;
    }
    db.transaction(function (tx) {
        tx.executeSql(sql, wherParams, function (tx, results) {
            if (results.rows.length < 1) {
                if (typeof (callback) == 'function') { callback(false) } //没有数据  
            } else {
                if (typeof (callback) == 'function') { callback(results.rows) }
            }
        }, function (tx, error) {
            return false;
        });
    });
}

/**
 * 获取某列的总和
 * @param tableName
 * @param selectFields  select的字段，用逗号分开，如果全部传"*"
 * @param whereStr      where语句，参数用?代替
 * @param wherParams    参数数组
 * @callback 必填，返回的对象会放在callback函数作为参数传递
 */
function selectSumSql(tableName, selectFields, whereStr, wherParams, callback) {
    if (db == null) { openDB(); }
    var sql = "SELECT sum(" + selectFields + ") FROM " + tableName;
    if (typeof (whereStr) != "undefined" && typeof (wherParams) != "undefined"
        && whereStr != "") {
        sql += " where " + whereStr;
    }
    db.transaction(function (tx) {
        tx.executeSql(sql, wherParams, function (tx, results) {
            if (results.rows.length < 1) {
                if (typeof (callback) == 'function') { callback(false) } //没有数据
            } else {
                if (typeof (callback) == 'function') { callback(results.rows) }
            }
        }, function (tx, error) {
            return false;
        });
    });
}

/** 
 * 插入或更新 
 * @param tableName 
 * @param insertFields 
 * @param insertParams 
 * @param key           根据该key来判断是否有数据 
 * @param keyVal
 * @param callback 回调
 */
function saveOrUpdate(tableName, insertFields, insertParams, key, keyVal,callback) {
    if (typeof (key) != "undefined" && typeof (keyVal) != "undefined"
        && key != "") {
        select(tableName, insertFields[0], key + "=?", [keyVal], function (rows) {
            if (rows) {
                updateTable(tableName, insertFields, insertParams, key + "=?", [keyVal],callback);
            } else {
                insertFields.push(key);
                insertParams.push(keyVal);
                insertTable(tableName, insertFields, insertParams,callback);
            }
        })
    } else {
        insertTable(tableName, insertFields, insertParams,callback);
    }
}