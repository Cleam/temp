// (function(doc, win) {
// 	var docEl = doc.documentElement,
// 		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
// 		recalc = function() {
// 			var clientWidth = docEl.clientWidth;
// 			if (!clientWidth) return;
// 			docEl.style.fontSize = Math.min(14 * (clientWidth / 320), 23.625) + 'px';
// 		};
// 	// Abort if browser does not support addEventListener
// 	if (!doc.addEventListener) return;
// 	win.addEventListener(resizeEvt, recalc, false);
// 	doc.addEventListener('DOMContentLoaded', recalc, false);

// 	// retina
// 	win.retina = docEl.clientWidth >= 375;
// })(document, window);


(function($) {
    /*
     * 保存指定类型的搜索记录
     *
     */
    $.saveSearchHistory = function(type, text) {
    	text = text.trim();
    	if (!text) return;

        var history = $.ls(type) || [];
        $.each(history, function(index, item) {
            if (text === item) {
                history.splice(index, 1);
            }
        });
        if (history.length >= 10) {
            history.splice(0, 1);
        }
        history.push(text);
        $.ls(type, history);
    };

    /*
     * 查询指定类型的搜索记录
     *
     */
    $.searchHistory = function(type) {
        return $.ls(type);
    };

    /*
     * 删除指定类型的搜索记录
     *
     */
    $.removeHistory = function(type) {
        return $.ls(type, null);
    };

    /*
    * Html5无刷新修改Url 
    *
    */
    $.changeUrl = function(changeOps) {
    	var targetUrlObj = $.combineObj(changeOps, $.getRequestData());
    	targetUrlObj.url = window.location.href.split('?')[0];
    	window.history.replaceState({time:new Date().getTime()},'',$.createUrl(targetUrlObj));
    };

    /*
     * 合并对象
     */
    $.combineObj = function(source, target) {
    	for(var key in source) {
    		if (source[key] != undefined) {
    			target[key] = source[key];
    		}
    	}
    	return target;
    };

    // 绑定通用事件
    $('body').on('tap', '#reload', function(){
    	return window.location.reload();
    });

        // 绑定通用事件
    $('body').on('tap', '.logo', function(){
    	//return $.gotoUrl('securityCenter.html');
    	return $.gotoUrl('index.html');
    });

    $('body').on('tap', '#goToLogin', function(){
    	//return $.gotoUrl('securityCenter.html');
    	return $.gotoUrl('login.html');
    });

    // 基本配置项
    $.baseConfig = function(){
    	var baseConfig = {
    		// 数据加载失败模板
    		noDataTemplate: '<div class="no-data"><div></div><p>数据加载失败，请稍后再试</p><button id="reload" class="btnBig-nb ui-mt35 mb20">重新加载</button></div>'
    	};
    	return function(){
    		return baseConfig;
    	};
    }();

    // 展示数据加载失败页面
    $.showNoDataView = function(type) {
        if (type.toUpperCase() === "GET") {
            $('header').after($.baseConfig().noDataTemplate);
            $.hideLoading();
            return true;
        }
        return false;
    };

    // 密码键盘通用回调方法
    window.FFT_Keyboard_CallBack = function(ops) {
        var options,
        	str = [];
        try {
            options = JSON.parse(ops);
        } catch (e) {
            options = {
                length: "6",
                pwd: ops
            };
        }
        for (var i = 0; i < parseInt(options['length'], 10); i++) {
            str.push("*");
        }
        $('#' + window.keyboardName).val(str.join("")).data("value", options.pwd);
    };

    /* 密码键盘通用事件触发 
     * class：js-keyboard
     * data-maxLength:最大长度
     * data-minLength:最小长度
     * data-type:密码类型
     */
    $('body').on('tap', '.js-keyboard',function() {
    	window.keyboardName = this.id;
        $(this).val("").data("value", "");
        BASE.clientSocket('FFT_CipherKeyboard_Service', {
            'fft_pwdMaxLength': $(this).data('maxlength') + '',
            'fft_pwdMinLength': $(this).data('minlength') + '',
            'fft_type': $(this).data('type') + ''
        }, 'FFT_Keyboard_CallBack');
    });

    // 删除该父节点的子节点
    $.fn.removeChildren = function() {
    	$(this).children().remove();
    };
	// 加法
    Number.prototype.add = function(arg) {
    	return $.add(arg, this);
    };
    // 乘法
    Number.prototype.mult = function(arg) {
    	return $.mult(arg, this);
    };

    // 加法
    $.add = function() {
    	var total = 0;
    	$.each(arguments, function(index, item) {
    		total += parseFloat(item);
    	});
    	return total;
    };

    // 减法
    $.subtr = function() {
    	var total = 0;
    	$.each(arguments, function(index, item) {
    		if (index === 0) {
    			total = parseFloat(item);
    		} else {
    			total = total -  parseFloat(item);
    		}
    	});
    	return total;
    }; 
    // 乘法
    $.mult = function () {
    	var total = 1;
    	$.each(arguments, function(index, item) {
    		total = total *  parseFloat(item);
    	});
    	return Math.round(total*100)/100;
    };

    // 获取图形验证码
    $.fn.getImgCode = function() {
    	var me = $(this);
        $.commonAjax({
            type: 'GET',
            url: "/user/code/generate_image",
            success: function(data) {
                // 成功获取验证码
                me.attr('src', CONFIG.imgUrl + data.url);
                me.data('imgToken', data.imgToken);
            },
            error: function(error) {
                $.alert(error.message);
            }
        });
    };
// 通用 兼容老图片路径
    $.checkOldData = function(str) {
    	if (str) {
			return str.indexOf('.') > -1;
    	}
    	return false;
    };
    $.checkOldImgSrc = function(imgSrc) {
        var url = '';
        if($.checkOldData(imgSrc)) {
            url = CONFIG.imgUrl + imgSrc;
        } else {
            url = CONFIG.newImageUrl + imgSrc + '?imageView2/0/w/640/h/640';
        }
        return url;
    };

    /**
     * 获取完整图片路径（兼容新图片裁切）
     * @parameter imgUrl --不带根路径的图片路径
     * @paramerter width --新的图片的宽度限制(非必须)
     * @parameter heigth --新的图片的高度限制(非必须、不设置时使用宽度值)
     * @return 完整的图片路径
     * @author ajaxGu
     */
    $.translateImgUrl = function(imgUrl, width, height) {

    	if (!imgUrl) {
            return '../images/default-img.png';
        }
        // CONFIG.imgUrl 旧的图片服务器地址
        // CONFIG.newImageUrl 七牛图片服务器地址

        // 判断新老图片格式
        if ($.checkOldData(imgUrl)) {
            return CONFIG.imgUrl + imgUrl;
        } else {
            if (width) {
                return CONFIG.newImageUrl + imgUrl + '?imageView2/0/w/' + width + '/h/' + (height || width);
            } else {
                return CONFIG.newImageUrl + imgUrl + '?imageView2/0/w/640/h/640'
            }
        }
    }





})(Zepto);


/**
 * 弹出框框（新）
 *
 */
;
(function($, window, undefined) {

	$.Confirm = function(options) {
		return new Dialog(options);
	};

	var Dialog = function(options) {
		this.settings = $.extend({}, Dialog.defaults, options);
		this.init();
	};

	Dialog.prototype = {
		/**
		 * 初始化
		 */
		init: function() {
			this.create();
		},
		/**
		 * 创建
		 */
		create: function() {

			var title = this.settings.title;
			var source = [
			'<div id="dialog" class="ui-pop-box ui-align-end">',
        	'	<div class="ui-pop-confirm">',
            '		<div class="ui-confirm-top">',
            '    		<%=# data.content %>',
            '		</div>',
	        '    	<div class="ui-confirm-bottom">',
	        '       	<button class="js-confirm-ok ok"><%= data.okText %></button>',
	        '       	<button class="js-confirm-cancel"><%= data.cancelText %></button>',
			'       </div>',
		    '   </div>',
		    '</div>'].join('');
			var render = template.compile(source);
	        var  html = render({
	            data: {
	            	title:this.settings.title,
	            	content:this.settings.content,
	            	okText: this.settings.okText,
					cancelText: this.settings.cancelText
	            }
	        });
	        $('body').append(html);
			// 设置cancel按钮
			if ($.isFunction(this.settings.cancel)) {
				this.cancel();
			}

			// 设置ok按钮
			if ($.isFunction(this.settings.ok)) {
				this.ok();
			}
		},


		/**
		 * cancel
		 */
		cancel: function() {

			var _this = this;
			$('.js-confirm-cancel').on("tap", function() {
				var cancelCallback = _this.settings.cancel();
				if (cancelCallback == undefined || cancelCallback) {
					_this.close();
				}
			});
		},

		/**
		 * ok
		 */

		ok: function() {
			var _this = this;
			$('.js-confirm-ok').on("tap", function() {
				var okCallback = _this.settings.ok();
				if (okCallback == undefined || okCallback) {
					_this.close();
				}
			});
		},

		/**
		 * 关闭方法
		 */
		close: function() {
			$('#dialog').remove();
		}
	};

	/**
	 * 默认配置
	 */
	Dialog.defaults = {

		// 内容
		content: '加载中...',

		// 标题
		title: 'load',

		// 宽度
		width: 'auto',

		// 高度
		height: 'auto',

		// 取消按钮回调函数
		cancel: null,

		// 确定按钮回调函数
		ok: null,

		// 确定按钮文字
		okText: '确定',

		// 取消按钮文字
		cancelText: '取消',

		// 自动关闭时间(毫秒)
		time: null,

		// 是否锁屏
		lock: true,

		// z-index值
		zIndex: 9999,

		//关闭后的回调事件
		colseCallBack: null

	};

	

})(window.jQuery || window.Zepto, window);




var CONFIG = {
	"logUrl": "//devlog.sqyh365.cn",
	"imgUrl": "//devimg.sqyh365.cn",
	'newImageUrl': 'https://dn-dev-ubank-web-server.qbox.me/',
	"domainUrl": "//dev.ubank365.com",
	"staticPage": "//devitem.ubank365.com",
	"bankLogo": {
		anhui: "../img/anhui-logo.png",
		chongqing: "../img/chongqing-logo.png"
	},
	"bankLogoSmall": {
		anhui: "../img/anhui-logosmall.png",
		chongqing: "../img/chongqing-logosmall.png"
	},
	isDisplayFroadPoint: isDisplayFroadPoint(),
	oldPwdNum: "10",
	debug: false,
	transfer: [],
	ad: {
		'anhui' : {
			'index' : 100000000,
			'merchantIndex' : 100000002,
			'merchantList' : 100000003,
			'cheapIndex' : 100000004,
			'cheapList' : 100000005
		},
		'chongqing' : {
			'index' : 100000001,
			'merchantIndex' : 100000006,
			'merchantList' : 100000007,
			'cheapIndex' : 100000008,
			'cheapList' : 100000009
		},
		'undefined' : {}
	}
};

window.FFT_GetNetworkInfo_Service_CallBack = function() {

};

function isDisplayFroadPoint() {
	var clientType = getClientType();
	return {
		'anhui': false
	}[clientType];
}

function getClientType() {
		var url = window.location.href;
		return url.substring(url.indexOf(".com/") + 5, url.indexOf("/m"));
	}
	(function($) {

		function detect(ua, platform) {
			var os = this.os = {},
				browser = this.browser = {},
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				osx = !!ua.match(/\(Macintosh\; Intel /),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				sdk = ua.match(/(SDK);?[\s\/]+([\d.]+)?/);

			if (browser.webkit = !!webkit) browser.version = webkit[1];
			if (sdk) os.sdk = true, os.sdkVer = sdk[2];
			if (android) os.android = true, os.version = android[2];
			if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
			if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
			if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
		}

		detect.call($, navigator.userAgent, navigator.platform);
		$.__detect = detect
	})(Zepto)


CONFIG.cqVer131 = (getClientType() === 'chongqing' && $.os.android && (!$.os.sdk));

//兼容老重庆客户端安卓4.3以下android 在滚动屏幕之后不能点击事件无效
(function($) {
	if (CONFIG.cqVer131) {
		var _on = $.fn.on;
		$.fn.on = function(evt) {
			if (evt === 'tap') {
				var args = [].slice.apply(arguments);
				args[0] = 'click';
				return _on.apply(this, args);
			}

			return _on.apply(this, arguments);
		};
	}
})(Zepto)

/**
 * 从url中获取参数
 */
;
(function($) {
	$.getRequestData = function(url) {
		if (url) {
			if (url.indexOf("?") == -1) {
				return {};
			} else {
				url = '?' + url.split('?').pop();	
			}
		} else {
			//获取url中"?"符后的字串
			url = location.search;
		}
		var theRequest = {};
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	};

    $.createUrl = function(obj) {
        var length = obj && obj.length,
            idx = 0,
            url = obj.url + '?';
        for (var key in obj) {
            if(key != 'url' && obj[key] !== null){
                url += (key + '=' + encodeURIComponent(obj[key]) + '&');
			}
        }
        return url.substring(0,url.lastIndexOf('&'));
    };

})(Zepto)

/**
 * 判断div是否显示
 */
;
(function($) {


	$.fn.isHide = function() {
		return isHide(this);
	};

	$.fn.isShow = function() {
		return !isHide(this);
	};

	function isHide(target) {
		if (target.length === 1) {
			if (target[0].style.display === 'none') {
				return true;
			}
			return false;
		}
	}

})(Zepto)

/**
 * cookie pligin for zepto
 * @author 	guxuelong(顾学龙)
 * @version 	1.0.0
 *
 * options
 *		expires: 定义cookie的有效时间，默认''
 *				 s是指秒，  如20秒就是20s
 *				 h是指小时，如12小时是h12
 *				 d是指天数，如30天就是d30
 *      path:
 *          	 定义cookie的有效路径,默认为''
 *      domain:  定义cookie的domain
 *      secure:  默认值：false。如果为true，cookie的传输需要使用安全协议（HTTPS）
 *      raw:     默认情况下，读取和写入 cookie 的时候自动进行编码和解码.要关闭这个功能设置 raw: true 即可
 *
 */
;
(function($) {

	$.cookie = function(key, value, options) {
		var opts;
		// 设置cookie
		var val = String(value);
		if (arguments.length > 1 && val !== "[object Object]") {
			var time, num, type, strsec = 0,
				exp = new Date();
			opts = $.extend({}, $.cookie.defaults, options);
			time = {
				null: "d-1",
				undefined: "d-1"
			}[value] || opts.expires;
			time != '' && (num = time.substring(1, time.length) * 1, type = time.substring(0, 1), strsec = {
				's': num * 1000,
				'h': num * 60 * 60 * 1000,
				'd': num * 24 * 60 * 60 * 1000
			}[type], exp.setTime(exp.getTime() + strsec * 1), time = ";expires=" + exp.toGMTString());
			return (document.cookie = [
				encodeURIComponent(key), '=',
				opts.raw ? val : encodeURIComponent(val),
				time,
				opts.path ? '; path=' + opts.path : '/',
				opts.domain ? '; domain=' + opts.domain : '',
				opts.secure ? '; secure' : ''
			].join(''))
		}
		// 获取cookie
		opts = $.extend({}, $.cookie.defaults, value);
		return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? {
			true: result[1],
			false: decodeURIComponent(result[1])
		}[opts.raw] : null
	};

	$.cookie.defaults = {
		expires: '',
		path: '/',
		secure: false,
		raw: false,
		domain: ''
	};
})(Zepto)

/**
 * json转对象
 *
 */
;
(function($) {
	$.paseJson = function(o) {
		if($.isNumber(o)) {
			return o;
		}
		var result;
		try {
			result = JSON.parse(o);
			if (typeof(result) !== 'object') {
			    return o;
			}
		} catch (e) {
			result = o;
		}
		return result;
	}

	$.isNumber = function(string) {
		return /^[0-9]*$/.test(string);
	}
})(Zepto)


/**
 * 页面非空校验
 *
 */
;
(function($) {
	$.pageEmptyCheck = function(o) {
		$.each(o, function(index, item) {
			$("#" + item).isEmpty();
		})
	}
})(Zepto)


/**
 * 重庆1.3.1版本打电话功能
 *
 */
$('body').on('tap', '.js-tel', function() {
	var _this = $(this);
    if (CONFIG.cqVer131) {
        window.froad.call(_this.data('tel') + '');
    } else {
    	_this.attr('href', 'tel:' + _this.data('tel'));
    	_this.trigger('tap');
    }
});




/**
 * HTML5 LocalStorage 本地存储
 *
 * save		$.ls("sample","123")
 * get  	$.ls("sample")
 * delete 	$.ls("sample",null) *
 *
 *_prefix  批量删除前缀，不传则删除全部
 */
;
(function($) {
	$.ls = function(key, value) {

		var ls = window.localStorage || window.sessionStorage;

		var gps = {
			'user': true
		}

		if (gps[key] && CONFIG.cqVer131) {
			if (arguments.length > 1) {
				return typeof(value) != "object" ? $.cookie(key, value, {
					expires: 'h24'
				}) : $.cookie(key, JSON.stringify(value), {
					expires: 'h24'
				});
			}
			return $.paseJson($.cookie(key));
		}

		if (arguments.length > 1) {
			return value == null ? ls.removeItem(key) : typeof(value) != "object" ? save(key, value) : save(key, JSON.stringify(value));
		}

		return $.paseJson(ls.getItem(key));

		function save(key, value) {
			ls.setItem(key, value);
		}
	};

	$.ls_del_prefix = function(_prefix) {
		var ls = window.localStorage || window.sessionStorage;
		if (_prefix == undefined || _prefix == null) {
			ls.clear();
			return;
		}
		var leng = ls.length;
		for (var i = 0; i < leng; i++) {
			var key = ls.key(i);
			if (key && key.indexOf(_prefix) == 0) {
				ls.removeItem(ls.key(i));
			}
		}
	}

})(Zepto)

/**
 * 带ajax的tab切换
 *
 *
 *
 */
;
(function($) {
	$.fn.ajaxTab = function(ops) {
		$(this).eventDelegate({
			callback: function(target) {
				$(target).addClass("current").siblings().removeClass("current");
				var list = $("#" + ops.viewId);
				list.show().loading();
				$.commonAjax({
					host: ops[target.title].host,
					url: ops[target.title].url,
					type: 'GET',
					data: ops[target.title].data,
					success: function(data) {
						$.closeLoading();
						list.children().remove();
						list.append(ops[target.title].success(data));
					},
					error: function(data) {
						$.closeLoading();
						ops[target.title].error(data);
					}
				});
			}
		});
	};

})(Zepto)

/**
 * 带ajax的select
 *
 *
 *
 */
;
(function($) {
	$.fn.ajaxSelect = function(ops) {
		$(this).eventDelegateForSelect({
			callback: function(target) {
				$(target).addClass("current").siblings().removeClass("current");
				var list = $("#" + ops.viewId);
				list.show().loading();
				$.commonAjax({
					host: ops[target.title].host,
					url: ops[target.title].url,
					type: ops[target.title].type || 'GET',
					data: ops[target.title].data,
					success: function(data) {
						$.closeLoading();
						list.children().remove();
						list.append(ops[target.title].success(data));
					},
					error: function(data) {
						$.closeLoading();
						ops[target.title].error(data);
					}
				});
			}
		});
	};

})(Zepto)



/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param num 数值(Number或者String)
 * @param type 数值(1:四舍五入，2：去尾法，3：增一法)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
;
(function($) {
	$.formatCurrency = function(num, type) {
		if (!type) {
			type = 1;
		}
		num = num.toString().replace(/\$|\,/g, '');
		if (isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = num * 100;
		num = type === 1 ? Math.round(num) : type === 2 ? Math.floor(num) : Math.ceil(num);
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if (cents < 10)
			cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' +
			num.substring(num.length - (4 * i + 3));
		return (((sign) ? '' : '-') + num + '.' + cents);
	};

	/**
	 * 货币格式化
	 * scale：小数位
	 * sign：boolean 人民币标识
	 * unit：boolean 是否加元
	 * */
	$.currency = function(value, scale, sign, unit) {
		scale = scale || 2;
		var price = $.formatCurrency(value);
		if (sign) {
			price = "￥" + price;
		}
		if (unit) {
			price += "元";
		}
		return price;
	}
})(Zepto)

/**
 *
 * main
 */
;
(function($) {

	$.fn.securityTap = function(ops) {
		if (!ops) {
			return $.alert("系统维护中，请稍后再试");
		}
			var _this = $(this);
			if (_this.attr('disabled')) {
					return false;
			}
			_this.attr('disabled', 'disabled');

			if(ops.isIllegal && ops.isIllegal()){
				return;
			}
			var error;

			if (typeof(ops.checkPara) === 'function') {
				error = ops.checkPara();
			} else {
				error = ops.checkPara && $.verifyPara(ops.checkPara);
			}
            if (error) {
                return _this.removeAttr('disabled');
				}
            $.commonAjax({
                url: ops.ajax.url,
                type: ops.ajax.type,
                data: ops.ajax.data,
                success: function(data) {
                    ops.success && ops.success(data);
                    ops.isNotJump && _this.removeAttr('disabled');
                },
                error: function(error) {
                    ops.error && ops.error(error);
					_this.removeAttr('disabled');
				}
            });
        };



	$.fn.loading = function() {
		$("#listLoading").length && $("#listLoading").show() || $(this).before('<div id="listLoading" class="rDialog" style="left:40%;top:20%;height:auto;width:' + $(window).width() / 5 + 'px"><div><div class="rDialog-header-load2"></div><div class="rDialog-footer"></div></div></div>');
	};

	var loading = $('#loading');
	$.showLoading = function() {
		loading.show();
	};

	$.hideLoading = function() {
		loading.hide();
	};

	$.fn.fullImage = function(url, slideTab, index) {

		//slideTab.fnStopSlide();
		var fullImage = $("#fullImage");
		if (fullImage.attr('disabled')) {
			return false;
		}
		fullImage.attr('disabled', 'disabled');
		var image = new Image();
		image.src = url;
		image.id = "image";
		image.onload = function() {
			var rate = image.width / image.height;
			image.width = $(window).width();
			image.height = $(window).width() / rate;
			fullImage.append(image);
			$("#image").css("marginTop", ($(window).height() - image.height) / 2);
			fullImage.show();
		};
		fullImage.on("tap", function() {
			fullImage.children().remove();
			slideTab && slideTab.goTo(index);
			fullImage.off("tap");
			fullImage.removeAttr('disabled');
			fullImage.hide();
		});
	};

	$.closeLoading = function() {
		$("#listLoading").hide();
	};


	$("#backBtn").on("tap", function() {
		window.history.go(-1);
	});

	/**
	 * 页面版本控制
	 * 页面code获取当前页面版本信息
	 */
	$.redirect = function(option) {
        // todo
        // index暂时走框架机，所以不要加.html
        if(option === 'index') {
            return option;
        }

        return option + '.html';
	};

	$.alert = function(err, time, callback) {
		if (!err) {
			err = "系统繁忙，请稍候再试";
		}
		return $.dialog({
			content: "<p style='color:#fff'>" + err + "</p>",
			title: "alert",
			time: time || 2500,
			colseCallBack: callback
		});
	};

	/* 
	 * 国内手机号校验
	 */
	$.fn.isPhoneNo = function() {
		// 移动：134、135、136、137、138、139、150、151、157(TD)、158、159、187、188
		// 　　 联通：130、131、132、152、155、156、185、186
		// 　　 电信：133、153、180、189、（1349卫通
		var err;
		var mobile = this.val();
		if (!mobile) {
			err = "请输入手机号码";
		}
		err = err && err || (!(/^1\d{10}$/.test(this.val())) ? "请输入正确格式手机号码" : undefined);

		err && $.alert(err);
		return !err;
	};

	$.fn.isEmpty = function() {
		var _this = this;
		var value = $(_this).val();
		var err = value ? undefined : ("请输入" + _this[0].name);
		err && $.alert(err);
		return err;
	};

	$.verifyPara = function(options) {
		for (var i = 0; i < options.length; i++) {
			if (typeof(options[i][1]) === 'function' && options[i][1]()) {
				return $.alert(options[i][0]);
			}
			if (!options[i][1]) {
				return $.alert("请输入" + options[i][0]);
			}
		}
	};


	// 联合登陆
	//

	/* 
	 * 事件代理（tap特定）
	 * tagNm（绑定特定的tag）
	 * coreTag(指定处理事件的tag)
	 * callback 回调函数（事件响应处理方法）
	 */
	$.fn.eventDelegate = function(opts) {
		this.on("tap", function(e) {
			var target = e.target;
			if (!opts.tagNm || target.tagName === opts.tagNm) {
				if (opts.coreTag && target.tagName != opts.coreTag.toUpperCase()) {
					target = $(target).closest(opts.coreTag)[0];
				}
				opts.callback && opts.callback(target);
			}
		});
	};

	/* 
	 * 事件代理（select特定）
	 * tagNm（绑定特定的tag）
	 * callback 回调函数（事件响应处理方法）
	 */
	$.fn.eventDelegateForSelect = function(opts) {
		this.on('change', function(e) {
			var target = e.target;
			opts.callback && opts.callback(target[target.selectedIndex]);
		});
	};

	// 跳转url
	/*
	 * url：跳转得html文件名
	 * backUrl: 返回html文件名, 缺省为当前页面URL
	 */
	//var routeUrl = ['personal.html', 'shoppingcartList.html'];
	var httpsUrl = [
		/*'login.html', 'bankCardList.html', 'resetLoginPsd.html', 'setNewPayPsd.html', 
		'findPsd.html', 'setPsd.html', 'secTradeOrConfirm.html', 'cashier.html'*/
	];
	$.gotoUrl = function(url, backUrl) {
		// 优化代码（拼接url）
		if (url && typeof(url) === 'object') {
		    url = $.createUrl(url);
		}
		// 优化代码（拼接url）
		if (backUrl && typeof(backUrl) === 'object') {
		    backUrl = $.createUrl(backUrl);
		}

		$('#loading').show();
		var AH = {
			"anhui": "anhuiLogin.html",
			"login.html": "anhuiLogin.html"
		}
		if (AH[BASE.getClientId()]) {
			url = AH[url] || url;
			backUrl = AH[backUrl] || backUrl;
		}
		var needlogin = false;
		if (!url) {
			return false;
		}
		// for (var i = 0; i < routeUrl.length; i++) {
		// 	var thehref = routeUrl[i];
		// 	if (url == thehref) {
		// 		needlogin = true;
		// 		break;
		// 	}
		// }

		var backUrl = backUrl || window.location.href;

		// 判断页面是不是https
		var dex = window.location.href.lastIndexOf("/");
		var location = window.location.href.substring(0, dex).split("://");
		for (var i = 0; i < httpsUrl.length; i++) {
			if (url.indexOf(httpsUrl[i]) > -1) {
				if (location[1].indexOf("localhost:") > -1) {
					href = "https://" + CONFIG.domainUrl + '/show_home/' + url;
				} else {
					href = "https://" + location[1] + '/' + url;
				}
				break;
			} else {
				href = "http://" + location[1] + '/' + url;
			}
		}

		if (needlogin) {
			if (!$.cookie("u_login_token") || !$.cookie("memberCode") || !$.ls('user')) {
				$.ls(CONFIG.result.loginPageName, url);
				window.location.href = CONFIG.result.loginPageName;
				return false;
			}
		}

		$.ls(url, backUrl);

		window.location.href = url;
		return true;
	};

	$.location = function(url) {
		$("body").append('<div class="js-trigger-location"><a href="' + url + '">&nbsp;</a></div>');
		$(".js-trigger-location a").trigger("click");
	};

	$.backUrl = function(backUrl) {
		if($.getRequestData()['backUrl']) {
			window.location.href = $.getRequestData()['backUrl'];
			return;
		}

		var urlArr = location.href.split('/'),
		    pN = urlArr[urlArr.length - 1].split('#')[0],
		    pM = urlArr[urlArr.length - 1].split('#')[0].split('?')[0],
		    url = $.ls(pN) || ($.ls(decodeURIComponent(pN)) || $.ls(pM)) || $.ls(location.href),
		    bUrl;

		// var dex = window.location.href.lastIndexOf("/");
		// var pageName = window.location.href.substr(dex + 1);
		// var pN = pageName.split('#')[0].split('?')[0];
		// var url = $.ls(pN);
		$.ls(pN, null);
		if (backUrl) {
			// 返回添加参数
			if(typeof(backUrl) === 'object') {
				if(url.indexOf('?')) {
					for (var key1 in backUrl) {
						url = url + '&' + key1 + '=' + backUrl[key1];
					}
				} else {
					var index = 0;
					for (var key2 in backUrl) {
						if (index === 0) {
							url = url + '?' + key2 + '=' + backUrl[key2];
						} else {
							url = url + '&' + key2 + '=' + backUrl[key2];
						}
						index++;
					}
				}
			} else {
				if(backUrl.indexOf('.html') === -1) {
					bUrl = $.redirect(backUrl);
				} else {
					bUrl = backUrl;
				}
			}	
		}

		// 含有historyFlg的页面强制采用history.go(-1)
		if ($.getRequestData().historyFlg) {
			return history.go(parseInt($.getRequestData().historyFlg));
		}

		if (bUrl || url) {
		    return window.location.href = bUrl || url;
		}

		

		// login.html 页面返回按钮必走最后一步
		if (pN.indexOf(CONFIG.result.loginPageName) !== -1) {
			if (!$.cookie("u_login_token") || !$.cookie("memberCode") || !$.ls('user')) {
				window.location.href = 'index';
				return false;	
			}			
		}

		if (bUrl || url) {
		    window.location.href = bUrl || url;
		} else {
		    history.go(-1);
		}
		//location.href = bUrl || url || 'index';
	};

	//get baseUrl from target
	$.getBaseUrl = function(target) {
		var id = target.id;
		return id && id.substring(0, id.indexOf("_"));
	};

	//$("#footer").append('<div class="nav-list"><ul id="ul"><li id="index"><span class="iconfont">&#xe609;</span><p>首页</p></li><li id="search"><span class="iconfont">&#xe607;</span><p>搜索</p></li><li id="shoppingcartList"> <span class="iconfont">&#xe600;</span><p>购物车</p></li><li id="personal"><span class="iconfont">&#xe606;</span><p>个人中心</p></li></ul></div>');

	//$("#"+$.ls("footerCurrent")).addClass("current").siblings().removeClass("current");

	// Footer事件代理
	// $("#ul").eventDelegate({
	// 	coreTag: "LI",
	// 	callback: function(target) {
	// 		if ()
	// 		$.gotoUrl($.redirect(target.id));
	// 	}
	// });

	window.FFT_UNIONLOGIN_CALLBACK = function(data) {
        var resObj = {};

        try {
            resObj = JSON.parse(data);
        } catch (e) {
            var arr = data.split(',');
            var str = '';
            var success = false;

            var arr2 = [];
            for (var i = 0; i < arr.length; i++) {

                if (arr[i].indexOf('paramSign') != -1) {
                    if (arr[i].indexOf('data') != -1) {
                        arr2[0] = arr[i].slice(8);
                    } else {
                        arr2[1] = (arr[i]);
                    }
                }

                if (arr[i].indexOf('encryptParamStr') != -1) {
                    if (arr[i].indexOf('data') != -1) {
                        arr2[0] = arr[i].slice(8);
                    } else {
                        arr2[1] = arr[i];
                    }
                }

                if (arr[i].indexOf('success') != -1) {
                    success = Boolean(arr[i].split(':')[1]);
                }
            }
            str = arr2.join(',');
            resObj.data = (str.slice(str.length - 2) == "}}") ? str.slice(0, -1) : str;
            resObj.success = success;
        }

        if (resObj.success) {        
            $.commonAjax({
			    type: "POST",
			    url: "I047",
			    data: {
                    mac: resObj.data
                },
			    success: function(data) {
	            	data.isUnionLogin = true;
	            	$.ls("user", data);
		            $.cookie("memberCode", data.memberCode, {
		                domain: '.ubank365.com'
		            });
		            return $.gotoUrl($.ls('indexUrl') + '.html');
	            },
	            error: function() {
	            	var id = $.ls('indexUrl');
	                
					if (id == 'personal' || id == 'shoppingcartList') {
						return $.isLogin(id + '.html');
					}
					$.gotoUrl(id + '.html');
	            }
	        });
        } else {
            var id = $.ls('indexUrl');
			if (id == 'personal' || id == 'shoppingcartList') {
				return $.isLogin(id + '.html');
			}
			$.gotoUrl(id + '.html');
        }
    };

	$('body').on('tap', '#ul li', function() {
		

		$.showLoading();
		if (this.id == 'index') {
			return $.gotoUrl(this.id);
		}

		if (CONFIG.result.isNewUnionLogin && (!$.cookie("u_login_token") || !$.cookie("memberCode") || !$.ls("user"))) {
			$.ls('indexUrl', this.id);
            BASE.clientSocket('FFT_isLogin_Service', null, 'FFT_UNIONLOGIN_CALLBACK');
            return;
        }
		
		if (this.id == 'personal' || this.id == 'shoppingcartList') {
			return $.isLogin(this.id + '.html');
		}
		$.gotoUrl(this.id + '.html');
	});
	// checkBos ischecked(true:checked;false:none)
	$.fn.isChecked = function(isChecked) {
		isChecked && this.attr("checked", "checked") || this.removeAttr("checked");
	};

	// 非LocalStorage校验登录态并登录
	$.isLoginForNotLs = function(base) {

		var ajaxFlg = true;
		if (!base) {
			base = window.location.href;
			ajaxFlg = false;
		}

		if (!$.cookie("u_login_token") || !$.cookie("memberCode")) {
			if(base.indexOf(CONFIG.staticPage) > -1) {
				var BANK = {
					"anhui": "/anhui/m/anhuiLogin.html",
					"chongqing": "/chongqing/m/login.html"
				};
				window.location.href = CONFIG.domainUrl + BANK[BASE.getClientId()] + '?backUrl=' + location.origin + location.pathname;
            } else {
				$.ls("orgUrl", base);
				$.gotoUrl(CONFIG.result.loginPageName);
			}
			
			return false;
		} else {
			if ('scanCode' != base && ajaxFlg) {

				if (base.indexOf('.html') > -1) {
					$.gotoUrl(base);
				} else {
				    $.gotoUrl($.redirect(base));
				}			
			}
			return true;
		}
	};


	// 校验登录态并登录
	$.isLogin = function(base) {
		// if (base) {
		// 	var dex = base.lastIndexOf("/");
		// 	var pageName = base.substr(dex + 1);
		// 	var pN = pageName.split("#")[0];
		// 	var dex2 = pN.indexOf(".html");
		// 	if (dex2 != -1) {
		// 		var base = pN.substr(0, dex2);
		// 	}
		// }

		var ajaxFlg = true;
		if (!base) {
			base = window.location.href;
			ajaxFlg = false;
		}

		if ($.cookie("u_login_token") === null || $.cookie("memberCode") === null || !$.ls("user")) {

			window.FFT_isLogin_Service_CallBack = function(data) {
				var resObj = {};

				try{
					resObj = JSON.parse(data);
				}catch(e){
					var arr = data.split(',');
					var str = '';
					var success = false;

					var arr2 = [];
					for (var i=0; i<arr.length; i++) {

						if (arr[i].indexOf('paramSign') != -1) {
							if (arr[i].indexOf('data') != -1) {
								if (arr[i].substr(0,1) == '{') {
									arr2[0] = arr[i].slice(8);
								} else {
									arr2[0] = arr[i].slice(7);
								}
							} else {
								arr2[1] = (arr[i]);
							}
						}

						if (arr[i].indexOf('encryptParamStr') != -1) {
							if (arr[i].indexOf('data') != -1) {
								if (arr[i].substr(0,1) == '{') {
									arr2[0] = arr[i].slice(8);
								} else {
									arr2[0] = arr[i].slice(7);
								}
							} else {
								arr2[1] = arr[i];
							}
						}

						if (arr[i].indexOf('success') != -1) {
							if (arr[i].indexOf('true') != -1) {
								success = true;
							} else {
								success = false;
							}
						}
					}
					str = arr2.join(',');
					resObj.data = (str.slice(str.length-2) == "}}") ? str.slice(0,-1) : str;
					resObj.success = success;
				}

				if (resObj.success === false) {
					if(base.indexOf(CONFIG.staticPage) > -1) {
						var BANK = {
							"anhui": "/anhui/m/anhuiLogin.html",
							"chongqing": "/chongqing/m/login.html"
						};
						window.location.href = CONFIG.domainUrl + BANK[BASE.getClientId()] + '?backUrl=' + location.origin + location.pathname;
		            } else {
						$.ls("orgUrl", base);
						$.gotoUrl(CONFIG.result.loginPageName + '?historyFlg=-1');
					}
				} else {
					$.unionLogin.init({mac: resObj.data});
				}
			};

			if (CONFIG.result.isNewUnionLogin) {
				BASE.clientSocket('FFT_isLogin_Service', null, 'FFT_isLogin_Service_CallBack');
			} else {
				if(base.indexOf(CONFIG.staticPage) > -1) {
					var BANK = {
						"anhui": "/anhui/m/anhuiLogin.html",
						"chongqing": "/chongqing/m/login.html"
					};
					window.location.href = CONFIG.domainUrl + BANK[BASE.getClientId()] + '?backUrl=' + location.origin + location.pathname;
	            } else {
					$.ls("orgUrl", base);
					$.gotoUrl(CONFIG.result.loginPageName + '?historyFlg=-1');
				}
			}

			return false;
		} else {
			if ('scanCode' != base && ajaxFlg) {

				if (base.indexOf('.html') > -1) {
					$.gotoUrl(base);
				} else {
				    $.gotoUrl($.redirect(base));
				}			
			}
			return true;
		}
	};

	// 动态加载script
	$.load_script = function(xyUrl, callback) {
		var head = doc.getElementsByTagName('head')[0];
		var script = doc.createElement('script');
		script.type = 'text/javascript';
		script.src = xyUrl;
		// 借鉴了jQuery的script跨域方法
		script.onload = script.onreadystatechange = function() {
			if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				callback && callback();
				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;
				if (head && script.parentNode) {
					head.removeChild(script);
				}
			}
		};
		// Use insertBefore instead of appendChild to circumvent an IE6 bug.
		head.insertBefore(script, head.firstChild);
	};

	// 随机生成函数名
	$.createFunctionName = function() {
		return 'cbk_' + Math.round(Math.random() * 10000); // 随机函数名
	};

    

})(Zepto)

/**
 * ajax调用
 *  ops :
 * type (默认： “GET”)：请求方法 (“GET”, “POST”, or other)
 * url (默认： 当前地址)：发送请求的地址
 * data (默认：none)：发送到服务器的数据；如果是get请求，它会自动被作为参数拼接到url上。非String对象将通过 $.param 得到序列化字符串。
 * processData (默认： true)： 对于非Get请求。是否自动将 data 转换为字符串。
 * contentType (默认： “application/x-www-form-urlencoded”)： 发送信息至服务器时内容编码类型。 (这也可以通过设置headers headers)。通过设置 false 跳过设置默认值。
 * dataType (默认： none)：预期服务器返回的数据类型(“json”, “jsonp”, “xml”, “html”, or “text”)
 * timeout (默认： 0)： 设置请求超时时间（毫秒），0表示不超时。
 * headers (默认：{})： 一个额外的"{键:值}"对映射到请求一起发送
 * async (默认： true)：默认设置下，所有请求均为异步。如果需发送同步请求，请将此设置为 false。
 * global (默认： true)：请求将触发全局AJAX事件处理程序，设置为 false 将不会触发全局 AJAX 事件。
 * context (默认： window)： 这个对象用于设置Ajax相关回调函数的上下文(this指向)。
 * traditional (默认：false)：激活传统的方式通过$.param来得到序列化的 data。
 */
;
(function($) {

	var page = {
			lastPageNumber: 0,
			firstRecordTime: 0,
			lastRecordTime: 0
		},
		rt,
		lock = {};

	$.commonAjax = function(options) {

		if (window.location.href.indexOf('localhost') > -1) {
			options.host = 'http://localhost:8080/api';
		}

		if (lock[options.url]) {
			return false;
		}
		lock[options.url] = 1;

		rt = $.ls('rt') ? parseInt($.ls('rt')) : 0;
		rt += 1;
		$.ls('rt', rt);
		rt === 10 && $.ls('rt', 0);

		var cUser = "/user/",
			userPro = cUser + "product/",
			userRefund = cUser + "refund/",
			userTicket = cUser + "ticket/",
			userOrder = cUser + "order/",
			userCode = cUser + "code/",
			userSafe = cUser + "safe/",
			userSavePC = cUser + "payment/channel/",
			userMer = cUser + "merchant/",
			userOl = cUser + "outlet/",
			userCmt = cUser + "comment/",
			userCmtPro = userCmt + "product/",
			userCmtOl = userCmt + "outlet/",
			userCmtMem = userCmt + "member/",
			userRev = "/user/receiver/",
			userFav = cUser + "favorite/",
			userFavPro = userFav + "product/",
			userFavOl = userFav + "outlet/",
			userFavMem = userFav + "member/",
			userCart = cUser + "cart/",
			userSelf = cUser + "self/",
			userSelfComment = userSelf + "comment/";
		// 接口定义
		var Url = {
			//预售商品查询、特惠商品查询、商品条件查询
			I001: userPro + "list",
			// 商品详情查询
			I002: userPro + "detail",
			// 商品分类查询
			I003: userPro + "category",
			// 预售商品地区查询
			I004: userPro + "area",
			// 预售商品网点查询
			I005: userPro + "outlet",
			// 退款接口
			I006: userRefund + "do",
			// 退款详情
			I007: userRefund + "details",
			// 会员退款列表查询
			I008: userRefund + "list",
			// 查询用户券列表
			I009: userTicket + "list",
			// 查询券总数量（用户）
			I010: userTicket + "totalCount",
			// 获取二维码
			I011: cUser + "qrcode/retrieve",
			// 获取广告列表
			I012: cUser + "ad/list",
			// 商户分类查询接口
			I013: userMer + "category",
			// 门店列表分页查询接口（根据位置查询）
			I014: userOl + "list",
			// 门店列表分页查询接口（根据商户查询）
			I015: userMer + "outlet/list",
			// 门店详情查询接口
			I016: userOl + "detail",
			// 商户列表分页查询接口
			I017: userMer + "list",
			// 门店相册查询接口
			I018: userOl + "photo/list",
			// 商品评论分页查询接口
			I019: userCmtPro + "list",
			// 商户评论分页查询接口
			I020: userCmtOl + "list",
			// 评论商品接口
			I021: userCmtPro + "add",
			// 评论门店接口
			I022: userCmtOl + "add",
			// 商品评论数量查询接口
			I023: userCmtPro + "count",
			// 门店评论数量查询接口
			I024: userCmtOl + "count",
			// 个人商品评论数量查询接口
			I025: userCmtMem + "product/count",
			// 个人门店评论数量查询接口
			I026: userCmtMem + "outlet/count",
			// 个人评论总数查询接口
			I027: userCmtMem + "count",
			// 商品评论详情查询接口（待确定）
			I028: userCmtPro + "detail",
			// 收货地址列表查询接口
			I029: userRev + "list",
			// 新增收货地址接口
			I030: userRev + "add",
			// 删除收货地址接口
			I031: userRev + "delete",
			// 更新收货地址接口
			I032: userRev + "update",
			// 获取地区列表接口
			I033: cUser + "area/list",
			// 新增默认收货地址接口（待确定）
			I034: userPro + "detail",
			// 个人商品收藏列表分页查询接口
			I035: userFavPro + "list",
			// 个人门店收藏列表分页查询接口
			I036: userFavOl + "list",
			// 收藏商品接口
			I037: userFavPro + "add",
			// 收藏门店接口
			I038: userFavOl + "add",
			// 取消商品收藏接口
			I039: userFavPro + "delete",
			// 取消门店收藏接口	
			I040: userFavOl + "delete",
			// 个人商品收藏数量查询接口
			I041: userFavMem + "product/count",
			// 个人门店收藏数量查询接口
			I042: userFavMem + "outlet/count",
			// 用户收藏总数查询接口
			I043: userFav + "count",
			// 商品是否已收藏查询接口
			I044: userFavPro + "iscollected",
			// 门店是否已收藏查询接口
			I045: userFav + "iscollected",
			// 登录接口
			I046: cUser + "login/login",
			// 联合登录
			I047: cUser + "login/loginUnion",
			// 注册会员
			I048: cUser + "register/register",
			// 订单列表
			I049: userOrder + "list",
			// 订单详情
			I050: userOrder + "detail",
			// 取消订单
			I051: userOrder + "cancel",
			// 确认收货
			I052: cUser + "myorder/receipt",
			// 生成图片验证码
			I053: userCode + "generate_image",
			// 发送短信验证码
			I054: userCode + "send_sms",
			// 校验验证码
			I055: userCode + "verify_code",
			// 修改登录密码
			I056: userSafe + "loginpwd/reset",
			// 修改支付密码
			I057: userSafe + "paypwd/update",
			// 修改手机号
			I058: userSafe + "phone/update",
			// 查询快捷支付列表
			I059: userSavePC + "list",
			// 查询快捷支付详情
			I060: userSavePC + "detail",
			// 验证支付密码
			I061: userSavePC + "detail",
			// 获取银行卡列表
			I062: userSafe + "bankcard/list",
			// 获取商品列表信息
			I063: cUser + "product/list",
			// 商品是否已收藏接口
			I064: cUser + "favorite/iscollected",
			// 商品是否已收藏接口
			I065: cUser + "favorite/product/add",
			// 商品取消收藏接口
			I066: cUser + "favorite/delete",
			// 银行卡签约
			I067: userSafe + "bankcard/sign",
			// 银行卡解约
			I068: userSafe + "bankcard/cancelSign",
			// 查询券码详情
			I069: userTicket + "detail",
			// 获取商品详细信息
			I070: cUser + "product/detail",
			// 购物车列表
			I071: userCart + "list",
			// 购物车单个
			I072: userCart + "get",
			// 添加购物车
			I073: userCart + "add",
			// 删除购物车单个商品
			I074: userCart + "delete",
			// 批量删除购物车信息
			I075: userCart + "deleteBatch",
			// 修改数量
			I076: userCart + "quantity",
			// 购物车结算
			I077: userCart + "settleAccounts",

			I078: userCode + "send_sms_member",
			// 通用验码
			I079: userCode + "verify_code",
			//取消收藏
			I080: userFav + "delete",
			//个人中心-收藏总数
			I081: userFav + "count",
			//根据城市查找地区
			I082: cUser + "area/list",
			//根据地区查找网点
			I083: cUser + "outlet/simple/list",
			//查询订单列表
			I084: cUser + "myorder/list",
			//查询订单详情
			I085: cUser + "myorder/detail",
			// 快捷银行卡短信
			I086: userSafe + "bankcard/sendMobileToken",
			// 用户退出
			I089: cUser + "logout/logout",

			//设置支付密码
			I091: cUser + "safe/paypwd/set",
			//用户积分-可用积分统计
			I092: cUser + 'integral/total',
			//用户积分-积分列表
			I093: cUser + 'integral/list',
			//取消订单
			I094: cUser + "myorder/cancel",
			//确认收货
			I095: cUser + "myorder/list",
			// 收银台初始化
			I096: cUser + "cashier/shoppingPayVipChannel",
			//找回支付密码
			I097: userSafe + "paypwd/reset",
			//线上/网点积分兑换订单列表
			I098: cUser + "myorder/pointOrderList",
			//线上/网点积分兑换订单详情
			I099: cUser + "myorder/pointOrderDetail",
			//创建订单
			I100: cUser + "order/generate",
			//绑定手机号
			I101: userSafe + "phone/bind",
			//安全问题
			I102: userSafe + "question/getPreinstallQuestion",
			// 获取设置过安全问题
			I103: userSafe + "question/getMemberQuestion",
			//支付
			I104: cUser + "cashier/payOrders",
			//验证安全问题[正常情况]
			I105: userSafe + "paypwd/verifyQuestion",
			//验证安全问题[输错五次]
			I106: userSafe + "paypwd/verifyImgQuestion",
			// 修改数量
			I107: userCart + "checkDelivery",

			//扫码创建订单
			I166: cUser + "order/add_qrcode",
			//校验手机银行手机号是否存在
			I167: cUser + "login/isExistUnionMobile",
			//联合登录不绑定手机号注册用户
			I168: cUser + "login/unionLoginExceptMobile",
			//联合登录用户绑定
			I173: cUser + "login/unionLoginBind",
			//用户解绑
			I169: cUser + "login/unionLoginUnbind",
			//面对面订单列表
			I170: cUser + "myorder/qrcode_list",
			//面对面订单详情
			I171: cUser + "myorder/qrcode_detail",
			//VIP用户节约金额
			I172: cUser + "myorder/vipdiscount",
			//忘记密码第一步
			I174: userSafe + "loginpwd/forget",
			//忘记密码第二步
			I175: userSafe + "loginpwd/find",
			//没有登陆态发送短信
			I176: userCode + "send_sms_visitor",
			//个人中心商品评论列表
			I177: userSelfComment + "product/list",
			//个人中心门店评论列表
			I178: userSelfComment + "outlet/list",
			// 无登录态 发短信
			I179: userCode + "send_sms_visitor",

			//扫码获取面对面商品详情
			I180: userPro + "detail/qrcode",
			//手机号是否注册
			I181: cUser + "register/checkMobile",
			//用户名是否注册
			I182: cUser + "register/checkLoginId",
			// 跟据订单号查询券码详情
			I183: userTicket + "subOrderId",
			// 查询秒杀列表
			I184: '/user/seckillProduct/list',
			// 秒杀查询服务器
			I185: '/seckill/current_timestamp',
			// 秒杀提交订单
			I186: '/seckill/place_order2',
			// 秒杀查询订单接口
			I187: '/seckill/query_order',
			// 秒杀提交配送方式地址
			I188: '/seckill/fill_order',
			// 收藏
			I189: '/seckill/favorite/product/iscollected',
			I190: '/seckill/favorite/product/add',
			I191: '/seckill/favorite/product/delete',
			I192: cUser + 'area/index_list',
			I193: cUser + 'area/is_support',
			I194: '/user/product/outlet/page',
			I195: '/user/product/area/list',
			I196: cUser + '/order/getPayRes',
			I197: cUser + '/safe/checkUnionMobile',
			I198: '/user/vip/my',
			I199: cUser + '/safe/question/verify',
			I200: cUser + '/safe/question/update',
			I201: cUser + '/safe/question/complete',
			I202: cUser + '/safe/appeal/check',
			I203: cUser + '/safe/appeal/sendMail',
			I204: cUser + '/safe/appeal/apply',
			I205: cUser + '/safe/appeal/resetQuestion',
			I206: cUser + '/safe/loginpwd/resetByMobile',
			I207: cUser + '/safe/loginpwd/resetByQuestion',
			I208: cUser + '/safe/phone/verifyOriginal'	

		};

		var ops = $.extend({}, $.commonAjax.defaults, options),
			dataJson = ops.data;

		if (ops.type.toUpperCase() != "GET") {
			dataJson = JSON.stringify(ops.data);
		}
		if (dataJson.pageNumber && dataJson.pageSize) {
			if (dataJson.pageNumber > 1) {
				dataJson.lastPageNumber = page.lastPageNumber;
				dataJson.firstRecordTime = page.firstRecordTime;
				dataJson.lastRecordTime = page.lastRecordTime;
			} else {
				dataJson.lastPageNumber = 0;
				dataJson.firstRecordTime = 0;
				dataJson.lastRecordTime = 0;
			}

		}
		ops.headers.rt = rt;
		var url = Url[ops.url] ? Url[ops.url] : ops.url;
		return $.ajax({
			type: ops.type ? ops.type : 'GET',
			url: (ops.host + url),
			data: dataJson,
			dataType: 'json',
			headers: ops.headers,
			timeout: 15000,
			async: ops.async,
			beforeSend: ops.beforeSend,
			success: function(data) {
				lock[options.url] = 0;				
				if (data && data.page) {
					page = {
						lastPageNumber: data.page.lastPageNumber,
						firstRecordTime: data.page.firstRecordTime,
						lastRecordTime: data.page.lastRecordTime
					};
				}

				if (!ops.isShowError && !data && $.showNoDataView(ops.type)) {	//isShowError设置为true不跳转提示页面
				    return;
				}

				ops.success && ops.success(data);
			},
			contentType: 'application/json',
			error: function(data) {
				lock[options.url] = 0;
				if (data.status === 608) {
				    if (ops.openDialog) {
				        $("#loading").hide();
				        var msg = ops.defaultErrorMsg;
				        if (data.responseText && data.responseText.length > 0) {
				            var obj = eval('(' + data.responseText + ')');
				            // 新增错误码"11001"，是则弹出错误框
				            // ops.isShowError = obj.code === '11001' ? true : false ;

				            if (obj.code == '9987' || obj.code == '9997') {
				                //$.alert("登录超时，请重新登录！");
				                $.ls('user', null);
				                $.isLogin();
				                // 不要随便打开
				                // $.dialog({
				                // 	content: '<p style="font-size:14px;">'+obj.message+'</p>',
				                // 				title : 'null',
				                // 	ok: function(){
				                // 					$.ls('user', null);
				                // 		$.isLogin();
				                // 				}            
				                // });
				                return false;
				            }

				            if (!ops.isShowError && $.showNoDataView(ops.type)) { //isShowError设置为true不跳转提示页面
				                return;
				            }

				            if (obj.msg && obj.msg.length > 0) {
				                msg = obj.msg;
				                $.alert(msg);
				            }
				            // 不要随便打开
				            //return false;
				        }
				    }
				    ops.error && ops.error($.paseJson(data.response));
				} else {
					// $.gotoUrl('500.html');
				}
				
			}
		});
	};

	var user = $.ls("user");
	$.commonAjax.defaults = {
		host: "//dev.ubank365.com/api",
		type: 'GET',
		url: null,
		data: {},
		openDialog: true,
		processData: true,
		contentType: 'application/json',
		//dataType: 'json',
		timeout: 3000,
		headers: {
			memberCode: $.cookie("memberCode") || ($.ls("user") && $.ls("user").memberCode) || ''
		},
		defaultErrorMsg: '获取信息失败',
		async: true,
		global: true,
		context: window,
		traditional: false
	};
	if ($.cookie("u_login_token")) {
		$.commonAjax.defaults.headers.token = $.cookie("u_login_token");
	}

})(Zepto)



/**
 * Created by bruce on 2015/4/14.
 */
;
(function($) {
	/***
	 * type:0全部；1 日期类型；2时间类型
	 * */
	$.dateFormat = function(time, type) {
		var datetime = new Date();
		datetime.setTime(time);
		var year = datetime.getFullYear();
		var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
		var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		if (type && type == "1")
			return year + "-" + month + "-" + date;
		else if (type && type == "2")
			return hour + ":" + minute + ":" + second;
		else
			return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
	};

	//校验手机号
	$.v_mobile = function(val) {
		var p = /^1\d{10}$/;
		if (p.test(val)) {
			return true;
		}
		return false;
	};

})(Zepto)

/**
 * 选择数量功能
 *
 */
;
(function($) {

    $.spinner = function(callback) {

        if ($(".plus").data("limit") === 0 || $(".plus").data("limit") > 99) {
            $(".plus").data("limit", 99);
        } else if ($(".plus").data("limit") === 1) {
        	$(".plus").addClass('disabled');
        	$(".js-count").addClass('disabled').attr('readonly', true);
        }
        $('body').on("tap", '.plus:not(.disabled)', function() {
            var _this = $(this),
                input = _this.prev();
            if (!parseInt(input.val())) {
                input.val(0);
            }
            input.val(parseInt(input.val()) + 1);
            if (parseInt(input.val()) >= parseInt(_this.data("limit"))) {
                input.val(_this.data("limit"));
                _this.addClass("disabled");
            }
            if (input.val() > 1) {
                _this.parent().find(".minus").removeClass("disabled");
            }
            callback && callback();
        });
        $('body').on("tap", '.minus:not(.disabled)', function() {

            var _this = $(this),
                input = _this.next();
            if (!parseInt(input.val())) {
                input.val(2);
            }
            input.val(parseInt(input.val()) - 1);
            if (parseInt(input.val()) == 1) {
                _this.addClass("disabled");
            }
            _this.parent().find(".plus").removeClass("disabled");
            callback && callback();
        });
        $("body").on("keyup", '.js-count', function(event) {
            var _this = $(this),
            	minus = _this.parent().find(".minus"),
            	plus = _this.parent().find(".plus");
        	last = event.timeStamp; //利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        	setTimeout(function() { //设时延迟0.5s执行
        	    if (last - event.timeStamp == 0) //如果时间差为0（也就是你停止输入0.5s之内都没有其它的keyup事件发生）则做你想要做的事
        	    {
        	        //做你要做的事情
            minus.addClass("disabled");
            plus.addClass("disabled");
            var temp = parseInt(_this.val());

          	if (_this.val() === '') {
          		return;
          	}
            if (isNaN(temp) || temp === 0) {
                _this.val(1);
		                callback && callback();
                return;
            }

            _this.val(temp);

            if (parseInt(_this.val()) >= _this.next().data("limit")) {
                _this.val(_this.next().data("limit"));
                if (_this.val() > 1) {
                	minus.removeClass("disabled");
            	}
		            	callback && callback();
                return;
            }

            if (_this.val() > 1) {
                minus.removeClass("disabled");
            }

            plus.removeClass("disabled");

		            callback && callback();
        	    }
        	}, 500);
        });

        $("body").on("blur", '.js-count', function() {
            var _this = $(this),
            	minus = _this.parent().find(".minus");
            if (_this.val() === '') {
            	minus.addClass("disabled");
            	 _this.val(1);
                return;
            }
            
        });
    };

})(Zepto)




/**
 * 弹出框框
 *
 */
;
(function($, window, undefined) {

	var win = $(window),
		doc = $(document),
		count = 1,
		isLock = false;

	var Dialog = function(options) {

		this.settings = $.extend({}, Dialog.defaults, options);

		this.init();

	};

	Dialog.prototype = {

		/**
		 * 初始化
		 */
		init: function() {

			this.create();

			if (this.settings.lock) {
				this.lock();
			}

			if (!isNaN(this.settings.time) && this.settings.time != null) {
				this.time();
			}

		},

		/**
		 * 创建
		 */
		create: function() {


			var title = this.settings.title;
			var divHeader = {
				'alert': ' ',
				null: ' '
			}[title] || '<div class="rDialog-header-' + this.settings.title + '"></div>';

			// HTML模板
			var wrap = 'rDialog-wrap' + {
				'alert': '-alert'
			}[title];
			var divContent = title === 'load' ? "" : ('<div class="rDialog-content">' + this.settings.content + '</div>');
			var templates = '<div class="' + wrap + '">' +
				divHeader +
				divContent +
				'<div class="rDialog-footer"></div>' +
				'</div>';

			// 追回到body
			this.dialog = $('<div>').addClass('rDialog').css({
				zIndex: this.settings.zIndex + (count++)
			}).html(templates).prependTo('body');


			// 设置cancel按钮
			if ($.isFunction(this.settings.cancel)) {
				this.cancel();
			}

			// 设置ok按钮
			if ($.isFunction(this.settings.ok)) {
				this.ok();
			}


			// 设置大小
			this.size();

			// 设置位置
			this.position();

		},


		/**
		 * cancel
		 */
		cancel: function() {

			var _this = this,
				footer = this.dialog.find('.rDialog-footer');

			$('<a>', {
				href: 'javascript:;',
				text: this.settings.cancelText
			}).on("tap", function() {
				var cancelCallback = _this.settings.cancel();
				if (cancelCallback == undefined || cancelCallback) {
					_this.close();
				}
			}).addClass('rDialog-cancel').appendTo(footer);

		},
		/**
		 * ok
		 */

		ok: function() {
			var _this = this,
				footer = this.dialog.find('.rDialog-footer');

			$('<a>', {
				href: 'javascript:;',
				text: this.settings.okText
			}).on("tap", function() {
				var okCallback = _this.settings.ok();
				if (okCallback == undefined || okCallback) {
					_this.close();
				}

			}).addClass('rDialog-ok').prependTo(footer);

		},


		/**
		 * 设置大小
		 */
		size: function() {

			var content = this.dialog.find('.rDialog-content'),
				wrap = this.dialog.find('.rDialog-wrap');

			content.css({
				width: this.settings.width,
				height: this.settings.height
			});
			//wrap.width(content.width());
		},

		/**
		 * 设置位置
		 */
		position: function() {

			var _this = this,
				winWidth = win.width(),
				winHeight = win.height(),
				scrollTop = 0;

			this.dialog.css({
				left: (winWidth - _this.dialog.width()) / 2,
				top: (winHeight - _this.dialog.height()) / 2 + scrollTop
			});

		},

		/**
		 * 设置锁屏
		 */
		lock: function() {

			if (isLock) return;
			var style = this.settings.title != 'load' ? "rDialog-mask" : "rDialog-white";
			this.lockSelect = $('<div>').css({
				zIndex: this.settings.zIndex
			}).addClass(style);
			this.lockSelect.appendTo('body');

			isLock = true;

		},

		/**
		 * 关闭锁屏
		 */
		unLock: function() {
			if (this.settings.lock) {
				if (isLock) {
					this.lockSelect.remove();
					isLock = false;
				}
			}
		},

		/**
		 * 关闭方法
		 */
		close: function() {
			this.dialog.remove();
			this.unLock();
			var colseCallBack = this.settings.colseCallBack;
			if (colseCallBack != undefined && colseCallBack != null) {
				this.settings.colseCallBack();
			}
		},

		/**
		 * 定时关闭
		 */
		time: function() {

			var _this = this;

			this.closeTimer = setTimeout(function() {
				_this.close();
			}, this.settings.time);

		}

	};

	/**
	 * 默认配置
	 */
	Dialog.defaults = {

		// 内容
		content: '加载中...',

		// 标题
		title: 'load',

		// 宽度
		width: 'auto',

		// 高度
		height: 'auto',

		// 取消按钮回调函数
		cancel: null,

		// 确定按钮回调函数
		ok: null,

		// 确定按钮文字
		okText: '确定',

		// 取消按钮文字
		cancelText: '取消',

		// 自动关闭时间(毫秒)
		time: null,

		// 是否锁屏
		lock: true,

		// z-index值
		zIndex: 9999,

		//关闭后的回调事件
		colseCallBack: null

	};

	var rDialog = function(options) {
		return new Dialog(options);
	};

	/**
	 * 基本提示框信息
	 * */
	$.defaultDialog = function(msg, title, width, time, colseCallBack) {
		var width = width || 240;
		var time = time || 2000;
		var title = title || '提示';
		$.alert(msg, time, colseCallBack);
	};

	window.rDialog = $.rDialog = $.dialog = rDialog;

})(window.jQuery || window.Zepto, window);

var ScrollPagenation = function(o) {
	this.hasNext = true;
	this.pageNumber = (o.pageNumber || "1") / 1 - 1;
	this.pageSize = o.pageSize || '8';

	this.scrollEl = o.scrollEl;
	this.height = o.height;

	this.destory = function() {
		m.scrollEl.off("scroll");
	};

	var m = this;

	if (!m.scrollEl) {
		alert('请设置滑动元素');
	}

	if (!m.height || m.height / 1 <= 0) {
		alert('请设置欢动范围高度');
	}

	m.next = function() {
		o.loadUI && o.loadUI(true);
		if (m.hasNext) {
			m.hasNext = false;
			m.pageNumber = m.pageNumber / 1 + 1;
			if (typeof o.nextPage == 'function') {
				o.nextPage({
					pageNumber: m.pageNumber,
					pageSize: m.pageSize,
					callbackFn: function(hasNext) {
						o.loadUI && o.loadUI(false);
						m.hasNext = hasNext;
					}
				});
			} else {
				$.alert('未定义分页数据核心函数');
			}
		}
	};

	m.scrollEl.on("scroll", function(e) {
		var top = window.pageYOffset;
		/*
		if(CONFIG.scrollDisable){
		    m.scrollEl.scrollTop(CONFIG.scrollDisable_top);
		    return false;
		}*/
		var height = m.scrollEl.height() - m.height;
		if ((top + 66) > height) {
			if (m.hasNext) {
				o.loadUI && o.loadUI(true);
				m.next();
			}
		}
	});

	m.init = function() {
		m.hasNext = true;
		m.pageNumber = (o.pageNumber || "1") / 1 - 1;
		m.pageSize = o.pageSize || '8';
		m.next();
	};

	m.next();
};

var Scroll = function(o) {
	this.hasNext = true;
	this.pageNumber = (o.pageNumber || "1") / 1 - 1;
	this.pageSize = o.pageSize || '8';
	this.scrollEl = o.scrollEl;

	var m = this;

	this.destory = function() {
		m.scrollEl.off("scroll");
	}

	m.next = function() {
		o.loadUI && o.loadUI(true);
		if (m.hasNext) {
			m.hasNext = false;
			m.pageNumber = m.pageNumber / 1 + 1;
			if (typeof o.nextPage == 'function') {
				o.nextPage({
					pageNumber: m.pageNumber,
					pageSize: m.pageSize,
					callbackFn: function(hasNext) {
						o.loadUI && o.loadUI(false);
						m.hasNext = hasNext;
					}
				});
			} else {
				//$.alert('未定义分页数据核心函数');
			}
		}
	};

	m.scrollEl.on("scroll", function(e) {
		var top = m.scrollEl.scrollTop();
		var offsetHeight = m.scrollEl[0].offsetHeight;
		var scrollHeight = m.scrollEl[0].scrollHeight;
		var height = scrollHeight - offsetHeight;
		if (top >= height) {
			if (m.hasNext) {
				o.loadUI && o.loadUI(true);
				m.next();
			}
		}
	});

	m.init = function() {
		m.hasNext = true;
		m.pageNumber = (o.pageNumber || "1") / 1 - 1;
		m.pageSize = o.pageSize || '10';
		m.next();
	};

	m.next();
};

var timer;
var BASE = {
	init: function() {
		//iox兼容fixed问题
		if ($.os.ios || $.os.android) {
			var height = $(window).height();
			$("body").on('focus', 'body input, body textarea', function() {
				if (this.type == 'checkbox') {
					return;
				}
				$("header").css("position", "absolute");
				$("footer").css("position", "absolute");
				$(".fixed-absolute").css("position", "absolute");
				$("body").css("min-height", height);
			});
			$("body").on('blur', 'body input, body textarea', function() {
				if (this.type == 'checkbox') {
					return;
				}
				$("header").css("position", "fixed");
				$("footer").css("position", "fixed");
				$(".fixed-absolute").css("position", "fixed");
				$("body").scrollTop(0);
			});
		}

		// 解决4.4版本的android input blur的空白问题
		if ((!$.os.ios && BASE.getClientId() === 'chongqing') || ($.os.android && BASE.getClientId() === 'taizhou')) {
			var height = $(window).height();
			$("body").on('blur', 'body input', function() {
				var top = $("body").scrollTop(),
					// 键盘的高度
					keyHeight = height - $(window).height();
				if (top < keyHeight) {
					$("body").scrollTop(0);
				} else {
					$("body").scrollTop(top - keyHeight);
				}
			});
			$("body").on('blur', 'body textarea', function() {
				$("body").scrollTop(0);
			});
			if ($('body input, body textarea').size() > 0) {
				$('body').css("min-height", height + 1);
			}
		}

		/*演示清除input*/
		$('body').on('tap', '.c-close-btn', function() {
			$(this).siblings('input').val("");
			//$(this).parent().find("input").val("");
		});

		/*出现删除×*/	
		$('body').on('focus', '.c-input input', function() {
			$(this).siblings('.c-close-btn').show().css("display", "inline-block");
			// var index = $(".c-close-btn").parent().find("input").index(this);
			// $(".c-close-btn").parent().find("input").eq(index).next().show().css("display", "inline-block");
		})
		$('body').on('blur', '.c-input input', function() {
			$(this).siblings('.c-close-btn').hide();
			// var index = $(".c-close-btn").parent().find("input").index(this);
			// $(".c-close-btn").parent().find("input").eq(index).next().show().css("display", "inline-block");
		})

		/*演示清除input（新的）*/
		$('body').on('tap', '.ui-icon-clear', function() {
			$(this).siblings('input').val("");
			$(this).siblings('input').focus();
		});

		/*出现删除×*/	
		$('body').on('focus', '.ui-input-nbd input', function() {
			if($(this).val().length > 0) {
				$(this).siblings('.ui-icon-clear').show().css("display", "inline-block");
			}
			else {
				$(this).siblings('.ui-icon-clear').hide();
			}
			$(this).closest('.ui-input-nbd').addClass('current');
		})
		$('body').on('keyup', '.ui-input-nbd input', function() {
			if($(this).val().length > 0) {
				$(this).siblings('.ui-icon-clear').show().css("display", "inline-block");
			}
			else {
				$(this).siblings('.ui-icon-clear').hide();
			}
		})
		$('body').on('blur', '.ui-input-nbd input', function() {
			$(this).siblings('.ui-icon-clear').hide();
			$(this).closest('.ui-input-nbd').removeClass('current');
		})
		

		this.headerNav();
		/*if (!CONFIG.debug) {
			try {
				template.onerror = function(err) {
					$.location("500.html");
				}
			} catch (e) {}
		}*/
		/*
		$(document).on('scroll', function(){
		   var scrollElement = document.getElementById('goTop');
		   if(scrollElement){
				scrollElement.style.display = (document.documentElement.scrollTop + document.body.scrollTop) ? 'block' : 'none';
		   }
		})

		$('#goTop').on('tap', function(){
			BASE.goTop();
			return false;
		})*/
	},
	headerNav: function() {
		if ($("#mainPage").size() > 0) {
			$("#mainPage").on("tap", function() {
				$.gotoUrl($.redirect("index"));
			})
		}
		if ($("header .arrow").size() > 0) {
			$("header .arrow").on("tap", function() {
				$.backUrl();
			})
		}
	},
	/*
	 *  1428914190125 -> 2015-12-21 12:21:32
	 */
	strToTime: function(time) {
		time = new Date(parseInt(time, 10));
		return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + ":" + (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds());
	},
	/*
	 *  1428914190125 -> 2015-12-21 12:21
	 */
	strToTime2: function(time) {
		time = new Date(parseInt(time, 10));
		return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes());
	},
	/*
	 *  1428914190125 -> 2015-12-21
	 */
	strToDate: function(time) {
		time = new Date(parseInt(time, 10));
		return time.getFullYear() + "-" + ((time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1)) + "-" + (time.getDate() < 10 ? "0" + time.getDate() : time.getDate());
	},
	/*
	 *  计算剩余时间
	 */
	calRestTime: function(endTime, nowTime) {
		if (nowTime) {
			leftTime = endTime - nowTime;
		} else {
			var nowTime = new Date();
			leftTime = endTime - nowTime.getTime();
		}
		if (leftTime < 0) {
			return '已过期';
		}
		var leftSecond = parseInt(leftTime / 1000);
		var day = Math.floor(leftSecond / (60 * 60 * 24));
		var hour = Math.floor((leftSecond - day * 24 * 60 * 60) / 3600);
		var minute = Math.floor((leftSecond - day * 24 * 60 * 60 - hour * 3600) / 60);
		var second = Math.floor(leftSecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
		if (day == 0) {
			return hour + "小时" + minute + "分" + second + "秒";
		}
		return day + "天" + hour + "小时" + minute + "分" + second + "秒";
	},
	/*
	 *  计算抢购剩余时间
	 */
	calSecRestTime: function(extraTime, startTime, endTime) {
		var nowTime = parseInt((new Date()).getTime());
		var currentTime = nowTime + extraTime;
		var leftTime;
		if (currentTime < startTime) {
			$(".js-leave-title").html("距抢购开始：");
			$(".time-box").removeClass("blue").addClass("gray");
			leftTime = parseInt(startTime) - parseInt(currentTime);
		} else if (currentTime > endTime) {
			$(".js-leave-title").html("抢购结束!");
			$(".time-box").removeClass("blue").addClass("gray");
			$("#buy").attr("disabled", true);
			return '';
		} else {
			$(".js-leave-title").html("距离结束：");
			if (pageData && pageData.store > 0) {
				$(".time-box").addClass("blue").removeClass("gray");
			}
			leftTime = parseInt(endTime) - parseInt(currentTime);
		}
		var leftSecond = parseInt(leftTime / 1000);
		var day = Math.floor(leftSecond / (60 * 60 * 24));
		var hour = Math.floor((leftSecond - day * 24 * 60 * 60) / 3600);
		var minute = Math.floor((leftSecond - day * 24 * 60 * 60 - hour * 3600) / 60);
		var second = Math.floor(leftSecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
		if (day == 0) {
			return hour + "小时" + minute + "分" + second + "秒";
		}
		return day + "天" + hour + "小时" + minute + "分" + second + "秒";
	},
	clientCompatible: function(cityName, methodName, para, callBackName) {
		var config = {
			'anhui': {
				'FFT_QRCode_Service': function() {
					location.hash = 'personal_CBank_COMMAND_showqrcode';
					location.hash = '#clean';
				},
				'FFT_GPS_Service': function() {
					location.hash = 'common_CBank_GPS_COMMAND_location';
					location.hash = '#clean';
				},
				'FFT_LoginInfo_Service': function() {
					setKeyBoardInfo({
						'callback': callBackName
					}, 'jumpLogin()', 'LOGIN');
				},
				'FFT_CipherKeyboard_Service': function() {
					setKeyBoardInfo({
						'callback': callBackName,
						'maxLength': para.fft_pwdMaxLength,
						'minLength': para.fft_pwdMinLength
					}, 'getKeyBoardInfo()', 'KB');
				}
			},
			'chongqing': {
				'FFT_QRCode_Service': function() {

					window.FFT_QRCode_Service_CallBack = window[callBackName];

					if ($.os.android && window.froad) {
						window.froad.FFT_QRCode_Service();
					} else {
						location.hash = '#{"fft_MethodName": "FFT_QRCode_Service"}';
						location.hash = '#clean';
					}
				},
				'FFT_GPS_Service': function() {

					// window.FFT_GPS_Service_CallBack = window[callBackName];

					if ($.os.android && window.froad) {
						// 	setTimeout(function() {					//兼容安卓4.4系统第一次定位之后再次进入不能定位
						window.froad.FFT_GPS_Service();
						// 	}, 2000)
					} else {
						location.hash = '{"fft_MethodName": "FFT_GPS_Service"}';
						location.hash = '#clean';
					}
				},
				'FFT_LoginInfo_Service': function() {

					window.FFT_LoginInfo_Service_CallBack = window[callBackName];

					if ($.os.android && window.froad) {
						window.froad.FFT_LoginInfo_Service('{"fft_MethodName": "FFT_LoginInfo_Service:","fft_Parameter":"1"}');
					} else {
						location.hash = '#{"fft_MethodName": "FFT_LoginInfo_Service:","fft_Parameter": "1"}';
						location.hash = '#clean';
					}

					$.cookie('_joinTime', '1', {
						expires: 's60'
					})

					var s = setInterval(function() {
						if ($.os.android && window.froad) {
							window.froad.FFT_LoginInfo_Service('{"fft_MethodName": "FFT_LoginInfo_Service:","fft_Parameter":"0"}');
						} else {
							location.hash = '#{"fft_MethodName": "FFT_LoginInfo_Service:","fft_Parameter": "0"}';
							location.hash = '#clean';
						}

						$.cookie('_joinTime') || clearInterval(s)
					}, 500);
				},
				'FFT_CipherKeyboard_Service': function() {

					var p = para ? para.fft_Parameter : 'p';

					window.FFT_PwTransmission_Service_CallBack = function(res) {
						var obj = JSON.parse(res),
							str = JSON.stringify({
								'pwd': obj.pw,
								'fft_Parameter': obj.passwordID,
								'length': obj.length
							});

						return window[callBackName] && window[callBackName](str);
					}

					if ($.os.android && window.froad) {
						window.froad.FFT_CipherKeyboard_Service('{"passwordID":"' + p + '"}');
					} else {
						location.hash = '#{"fft_MethodName": "FFT_CipherKeyboard_Service:","fft_Parameter": "' + p + '"}'
						location.hash = '#clean';
					}

				},
				'FFT_BackPhoneHomePage_Service': function() {
					if ($.os.android && window.froad) {
						window.froad.FFT_BackPhoneHomePage_Service();
					} else {
						location.hash = '#{"fft_MethodName": "FFT_BackPhoneHomePage_Service"}';
						location.hash = '#clean';
					}
				}
			}
		}

		return config[cityName] && config[cityName][methodName] && config[cityName][methodName]();
	},
	/*
	 *  调用客户端接口
	 *  @option 调用客户端的功能函数名字，格式string
	 *  @data {} 传送给客户端的数据，格式是Json
	 *  callback 客户端返回时调用的函数, function名字
	 */
	clientSocket: function(option, data, callback) {
		var clientId = BASE.getClientId();
		if (CONFIG.source == 100) {
			return false;
		}
		var str = null;
		if (option && callback && data) {
			str = {
				'nativeMethodName': option,
				'functionName': callback
			};
			for (var attr in data) {
				str[attr] = data[attr];
			}
		} else if (option && callback) {
			str = {
				'nativeMethodName': option,
				'functionName': callback
			};
		} else {
			str = {
				'nativeMethodName': option
			};
		}
		var strJson = JSON.stringify(str);
		if ($.os.android) {
			if (clientId == 'chongqing' && !($.os.sdk)) {
				BASE.clientCompatible(clientId, option, data, callback);
			} else {
				prompt(strJson);
			}
		} else {
			if (clientId == 'chongqing' && !($.os.sdk)) {
				BASE.clientCompatible(clientId, option, data, callback);
			}
			location.hash = encodeURIComponent(strJson);
			location.hash = 'clean';
			window.history.replaceState(null, null, location.href.split('#clean')[0]);
		}
	},
	getCreateSource: function() {
		var createSource = 100;
		if ($.os.android) {
			createSource = 200;
		}
		if ($.os.ios) {
			createSource = 300;
		}
		if ($.os.ipad) {
			createSource = 100;
		}
		return createSource;
	},
	terminalType: function() {
		var createSource = 1;
		if ($.os.android) {
			createSource = 2;
		}
		if ($.os.ios) {
			createSource = 3;
		}
		if ($.os.ipad) {
			createSource = 1;
		}
		return createSource;
	},
	getSmsMember: function(me, smsType, mobile, imgCode, imgToken, callback) {
		if (!me.prop("disabled")) {
			if (imgCode && imgToken) {
				this.sendSMS(me, 'I176', smsType, mobile, imgCode, imgToken, callback);
			} else {
				this.sendSMS(me, 'I078', smsType, mobile);
			}
		} else {
			return false;
		}

		me.html("获取中...");
		me.attr("disabled", true);

		var wait = 120;
		var time = function(me) {
			if (wait == 0) {
				me.removeAttr("disabled");
				me.html("重新获取");
				wait = 120;
			} else {
				me.attr("disabled", true);
				me.html("获取(" + wait + "s)");
				wait--;
				timer = setTimeout(function() {
					time(me);
				}, 1000);
			}
		};
		time(me);
	},
	sendSMS: function(me, url, smsType, mobile, imgCode, imgToken, callback) {
		$.commonAjax({
			url: url,
			type: 'POST',
			data: {
				mobile: mobile,
				smsType: smsType,
				imgCode: imgCode || '',
				imgToken: imgToken || ''
			},
			success: function(res) {
				$.alert("短信成功发送", 3000);
				$.ls('resetLSms', res);
			},
			error: function(data) {
				$.alert(data.message);
				clearTimeout(timer);
				me.html("获取验证码");
				me.removeAttr("disabled");
				callback && callback();
			}
		});
	},
	/**
	 * 清除短信定时
	 * */
	clearSmsTimer: function(me, code) {
		if (timer)
			clearTimeout(timer);
		if (me) {
			me.removeAttr("disabled");
			me.html("重新获取");
		}
		if (code) {
			code.val("");
		}
	},
	/*
	 * 选择数量功能
	 */
	spinner: function() {
		if ($(".number-box .plus").data("limit") == 0) {
			$(".number-box .plus").data("limit", 99);
		}
		$('.number-box').on("tap", '.plus:not(.disabled)', function() {
			var input = $(this).prev();
			if (!parseInt(input.val())) {
				input.val(0);
			}
			input.val(parseInt(input.val()) + 1);
			if (parseInt(input.val()) >= parseInt($(this).data("limit"))) {
				input.val($(this).data("limit"));
				$(this).addClass("disabled");
			}
			if (input.val() > 1) {
				$(this).parent().find(".minus").removeClass("disabled");
			}
		});
		$('.number-box').on("tap", '.minus:not(.disabled)', function() {
			var input = $(this).next();
			if (!parseInt(input.val())) {
				input.val(2);
			}
			input.val(parseInt(input.val()) - 1);
			if (parseInt(input.val()) == 1) {
				$(this).addClass("disabled");
			}
			$(this).parent().find(".plus").removeClass("disabled");
		});
		$(".number-box").on("keyup", '#num', function() {
			if (parseInt($(this).val()) > $(this).next().data("limit")) {
				$(this).val($(this).next().data("limit"));
				return false;
			}
			if (isNaN(parseInt($(this).val())) && $(this).val() != '') {
				$(this).val(1);
				return false;
			}
			$(this).parent().find(".plus").removeClass("disabled");
		});
		$(".number-box").on("blur", '#num', function() {
			if ($(this).val() == '' || $(this).val() == 0 || isNaN(parseInt($(this).val()))) {
				$(this).val(1);
			} else if ($(this).val() != 1) {
				$(this).parent().find(".minus").removeClass("disabled");
			}
		})
	},
	escapeSymbol: function(source) {
		//TODO: 之前使用\s来匹配任意空白符
		//发现在ie下无法匹配中文全角空格和纵向指标符\v
		//所以改\s为\f\r\n\t\v以及中文全角空格和英文空格
		//但是由于ie本身不支持纵向指标符\v
		//故去掉对其的匹配，保证各浏览器下效果一致
		return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function(all) {
			return '%' + (0x100 + all.charCodeAt())
				.toString(16).substring(1).toUpperCase();
		});
	},
	jsonToQuery: function(json, replacer_opt) {
		var result = [],
			itemLen,
			replacer = replacer_opt || function(value) {
				return BASE.escapeSymbol(value);
			};
		for (key in json) {
			result.push(key + '=' + replacer(json[key], key));
		}
		return result.join('&');
	},
	queryToJson: function(url) {
		var query = url.substr(url.lastIndexOf('?') + 1).split('#')[0],
			params = query.split('&'),
			len = params.length,
			result = {},
			i = 0,
			key, value, item, param;
		for (; i < len; i++) {
			if (!params[i]) {
				continue;
			}
			param = params[i].split('=');
			key = param[0];
			value = param[1];
			item = result[key];
			if ('undefined' == typeof item) {
				result[key] = value;
			} else {
				result[key] = [item, value];
			}
		}
		return result;
	},
	getUrlParams: function() {
		try {
			var href = window['location']['href'];
			var sParam = href.substring(href.indexOf('?')).split('#')[0];
			var params = BASE.queryToJson(sParam);

			for (var p in params) {
				try {
					params[p] = decodeURIComponent(params[p]);
				} catch (e1) {}
			}
			return params;
		} catch (e) {
			return {};
		}
	},
	getClientId: function() {
		return window.location.href.split("/")[3].split('#')[0];
	},
	// JavaScript Document
	goTop: function(acceleration, time) {
		acceleration = acceleration || 0.1;
		time = time || 8;
		var x1 = 0;
		var y1 = 0;
		var x2 = 0;
		var y2 = 0;
		var x3 = 0;
		var y3 = 0;

		if (document.documentElement) {
			x1 = document.documentElement.scrollLeft || 0;
			y1 = document.documentElement.scrollTop || 0;
		}
		if (document.body) {
			x2 = document.body.scrollLeft || 0;
			y2 = document.body.scrollTop || 0;
		}
		var x3 = window.scrollX || 0;
		var y3 = window.scrollY || 0;

		// 滚动条到页面顶部的水平距离
		var x = Math.max(x1, Math.max(x2, x3));
		// 滚动条到页面顶部的垂直距离
		var y = Math.max(y1, Math.max(y2, y3));

		// 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
		var speed = 1 + acceleration;
		window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));

		// 如果距离不为零, 继续调用迭代本函数
		if (x > 0 || y > 0) {
			var invokeFunction = "BASE.goTop(" + acceleration + ", " + time + ")";
			window.setTimeout(invokeFunction, time);
		}
	},
	//卡密支付
	kamiPay: function(form, node) {
		// var formArr = $('#form input[name=Plain]').val().split('|'),
		// 	sign = $('#form input[name=Signature]').val(),
		// 	action = $('#form form').attr('action'),
		// 	formObj = {};

		// for(var i=0; i<formArr.length; i++) {
		// 	var attr = formArr[i].split('=');
		// 	formObj[attr[0]] = attr[1];
		// }

		// formObj.MerchantUrl = decodeURIComponent(formObj.MerchantUrl);

		// function createPar(obj) {
		// 	var str = '';
		// 	for(var attr in obj) {
		// 		var s = attr + '=' + obj[attr] + '&';
		// 		str += s;
		// 	}

		// 	return str + 'Signature=' + sign;
		// } 

		// node.hide();
		// $('#footer').hide();
		// var pageName = window.location.href.split('/').pop().split('?')[0];
		// var h = pageName == 'cashier.html' ? 58 : 15;

		$('header').siblings(':not(script)').hide();
		var newFrame = document.createElement("iframe");
	    newFrame.id = 'kami';
	    newFrame.frameBorder = 0;
	    newFrame.width = "100%";
	    newFrame.height = $(window).height() + 15;
	    newFrame.scrolling = "yes";

		node.after(newFrame);

		// if (pageName == 'cashier.html') {
		// 	$('#kami').css('margin-top', '-58px');
		// } else {
			$('#kami').css('margin-top', '-15px');
		// }

		var iframeDoc = newFrame.contentWindow.document;

        iframeDoc.open();
        iframeDoc.write('<body style="display:none;">' + form + '</body>');
		var fObj = $(iframeDoc).find('form')[0];

		if ($(fObj).find("input[name='submit']").length > 0) {
			$(fObj).find("input[name='submit']").eq(0).trigger("click");
		} else {
			fObj.submit();
		}

        iframeDoc.close();

		// window.FFT_Back_Service_CallBack = function() {
		// 	$('#kami').remove();
		// 	$('.arrow').unbind().bind('tap', $.backUrl);
		// 	window.FFT_Back_Service_CallBack = $.backUrl;
		// 	node.show();
		// };
		
		// $('.arrow').unbind().bind('tap', window.FFT_Back_Service_CallBack);
	}
};

function getClintId() {
	return clintId = window.location.href.split("/")[3];
}

CONFIG.source = BASE.getCreateSource(),

	BASE.init();

window.FFT_Back_Service_CallBack = function() {
	var href = url;
	var dex = window.location.href.lastIndexOf("/");
	var pageName = window.location.href.substr(dex + 1);
	var pN = pageName.split('#')[0].split('?')[0];
	var url = $.ls(pN);
	$.ls(pageName, null);

	if (url) {
		window.location.href = url;
	} else {
		if ($.getRequestData().historyFlg) {
			history.go(parseInt($.getRequestData().historyFlg));
		} else {
			history.go(-1);
		}
	}
};

//兼容老重庆客户端
if (window.froad || ($.os.ios && !($.os.sdk))) {
	window.FFT_HomePage_Service_CallBack = function() {
		window.location.href = 'index';
	}
}


window.CBank = {};

/*
 *兼容安徽IOS客户端
 */
//事件源
var eventName = "";
var eventCode = "0";
// 清理自定义事件 接口
function clearEvent() {
		eventCode = "0";
		eventName = "";


	}
	// 获取EventCode
function getWebKitEventCode() {
	return eventCode;
}

// 获取自定义事件
function getWebKitEvent() {
	return eventName;
}

function setWebKitEvent(evtName, evtCode) {
	if (eventName != "") {
		return;
	}

	eventCode = evtCode;
	eventName = evtName;
}

var _YTkeyboard = {
	'callback': 'loginNotice'
};

function setKeyBoardInfo(cfg, method, flag) {
		_YTkeyboard = cfg;
		setWebKitEvent(method, flag);
	}
	// 获取提示信息
function jumpLogin() {
	clearEvent();
	return JSON.stringify(_YTkeyboard);
}

function getKeyBoardInfo() {
	clearEvent();
	return JSON.stringify(_YTkeyboard);
}

/*
 *GPS定位获取当前经纬度、百度cityCode、城市名
 *
 *return 返回一g个deferred对象
 *done param 类型是对象，包含 status为0表示成功、cityCode百度获取得城市唯一ID、location经纬度(lat纬度，lng经度)、cityName城市名
 * set cookie gpsInfo
 * set localStorage _gpsCityCode
 * set localStorage _gpsLocation
 * set localStorage _gpsCityName
 *
 *fail param 类型是对象，包含 status为1表示失败、msg错误描述
 *
 *
 */
(function($) {

	$.GPS = function() {

		var dtd = $.Deferred();
		var getbaiduInfo = function(position) {


			var url = '/api/baidu_map_proxy/?ak=vfVfmbix47Uks5DX54CC4GVB&callback=?&location=' + position.latitude + ',' + position.longitude + '&output=json&pois=0&coordtype=wgs84ll';
			var domain = location.hostname === 'localhost' ? '' : '.ubank365.com';
			return $.ajax({
					url: url,
					timeout: 5000
				}).done(function(data) {
					if (data && data.status == 0) {
						$.cookie('gpsInfo', '1', {
							expires: 's300'
						});
						var location = ($.os.ios && BASE.getClientId() == 'anhui') || ($.os.ios && $.os.sdk) ? data.result.location : {
							lat: position.latitude,
							lng: position.longitude
						};

						$.ls('_gpsCityCode', data.result.cityCode);
						$.ls('_gpsLocation', location);
						$.ls('_gpsCityName', data.result.addressComponent.city);
						$.cookie('longitude', location.lng , { expires: 'd365', domain: domain});
						$.cookie('latitude', location.lat , { expires: 'd365', domain: domain});

						dtd.resolve({
							status: 0,
							cityCode: data.result.cityCode,
							location: location,
							cityName: data.result.addressComponent.city
						});
					} else {
						dtd.reject();
					}
				})
				.fail(function(xhr, status) {
					dtd.reject();
				})
		};

        // 供客户端回调的GPS_Service函数
		window.FFT_GPS_Service_CallBack = function(result, lat) {
			if (lat) {
				var p = {};
				p.longitude = result;
				p.latitude = lat;
			} else {
				var p = JSON.parse(result);
			}
			getbaiduInfo(p);
		};

		window.CBank.appGPScallback = window.FFT_GPS_Service_CallBack; //老客户端兼容

        // 调用客户端FFT_GPS_Service方法
        // 客户端然后会回调FFT_GPS_Service_Callback
		BASE.clientSocket('FFT_GPS_Service', null, 'FFT_GPS_Service_CallBack');

        // 如果客户端回调FFT_GPS_Service_Callback超时，则在10000/6000ms时间之后，调用reject()
		setTimeout(function() {

			dtd.reject();
		}, !($.os.sdk) ? 10000 : 6000)

		return dtd.promise();
	}
})(Zepto);

;
(function($) {

	// 多银行接入配置
	CONFIG.module = {
	    functionList: {
	        '1': {
	        	type: 'merchant',
	        	jumpUrl: 'merchantIndex?positionPage=THSH'
	        },
	        '2': {
	        	type: 'cheap',
	        	jumpUrl: 'cheapIndex?isRecommend=true&positionPage=THSP'
	        },
	        '3': {
	        	type: 'boutiqueSale',
	        	jumpUrl: 'boutiqueSaleList.html'
	        },
	        '4': {
	        	type: 'scanCode',
	        	jumpUrl: 'scanCode'
	        },
	        '5': {
	        	type: 'creditsExchange',
	        	jumpUrl: 'creditsExchange.html'
	        }
	    }
	};

	$.getFunctionUrlBytype = function(type) {
		return CONFIG.module.functionList[type].jumpUrl;
	}

	$.getTypeByTypeName = function(typeName) {

		for (var key in CONFIG.module.functionList) {
			var temp = CONFIG.module.functionList[key];
			if (temp.type === typeName) {
				return key;
			}
		}
	}

	$.getAliasNameByType = function(type, functionModule, other) {

		for (var key in functionModule) {
			var item = functionModule[key];
			if (item.type === type) {
				return  other ? (item.moduleAlias + other) : item.moduleAlias;
			}
		}
	}

	$.getAliasNameByTypeName = function(typeName, functionModule, other) {
		 var moduleAlias = $.getAliasNameByType($.getTypeByTypeName(typeName), functionModule);
		 return other ? (moduleAlias + other) : moduleAlias;
	}

	$.SetHeading = function(typeName, functionModule, other) {
	    var moduleAlias = $.getAliasNameByType($.getTypeByTypeName(typeName), functionModule);
	    document.title = other ? (moduleAlias + other) : moduleAlias;
	    $('header p').text(other ? (moduleAlias + other) : moduleAlias);
	    return moduleAlias;
	}




    // 配置不同的客户端对应不同的页面，不同的页面拥有不同的功能
    CONFIG.transfer = 
        {
            'anhui': {
                'indexIcons': [{'name':'特惠商户', 'id': 'merchantIndex', 'class': 'merchant-icon'}, 
                                    //{'name':'特惠商品', 'id': 'cheapIndex', 'class': 'goods-icon'},
                                    {'name':'精品预售', 'id': 'boutiqueSaleList.html', 'class': 'botique-icon'},
                                    {'name':'扫一扫', 'id': 'scanCode', 'class': 'scan-code-icon'},
                                    {'name':'名优特惠', 'id': 'famousGoodsList.html', 'class': 'famous-icon'},
                                    {'name':'积分兑换', 'id': 'creditsExchange.html', 'class': 'credit-icon'}],
                'loginPageName': 'anhuiLogin.html',
                cardAgreement: {
                	type: '1',
                	bankName: '安徽农金',
                	bankFullName: '安徽农村信用社联合社'
                },
                showBankPoint: true,
                'couponTitles': ['特惠团购码','预售提货码'],
                'labelText': ['特惠商品', '精品预售', '名优特惠', '特惠商户'],
                showPreSaleList: 1,
                ad: {
                	index: 100000000,
                    merchantIndex: 100000002,
                    merchantList: 100000003,
                    cheapIndex: 100000004,
                    cheapList: 100000005
                },
                showSecurityQuestion: false,
                cardManage: {
			        tapName: '银行卡',
			        typeName: '储蓄卡',
			        type: 1,
			        name: '银行卡'
			    },
			    bankLogoSmall: '../img/anhui-logosmall.png',
			    marketing: {
			    	ad1: 100000002,
			    	ad2: 100000007,
			    	ad3: 100000005,
			    	ad4: 100000001
			    }
            },
            'chongqing': {
                'showFroadPoint': 1,
                'indexIcons': [{'name':'惠商户', 'id': 'merchantIndex', 'class': 'merchant-icon'}, 
                                    {'name':'惠团购', 'id': 'cheapIndex', 'class': 'goods-icon'},
                                    {'name':'惠预售', 'id': 'boutiqueSaleList.html', 'class': 'botique-icon'},
                                    {'name':'码上付', 'id': 'scanCode', 'class': 'scan-code-icon'}],
                'hideIntegralItem': 1,
                'loginPageName': $.os.sdk && $.os.sdkVer == '2.1.0' ? 'loginNew.html' : 'login.html',
                'newLoginPageName':'loginNew.html',
                cardAgreement: {
                	type: '1',
                	bankName: '重庆农商',
                	bankFullName: '重庆农村商业银行'
                },
                'couponTitles': ['惠团购码','惠预售提货码'], //我的券码页面
                'showVipTag': 0,
                'labelText': ['惠团购', '惠预售', '', '惠商户'],
                'showPreSaleList': 0,
                ad: {
                	index: 100000001,
                    merchantIndex: 100000006,
                    merchantList: 100000007,
                    cheapIndex: 100000008,
                    cheapList: 100000009
                },
                showSecurityQuestion: true,
                cardManage: {
			        tapName: '银行卡',
			        typeName: '储蓄卡',
			        type: 1,
			        name: '银行卡'
			    },
			    bankLogoSmall: '../img/chongqing-logosmall.png',
			    marketing: {
			    	ad1: 100000009,
			    	ad2: 100000010,
			    	ad3: 100000012,
			    	ad4: 100000015
			    },
			    isHideUnionLogin: $.os.sdk && $.os.sdkVer == '2.1.0' ? 1 : 0,
			    isNewUnionLogin: $.os.sdk && $.os.sdkVer == '2.1.0' ? true : false
            },
			taizhou: {
			    showBankPoint: 1,
			    showFroadPoint: 1,
			    indexIcons: [{
			        name: '特惠商户',
			        id: 'merchantIndex',
			        class: 'merchant-icon'
			    }, {
			        name: ' 特惠商品',
			        id: 'cheapIndex',
			        class: 'goods-icon'
			    }, {
			        name: '扫一扫',
			        id: 'scanCode',
			        class: 'scan-code-icon'
			    }],
			    hideIntegralItem: 1,
			    loginPageName: 'login.html',	
			    cardAgreement: {
			    	type: '0',
                	bankName: '安徽农金',
                	bankFullName: '安徽农村信用社联合社'
                },
			    //couponTitles: ['惠团购码', '惠预售提货码'], //我的券码页面
			    showVipTag: 0,
			    labelText: ['特惠商品', '', '', '特惠商户'],
			    showPreSaleList: 1,
			    ad: {
			    	index: 100001000,
			        merchantIndex: 100000014,
			        merchantList: 100000015,
			        cheapIndex: 100000016,
			        cheapList: 100000017
			    },
			    showSecurityQuestion: 1,
			    cardManage: {
			        tapName: '银行积分卡',
			        typeName: '积分卡',
			        type: 0,
			        name: '积分卡'
			    },
			    bankLogoSmall: '../img/taizhou-logosmall.png',
			    marketing: {
			    	ad1: 100000027,
			    	ad2: 100000028,
			    	ad3: 100000029,
			    	ad4: 100000032
			    },
			    isShowClientPay: true,
			    isHideUnionLogin: 0,
			    isNewUnionLogin: false
			},
			xingtai: {
				showBankPoint: 1,
			    showFroadPoint: 1,
			    indexIcons: [{
			        name: '特惠商户',
			        id: 'merchantIndex',
			        class: 'merchant-icon'
			    }, {
			        name: ' 特惠商品',
			        id: 'cheapIndex',
			        class: 'goods-icon'
			    }, {
			        name: '扫一扫',
			        id: 'scanCode',
			        class: 'scan-code-icon'
			    }],
			    hideIntegralItem: 1,
			    loginPageName: 	'loginNew.html', //'login.html',	
			    cardAgreement: {
			    	type: '0',
                	bankName: '安徽农金',
                	bankFullName: '安徽农村信用社联合社'
                },
			    //couponTitles: ['惠团购码', '惠预售提货码'], //我的券码页面
			    showVipTag: 0,
			    labelText: ['特惠商品', '', '', '特惠商户'],
			    showPreSaleList: 1,
			    ad: {
			    	index: 100001000,
			        merchantIndex: 100000014,
			        merchantList: 100000015,
			        cheapIndex: 100000016,
			        cheapList: 100000017
			    },
			    showSecurityQuestion: 1,
			    cardManage: {
			        tapName: '银行积分卡',
			        typeName: '积分卡',
			        type: 0,
			        name: '积分卡'
			    },
			    bankLogoSmall: '../img/taizhou-logosmall.png',
			    marketing: {
			    	ad1: 100000027,
			    	ad2: 100000028,
			    	ad3: 100000029,
			    	ad4: 100000032
			    },
			    isShowClientPay: true,
			    isHideUnionLogin: 1,	// 0,
			    isNewUnionLogin:  true 	//false
			},
			jilin: {
            	showBankPoint: 1,
                showFroadPoint: 1,
                indexIcons: [{'name':'特惠商户', 'id': 'merchantIndex', 'class': 'merchant-icon'}, 
                                    {'name':'特惠商品', 'id': 'cheapIndex', 'class': 'goods-icon'},
                                    {'name':'精品预售', 'id': 'boutiqueSaleList.html', 'class': 'botique-icon'},
                                    {'name':'扫一扫', 'id': 'scanCode', 'class': 'scan-code-icon'}],
                hideIntegralItem: 1,
                loginPageName:'login.html',
                cardAgreement: {
                	type: '1',
                	bankName: '吉林农信',
                	bankFullName: '吉林省农村信用社联合社'
                },
                couponTitles: ['特惠团购码','预售提货码'], //我的券码页面
                showVipTag: 0,
                labelText: ['特惠商品', '精品预售', '', '特惠商户'],
                showPreSaleList: 1,
                ad: {
                	index: 100002000,
                    merchantIndex: 100000010,
                    merchantList: 100000011,
                    cheapIndex: 100000012,
                    cheapList: 100000013
                },
                showSecurityQuestion: true,
                cardManage: {
                	tapName:"银行卡",
			        typeName: '储蓄卡',
			        type: 1,
			        name: '银行卡'
                },
                isHideUnionLogin: 1,
			    bankLogoSmall: '../img/jilin-logosmall.png',
			    marketing: {
			    	ad1: 100000017,
			    	ad2: 100000018,
			    	ad3: 100000019,
			    	ad4: 100000022
			    }
            },
            default: {
            	showBankPoint: 1,
                showFroadPoint: 1,
                indexIcons: [{'name':'特惠商户', 'id': 'merchantIndex', 'class': 'merchant-icon'}, 
                                    {'name':'特惠商品', 'id': 'cheapIndex', 'class': 'goods-icon'},
                                    {'name':'精品预售', 'id': 'boutiqueSaleList.html', 'class': 'botique-icon'},
                                    {'name':'扫一扫', 'id': 'scanCode', 'class': 'scan-code-icon'}],
                hideIntegralItem: 1,
                loginPageName:'login.html',
                cardAgreement: {
                	type: '1',
                	bankName: '安徽农金',
                	bankFullName: '安徽农村信用社联合社'
                },
                couponTitles: ['特惠团购码','预售提货码'], //我的券码页面
                showVipTag: 0,
                labelText: ['特惠商品', '精品预售', '', '特惠商户'],
                showPreSaleList: 1,
                ad: {
                    'merchantIndex': 100000006,
                    'merchantList': 100000007,
                    'cheapIndex': 100000008,
                    'cheapList': 100000009
                },
                showSecurityQuestion: true,
                cardManage: {
                	tapName:"银行卡",
			        typeName: '储蓄卡',
			        type: 1,
			        name: '银行卡'
                },
                isHideUnionLogin: 1,
			    bankLogoSmall: '../img/jilin-logosmall.png',
			    marketing: {
			    	ad1: 100000002,
			    	ad2: 100000007,
			    	ad3: 100000005,
			    	ad4: 100000001
			    }
            }
        };

	// 用来返回页面含有的功能
	CONFIG.result = {};

	/**
	 * 截取客户端的字样
	 * 返回‘anhui’或者'chongqing'...
	 */
	$.getResult = function() {
		var transfer = CONFIG.transfer,
			clientId = BASE.getClientId();
		CONFIG.result = transfer[clientId] || transfer['default']

		$.each(CONFIG.result.indexIcons, function(index, item) {
			if(item.id === 'famousGoodsList.html'){
				// 名优特惠模块
				CONFIG.result.famousModule = true;
				CONFIG.result.famousModuleName = item.name;
			} else if(item.id === 'boutiqueSaleList.html'){
				// 精品预售模块
				CONFIG.result.preSaleModule = true;
				CONFIG.result.preSaleModuleName = item.name;
			} else if(item.id === 'creditsExchange.html'){
				// 积分兑换模块
				CONFIG.result.creditsExchangeModule = true;
				CONFIG.result.creditsExchangeModuleName = item.name;
			}
		})


	}();

})(Zepto);


/*
 * 获取当前选中的城市信息
 * return 返回一个deferred对象
 * done param  类型是对象，包含cityId(后台定义字段)、isSupprot(是否同城，boolean值)、gpsLocation(当isSupproot为true时返回)、gpsCityCode(当isSupproot为true时返回)、gpsCityName(当isSupproot为true时返回)
 * fail param  无
 *
 */
(function($) {

	$.getCurCityInfo = function() {

		var dtd = $.Deferred();

		var method = {

            /**
             * 使用areaCode向后台getAreaId
             * @method getAreaId
             * @param cityCode
             * @returns {*}
             */
			getAreaId: function(cityCode) {
				return $.ajax({
					url: "//dev.ubank365.com/api/user/area/is_support",
					timeout: 5000,
					dataType: 'json',
					data: {

                        // 用cityCode跟后台获取areaId，然后保存到localstorage cityId当中
						"areaCode": cityCode || $.ls('_gpsCityCode')
					}
				})
			},

            /**
             * 向后台checkCityCode
             * 1）如果localStorage当中没有cityCode的值，则拿着
             * @method checkCityCode
             * @param gc, GPSed cityCode
             * @param glocat, GPSed location
             * @param gName, GPSed cityName
             */
			checkCityCode: function(gc, glocat, gName) {

                if(typeof gc !== 'undefined') {

					this.getAreaId(gc).done(function(data) {

							if (data && data.resResult && data.area) {

                                var gCityName = gName;

                                dtd.resolve({
                                    cityId: data.area.id,
                                    cityName: gCityName ? gCityName : $.ls('curCityName'),
                                    isSupprot: true,
                                    gpsLocation: glocat,
                                    gpsCityCode: gc,
                                    gpsCityName: gCityName
                                });

							} else {

                                // if (data && data.resResult && data.area) === false
                                // set isSupprot to false
								dtd.reject({
									isSupprot: false,
									gpsLocation: glocat,
									gpsCityCode: gc,
									gpsCityName: gName
								})
							}
						})
						.fail(function() {

							dtd.reject({
								isSupprot: false,
								gpsLocation: glocat,
								gpsCityCode: gc,
								gpsCityName: gName
							});
						});

				} else {


                    // if gc === defined,
                    // which means checkCityCode() is called
                    // non-GPS

                    // cityCode存的是和后台保存的areaCode完全一致
                    // 如果页面显示的地方和gps所在的地方是一样的，即cityCode === _gpsCityCode 则isSupprot为true, 并带上gpsLocation信息
                    // 以及如果_gpsCityCode和 cityCode的parent, 即parentCityCode相同的话，也认为isSupprot是true

                    // (cityCode == _gpsCityCode) => isSupprot = true
                    if ( ($.cookie('cityCode') && $.ls('_gpsCityCode') && $.cookie('cityCode') == $.ls('_gpsCityCode')) ||
                            // (parentCityCode == _gpsCityCode) => isSupprot = true
                        ($.cookie('parentCityCode') && $.ls('_gpsCityCode') && $.cookie('parentCityCode') == $.ls('_gpsCityCode')) ) {

                        dtd.resolve({
                            cityId: $.cookie('areaId'),
                            cityName:  $.ls('curCityName'),
                            isSupprot: true,
                            gpsLocation: $.ls('_gpsLocation'),
                            gpsCityCode: $.ls('_gpsCityCode'),
                            gpsCityName: $.ls('_gpsCityName')
                        });

                    } else {

                        dtd.resolve({
                            cityId: $.cookie('areaId'),
                            cityName: $.ls('curCityName'),
                            isSupprot: false
                        });
                    }
                }
			}
		};

        // 因为现在只首页接入了直出，所以这里进行一个hardcode判断
        if(window.location.pathname.lastIndexOf('/index') != '-1') {

            // 如果是首页，必须GPS进行协助定位
            $.GPS().done(function (data) {

                method.checkCityCode(data.cityCode, data.location, data.cityName);

            })
                .fail(function () {

                    dtd.reject({});
                });


        } else {

            // 非首页，还未直出
            if ($.cookie('areaId')) {

                method.checkCityCode();

            } else {
                // show loading
                $("#gpsLoading").append('<div class="load-shadow"><div> <img style="top: 17px;" src="../images/iconfont-lladdre.gif"><p style="left: 10px;top: 50px;position: absolute;color: white;font-size: 12px;">系统定位中</p></div></div>')

                $.GPS()
                    .done(function (data) {

                    $("#gpsLoading").hide();
                    method.checkCityCode(data.cityCode, data.location, data.cityName);
                })
                    .fail(function () {
                        $("#gpsLoading").hide();
                        dtd.reject({});
                    })
            }
        }

		return dtd.promise();
	}
})(Zepto);


/**
 * 下拉选择框
 *
 */
;
(function($, window, undefined) {

	var SelectModule = function(options) {

		this.settings = $.extend({}, SelectModule.defaults, options);

		this.init();

	};

	SelectModule.prototype = {

		/**
		 * 初始化
		 */
		init: function() {

			this.create();

		},

		/**
		 * 创建
		 */
		create: function() {


			var title = this.settings.title,
				context = '',
				selectList = this.settings.content,
				domList = [];

			var dom = [
				'<div id="selectModule" style="" class="dialog-box-end">',
				'    <div class="select-popup dialog-end">',
				'        <div class="title-line boxpack-center">',
				'            <p id="cancel" class="select-cancel">×</p>',
				'            <h3 class=" boxflex-one">',
				title,
				'</h3>',
				'            <p id="ok" class="select-ok"><i></i></p>',
				'        </div>',
				'        <div id="animation-effect" class="choose-area iSlider-effect">',
				'        <div class="current-line"></div>',
				'        </div>',
				'    </div>',
				'</div>'
			].join('');
			// 追回到body
			$('body').append(dom);

			for (var i = 0; i < selectList.length; i++) {
				context = {
					content: '<p id=' + selectList[i].key + '>' + selectList[i].value + '</p>'
				};
				domList.push(context);
			}

			var islider1 = new iSlider({
				data: domList,
				dom: document.getElementById("animation-effect"),
				type: 'dom',
				animateType: 'depth-h',
				isLooping: true,
				isVertical: true
			});

			// 设置cancel按钮
			if ($.isFunction(this.settings.cancel)) {
				this.cancel();
			}

			// 设置ok按钮
			if ($.isFunction(this.settings.ok)) {
				this.ok();
			}


			// 设置大小
			this.size();

			// 设置位置
			this.position();

		},


		/**
		 * cancel
		 */
		cancel: function() {

			var _this = this;

			$('#cancel').on("tap", function() {
				var cancelCallback = _this.settings.cancel();
				if (cancelCallback == undefined || cancelCallback) {
					_this.close();
				}
			});

		},
		/**
		 * ok
		 */

		ok: function() {
			var _this = this,
				selectInfo = {};
			$('#ok').on("tap", function() {
				var selectElement = document.getElementById('selected').firstChild.firstChild;
				selectInfo.selectKey = selectElement.id;
				selectInfo.selectValue = selectElement.innerHTML;
				var okCallback = _this.settings.ok(selectInfo);
				if (okCallback == undefined || okCallback) {
					_this.close();
				}
			});

		},


		/**
		 * 设置大小
		 */
		size: function() {
			//wrap.width(content.width());
		},

		/**
		 * 设置位置
		 */
		position: function() {

		},

		/**
		 * 关闭方法
		 */
		close: function() {
			$('#selectModule').remove();
		}

	};

	/**
	 * 默认配置
	 */
	SelectModule.defaults = {

		// 内容
		content: '加载中...',

		// 标题
		title: 'load',

		// 宽度
		width: 'auto',

		// 高度
		height: 'auto',

		// 取消按钮回调函数
		cancel: null,

		// 确定按钮回调函数
		ok: null,

		// z-index值
		zIndex: 9999

	};

	var selectModule = function(options) {
		return new SelectModule(options);
	};


	window.selectModule = $.selectModule = $.selectModule = selectModule;

})(window.jQuery || window.Zepto, window);

;
(function($){
	var MODEL= {
	    obj: {},
	    isCanLogin: false
	};

	$.unionLogin = {

	    init: function(userInfo) {
	        var me = this,
	            model = MODEL;


	        model.obj = userInfo;

	        $.cookie('sms_token', null);

	        $.showLoading();
	        $.commonAjax({
	            type: "POST",
	            url: "I047",
	            data: model.obj,
	            success: function(data) {
	                data.isUnionLogin =  true;

	                $.ls("user", data);

	                $.cookie("memberCode", data.memberCode, {
	                    domain: '.ubank365.com'
	                });
	                $.ls_del_prefix("froad_");

	                me.back();
	            },
	            error: function(obj) {
	            	$.hideLoading();
	                if (obj.code === 7107 || obj.code === 7108) {

	                    me.dialog1();

	                    me.bindEvent();

	                    if (obj.mobile) {
	                        $('#bank_phone').val(obj.mobile);
	                    }

	                    if (obj.code === 7108) {
	                        $('#phoneErr').html("手机号已经绑定手机银行用户，请更换手机号！");
	                        return;
	                    }

	                    if (obj.code === 7107) {
	                        $('#phoneErr').html("手机号已经绑定社区银行用户，请校验手机号！");
	                        me.rmGetCodeNoTap();
	                        return;
	                    }

	                } else {
	                    $.alert(obj.message);
	                }
	            }
	        });
	    },

	    back: function() {
	    	$.hideLoading();
	    	if ($.os.ios) {
	    	    $.ls('IOSLOGIN', true);
	    	    history.go(-3);
	    	}
	    	else {
	    		history.go(-1);
	    	}
	    },

	    bindEvent: function() {
	        var me = this;

	        $('#bank_phone').on('keyup', function() {
	            if ($('#bank_phone').val().length == 11 && $('#bank_phone').isPhoneNo()) {
	                me.checkBind();
	            } else {
	                me.setGetCodeNoTap();
	                $('#phoneErr').html("");
	            }
	            return false;
	        });

	        $('#getCode').on("tap", function() {
	            if (!$(this).prop("disabled")) {
	                var obj = {
	                    mobile: $('#bank_phone').val(),
	                    smsType: 1306,
	                };

	                $('#bank_phone').prop('disabled', true);
	                $('#codeErry').addClass('style');
	                me.sendSMS(obj, this);
	            }
	        });
	    },

	    dialog1: function() {
	        var me = this,
	            model = MODEL;

	        model.dia1Index = $.dialog({
	                            content: [
	                                '<p style="padding:0 0 10px 0;text-align:center;">绑定手机号</p>',
	                                '<p>',
	                                    '<input id="bank_phone" type="tel" placeholder="请输入手机号" maxlength="11" style="width:100%;-webkit-appearance:none; border-radius:5px; outline:0; border:1px solid #ccc; height:30px; text-indent:10px;" />',
	                                '</p>',
	                                '<div style="text-align:left;margin-top:5px;">',
	                                    '<div style="margin-bottom:12px; font-size:12px; color:#999; text-align:left;" id="phoneErr"></div>',
	                                    '<input id="joinCode" type="tel" placeholder="请输入验证码" maxlength="6" style="-webkit-appearance:none; border-radius:5px; outline:0; text-indent:10px; border:1px solid #ccc;width:58%; height:30px"/>',
	                                    '<button style="float:right;background:rgba(0,0,0,0); width:100px; height:30px; border:1px solid #A4AEB1;border-radius:5px;color: #A4AEB1" id="getCode" disabled>获取验证码<tton>',
	                                '</div>',
	                                '<div class="style" style="margin-top:10px; 0;color:#fd2b01; text-align:left;" id="codeErry">验证码错误</div>'].join(''),
	                            title: 'null',
	                            ok: function() {
	                                if (!$('.rDialog-ok').prop('disabled')) {

	                                    var verCode = $.trim(($('#joinCode').val()));

	                                    if (!$.trim(($('#bank_phone').val()))) {
	                                        $.alert('手机号不能为空!', 3000);
	                                        return false;
	                                    }

	                                    if (!$('#bank_phone').isPhoneNo()) {
	                                        //$.alert('请输入正确的手机号码!', 3000);
	                                        return false;
	                                    }

	                                    if(!$.cookie('sms_token')) {
	                                        $.alert('请获取验证码!', 3000);
	                                        return false;                                        
	                                    }

	                                    if (!verCode) {
	                                        $.alert('验证码不能为空!', 3000);
	                                        return false;
	                                    }

	                                    $('.rDialog-ok').prop('disabled', true);

	                                    me.checkVerCode(verCode);
	                                }


	                                return false;
	                            },
	                            cancel: function() {
	                                me.cancelLogin();
	                            },
	                            lock: true
	                        });
	    },


	    dialog2: function() {
	        var me = this,
	            model = MODEL;

	        model.dia2Index = $.dialog({
	                            content: '<p style="font-size:18px;color:#302929;text-align:center;">验证成功</p><div style="font-size:12px;color: #302929;line-height:20px;margin:10px 0 5px 0;" id="tips" >提示：已是社区银行用户请点击‘绑定已有账户’若不是则可能是其他用户绑定过该手机号，请点击‘创建新账户’</div>',
	                            okText: '绑定已有账户',
	                            cancelText: '创建新账户',
	                            title: 'null',
	                            ok: function() {
	                                $.gotoUrl('bindID.html');
	                            },
	                            cancel: function() {
	                                me.creNewUser();
	                            },
	                            lock: true
	                        });
	    },

	    checkBind: function() {
	        var me = this,
	            model = MODEL;

	        $.commonAjax({
	            type: 'POST',
	            url: "I167",
	            data: {
	                mobile: $('#bank_phone').val()
	            },
	            success: function(data) {
	                if (data.result === true) {
	                    if(data.errorCode === 7108) {
	                        me.setGetCodeNoTap();
	                        $('#phoneErr').html("手机号已经绑定手机银行用户，请更换手机号！");
	                    } 

	                    if(data.errorCode === 7107) {
	                        me.rmGetCodeNoTap();
	                        $('#phoneErr').html("手机号已经绑定社区银行用户，请校验手机号！");
	                        model.isCanLogin = false;
	                    } 
	                } else {
	                    model.isCanLogin = true;
	                    me.rmGetCodeNoTap();
	                    $('#phoneErr').html('');
	                }
	            },
	            error: function(error) {
	                $.alert(error.message, 3000);
	            }
	        });
	    },

	    setGetCodeNoTap: function() {
	        $('#getCode').prop('disabled', true);
	        $('#getCode').css('border', '1px solid #A4AEB1');
	        $('#getCode').css('color', '#A4AEB1');
	    },

	    rmGetCodeNoTap: function() {
	        $('#getCode').prop('disabled', false);
	        $('#getCode').css('border', '1px solid #3ca0ec');
	        $('#getCode').css('color', '#3ca0ec');
	    },

	    checkVerCode: function(verCode) {
	        var me = this,
	            model = MODEL;

	        $.commonAjax({
	            type: "POST",
	            url: "I055",
	            data: {
	                token: $.cookie('sms_token'),
	                code: verCode
	            },
	            success: function(data) {
	                $('#codeErry').addClass('style');
	                var mobile =  $.trim($('#bank_phone').val());
	                model.obj.confirmMobile = mobile;
	                $.ls('bPhone', mobile);
	                if (model.isCanLogin) {
	                    me.init(model.obj);
	                } else {
	                    model.dia1Index.close();
	                    me.dialog2();
	                }
	            },
	            error: function(error) {
	                $('.rDialog-ok').prop('disabled', false);
	                $('#codeErry').html(error.message);
	                $('#codeErry').removeClass('style');
	            }
	        });

	    },

	    cancelLogin: function() {
	        var model = MODEL,
	        	me = this;

	        $.commonAjax({
	            type: 'POST',
	            url: "I168",
	            data: model.obj,
	            success: function(data) {
	                data.isUnionLogin =  true;
	                $.ls("user", data);
	                $.cookie("memberCode", data.memberCode, {
	                    domain: '.ubank365.com'
	                });
	                $.ls_del_prefix("froad_");
	                me.back();
	            },
	            error: function(error) {
	                $.alert(error.message, 3000);
	            }
	        });
	    },

	    creNewUser: function() {
	        var model = MODEL,
	        	me = this;

	        if(!model.obj.confirmMobile) {
	            model.obj.confirmMobile = $.ls('bPhone');
	        }

	        $.commonAjax({
	            type: 'POST',
	            url: "I169",
	            data: model.obj,
	            success: function(data) {
	                data.isUnionLogin =  true;
	                $.ls("user", data);
	                $.cookie("memberCode", data.memberCode, {
	                    domain: '.ubank365.com'
	                });
	                me.back();
	                $.ls_del_prefix("froad_");
	            },
	            error: function(error) {
	                $.alert(error.message);
	            }
	        });
	    },

	    sendSMS: function(dataObj, _this) {
	        var me = this;

	        $.ls("time", 120);

	        time();
	        var timer;

	        function time() {
	            if ($.ls("time") <= 0) {
	                me.rmGetCodeNoTap();
	                $('#bank_phone').prop('disabled', false);
	                $(_this).text("获取验证码");
	                $.ls("time", 120);
	            } else {
	                me.setGetCodeNoTap();
	                $(_this).text("重新发送(" + $.ls("time") + ")");
	                $.ls("time", $.ls("time") - 1);
	                timer = setTimeout(function() {
	                        time();
	                    },
	                    1000);
	            }
	        }

	        $.commonAjax({
	            url: 'I179',
	            type: 'POST',
	            data: dataObj,
	            success: function(data) {
	                $.cookie('sms_token', data);
	                $.alert("短信已发送，请注意查收。", 3000);
	            },
	            error: function(error) {
	                $.alert(error.message);
	                clearTimeout(timer);
	                $('#bank_phone').prop('disabled', false);
	                me.rmGetCodeNoTap();
	                $.cookie('sms_token', null);
	                $(_this).text("获取验证码");
	            }
	        });
	    }
	};
})(Zepto);