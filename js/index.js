var _ = 'http://192.168.10.200:3000', channel;

$(document).on('mobileinit', function(){
	$.mobile.ajaxEnabled = false; //禁用自动ajax
});

$(document).ready(function(){
	//版本比较
	$.get(_ + '/v/' + localStorage.getItem('version'), function(data){
		//与服务器版本相同
		if(data.success){
			$('#index_channel').append(localStorage.getItem('channel')).listview('refresh');
		}else{
			var t = '';
			$.each(data.channel, function(k, v){
				t += '<li><a href="javascript:;" onclick="switchChannel(this)" data-channel="'+ v.ename +'">'+ v.cname +'</a></li>';
			});
			
			//更新本地版本号
			localStorage.removeItem('version');
			localStorage.setItem('version', data.version);
			
			//更新本地频道项
			localStorage.removeItem('channel');
			localStorage.setItem('channel', t);
			
			$('#index_channel').append(t).listview('refresh');
		}
		
		//next按钮绑定事件
		$('#index_next').click(function(){
			//当前频道
			if(!channel) return;
			
			//切换显示区域
			$('.index_box').toggle();
			//$('.index_box:hidden').text('Loading...');
			
			//请求数据
			$.get(_ + '/r/' + channel, function(data){
				$('.index_box:hidden').html(data.success ? data.items.detail: 'Error');
			}, 'json');
		});
	}, 'json');
});

//切换频道
function switchChannel(t){
	//取得频道标记
	var dc = t.getAttribute('data-channel');
	if(dc == channel) return;
	$('#index_title').text('Loading...');
	
	//请求数据
	$.get(_ + '/c/' + dc, function(data){
		if(data.success){
			$('#index_boxa').html(data.items[0].detail);
			$('#index_boxb').html(data.items[1].detail);
			$('#index_title').text(t.text);
			
			//记录所选频道
			channel = dc;
		}else{
			$('#index_title').text('Error');
		}
	}, 'json');
}
