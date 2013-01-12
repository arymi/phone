//配置参数
var _ = {
	"serverUrl": "http://192.168.10.200:3000",
	"version": "0",
	"channel": ""
};

//JM 初始化
$(document).on('mobileinit', function(){
	$.mobile.ajaxEnabled = false; //禁用自动ajax
});

$(document).ready(function(){
	//版本初始化
	$.ajax({
		url: _.serverUrl + '/v/' + _.version,
		type: 'GET',
		dataType: 'json',
		success: function(data){
			$('#index_boxa').html(data.msg);
			
			//生成频道列表
			var t = '';
			$.each(data.channel, function(k, v){
				t += '<li><a href="javascript:;" onclick="switchChannel(this)" data-channel="'+ v.ename +'">'+ v.cname +'</a></li>';
			});
			
			$('#index_boxs').show();
			$('#index_channel').append(t).listview('refresh');
			
			//next按钮绑定事件
			$('#index_next').click(function(){
				//切换显示区域
				$('.index_box').toggle();
				
				//请求数据
				$.get(_.serverUrl + '/r/' + _.channel, function(data){
					$('.index_box:hidden').html(data.success ? data.items.detail: 'Error');
				}, 'json');
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){ //请求失败
			$('#index_boxa').text('+_+ 抱歉，连接不到服务器...');
			$('#index_boxs').show();
		}
	});
});

//切换频道
function switchChannel(t){
	var dc = t.getAttribute('data-channel');
	if(_.channel == dc) return; //避免重复选择
	if(_.channel == '') $('#index_tool').show(); //第一次选择显示控制工具栏
	
	$('#index_title').text('Loading...');
	
	//请求数据预载两条数据
	$.get(_.serverUrl + '/c/' + dc, function(data){
		if(data.success){
			$('#index_boxa').html(data.items[0].detail);
			$('#index_boxb').html(data.items[1].detail);
			$('#index_title').text(t.text);
			
			//记录所选频道
			_.channel = dc;
		}else{
			$('#index_title').text('Error');
		}
	}, 'json');
}
