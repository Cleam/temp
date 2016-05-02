$(function(){
	//global_sider 全局侧边栏
	(function(){
		var topbtn = $('#gotop_btn');
		//绑定页面滚动事件
		$(window).bind('scroll',function(){
			var len=$(this).scrollTop();
			if(len>=100){
				//显示回到顶部按钮
				$('.goto_top').show();
			}else{
				//影藏回到顶部按钮
				$('.goto_top').hide();
			}
		});
		//顶部
		topbtn.on('click', function(){
			$("html, body").filter(':not(:animated)').animate({
				scrollTop: 0
			});
		});
	})();

	(function(){
		// 获取uid，存入cookie
		var uid_url='http://tjpc.dfshurufa.com/getpcdata/getuid';//请求UID 接口
		var getData_url='http://pclog.dftoutiao.com/getpcdata/data';//请求传递数据接口修改地址01月17日
		// var getData_url='http://tjpc.dfshurufa.com/getpcdata/data';//请求传递数据接口
		var getOnlineData_url='http://tjpc.dfshurufa.com/pconline/pconline';//请求传递online数据接口
		var flag_cooke=0;
		var u_id='';
		var soft_type='';
		var soft_name='';
		var OSType='';//操作系统
		var browserType='';//浏览器
		OSType=detectOS();
		browserType=explorerType();
		var wayPath=String(coo_name);//渠道来源
		if(wayPath == null || wayPath== ''){
			wayPath='null';
		}else{
			if(wayPath.indexOf('=') != -1){
				// wayPath=wayPath.substr(4);
				wayPath=wayPath.split('=')[1];
			}
		}
		//判断浏览器
		function explorerType(){
			var brow=$.browser;
			var bInfo="非主流浏览器";
			if(brow.msie){
				bInfo="MicrosoftInternetExplorer"+brow.version;
			}
			if(brow.mozilla){
				bInfo="MozillaFirefox"+brow.version;
			}
			if(brow.safari){
				bInfo="AppleSafari"+brow.version;
			}
			if(brow.opera){
				bInfo="Opera"+brow.version;
			}
			if(brow.chrome){
				bInfo="chrome"+brow.version;
			}
			return bInfo;
		}
		//获取客户端操作系统类型
		function detectOS() {
			var sUserAgent = navigator.userAgent;
			var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
			if (isMac) return "Mac";
			var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
			if (isUnix) return "Unix";
			var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
			if (isLinux) return "Linux";
			if (isWin) {
				var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
				if (isWin2K) return "Win2000";
				var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
				if (isWinXP) return "WinXP";
				var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
				if (isWin2003) return "Win2003";
				var isWin2003 = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
				if (isWin2003) return "WinVista";
				var isWin2003 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
				if (isWin2003) return "Win7";
			}
			return "None";
		}
		if(!$.cookie('mylist')){
			uid_ajax(uid_url,0);
		}else{
			u_id=$.parseJSON($.cookie('mylist')).uid;
			soft_type=$.parseJSON($.cookie('mylist')).softtype;
			soft_name=$.parseJSON($.cookie('mylist')).softname;
			getData_ajax(getData_url,wayPath,newstype,u_id,soft_type,soft_name,OSType,browserType);//请求传递数据,wayPath\newstype全局变量qid
		}
		//10秒定时去请求传online数据
		setInterval(function(){
			if(!$.cookie('mylist')){
				uid_ajax(uid_url,1);
			} else {
				u_id=$.parseJSON($.cookie('mylist')).uid;
				soft_type=$.parseJSON($.cookie('mylist')).softtype;
				soft_name=$.parseJSON($.cookie('mylist')).softname;
				getOnline_ajax(getOnlineData_url,wayPath,newstype,u_id,soft_type,soft_name,OSType,browserType);
			}
		},10000);
		function Mycookie(uid){
			//设置cookie
			var info = '{"uid":"' + uid + '","softtype":"toutiao","softname":"DFTT"}';
			$.cookie('mylist',info,{expires:30,path:'/'});
		}
		//获取UID
		function uid_ajax(url,gotype){
			$.ajax({
				type:'get',
				url:url,
				dataType:'jsonp',
				jsonp: 'jsonpcallback',
				timeout:6000,
				beforeSend:function () {
					// 加载提示
					// $('#ajax_tips').show();
				},
				success:function(data){
					//数据传递验证成功后执行的操作
					var uid0=data.uid;
					Mycookie(uid0);
					flag_cooke=1;
				},
				complete:function () {
					if(flag_cooke==1){
						u_id=$.parseJSON($.cookie('mylist')).uid;
						soft_type=$.parseJSON($.cookie('mylist')).softtype;
						soft_name=$.parseJSON($.cookie('mylist')).softname;
						if(gotype==0){
							//gotype为0代表日志请求否则代表online接口请求
							getData_ajax(getData_url,wayPath,newstype,u_id,soft_type,soft_name,OSType,browserType);//请求传递数据,wayPath\newstype全局变量qid
						}else{
							getOnline_ajax(getOnlineData_url,wayPath,newstype,u_id,soft_type,soft_name,OSType,browserType);
						}
					}
				},
				error:function(jqXHR,textStatus,errrorThrown){if(errrorThrown=='Not Found'){console.log('Your requested address is not found.');}else if(textStatus=='timeout'){console.log('Verify the request timeout, please refresh the page and try again');}else{console.log('Your requested address is not found.');}}
			});
		}
		//请求传递数据
		function getData_ajax(url,wayPath,newstype,uid,softtype,softname,OS,browser){
			var qid=wayPath;
			var uid=uid;
			var softtype=softtype;
			var softname=softname;
			var newstype=newstype;
			var from='';
			var idx=''//新闻链接位置
			var ishot='';//是否热新闻
			var btype=''//大类
			var subtype=''//子类
			var _vbb='0.5.1';//版本号
			var OS=OS;//操作系统
			var browser=browser;//浏览器类型
			// from=document.referrer;
			var to=window.location.host+window.location.pathname;
			var fr_url=document.referrer;
			if(fr_url=='' || fr_url == 'null'){
				fr_url='null';
			}else{
				fr_url=fr_url.split("?");
				fr_url=String(fr_url[0]);
			}
			from=fr_url;
			var temp = window.location.search; //获取url中"?"符后的字串
			if (temp.indexOf("?") != -1) {
				btype=GetRequest(temp).btype;
				subtype=GetRequest(temp).subtype;
				idx=GetRequest(temp).idx;
				ishot=GetRequest(temp).ishot;
			}else{
				btype='null';
				subtype='null'
				idx='null';//没传参时的情况下
				ishot=0;
			}

			var param=qid+"\t"+uid+"\t"+softtype+"\t"+softname+"\t"+newstype+"\t"+from+"\t"+to+"\t"+btype+"\t"+subtype+"\t"+idx+"\t"+ishot+"\t"+fr_url+"\t"+_vbb+"\t"+OS+"\t"+browser;
			// console.log(param);
			function GetRequest(temp) {
				var theRequest = new Object();
				// if (url.indexOf("?") != -1) {
				var str = temp.substr(1);
				var strs = str.split("&");
				for(var i = 0; i < strs.length; i ++) {
					theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
				}
				// }
				return theRequest;
			}

			$.ajax({
				type:'get',
				url:url+'?param='+escape(param),
				// data:param,
				dataType:'jsonp',
				jsonp: 'jsonpcallback',
				timeout:6000,
				beforeSend:function () {
					// 加载提示
					// $('#ajax_tips').show();
				},
				success:function(data){
					//数据传递验证成功后执行的操作
					// console.log(url);
				},
				complete:function () {
				},
				error:function(jqXHR,textStatus,errrorThrown){if(errrorThrown=='Not Found'){console.log('Your requested address is not found.');}else if(textStatus=='timeout'){console.log('Verify the request timeout, please refresh the page and try again');}else{console.log('Your requested address is not found.');}}
			});
		}
		//请求传递online数据
		function getOnline_ajax(url,wayPath,newstype,uid,softtype,softname,OS,browser){
			var qid=wayPath;
			var uid=uid;
			var softtype=softtype;
			var softname=softname;
			var newstype=newstype;
			var ishot='';//是否热新闻
			var _vbb='0.5.1';//版本号
			var OS=OS;//操作系统
			var browser=browser;//浏览器类型
			var thisurl=window.location.host+window.location.pathname;//当前链接
			var setIntervalTime=10;
			var temp = window.location.search; //获取url中"?"符后的字串
			if (temp.indexOf("?") != -1) {
				ishot=GetRequest(temp).ishot;
			}else{
				ishot=0;
			}
			var param=qid+"\t"+uid+"\t"+softtype+"\t"+softname+"\t"+newstype+"\t"+thisurl+"\t"+ishot+"\t"+_vbb+"\t"+OS+"\t"+browser+"\t"+setIntervalTime;
			// console.log(param);
			function GetRequest(temp) {
				var theRequest = new Object();
				// if (url.indexOf("?") != -1) {
				var str = temp.substr(1);
				var strs = str.split("&");
				for(var i = 0; i < strs.length; i ++) {
					theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
				}
				// }
				return theRequest;
			}
			$.ajax({
				type:'get',
				url:url,
				data:{
					param:escape(param)
				},
				dataType:'jsonp',
				jsonp: 'jsonpcallback'
			});
		}
	})();

	/* 添加快讯 */
	(function(){
		/*
		 <div class="fixed-kuaixun">
		 <img src="<?php echo __WWW_IMG ?>kuaixun.png" alt="快讯" width="86" height="48">
		 <a class="txt" href="javascript:;">国防部证实我国正在研制第二航母舰队</a>
		 <a class="close" href="javascript:;" title="点击关闭">关闭</a>
		 </div>
		 */
		setTimeout(function(){
			var COOKIE_NAME = 'kuaixun',    // 快讯cookie name
				cookieVal = $.cookie(COOKIE_NAME),  // 快讯cookie value
				ymd = getDateStr(),   // 年月日字符串
				url = '/json/kuaixun/kuaixun_' + ymd + '.json';
			$.getJSON(url, function(data, status){
				if(status != 'success' || !data){
					return false;
				}
				if(!cookieVal && cookieVal != data.id){
					var startTime = new Date(data.start_time.replace(/-/g, '/')),
						endTime = new Date(data.end_time.replace(/-/g, '/')),
						curTime = new Date();
					if(curTime.getTime() > startTime.getTime() && curTime.getTime() < endTime.getTime()){
						var $kuaixun = $('<div class="fixed-kuaixun"><img src="/assets/images/kuaixun.png" alt="快讯" width="86" height="48"></div>'),
							$kxLink = $('<a class="txt" href="javascript:;" target="_blank"></a>'),
							$kxClose = $('<a class="close" href="javascript:;" title="点击关闭">关闭</a>');
						$kxLink.attr('href', data.url);
						$kxLink.html(data.topic);
						$('body').append($kuaixun.append($kxLink).append($kxClose));
						$kxClose.on('click', function(){
							$.cookie(COOKIE_NAME, data.id, {expires: 30, path: '/'});
							$kuaixun.remove();
						});
						$kxLink.on('click', function(){
							$.cookie(COOKIE_NAME, data.id, {expires: 30, path: '/'});
							$kuaixun.remove();
						});

						if(!($.browser.version.toString().substring(0,1) == '6' || $.browser.version.toString().substring(0,1) == '7')){
							$kuaixun.animate({
								bottom: '70px'
							});
						}
					}
				}
			});

			function getDateStr(){
				var now = new Date(),
					year = now.getFullYear().toString().slice(2),
					month = (now.getMonth() + 1).toString(),
					day = now.getDate().toString();
				month = (month.length === 1) ? (month = '0' + month) : month;
				day = (day.length === 1) ? (day = '0' + day) : day;
				return year + month + day;   // 年月日字符串
			}
		}, 3000);


	})();

	$('ul.nav li:last').hover(function(){
		$(this).children('div').show();
	},function(){
		$(this).children('div').hide();
	});

});

