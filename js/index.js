//JM 初始化
$(document).on('mobileinit', function(){
	$.mobile.ajaxEnabled = false; //禁用自动ajax
});

$(document).ready(function(){
	//搜索关键词
	var kw = '';

	//连接数据库
	var db = window.openDatabase('test', '1.0', 'Test DB', 2000000);

	//搜索
	$('#index_search').live('keyup', function(e){
		if(this.value != kw){
			kw = this.value;
			alert(kw);
		}else{
			return false;
		}
	});

	//生成数据库
	$('#index_cdb').on('click', function(e){
		db.transaction(populateDB, errorCB, successCB);
	});

	//读取记录
	$('#index_rdb').on('click', function(e){
		 db.transaction(queryDB, errorCB);
	});
});

//错误回调
function errorCB(err){
	alert("Error processing SQL: " + err.code);
}

//成功回调
function successCB(){
	alert("success!");
}

//执行SQL
function populateDB(tx){
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (3, "Three row")');
}

//查询
function queryDB(tx){
	tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

//查询成功
function querySuccess(tx, results){
	alert(results.rows.length);
}
